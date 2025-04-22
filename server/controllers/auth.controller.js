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
      console.log("Début du processus d'inscription");
      const { username, email, password } = req.body;
      console.log("Données reçues:", { username, email, password: "***" });
      
      // Validation des données
      if (!username || !email || !password) {
        console.log("Validation échouée: champs manquants");
        return res.status(400).json({ 
          message: 'Tous les champs sont requis (username, email, password)' 
        });
      }
      
      // Vérifier si l'email existe déjà
      try {
        console.log("Vérification de l'email existant...");
        const existingUser = await UserModel.findByEmail(email);
        console.log("Résultat de la vérification:", existingUser ? "Email déjà utilisé" : "Email disponible");
        
        if (existingUser) {
          return res.status(409).json({ message: 'Cet email est déjà utilisé' });
        }
      } catch (emailCheckError) {
        console.error("Erreur lors de la vérification de l'email:", emailCheckError);
        return res.status(500).json({ 
          message: 'Erreur lors de la vérification de l\'email',
          details: emailCheckError.message
        });
      }
      
      // Hasher le mot de passe
      let hashedPassword;
      try {
        console.log("Hashage du mot de passe...");
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
        console.log("Mot de passe hashé avec succès");
      } catch (hashError) {
        console.error("Erreur lors du hashage du mot de passe:", hashError);
        return res.status(500).json({ 
          message: 'Erreur lors du hashage du mot de passe',
          details: hashError.message
        });
      }
      
      // Créer l'utilisateur
      let user;
      try {
        console.log("Création de l'utilisateur dans la base de données...");
        user = await UserModel.create({
          username,
          email,
          password: hashedPassword
        });
        console.log("Utilisateur créé avec succès:", { id: user.id, username: user.username });
      } catch (dbError) {
        console.error("Erreur lors de la création de l'utilisateur:", dbError);
        return res.status(500).json({ 
          message: 'Erreur lors de la création de l\'utilisateur',
          details: dbError.message
        });
      }
      
      // Générer un token JWT
      let token;
      try {
        console.log("Génération du token JWT...");
        token = jwt.sign(
          { id: user.id, email: user.email, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );
        console.log("Token généré avec succès");
      } catch (tokenError) {
        console.error("Erreur lors de la génération du token:", tokenError);
        return res.status(500).json({ 
          message: 'Erreur lors de la génération du token',
          details: tokenError.message
        });
      }
      
      // Réponse finale
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
      console.error('Erreur complète lors de l\'inscription:', error);
      console.error('Stack d\'erreur:', error.stack);
      res.status(500).json({ 
        message: 'Erreur lors de l\'inscription', 
        details: error.message 
      });
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
      
      // Créer les données pour le payload JWT
      const payload = {
        id: user.id,
        email: user.email,
        username: user.username
      };
      
      console.log("Génération du token avec payload:", payload);
      console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Secret défini (longueur: " + process.env.JWT_SECRET.length + ")" : "Secret non défini");
      
      // Générer un token JWT
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Vérifier que le token est bien formé
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Vérification immédiate du token réussie:", { id: decoded.id, email: decoded.email });
      } catch (tokenError) {
        console.error("ERREUR: Le token généré est invalide:", tokenError);
        return res.status(500).json({ message: 'Erreur lors de la génération du token' });
      }
      
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
      console.log("AuthController.verifyToken - Données utilisateur du token:", req.user);
      
      if (!req.user || !req.user.id) {
        console.error("AuthController.verifyToken - Données utilisateur invalides dans le token");
        return res.status(400).json({ message: 'Données utilisateur invalides dans le token' });
      }
      
      console.log("AuthController.verifyToken - Recherche de l'utilisateur avec ID:", req.user.id);
      
      const user = await UserModel.findById(req.user.id);
      
      console.log("AuthController.verifyToken - Résultat de la recherche:", user ? "Utilisateur trouvé" : "Utilisateur non trouvé");
      
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
      console.error('Erreur détaillée lors de la vérification du token:', error);
      console.error('Stack d\'erreur:', error.stack);
      
      // Déterminer le type d'erreur pour une meilleure réponse
      if (error.code && error.code.startsWith('ER_')) {
        // Erreur SQL
        console.error('Erreur SQL lors de la vérification du token:', error.code);
        return res.status(500).json({ 
          message: 'Erreur de base de données lors de la vérification du token',
          details: error.message
        });
      }
      
      // Erreur générique
      res.status(500).json({ 
        message: 'Erreur lors de la vérification du token',
        details: error.message
      });
    }
  }
}

module.exports = AuthController; 
      // Créer les données pour le payload JWT
      const payload = {
        id: user.id,
        email: user.email,
        username: user.username
      };
      
      console.log("Génération du token avec payload:", payload);
      console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Secret défini (longueur: " + process.env.JWT_SECRET.length + ")" : "Secret non défini");
      
      // Générer un token JWT
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Vérifier que le token est bien formé
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Vérification immédiate du token réussie:", { id: decoded.id, email: decoded.email });
      } catch (tokenError) {
        console.error("ERREUR: Le token généré est invalide:", tokenError);
        return res.status(500).json({ message: 'Erreur lors de la génération du token' });
      }
      
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
      console.log("AuthController.verifyToken - Données utilisateur du token:", req.user);
      
      if (!req.user || !req.user.id) {
        console.error("AuthController.verifyToken - Données utilisateur invalides dans le token");
        return res.status(400).json({ message: 'Données utilisateur invalides dans le token' });
      }
      
      console.log("AuthController.verifyToken - Recherche de l'utilisateur avec ID:", req.user.id);
      
      const user = await UserModel.findById(req.user.id);
      
      console.log("AuthController.verifyToken - Résultat de la recherche:", user ? "Utilisateur trouvé" : "Utilisateur non trouvé");
      
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
      console.error('Erreur détaillée lors de la vérification du token:', error);
      console.error('Stack d\'erreur:', error.stack);
      
      // Déterminer le type d'erreur pour une meilleure réponse
      if (error.code && error.code.startsWith('ER_')) {
        // Erreur SQL
        console.error('Erreur SQL lors de la vérification du token:', error.code);
        return res.status(500).json({ 
          message: 'Erreur de base de données lors de la vérification du token',
          details: error.message
        });
      }
      
      // Erreur générique
      res.status(500).json({ 
        message: 'Erreur lors de la vérification du token',
        details: error.message
      });
    }
  }
}

module.exports = AuthController; 