const express = require('express');
const CommentController = require('../controllers/comment.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// Routes publiques (ne nécessitant pas d'authentification)
// Récupérer tous les commentaires d'un média
router.get('/media/:media_type/:media_id', CommentController.getMediaComments);

// Récupérer toutes les réponses à un commentaire
router.get('/replies/:comment_id', CommentController.getCommentReplies);

// Routes protégées (nécessitant une authentification)
// Appliquer le middleware d'authentification aux routes suivantes
router.use(verifyToken);

// Créer un commentaire
router.post('/', CommentController.createComment);

// Mettre à jour un commentaire
router.put('/:id', CommentController.updateComment);

// Supprimer un commentaire
router.delete('/:id', CommentController.deleteComment);

module.exports = router; 