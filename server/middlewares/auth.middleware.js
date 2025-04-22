const jwt = require('jsonwebtoken');

/**
 * Middleware pour vérifier le token JWT
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Aucun token fourni' });
  }
  
  // Format du header: "Bearer TOKEN"
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Format du token invalide' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

module.exports = {
  verifyToken
}; 