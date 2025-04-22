const jwt = require('jsonwebtoken');

/**
 * Middleware pour vérifier le token JWT
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  console.log('Vérification du token - Headers:', req.headers);
  
  if (!authHeader) {
    console.log('Vérification du token - Aucun header d\'autorisation trouvé');
    return res.status(401).json({ message: 'Aucun token fourni' });
  }
  
  // Format du header: "Bearer TOKEN"
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    console.log('Vérification du token - Format du token invalide');
    return res.status(401).json({ message: 'Format du token invalide' });
  }

  try {
    console.log('Vérification du token - Tentative de décodage avec secret:', process.env.JWT_SECRET ? 'Secret défini' : 'Secret non défini');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Vérification du token - Décodage réussi:', { id: decoded.id, email: decoded.email });
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erreur d\'authentification détaillée:', error.name, error.message);
    console.error('Stack d\'erreur:', error.stack);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré', details: 'Veuillez vous reconnecter' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token invalide', details: error.message });
    }
    
    return res.status(401).json({ 
      message: 'Token invalide ou expiré',
      details: error.message
    });
  }
};

module.exports = {
  verifyToken
}; 