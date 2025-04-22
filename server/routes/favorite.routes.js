const express = require('express');
const FavoriteController = require('../controllers/favorite.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// Appliquer le middleware d'authentification à toutes les routes
router.use(verifyToken);

// Route pour ajouter un favori
router.post('/', FavoriteController.addFavorite);

// Route pour supprimer un favori
router.delete('/:media_type/:media_id', FavoriteController.removeFavorite);

// Route pour vérifier si un média est dans les favoris
router.get('/check/:media_type/:media_id', FavoriteController.checkFavorite);

// Route pour récupérer tous les favoris d'un utilisateur
router.get('/', FavoriteController.getUserFavorites);

module.exports = router; 