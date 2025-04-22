// Importations commentées pour l'instant (à décommenter lorsque l'API sera prête)
// import axios from 'axios';
// import { getToken } from './authService';

// const API_URL = import.meta.env.VITE_API_URL;

// Service pour la gestion des favoris
const favoriteService = {
  /**
   * Récupérer les favoris de l'utilisateur connecté
   * @returns {Promise} Liste des favoris
   */
  getUserFavorites: async () => {
    try {
      // Cette fonction appelle l'API, mais pour le moment elle renvoie des données fictives
      // Nous allons simuler un appel API avec un setTimeout
      return new Promise((resolve) => {
        setTimeout(() => {
          // Données fictives pour le développement
          resolve([]);
        }, 500);
      });
      
      // Quand l'API sera prête, le code ci-dessous devra être utilisé
      /*
      const token = getToken();
      const response = await axios.get(`${API_URL}/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
      */
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris:', error);
      throw error;
    }
  },

  /**
   * Ajouter un média aux favoris
   * @param {number} mediaId - ID du média
   * @param {string} mediaType - Type du média (movie ou tv)
   * @returns {Promise} - Résultat de l'API
   */
  // eslint-disable-next-line no-unused-vars
  addFavorite: async (mediaId, mediaType) => {
    try {
      // Cette fonction appelle l'API, mais pour le moment elle renvoie une promesse résolue
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 500);
      });
      
      // Quand l'API sera prête, le code ci-dessous devra être utilisé
      /*
      const token = getToken();
      const response = await axios.post(`${API_URL}/favorites`, {
        mediaId: mediaId,
        mediaType: mediaType
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
      */
    } catch (error) {
      console.error('Erreur lors de l\'ajout du favori:', error);
      throw error;
    }
  },

  /**
   * Supprimer un média des favoris
   * @param {number} mediaId - ID du média
   * @param {string} mediaType - Type du média (movie ou tv)
   * @returns {Promise} - Résultat de l'API
   */
  // eslint-disable-next-line no-unused-vars
  removeFavorite: async (mediaId, mediaType) => {
    try {
      // Cette fonction appelle l'API, mais pour le moment elle renvoie une promesse résolue
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 500);
      });
      
      // Quand l'API sera prête, le code ci-dessous devra être utilisé
      /*
      const token = getToken();
      const response = await axios.delete(`${API_URL}/favorites/${mediaType}/${mediaId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
      */
    } catch (error) {
      console.error('Erreur lors de la suppression du favori:', error);
      throw error;
    }
  },

  /**
   * Vérifier si un média est dans les favoris de l'utilisateur
   * @param {number} mediaId - ID du média
   * @param {string} mediaType - Type du média (movie ou tv)
   * @returns {Promise<boolean>} - true si le média est dans les favoris, false sinon
   */
  // eslint-disable-next-line no-unused-vars
  isFavorite: async (mediaId, mediaType) => {
    try {
      // Cette fonction appelle l'API, mais pour le moment elle renvoie une valeur aléatoire
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(Math.random() > 0.5);
        }, 500);
      });
      
      // Quand l'API sera prête, le code ci-dessous devra être utilisé
      /*
      const token = getToken();
      const response = await axios.get(`${API_URL}/favorites/check/${mediaType}/${mediaId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.isFavorite;
      */
    } catch (error) {
      console.error('Erreur lors de la vérification du favori:', error);
      return false;
    }
  }
};

export default favoriteService; 