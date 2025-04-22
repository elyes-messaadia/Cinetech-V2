import axios from 'axios';

// Configuration de base pour axios
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'votre_cle_api_tmdb';
const BASE_URL = 'https://api.themoviedb.org/3';

// Instance axios avec configuration par défaut
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'fr-FR'
  }
});

// Services pour l'API TMDb
const tmdbService = {
  // Films
  fetchTrendingMovies: async (timeWindow = 'week') => {
    try {
      const response = await api.get(`/trending/movie/${timeWindow}`);
      return response.data.results;
    } catch (error) {
      console.error('Erreur lors de la récupération des films tendances', error);
      throw error;
    }
  },
  
  fetchPopularMovies: async () => {
    try {
      const response = await api.get('/movie/popular');
      return response.data.results;
    } catch (error) {
      console.error('Erreur lors de la récupération des films populaires', error);
      throw error;
    }
  },
  
  fetchMovieDetails: async (movieId) => {
    try {
      const response = await api.get(`/movie/${movieId}`, {
        params: {
          append_to_response: 'videos,images'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des détails du film ${movieId}`, error);
      throw error;
    }
  },
  
  fetchMovieCredits: async (movieId) => {
    try {
      const response = await api.get(`/movie/${movieId}/credits`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des crédits du film ${movieId}`, error);
      throw error;
    }
  },
  
  fetchSimilarMovies: async (movieId) => {
    try {
      const response = await api.get(`/movie/${movieId}/similar`);
      return response.data.results;
    } catch (error) {
      console.error(`Erreur lors de la récupération des films similaires à ${movieId}`, error);
      throw error;
    }
  },
  
  // Séries TV
  fetchTrendingTvShows: async (timeWindow = 'week') => {
    try {
      const response = await api.get(`/trending/tv/${timeWindow}`);
      return response.data.results;
    } catch (error) {
      console.error('Erreur lors de la récupération des séries tendances', error);
      throw error;
    }
  },
  
  fetchPopularTvShows: async () => {
    try {
      const response = await api.get('/tv/popular');
      return response.data.results;
    } catch (error) {
      console.error('Erreur lors de la récupération des séries populaires', error);
      throw error;
    }
  },
  
  fetchTvShowDetails: async (tvId) => {
    try {
      const response = await api.get(`/tv/${tvId}`, {
        params: {
          append_to_response: 'videos,images'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des détails de la série ${tvId}`, error);
      throw error;
    }
  },
  
  fetchTvShowCredits: async (tvId) => {
    try {
      const response = await api.get(`/tv/${tvId}/credits`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des crédits de la série ${tvId}`, error);
      throw error;
    }
  },
  
  fetchSimilarTvShows: async (tvId) => {
    try {
      const response = await api.get(`/tv/${tvId}/similar`);
      return response.data.results;
    } catch (error) {
      console.error(`Erreur lors de la récupération des séries similaires à ${tvId}`, error);
      throw error;
    }
  },
  
  // Recherche
  searchMulti: async (query, page = 1) => {
    try {
      const response = await api.get('/search/multi', {
        params: {
          query,
          page
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la recherche de "${query}"`, error);
      throw error;
    }
  },
  
  // Découverte
  discoverMovies: async (params = {}) => {
    try {
      const response = await api.get('/discover/movie', {
        params: { ...params }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la découverte de films', error);
      throw error;
    }
  },
  
  discoverTvShows: async (params = {}) => {
    try {
      const response = await api.get('/discover/tv', {
        params: { ...params }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la découverte de séries', error);
      throw error;
    }
  },
  
  // Genres
  fetchMovieGenres: async () => {
    try {
      const response = await api.get('/genre/movie/list');
      return response.data.genres;
    } catch (error) {
      console.error('Erreur lors de la récupération des genres de films', error);
      throw error;
    }
  },
  
  fetchTvGenres: async () => {
    try {
      const response = await api.get('/genre/tv/list');
      return response.data.genres;
    } catch (error) {
      console.error('Erreur lors de la récupération des genres de séries', error);
      throw error;
    }
  }
};

export default tmdbService; 