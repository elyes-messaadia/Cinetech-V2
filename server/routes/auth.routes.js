const express = require('express');
const AuthController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// Route pour l'inscription
router.post('/register', AuthController.register);

// Route pour la connexion
router.post('/login', AuthController.login);

// Route pour vérifier le token
router.get('/verify', verifyToken, AuthController.verifyToken);

module.exports = router; 