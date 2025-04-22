const mysql = require('mysql2');

// Créer un pool de connexions avec des logs supplémentaires
console.log("Configuration de la connexion à la base de données...");
console.log(`Host: ${process.env.DB_HOST || 'localhost'}`);
console.log(`User: ${process.env.DB_USER || 'root'}`);
console.log(`Database: ${process.env.DB_NAME || 'cinetech_db'}`);

// Création du pool de connexions
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cinetech_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test initial de la connexion
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Erreur lors de la connexion à MySQL:');
    console.error(err);
    
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('La connexion à la base de données a été perdue.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('La base de données a trop de connexions.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('La connexion à la base de données a été refusée.');
    }
    if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('La base de données spécifiée n\'existe pas.');
      console.error('Veuillez créer la base de données manuellement dans phpMyAdmin.');
    }
  } else {
    console.log('Connexion à MySQL établie avec succès !');
    connection.release();
  }
});

// Promisify pour utiliser async/await avec mysql
const promisePool = pool.promise();

module.exports = {
  connection: promisePool,
  
  // Méthode pour initialiser la base de données
  initDb: async () => {
    try {
      console.log('Initialisation de la base de données...');
      
      // Test de connexion avant de créer les tables
      try {
        const [testResult] = await promisePool.query('SELECT 1 as test');
        console.log('Test de connexion réussi:', testResult);
      } catch (testError) {
        console.error('Échec du test de connexion:', testError);
        throw testError;
      }
      
      // Création des tables
      console.log('Création de la table users...');
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
      console.log('Table users créée ou déjà existante');
      
      console.log('Création de la table favorites...');
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
      console.log('Table favorites créée ou déjà existante');
      
      console.log('Création de la table comments...');
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
      console.log('Table comments créée ou déjà existante');
      
      console.log('Base de données initialisée avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la base de données:');
      console.error(error);
      throw error;
    }
  }
}; 