const { connection } = require('../config/db.config');

class UserModel {
  /**
   * Créer un nouvel utilisateur
   * @param {Object} userData Données de l'utilisateur
   * @returns L'utilisateur créé
   */
  static async create(userData) {
    const { username, email, password } = userData;
    
    try {
      console.log("UserModel.create - Tentative d'insertion d'un utilisateur:", { username, email });
      
      // Vérifier l'état de la connexion
      try {
        const [pingResult] = await connection.query('SELECT 1 as ping');
        console.log("UserModel.create - Test de connexion:", pingResult);
      } catch (pingError) {
        console.error("UserModel.create - ERREUR: La connexion à la base de données a échoué:", pingError);
        throw new Error("Impossible de se connecter à la base de données: " + pingError.message);
      }
      
      // Vérifier si la table existe
      try {
        const [tableResult] = await connection.query("SHOW TABLES LIKE 'users'");
        console.log("UserModel.create - Vérification de la table users:", tableResult.length ? "Existe" : "N'existe pas");
        
        if (tableResult.length === 0) {
          console.error("UserModel.create - ERREUR: La table 'users' n'existe pas");
          throw new Error("La table 'users' n'existe pas dans la base de données");
        }
      } catch (tableError) {
        console.error("UserModel.create - ERREUR lors de la vérification de la table:", tableError);
        throw tableError;
      }
      
      // Insérer l'utilisateur
      try {
        const [result] = await connection.query(
          'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
          [username, email, password]
        );
        
        console.log("UserModel.create - Utilisateur inséré avec succès. ID:", result.insertId);
        return { id: result.insertId, username, email };
      } catch (insertError) {
        console.error("UserModel.create - ERREUR détaillée lors de l'insertion:", insertError);
        if (insertError.code === 'ER_DUP_ENTRY') {
          console.error("UserModel.create - Erreur de doublon (email déjà utilisé)");
          throw new Error("Cet email est déjà utilisé");
        }
        if (insertError.code === 'ER_NO_SUCH_TABLE') {
          console.error("UserModel.create - La table n'existe pas");
          throw new Error("La table 'users' n'existe pas dans la base de données");
        }
        throw new Error("Erreur lors de l'insertion: " + insertError.message);
      }
    } catch (error) {
      console.error("UserModel.create - Erreur lors de la création de l'utilisateur:", error);
      console.error("UserModel.create - Stack d'erreur:", error.stack);
      throw error;
    }
  }
  
  /**
   * Trouver un utilisateur par email
   * @param {string} email Email de l'utilisateur
   * @returns L'utilisateur trouvé ou null
   */
  static async findByEmail(email) {
    try {
      console.log("UserModel.findByEmail - Recherche d'un utilisateur par email:", email);
      
      const [rows] = await connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      
      console.log("UserModel.findByEmail - Résultat:", rows.length ? "Utilisateur trouvé" : "Aucun utilisateur trouvé");
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error("UserModel.findByEmail - Erreur lors de la recherche par email:", error);
      throw error;
    }
  }
  
  /**
   * Trouver un utilisateur par ID
   * @param {number} id ID de l'utilisateur
   * @returns L'utilisateur trouvé ou null
   */
  static async findById(id) {
    try {
      console.log("UserModel.findById - Recherche d'un utilisateur par ID:", id);
      
      const [rows] = await connection.query(
        'SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?',
        [id]
      );
      
      console.log("UserModel.findById - Résultat:", rows.length ? "Utilisateur trouvé" : "Aucun utilisateur trouvé");
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error("UserModel.findById - Erreur lors de la recherche par ID:", error);
      throw error;
    }
  }
  
  /**
   * Mettre à jour un utilisateur
   * @param {number} id ID de l'utilisateur
   * @param {Object} userData Données à mettre à jour
   * @returns Nombre de lignes affectées
   */
  static async update(id, userData) {
    const { username, email } = userData;
    
    try {
      console.log("UserModel.update - Mise à jour de l'utilisateur:", { id, username, email });
      
      const [result] = await connection.query(
        'UPDATE users SET username = ?, email = ? WHERE id = ?',
        [username, email, id]
      );
      
      console.log("UserModel.update - Résultat:", result.affectedRows, "ligne(s) affectée(s)");
      return result.affectedRows;
    } catch (error) {
      console.error("UserModel.update - Erreur lors de la mise à jour:", error);
      throw error;
    }
  }
}

module.exports = UserModel; 