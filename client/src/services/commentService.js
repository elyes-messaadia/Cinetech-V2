import axios from 'axios';
import { getToken } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

// Service pour la gestion des commentaires
const commentService = {
  // Récupérer tous les commentaires d'un média
  getMediaComments: async (mediaId, mediaType) => {
    try {
      const response = await axios.get(`${API_URL}/comments/media/${mediaType}/${mediaId}`);
      return response.data.comments || [];
    } catch (error) {
      console.error('Erreur getMediaComments:', error);
      if (error.response) {
        console.error('Réponse d\'erreur:', error.response.data);
      }
      return [];
    }
  },
  
  // Récupérer toutes les réponses à un commentaire
  getCommentReplies: async (commentId) => {
    try {
      const response = await authAxios.get(`${API_URL}/comments/replies/${commentId}`);
      return response.data.replies;
    } catch (error) {
      console.error('Erreur getCommentReplies:', error);
      throw error.response?.data || { message: 'Erreur lors de la récupération des réponses' };
    }
  },
  
  // Créer un nouveau commentaire
  createComment: async (commentData) => {
    try {
      const response = await authAxios.post(`${API_URL}/comments`, commentData);
      return response.data;
    } catch (error) {
      console.error('Erreur createComment:', error);
      if (error.response) {
        console.error('Réponse d\'erreur:', error.response.data);
      }
      throw error.response?.data || { message: 'Erreur lors de la création du commentaire' };
    }
  },
  
  // Mettre à jour un commentaire
  updateComment: async (commentId, commentData) => {
    try {
      const response = await authAxios.put(`${API_URL}/comments/${commentId}`, commentData);
      return response.data;
    } catch (error) {
      console.error('Erreur updateComment:', error);
      throw error.response?.data || { message: 'Erreur lors de la mise à jour du commentaire' };
    }
  },
  
  // Supprimer un commentaire
  deleteComment: async (commentId) => {
    try {
      const response = await authAxios.delete(`${API_URL}/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur deleteComment:', error);
      throw error.response?.data || { message: 'Erreur lors de la suppression du commentaire' };
    }
  }
};

export default commentService; 