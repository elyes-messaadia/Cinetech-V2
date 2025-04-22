import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// Créer le contexte
const AuthContext = createContext(null);

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier l'authentification au chargement du composant
  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Essayer de récupérer le token stocké
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Vérifier si le token est bien formé (structure JWT)
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          console.error('Token mal formé:', token);
          localStorage.removeItem('token');
          setLoading(false);
          return;
        }
        
        try {
          // Vérifier la validité du token avec le serveur
          const userData = await authService.verifyToken();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (verifyErr) {
          console.error('Erreur lors de la vérification du token:', verifyErr);
          // Si l'erreur est 401 (non autorisé) ou 500 (erreur serveur), supprimer le token
          if (verifyErr.response && (verifyErr.response.status === 401 || verifyErr.response.status === 500)) {
            console.log('Suppression du token invalide');
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        console.error('Erreur lors de la vérification du token:', err);
        // Supprimer le token invalide
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  // Fonction de connexion
  const login = async (credentials) => {
    try {
      setError(null);
      const data = await authService.login(credentials);
      
      // Stocker le token dans le localStorage
      localStorage.setItem('token', data.token);
      
      // Mettre à jour le state
      setUser(data.user);
      setIsAuthenticated(true);
      
      return data.user;
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
      throw err;
    }
  };

  // Fonction d'inscription
  const register = async (userData) => {
    try {
      setError(null);
      const data = await authService.register(userData);
      
      // Stocker le token dans le localStorage
      localStorage.setItem('token', data.token);
      
      // Mettre à jour le state
      setUser(data.user);
      setIsAuthenticated(true);
      
      return data.user;
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'inscription');
      throw err;
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    
    // Réinitialiser le state
    setUser(null);
    setIsAuthenticated(false);
  };

  // Fonction de mise à jour du profil
  const updateUser = async (userData) => {
    try {
      setError(null);
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour du profil');
      throw err;
    }
  };

  // Les valeurs et fonctions exposées par le contexte
  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 