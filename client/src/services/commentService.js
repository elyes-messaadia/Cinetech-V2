import axios from 'axios';
import { getToken } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Cache pour les commentaires
const commentsCache = {
  data: new Map(),
  ttl: 60 * 1000, // 1 minute en ms
  
  // Générer une clé unique pour chaque média
  getMediaKey: (mediaType, mediaId) => `comments-${mediaType}-${mediaId}`,
  
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
  
  invalidate: function(mediaType, mediaId) {
    const key = this.getMediaKey(mediaType, mediaId);
    this.data.delete(key);
  }
};

// Configurer axios avec le token d'authentification
const authAxios = axios.create({
  baseURL: API_URL,
  timeout: 10000 // 10 secondes timeout
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

// Fonction utilitaire pour la gestion des erreurs
const handleError = (error, context) => {
  console.error(`Erreur ${context}:`, error);
  
  if (error.response) {
    console.error('Réponse d\'erreur:', error.response.status, error.response.data);
    return Promise.reject(error.response.data || { message: `Erreur ${context}` });
  }
  
  if (error.request) {
    console.error('Pas de réponse du serveur');
    return Promise.reject({ message: 'Le serveur ne répond pas. Veuillez réessayer plus tard.' });
  }
  
  return Promise.reject({ message: `Erreur ${context}: ${error.message}` });
};

// Service pour la gestion des commentaires
const commentService = {
  // Récupérer tous les commentaires d'un média
  getMediaComments: async (mediaId, mediaType) => {
    if (!mediaId || !mediaType) {
      console.error('getMediaComments: mediaId ou mediaType manquant');
      return [];
    }
    
    const cacheKey = commentsCache.getMediaKey(mediaType, mediaId);
    const cachedComments = commentsCache.get(cacheKey);
    
    if (cachedComments) {
      return cachedComments;
    }
    
    try {
      const response = await axios.get(`${API_URL}/comments/media/${mediaType}/${mediaId}`);
      const comments = response.data.comments || [];
      
      // Trier les commentaires par date (plus récents en premier)
      const sortedComments = comments.sort((a, b) => {
        return new Date(b.created_at || b.date) - new Date(a.created_at || a.date);
      });
      
      commentsCache.set(cacheKey, sortedComments);
      return sortedComments;
    } catch {
      console.warn(`Aucun commentaire trouvé pour ${mediaType}/${mediaId} ou erreur de chargement`);
      return [];
    }
  },
  
  // Récupérer toutes les réponses à un commentaire
  getCommentReplies: async (commentId) => {
    if (!commentId) {
      return Promise.reject({ message: 'ID de commentaire non spécifié' });
    }
    
    try {
      const response = await authAxios.get(`${API_URL}/comments/replies/${commentId}`);
      return response.data.replies || [];
    } catch (error) {
      return handleError(error, 'lors de la récupération des réponses');
    }
  },
  
  // Créer un nouveau commentaire
  createComment: async (commentData) => {
    if (!commentData || !commentData.media_id || !commentData.media_type || !commentData.content) {
      return Promise.reject({ message: 'Données de commentaire incomplètes' });
    }
    
    try {
      const response = await authAxios.post(`${API_URL}/comments`, commentData);
      
      // Invalider le cache pour ce média
      commentsCache.invalidate(commentData.media_type, commentData.media_id);
      
      return response.data;
    } catch (error) {
      return handleError(error, 'lors de la création du commentaire');
    }
  },
  
  // Mettre à jour un commentaire
  updateComment: async (commentId, commentData) => {
    if (!commentId) {
      return Promise.reject({ message: 'ID de commentaire non spécifié' });
    }
    
    try {
      const response = await authAxios.put(`${API_URL}/comments/${commentId}`, commentData);
      
      // Invalider le cache si on a l'information sur le média
      if (commentData.media_type && commentData.media_id) {
        commentsCache.invalidate(commentData.media_type, commentData.media_id);
      }
      
      return response.data;
    } catch (error) {
      return handleError(error, 'lors de la mise à jour du commentaire');
    }
  },
  
  // Supprimer un commentaire
  deleteComment: async (commentId, mediaType, mediaId) => {
    if (!commentId) {
      return Promise.reject({ message: 'ID de commentaire non spécifié' });
    }
    
    try {
      const response = await authAxios.delete(`${API_URL}/comments/${commentId}`);
      
      // Invalider le cache si on a l'information sur le média
      if (mediaType && mediaId) {
        commentsCache.invalidate(mediaType, mediaId);
      }
      
      return response.data;
    } catch (error) {
      return handleError(error, 'lors de la suppression du commentaire');
    }
  }
};

export default commentService; 