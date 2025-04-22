const express = require('express');
const UserController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// Appliquer le middleware d'authentification à toutes les routes
router.use(verifyToken);

// Récupérer le profil de l'utilisateur connecté
router.get('/profile', UserController.getProfile);

// Mettre à jour le profil de l'utilisateur connecté
router.put('/profile', UserController.updateProfile);

// Mettre à jour le mot de passe de l'utilisateur connecté
router.put('/password', UserController.updatePassword);

module.exports = router; 