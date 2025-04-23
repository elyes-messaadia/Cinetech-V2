import axios from 'axios';

// Créer une instance axios pour l'API TMDb
const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: 'fr-FR'
  }
});

// Système de cache simple pour éviter les appels redondants
const cache = {
  data: new Map(),
  ttl: 5 * 60 * 1000, // 5 minutes en ms
  
  get: function(key) {
    const item = this.data.get(key);
    if (!item) return null;
    
    const now = Date.now();
    if (now > item.expiry) {
      this.data.delete(key);
      return null;
    }
    
    return item.value;
  },
  
  set: function(key, value) {
    const expiry = Date.now() + this.ttl;
    this.data.set(key, { value, expiry });
  },
  
  clear: function() {
    this.data.clear();
  }
};

// Intercepteur pour la gestion globale des erreurs
tmdbApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gérer les erreurs spécifiques de l'API
    if (error.response) {
      const status = error.response.status;
      
      if (status === 401) {
        console.error('Erreur d\'authentification avec l\'API TMDb - vérifiez votre clé API');
      } else if (status === 404) {
        console.error('Ressource non trouvée sur l\'API TMDb');
      } else if (status >= 500) {
        console.error('Erreur serveur de l\'API TMDb');
      }
    } else if (error.request) {
      console.error('Pas de réponse reçue de l\'API TMDb - vérifiez votre connexion internet');
    } else {
      console.error('Erreur dans la configuration de la requête:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Service pour les appels à l'API TMDb
const tmdbService = {
  /**
   * Récupérer les médias tendances (films et séries)
   * @param {string} timeWindow - 'day' ou 'week'
   * @returns {Promise} - Résultat de l'API
   */
  getTrending: async (timeWindow = 'week') => {
    const cacheKey = `trending-${timeWindow}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    try {
      const response = await tmdbApi.get(`/trending/all/${timeWindow}`);
      cache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des tendances (${timeWindow}):`, error);
      throw error;
    }
  },

  /**
   * Récupérer les films populaires
   * @param {number} page - Numéro de page
   * @returns {Promise} - Résultat de l'API
   */
  getPopularMovies: async (page = 1) => {
    const cacheKey = `popular-movies-${page}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    try {
      const response = await tmdbApi.get('/movie/popular', {
        params: { page }
      });
      cache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des films populaires (page ${page}):`, error);
      throw error;
    }
  },

  /**
   * Récupérer les séries populaires
   * @param {number} page - Numéro de page
   * @returns {Promise} - Résultat de l'API
   */
  getPopularSeries: async (page = 1) => {
    try {
      const response = await tmdbApi.get('/tv/popular', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des séries populaires:', error);
      throw error;
    }
  },

  /**
   * Découvrir des films avec filtres
   * @param {Object} options - Options de filtrage (page, genres, année, note, etc.)
   * @returns {Promise} - Résultat de l'API
   */
  discoverMovies: async (options = {}) => {
    try {
      const response = await tmdbApi.get('/discover/movie', {
        params: options
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la découverte des films:', error);
      throw error;
    }
  },

  /**
   * Découvrir des séries TV avec filtres
   * @param {Object} options - Options de filtrage (page, genres, année, note, etc.)
   * @returns {Promise} - Résultat de l'API
   */
  discoverTVShows: async (options = {}) => {
    try {
      const response = await tmdbApi.get('/discover/tv', {
        params: options
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la découverte des séries:', error);
      throw error;
    }
  },

  /**
   * Récupérer les films à venir
   * @param {number} page - Numéro de page
   * @returns {Promise} - Résultat de l'API
   */
  getUpcomingMovies: async (page = 1) => {
    try {
      const response = await tmdbApi.get('/movie/upcoming', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des films à venir:', error);
      throw error;
    }
  },

  /**
   * Récupérer les détails d'un film
   * @param {number} id - ID du film
   * @returns {Promise} - Résultat de l'API
   */
  getMovieDetails: async (id) => {
    if (!id) {
      throw new Error('ID du film non spécifié');
    }
    
    const cacheKey = `movie-${id}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    try {
      const response = await tmdbApi.get(`/movie/${id}`, {
        params: {
          append_to_response: 'videos,credits,similar,recommendations'
        }
      });
      
      if (!response.data) {
        throw new Error(`Aucune donnée retournée pour le film ${id}`);
      }
      
      cache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error(`Film non trouvé (ID: ${id})`);
        throw new Error(`Film non trouvé (ID: ${id})`);
      }
      console.error(`Erreur lors de la récupération des détails du film ${id}:`, error);
      throw error;
    }
  },

  /**
   * Récupérer les détails d'une série
   * @param {number} id - ID de la série
   * @returns {Promise} - Résultat de l'API
   */
  getSeriesDetails: async (id) => {
    if (!id) {
      throw new Error('ID de la série non spécifié');
    }
    
    const cacheKey = `tv-${id}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    try {
      const response = await tmdbApi.get(`/tv/${id}`, {
        params: {
          append_to_response: 'videos,credits,similar,recommendations'
        }
      });
      
      if (!response.data) {
        throw new Error(`Aucune donnée retournée pour la série ${id}`);
      }
      
      cache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error(`Série non trouvée (ID: ${id})`);
        throw new Error(`Série non trouvée (ID: ${id})`);
      }
      console.error(`Erreur lors de la récupération des détails de la série ${id}:`, error);
      throw error;
    }
  },

  /**
   * Rechercher des films et séries
   * @param {string} query - Terme de recherche
   * @param {number} page - Numéro de page
   * @returns {Promise} - Résultat de l'API
   */
  searchMulti: async (query, page = 1) => {
    try {
      const response = await tmdbApi.get('/search/multi', {
        params: { query, page }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      throw error;
    }
  },

  /**
   * Rechercher des films uniquement
   * @param {string} query - Terme de recherche
   * @param {number} page - Numéro de page
   * @param {Object} additionalParams - Paramètres additionnels (filtres)
   * @returns {Promise} - Résultat de l'API
   */
  searchMovies: async (query, page = 1, additionalParams = {}) => {
    try {
      const response = await tmdbApi.get('/search/movie', {
        params: { 
          query, 
          page,
          ...additionalParams
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche de films:', error);
      throw error;
    }
  },

  /**
   * Rechercher des séries uniquement
   * @param {string} query - Terme de recherche
   * @param {number} page - Numéro de page
   * @param {Object} additionalParams - Paramètres additionnels (filtres)
   * @returns {Promise} - Résultat de l'API
   */
  searchTVShows: async (query, page = 1, additionalParams = {}) => {
    try {
      const response = await tmdbApi.get('/search/tv', {
        params: { 
          query, 
          page,
          ...additionalParams
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche de séries:', error);
      throw error;
    }
  },

  /**
   * Récupérer les genres de films
   * @returns {Promise} - Résultat de l'API
   */
  getMovieGenres: async () => {
    try {
      const response = await tmdbApi.get('/genre/movie/list');
      return response.data.genres;
    } catch (error) {
      console.error('Erreur lors de la récupération des genres de films:', error);
      throw error;
    }
  },

  /**
   * Récupérer les genres de séries
   * @returns {Promise} - Résultat de l'API
   */
  getTvGenres: async () => {
    try {
      const response = await tmdbApi.get('/genre/tv/list');
      return response.data.genres;
    } catch (error) {
      console.error('Erreur lors de la récupération des genres de séries:', error);
      throw error;
    }
  },

  /**
   * Récupérer les genres en fonction du type de média
   * @param {string} type - Type de média ('movie' ou 'tv')
   * @returns {Promise} - Liste des genres
   */
  getGenres: async (type) => {
    if (type === 'movie') {
      return tmdbService.getMovieGenres();
    } else if (type === 'tv') {
      return tmdbService.getTvGenres();
    } else {
      throw new Error('Type de média non valide. Utilisez "movie" ou "tv".');
    }
  },
  
  /**
   * Récupérer les commentaires d'un film ou d'une série
   * @param {string} mediaType - Type de média (movie ou tv)
   * @param {number} id - ID du média
   * @param {number} page - Numéro de page
   * @returns {Promise} - Résultat de l'API
   */
  getComments: async (mediaType, id, page = 1) => {
    try {
      const response = await tmdbApi.get(`/${mediaType}/${id}/reviews`, {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des commentaires:`, error);
      throw error;
    }
  }
};

export default tmdbService; 