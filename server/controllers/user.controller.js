const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');

/**
 * Contrôleur pour la gestion des utilisateurs
 */
class UserController {
  /**
   * Récupérer les informations d'un utilisateur
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  static async getProfile(req, res) {
    try {
      const user_id = req.user.id;
      
      // Récupérer l'utilisateur
      const user = await UserModel.findById(user_id);
      
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      
      res.status(200).json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.created_at
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération du profil' });
    }
  }
  
  /**
   * Mettre à jour le profil d'un utilisateur
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  static async updateProfile(req, res) {
    try {
      const user_id = req.user.id;
      const { username, email } = req.body;
      
      // Validation des données
      if (!username && !email) {
        return res.status(400).json({ 
          message: 'Au moins un champ doit être fourni (username, email)' 
        });
      }
      
      // Récupérer l'utilisateur actuel
      const currentUser = await UserModel.findById(user_id);
      
      if (!currentUser) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      
      // Vérifier si l'email est déjà utilisé (si l'email est modifié)
      if (email && email !== currentUser.email) {
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
          return res.status(409).json({ message: 'Cet email est déjà utilisé' });
        }
      }
      
      // Mettre à jour l'utilisateur
      const userData = {
        username: username || currentUser.username,
        email: email || currentUser.email
      };
      
      await UserModel.update(user_id, userData);
      
      res.status(200).json({
        message: 'Profil mis à jour avec succès',
        user: {
          id: user_id,
          username: userData.username,
          email: userData.email
        }
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' });
    }
  }
  
  /**
   * Mettre à jour le mot de passe d'un utilisateur
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  static async updatePassword(req, res) {
    try {
      const user_id = req.user.id;
      const { current_password, new_password } = req.body;
      
      // Validation des données
      if (!current_password || !new_password) {
        return res.status(400).json({ 
          message: 'current_password et new_password sont requis' 
        });
      }
      
      // Récupérer l'utilisateur
      const user = await UserModel.findByEmail(req.user.email);
      
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      
      // Vérifier le mot de passe actuel
      const isPasswordValid = await bcrypt.compare(current_password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
      }
      
      // Hasher le nouveau mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(new_password, salt);
      
      // Mettre à jour le mot de passe
      await UserModel.update(user_id, {
        username: user.username,
        email: user.email,
        password: hashedPassword
      });
      
      res.status(200).json({
        message: 'Mot de passe mis à jour avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du mot de passe' });
    }
  }
}

module.exports = UserController; 