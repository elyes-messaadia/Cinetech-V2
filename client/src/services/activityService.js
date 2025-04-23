// Importations commentées pour l'instant (à décommenter lorsque l'API sera prête)
// import axios from 'axios';
// import { getToken } from './authService';

// const API_URL = import.meta.env.VITE_API_URL;

// Service pour la gestion des activités utilisateur
const activityService = {
  /**
   * Récupérer les activités récentes de l'utilisateur connecté
   * @param {number} limit - Nombre maximum d'activités à récupérer
   * @returns {Promise} Liste des activités
   */
  getUserActivities: async (limit = 5) => {
    try {
      // Cette fonction appelle l'API, mais pour le moment elle renvoie des données fictives
      // Nous allons simuler un appel API avec un setTimeout
      return new Promise((resolve) => {
        setTimeout(() => {
          // Données fictives pour le développement
          const activities = [
            {
              id: 1,
              type: 'favorite',
              mediaType: 'movie',
              mediaId: 550,
              mediaTitle: 'Fight Club',
              posterPath: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
              date: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
            },
            {
              id: 2,
              type: 'watchlist',
              mediaType: 'tv',
              mediaId: 1396,
              mediaTitle: 'Breaking Bad',
              posterPath: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
              date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() // 3 hours ago
            },
            {
              id: 3,
              type: 'view',
              mediaType: 'movie',
              mediaId: 155,
              mediaTitle: 'The Dark Knight',
              posterPath: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
              date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
            },
            {
              id: 4,
              type: 'favorite',
              mediaType: 'tv',
              mediaId: 66732,
              mediaTitle: 'Stranger Things',
              posterPath: '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
              date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() // 2 days ago
            },
            {
              id: 5,
              type: 'view',
              mediaType: 'movie',
              mediaId: 680,
              mediaTitle: 'Pulp Fiction',
              posterPath: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
              date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() // 3 days ago
            }
          ];
          
          // Limiter le nombre d'activités
          resolve(activities.slice(0, limit));
        }, 500);
      });
      
      // Quand l'API sera prête, le code ci-dessous devra être utilisé
      /*
      const token = getToken();
      const response = await axios.get(`${API_URL}/activities?limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
      */
    } catch (error) {
      console.error('Erreur lors de la récupération des activités:', error);
      throw error;
    }
  },

  /**
   * Ajouter une nouvelle activité
   * @param {Object} activity - Données de l'activité
   * @returns {Promise} - Résultat de l'API
   */
  addActivity: async (activity) => {
    try {
      // Cette fonction appelle l'API, mais pour le moment elle renvoie une promesse résolue
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, activity: { ...activity, id: Math.random() } });
        }, 300);
      });
      
      // Quand l'API sera prête, le code ci-dessous devra être utilisé
      /*
      const token = getToken();
      const response = await axios.post(`${API_URL}/activities`, activity, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
      */
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'activité:', error);
      throw error;
    }
  },

  /**
   * Supprimer une activité
   * @param {number} activityId - ID de l'activité à supprimer
   * @returns {Promise} - Résultat de l'API
   */
  // eslint-disable-next-line no-unused-vars
  deleteActivity: async (activityId) => {
    try {
      // Cette fonction appelle l'API, mais pour le moment elle renvoie une promesse résolue
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 300);
      });
      
      // Quand l'API sera prête, le code ci-dessous devra être utilisé
      /*
      const token = getToken();
      const response = await axios.delete(`${API_URL}/activities/${activityId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
      */
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'activité:', error);
      throw error;
    }
  }
};

export default activityService; 