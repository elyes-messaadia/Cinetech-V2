/**
 * Fonction de debounce pour limiter la fréquence d'exécution d'une fonction
 * @param {Function} func - La fonction à exécuter
 * @param {number} wait - Le délai d'attente en millisecondes
 * @returns {Function} - La fonction avec debounce
 */
export const debounce = (func, wait) => {
  let timeoutId = null;
  
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, wait);
  };
};

/**
 * Formater une date en chaîne de caractères localisée
 * @param {string} dateString - La date au format ISO
 * @param {boolean} includeTime - Inclure l'heure dans le résultat
 * @returns {string} - La date formatée
 */
export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return 'Date inconnue';
  
  const date = new Date(dateString);
  const options = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    ...(includeTime && { hour: '2-digit', minute: '2-digit' })
  };
  
  return date.toLocaleDateString('fr-FR', options);
};

/**
 * Tronquer un texte à une longueur maximale
 * @param {string} text - Le texte à tronquer
 * @param {number} maxLength - La longueur maximale
 * @returns {string} - Le texte tronqué
 */
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Obtenir l'URL d'une image TMDb
 * @param {string} path - Le chemin de l'image
 * @param {string} size - La taille de l'image (w92, w154, w185, w342, w500, w780, original)
 * @param {string} fallback - L'URL de l'image par défaut
 * @returns {string} - L'URL complète de l'image
 */
export const getImageUrl = (path, size = 'original', fallback = '/images/poster-placeholder.png') => {
  if (!path) return fallback;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

/**
 * Convertir les minutes en format heures/minutes
 * @param {number} minutes - Le nombre de minutes
 * @returns {string} - Le temps formaté
 */
export const formatRuntime = (minutes) => {
  if (!minutes) return 'Non disponible';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}min`;
  return `${hours}h ${mins}min`;
}; 