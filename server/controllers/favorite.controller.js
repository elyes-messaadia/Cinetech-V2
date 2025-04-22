const FavoriteModel = require('../models/favorite.model');

/**
 * Contrôleur pour la gestion des favoris
 */
class FavoriteController {
  /**
   * Ajouter un média aux favoris
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  static async addFavorite(req, res) {
    try {
      const { media_id, media_type } = req.body;
      const user_id = req.user.id;
      
      // Validation des données
      if (!media_id || !media_type) {
        return res.status(400).json({ 
          message: 'media_id et media_type sont requis' 
        });
      }
      
      // Vérifier que media_type est valide ('movie' ou 'tv')
      if (media_type !== 'movie' && media_type !== 'tv') {
        return res.status(400).json({ 
          message: 'media_type doit être "movie" ou "tv"' 
        });
      }
      
      // Vérifier si le favori existe déjà
      const exists = await FavoriteModel.exists(user_id, media_id, media_type);
      if (exists) {
        return res.status(409).json({ 
          message: 'Ce média est déjà dans vos favoris' 
        });
      }
      
      // Ajouter le favori
      const favorite = await FavoriteModel.add({
        user_id,
        media_id,
        media_type
      });
      
      res.status(201).json({
        message: 'Média ajouté aux favoris avec succès',
        favorite
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du favori:', error);
      res.status(500).json({ message: 'Erreur lors de l\'ajout du favori' });
    }
  }
  
  /**
   * Supprimer un média des favoris
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  static async removeFavorite(req, res) {
    try {
      const { media_id, media_type } = req.params;
      const user_id = req.user.id;
      
      // Validation des données
      if (!media_id || !media_type) {
        return res.status(400).json({ 
          message: 'media_id et media_type sont requis' 
        });
      }
      
      // Vérifier si le favori existe
      const exists = await FavoriteModel.exists(user_id, media_id, media_type);
      if (!exists) {
        return res.status(404).json({ 
          message: 'Ce média n\'est pas dans vos favoris' 
        });
      }
      
      // Supprimer le favori
      await FavoriteModel.remove(user_id, media_id, media_type);
      
      res.status(200).json({
        message: 'Média supprimé des favoris avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du favori:', error);
      res.status(500).json({ message: 'Erreur lors de la suppression du favori' });
    }
  }
  
  /**
   * Vérifier si un média est dans les favoris
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  static async checkFavorite(req, res) {
    try {
      const { media_id, media_type } = req.params;
      const user_id = req.user.id;
      
      // Validation des données
      if (!media_id || !media_type) {
        return res.status(400).json({ 
          message: 'media_id et media_type sont requis' 
        });
      }
      
      // Vérifier si le favori existe
      const isFavorite = await FavoriteModel.exists(user_id, media_id, media_type);
      
      res.status(200).json({
        isFavorite
      });
    } catch (error) {
      console.error('Erreur lors de la vérification du favori:', error);
      res.status(500).json({ message: 'Erreur lors de la vérification du favori' });
    }
  }
  
  /**
   * Récupérer tous les favoris d'un utilisateur
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  static async getUserFavorites(req, res) {
    try {
      const user_id = req.user.id;
      
      // Récupérer les favoris
      const favorites = await FavoriteModel.getUserFavorites(user_id);
      
      res.status(200).json({
        favorites
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des favoris' });
    }
  }
}

module.exports = FavoriteController; 