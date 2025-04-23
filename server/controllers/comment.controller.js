const CommentModel = require('../models/comment.model');

/**
 * Contrôleur pour la gestion des commentaires
 */
class CommentController {
  /**
   * Créer un nouveau commentaire
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  static async createComment(req, res) {
    try {
      console.log('Début de createComment avec body:', req.body);
      const { media_id, mediaId, media_type, mediaType, content, parent_id, parentId, is_spoiler, isSpoiler } = req.body;
      const user_id = req.user.id;
      
      // Adapter les paramètres selon les différentes conventions de nommage possibles
      const finalMediaId = media_id || mediaId;
      const finalMediaType = media_type || mediaType;
      const finalParentId = parent_id || parentId || null;
      const finalIsSpoiler = is_spoiler || isSpoiler || false;
      
      console.log('Paramètres adaptés:', { 
        finalMediaId, 
        finalMediaType, 
        finalParentId, 
        finalIsSpoiler, 
        content 
      });
      
      // Validation des données
      if (!finalMediaId || !finalMediaType || !content) {
        console.log('Validation échouée: champs requis manquants');
        return res.status(400).json({ 
          message: 'media_id, media_type et content sont requis',
          received: { mediaId: finalMediaId, mediaType: finalMediaType, content }
        });
      }
      
      // Vérifier que media_type est valide ('movie' ou 'tv')
      if (finalMediaType !== 'movie' && finalMediaType !== 'tv') {
        console.log(`Type de média invalide: ${finalMediaType}`);
        return res.status(400).json({ 
          message: 'media_type doit être "movie" ou "tv"',
          received: finalMediaType
        });
      }
      
      // Vérifier que le commentaire n'est pas vide
      if (content.trim() === '') {
        console.log('Commentaire vide rejeté');
        return res.status(400).json({ 
          message: 'Le commentaire ne peut pas être vide' 
        });
      }
      
      // Si c'est une réponse, vérifier que le commentaire parent existe
      if (finalParentId) {
        try {
          console.log(`Vérification du commentaire parent ${finalParentId}`);
          const parentComment = await CommentModel.findById(finalParentId);
          if (!parentComment) {
            console.log(`Commentaire parent ${finalParentId} non trouvé`);
            return res.status(404).json({ 
              message: 'Le commentaire parent n\'existe pas',
              parentId: finalParentId
            });
          }
        } catch (parentError) {
          console.error('Erreur lors de la vérification du parent:', parentError);
          return res.status(500).json({ 
            message: 'Erreur lors de la vérification du commentaire parent',
            error: parentError.message
          });
        }
      }
      
      // Créer le commentaire
      console.log('Tentative de création du commentaire');
      const comment = await CommentModel.create({
        user_id,
        media_id: finalMediaId,
        media_type: finalMediaType,
        content,
        parent_id: finalParentId,
        is_spoiler: finalIsSpoiler
      });
      
      console.log('Commentaire créé avec succès:', comment);
      
      res.status(201).json({
        message: 'Commentaire créé avec succès',
        comment
      });
      
    } catch (error) {
      console.error('Erreur globale lors de la création du commentaire:', error);
      res.status(500).json({ 
        message: 'Erreur lors de la création du commentaire',
        error: error.message
      });
    }
  }
  
  /**
   * Mettre à jour un commentaire
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  static async updateComment(req, res) {
    try {
      const { id } = req.params;
      const { content, is_spoiler } = req.body;
      const user_id = req.user.id;
      
      // Validation des données
      if (!content) {
        return res.status(400).json({ 
          message: 'content est requis' 
        });
      }
      
      // Vérifier que le commentaire n'est pas vide
      if (content.trim() === '') {
        return res.status(400).json({ 
          message: 'Le commentaire ne peut pas être vide' 
        });
      }
      
      // Vérifier que le commentaire existe
      const comment = await CommentModel.findById(id);
      if (!comment) {
        return res.status(404).json({ 
          message: 'Commentaire non trouvé' 
        });
      }
      
      // Vérifier que l'utilisateur est le propriétaire du commentaire
      if (comment.user_id !== user_id) {
        return res.status(403).json({ 
          message: 'Vous n\'êtes pas autorisé à modifier ce commentaire' 
        });
      }
      
      // Mettre à jour le commentaire
      await CommentModel.update(id, {
        content,
        is_spoiler: is_spoiler !== undefined ? is_spoiler : comment.is_spoiler
      });
      
      res.status(200).json({
        message: 'Commentaire mis à jour avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du commentaire:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du commentaire' });
    }
  }
  
  /**
   * Supprimer un commentaire
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  static async deleteComment(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;
      
      // Vérifier que le commentaire existe
      const comment = await CommentModel.findById(id);
      if (!comment) {
        return res.status(404).json({ 
          message: 'Commentaire non trouvé' 
        });
      }
      
      // Vérifier que l'utilisateur est le propriétaire du commentaire
      if (comment.user_id !== user_id) {
        return res.status(403).json({ 
          message: 'Vous n\'êtes pas autorisé à supprimer ce commentaire' 
        });
      }
      
      // Supprimer le commentaire
      await CommentModel.delete(id);
      
      res.status(200).json({
        message: 'Commentaire supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
      res.status(500).json({ message: 'Erreur lors de la suppression du commentaire' });
    }
  }
  
  /**
   * Récupérer tous les commentaires d'un média
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  static async getMediaComments(req, res) {
    try {
      const { media_id, media_type } = req.params;
      
      // Validation des données
      if (!media_id || !media_type) {
        return res.status(400).json({ 
          message: 'media_id et media_type sont requis' 
        });
      }
      
      // Récupérer les commentaires
      const comments = await CommentModel.getMediaComments(media_id, media_type);
      
      // Pour chaque commentaire, récupérer ses réponses
      const commentsWithReplies = await Promise.all(
        comments.map(async (comment) => {
          const replies = await CommentModel.getCommentReplies(comment.id);
          return { ...comment, replies };
        })
      );
      
      res.status(200).json({
        comments: commentsWithReplies
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des commentaires' });
    }
  }
  
  /**
   * Récupérer toutes les réponses à un commentaire
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  static async getCommentReplies(req, res) {
    try {
      const { comment_id } = req.params;
      
      // Vérifier que le commentaire existe
      const comment = await CommentModel.findById(comment_id);
      if (!comment) {
        return res.status(404).json({ 
          message: 'Commentaire non trouvé' 
        });
      }
      
      // Récupérer les réponses
      const replies = await CommentModel.getCommentReplies(comment_id);
      
      res.status(200).json({
        replies
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des réponses:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des réponses' });
    }
  }
}

module.exports = CommentController; 