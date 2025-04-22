import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Service d'authentification
const authService = {
  // Inscription d'un utilisateur
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de l\'inscription' };
    }
  },
  
  // Connexion d'un utilisateur
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la connexion' };
    }
  },
  
  // Déconnexion
  logout: () => {
    localStorage.removeItem('user');
  },
  
  // Vérification du token JWT
  verifyToken: async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) {
      return null;
    }
    
    try {
      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      return response.data;
    } catch (error) {
      // Si le token est invalide, déconnecter l'utilisateur
      localStorage.removeItem('user');
      throw error.response?.data || { message: 'Token invalide' };
    }
  },
  
  // Récupérer l'utilisateur courant depuis le localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  // Récupérer le token JWT
  getToken: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).token : null;
  },
  
  // Vérifier si l'utilisateur est connecté
  isLoggedIn: () => {
    return !!localStorage.getItem('user');
  }
};

// Intercepteur pour ajouter le token à toutes les requêtes
axios.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token && !config.url.includes('themoviedb.org')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default authService; 