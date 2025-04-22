require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./config/db.config');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const favoriteRoutes = require('./routes/favorite.routes');
const commentRoutes = require('./routes/comment.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/comments', commentRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API Cinetech' });
});

// 404 handling
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Une erreur est survenue sur le serveur',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Initialiser la base de données puis démarrer le serveur
const startServer = async () => {
  try {
    // Initialiser la base de données
    console.log("Tentative d'initialisation de la base de données...");
    await initDb();
    console.log("Base de données initialisée avec succès !");
    
    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Erreur détaillée lors de l\'initialisation de la base de données:');
    console.error(error);
    
    // Démarrer quand même le serveur en cas d'erreur
    app.listen(PORT, () => {
      console.log(`Serveur en cours d'exécution sur le port ${PORT} (sans initialisation de la base de données)`);
    });
  }
};

startServer(); 