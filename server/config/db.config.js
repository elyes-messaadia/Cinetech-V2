const mysql = require('mysql2');

// Création du pool de connexions
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cinetech',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Promisify pour utiliser async/await avec mysql
const promisePool = pool.promise();

module.exports = {
  connection: promisePool,
  
  // Méthode pour initialiser la base de données
  initDb: async () => {
    try {
      console.log('Initialisation de la base de données...');
      
      // Création des tables
      
      // Table users
      await promisePool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(100) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      // Table favorites
      await promisePool.query(`
        CREATE TABLE IF NOT EXISTS favorites (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          media_id INT NOT NULL,
          media_type ENUM('movie', 'tv') NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE KEY user_media (user_id, media_id, media_type)
        )
      `);
      
      // Table comments
      await promisePool.query(`
        CREATE TABLE IF NOT EXISTS comments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          media_id INT NOT NULL,
          media_type ENUM('movie', 'tv') NOT NULL,
          parent_id INT NULL,
          content TEXT NOT NULL,
          is_spoiler BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
        )
      `);
      
      console.log('Base de données initialisée avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la base de données:', error);
      throw error;
    }
  }
}; 