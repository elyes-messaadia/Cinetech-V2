const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

/**
 * Contrôleur pour l'authentification
 */
class AuthController {
  /**
   * Inscription d'un nouvel utilisateur
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  static async register(req, res) {
    try {
      const { username, email, password } = req.body;
      
      // Validation des données
      if (!username || !email || !password) {
        return res.status(400).json({ 
          message: 'Tous les champs sont requis (username, email, password)' 
        });
      }
      
      // Vérifier si l'email existe déjà
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'Cet email est déjà utilisé' });
      }
      
      // Hasher le mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Créer l'utilisateur
      const user = await UserModel.create({
        username,
        email,
        password: hashedPassword
      });
      
      // Générer un token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({ message: 'Erreur lors de l\'inscription' });
    }
  }
  
  /**
   * Connexion d'un utilisateur
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validation des données
      if (!email || !password) {
        return res.status(400).json({ 
          message: 'Email et mot de passe requis' 
        });
      }
      
      // Vérifier si l'utilisateur existe
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }
      
      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }
      
      // Générer un token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.status(200).json({
        message: 'Connexion réussie',
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
  }
  
  /**
   * Vérification du token JWT
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  static async verifyToken(req, res) {
    // Le middleware auth a déjà vérifié le token
    try {
      const user = await UserModel.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      
      res.status(200).json({
        message: 'Token valide',
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      res.status(500).json({ message: 'Erreur lors de la vérification du token' });
    }
  }
}

module.exports = AuthController; 