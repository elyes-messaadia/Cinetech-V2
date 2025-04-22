import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Service pour la gestion des commentaires
const commentService = {
  // Récupérer tous les commentaires d'un média
  getMediaComments: async (mediaId, mediaType) => {
    try {
      const response = await axios.get(`${API_URL}/comments/media/${mediaType}/${mediaId}`);
      return response.data.comments;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des commentaires' };
    }
  },
  
  // Récupérer toutes les réponses à un commentaire
  getCommentReplies: async (commentId) => {
    try {
      const response = await axios.get(`${API_URL}/comments/replies/${commentId}`);
      return response.data.replies;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des réponses' };
    }
  },
  
  // Créer un nouveau commentaire
  createComment: async (commentData) => {
    try {
      const response = await axios.post(`${API_URL}/comments`, commentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la création du commentaire' };
    }
  },
  
  // Mettre à jour un commentaire
  updateComment: async (commentId, commentData) => {
    try {
      const response = await axios.put(`${API_URL}/comments/${commentId}`, commentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour du commentaire' };
    }
  },
  
  // Supprimer un commentaire
  deleteComment: async (commentId) => {
    try {
      const response = await axios.delete(`${API_URL}/comments/${commentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la suppression du commentaire' };
    }
  }
};

export default commentService; 