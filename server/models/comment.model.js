const { connection } = require('../config/db.config');

class CommentModel {
  /**
   * Créer un nouveau commentaire
   * @param {Object} commentData Données du commentaire
   * @returns Le commentaire créé
   */
  static async create(commentData) {
    const { user_id, media_id, media_type, content, parent_id = null, is_spoiler = false } = commentData;
    
    try {
      const [result] = await connection.query(
        `INSERT INTO comments 
        (user_id, media_id, media_type, content, parent_id, is_spoiler) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [user_id, media_id, media_type, content, parent_id, is_spoiler]
      );
      
      return { 
        id: result.insertId, 
        user_id, 
        media_id, 
        media_type, 
        content, 
        parent_id, 
        is_spoiler,
        created_at: new Date()
      };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Récupérer un commentaire par son ID
   * @param {number} id ID du commentaire
   * @returns Le commentaire trouvé ou null
   */
  static async findById(id) {
    try {
      const [rows] = await connection.query(
        `SELECT c.*, u.username 
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.id = ?`,
        [id]
      );
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Mettre à jour un commentaire
   * @param {number} id ID du commentaire
   * @param {Object} commentData Données à mettre à jour
   * @returns Nombre de lignes affectées
   */
  static async update(id, commentData) {
    const { content, is_spoiler } = commentData;
    
    try {
      const [result] = await connection.query(
        'UPDATE comments SET content = ?, is_spoiler = ? WHERE id = ?',
        [content, is_spoiler, id]
      );
      
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Supprimer un commentaire
   * @param {number} id ID du commentaire
   * @returns Nombre de lignes affectées
   */
  static async delete(id) {
    try {
      const [result] = await connection.query(
        'DELETE FROM comments WHERE id = ?',
        [id]
      );
      
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Récupérer tous les commentaires d'un média
   * @param {number} media_id ID du média
   * @param {string} media_type Type du média ('movie' ou 'tv')
   * @returns Liste des commentaires
   */
  static async getMediaComments(media_id, media_type) {
    try {
      const [rows] = await connection.query(
        `SELECT c.*, u.username 
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.media_id = ? AND c.media_type = ? AND c.parent_id IS NULL
        ORDER BY c.created_at DESC`,
        [media_id, media_type]
      );
      
      return rows;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Récupérer toutes les réponses à un commentaire
   * @param {number} parent_id ID du commentaire parent
   * @returns Liste des réponses
   */
  static async getCommentReplies(parent_id) {
    try {
      const [rows] = await connection.query(
        `SELECT c.*, u.username 
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.parent_id = ?
        ORDER BY c.created_at ASC`,
        [parent_id]
      );
      
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CommentModel; 