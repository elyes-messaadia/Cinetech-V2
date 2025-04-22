const { connection } = require('../config/db.config');

class FavoriteModel {
  /**
   * Ajouter un média aux favoris d'un utilisateur
   * @param {Object} favoriteData Données du favori
   * @returns Le favori créé
   */
  static async add(favoriteData) {
    const { user_id, media_id, media_type } = favoriteData;
    
    try {
      const [result] = await connection.query(
        'INSERT INTO favorites (user_id, media_id, media_type) VALUES (?, ?, ?)',
        [user_id, media_id, media_type]
      );
      
      return { id: result.insertId, user_id, media_id, media_type };
    } catch (error) {
      // Si l'enregistrement existe déjà (erreur de clé unique)
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Ce média est déjà dans vos favoris');
      }
      throw error;
    }
  }
  
  /**
   * Supprimer un média des favoris d'un utilisateur
   * @param {number} user_id ID de l'utilisateur
   * @param {number} media_id ID du média
   * @param {string} media_type Type du média ('movie' ou 'tv')
   * @returns Nombre de lignes affectées
   */
  static async remove(user_id, media_id, media_type) {
    try {
      const [result] = await connection.query(
        'DELETE FROM favorites WHERE user_id = ? AND media_id = ? AND media_type = ?',
        [user_id, media_id, media_type]
      );
      
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Vérifier si un média est dans les favoris d'un utilisateur
   * @param {number} user_id ID de l'utilisateur
   * @param {number} media_id ID du média
   * @param {string} media_type Type du média ('movie' ou 'tv')
   * @returns Booléen indiquant si le média est dans les favoris
   */
  static async exists(user_id, media_id, media_type) {
    try {
      const [rows] = await connection.query(
        'SELECT * FROM favorites WHERE user_id = ? AND media_id = ? AND media_type = ?',
        [user_id, media_id, media_type]
      );
      
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Récupérer tous les favoris d'un utilisateur
   * @param {number} user_id ID de l'utilisateur
   * @returns Liste des favoris
   */
  static async getUserFavorites(user_id) {
    try {
      const [rows] = await connection.query(
        'SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC',
        [user_id]
      );
      
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = FavoriteModel; 