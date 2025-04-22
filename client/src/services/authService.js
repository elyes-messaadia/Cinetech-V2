import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Récupérer le token JWT du localStorage
export const getToken = () => localStorage.getItem('token');

// Configurer axios avec le token d'authentification
const authAxios = axios.create({
  baseURL: API_URL
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
authAxios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Service pour l'authentification
const authService = {
  /**
   * Inscription d'un nouvel utilisateur
   * @param {Object} userData - Données de l'utilisateur (username, email, password)
   * @returns {Promise} - Résultat de l'API avec l'utilisateur et le token
   */
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      
      // Gestion des erreurs spécifiques
      if (error.response) {
        if (error.response.status === 409) {
          throw new Error('Cet email est déjà utilisé');
        }
        throw new Error(error.response.data.message || 'Erreur lors de l\'inscription');
      }
      
      throw new Error('Erreur lors de l\'inscription');
    }
  },

  /**
   * Connexion d'un utilisateur
   * @param {Object} credentials - Identifiants de connexion (email, password)
   * @returns {Promise} - Résultat de l'API avec l'utilisateur et le token
   */
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      
      // Gestion des erreurs spécifiques
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error('Email ou mot de passe incorrect');
        }
        throw new Error(error.response.data.message || 'Erreur lors de la connexion');
      }
      
      throw new Error('Erreur lors de la connexion');
    }
  },

  /**
   * Vérification du token JWT
   * @returns {Promise} - Résultat de l'API avec les données de l'utilisateur
   */
  verifyToken: async () => {
    try {
      const response = await authAxios.get(`${API_URL}/auth/verify`);
      return response.data.user;
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      throw error;
    }
  },

  /**
   * Mise à jour du profil utilisateur
   * @param {Object} userData - Nouvelles données de l'utilisateur
   * @returns {Promise} - Résultat de l'API avec l'utilisateur mis à jour
   */
  updateProfile: async (userData) => {
    try {
      const response = await authAxios.put(`${API_URL}/users/profile`, userData);
      return response.data.user;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      
      // Gestion des erreurs spécifiques
      if (error.response) {
        if (error.response.status === 409) {
          throw new Error('Cet email est déjà utilisé');
        }
        throw new Error(error.response.data.message || 'Erreur lors de la mise à jour du profil');
      }
      
      throw new Error('Erreur lors de la mise à jour du profil');
    }
  }
};

export default authService; 
   * @returns {Promise} - Résultat de l'API avec l'utilisateur mis à jour
   */
  updateProfile: async (userData) => {
    try {
      const response = await authAxios.put(`${API_URL}/users/profile`, userData);
      return response.data.user;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      
      // Gestion des erreurs spécifiques
      if (error.response) {
        if (error.response.status === 409) {
          throw new Error('Cet email est déjà utilisé');
        }
        throw new Error(error.response.data.message || 'Erreur lors de la mise à jour du profil');
      }
      
      throw new Error('Erreur lors de la mise à jour du profil');
    }
  }
};

export default authService; 