import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Service pour la gestion des favoris
const favoriteService = {
  // Récupérer tous les favoris de l'utilisateur
  getFavorites: async () => {
    try {
      const response = await axios.get(`${API_URL}/favorites`);
      return response.data.favorites;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des favoris' };
    }
  },
  
  // Vérifier si un média est dans les favoris
  checkFavorite: async (mediaId, mediaType) => {
    try {
      const response = await axios.get(`${API_URL}/favorites/check/${mediaType}/${mediaId}`);
      return response.data.isFavorite;
    } catch (error) {
      console.error('Erreur lors de la vérification du favori:', error);
      return false;
    }
  },
  
  // Ajouter un média aux favoris
  addFavorite: async (mediaId, mediaType) => {
    try {
      const response = await axios.post(`${API_URL}/favorites`, {
        media_id: mediaId,
        media_type: mediaType
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de l\'ajout aux favoris' };
    }
  },
  
  // Supprimer un média des favoris
  removeFavorite: async (mediaId, mediaType) => {
    try {
      const response = await axios.delete(`${API_URL}/favorites/${mediaType}/${mediaId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la suppression des favoris' };
    }
  },
  
  // Toggle favori (ajouter ou supprimer)
  toggleFavorite: async (mediaId, mediaType) => {
    try {
      const isFavorite = await favoriteService.checkFavorite(mediaId, mediaType);
      
      if (isFavorite) {
        return await favoriteService.removeFavorite(mediaId, mediaType);
      } else {
        return await favoriteService.addFavorite(mediaId, mediaType);
      }
    } catch (error) {
      throw error;
    }
  }
};

export default favoriteService; 