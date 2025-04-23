import axios from 'axios';

// Vérifier si la clé API TMDB est définie
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

if (!TMDB_API_KEY) {
  console.error('ERREUR: La clé API TMDB (VITE_TMDB_API_KEY) n\'est pas définie dans le fichier .env');
} else {
  console.log('Clé API TMDB trouvée:', TMDB_API_KEY.substring(0, 5) + '...');
}

// Créer une instance axios pour l'API TMDb
const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: TMDB_API_KEY,
    language: 'fr-FR'
  }
});

// Intercepteur pour les requêtes
tmdbApi.interceptors.request.use(
  config => {
    console.log(`Requête TMDB: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    console.error('Erreur dans la requête TMDB:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
tmdbApi.interceptors.response.use(
  response => {
    console.log(`Réponse TMDB: ${response.status} ${response.config.url}`);
    return response;
  },
  error => {
    if (error.response) {
      console.error(`Erreur TMDB ${error.response.status}: ${error.response.data.status_message || error.message}`);
    } else if (error.request) {
      console.error('Aucune réponse reçue de TMDB:', error.request);
    } else {
      console.error('Erreur lors de la configuration de la requête TMDB:', error.message);
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
    try {
      if (!TMDB_API_KEY) throw new Error('Clé API TMDB non définie');
      console.log(`Récupération des tendances (${timeWindow})...`);
      const response = await tmdbApi.get(`/trending/all/${timeWindow}`);
      console.log(`Tendances récupérées: ${response.data.results.length} résultats`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des tendances:', error);
      throw error;
    }
  },

  /**
   * Récupérer les films populaires
   * @param {number} page - Numéro de page
   * @returns {Promise} - Résultat de l'API
   */
  getPopularMovies: async (page = 1) => {
    try {
      console.log(`Récupération des films populaires (page ${page})...`);
      const response = await tmdbApi.get('/movie/popular', {
        params: { page }
      });
      console.log(`Films populaires récupérés: ${response.data.results.length} résultats`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des films populaires:', error);
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
      console.log(`Récupération des séries populaires (page ${page})...`);
      const response = await tmdbApi.get('/tv/popular', {
        params: { page }
      });
      console.log(`Séries populaires récupérées: ${response.data.results.length} résultats`);
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
    try {
      const response = await tmdbApi.get(`/movie/${id}`, {
        params: {
          append_to_response: 'videos,credits,similar,recommendations'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des détails du film ${id}:`, error);
      throw error;
    }
  },

  /**
   * Récupérer les détails d'une série
   * @param {number} id - ID de la série
   * @returns {Promise} - Résultat de l'API
   */
  getTvDetails: async (id) => {
    try {
      const response = await tmdbApi.get(`/tv/${id}`, {
        params: {
          append_to_response: 'videos,credits,similar,recommendations'
        }
      });
      return response.data;
    } catch (error) {
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