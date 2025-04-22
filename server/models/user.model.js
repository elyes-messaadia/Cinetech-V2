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
      const [result] = await connection.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, password]
      );
      
      return { id: result.insertId, username, email };
    } catch (error) {
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
      const [rows] = await connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      
      return rows.length ? rows[0] : null;
    } catch (error) {
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
      const [rows] = await connection.query(
        'SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?',
        [id]
      );
      
      return rows.length ? rows[0] : null;
    } catch (error) {
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
      const [result] = await connection.query(
        'UPDATE users SET username = ?, email = ? WHERE id = ?',
        [username, email, id]
      );
      
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserModel; 