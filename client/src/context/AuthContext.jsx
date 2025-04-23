import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

// Créer le contexte
const AuthContext = createContext(null);

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);

// Durée de session en millisecondes (4 heures)
const SESSION_DURATION = 4 * 60 * 60 * 1000;

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [tokenRefreshTimer, setTokenRefreshTimer] = useState(null);

  // Déconnecter l'utilisateur lorsque son token est expiré
  const handleSessionExpiry = useCallback(() => {
    console.log('Session expirée, déconnexion automatique');
    logout();
  }, []);

  // Configurer un timer pour la déconnexion automatique
  useEffect(() => {
    if (sessionExpiry) {
      const timeUntilExpiry = sessionExpiry - Date.now();
      
      if (timeUntilExpiry <= 0) {
        handleSessionExpiry();
        return;
      }

      const timer = setTimeout(handleSessionExpiry, timeUntilExpiry);
      
      return () => clearTimeout(timer);
    }
  }, [sessionExpiry, handleSessionExpiry]);

  // Vérifier l'authentification au chargement du composant
  useEffect(() => {
    const verifyToken = async () => {
      try {
        setLoading(true);
        
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
          
          // Définir la date d'expiration de la session
          const expiry = Date.now() + SESSION_DURATION;
          setSessionExpiry(expiry);
          
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
    
    // Événement pour détecter les changements de stockage entre les onglets
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        if (!e.newValue) {
          // Token supprimé dans un autre onglet
          setUser(null);
          setIsAuthenticated(false);
          setSessionExpiry(null);
        } else if (e.newValue !== e.oldValue) {
          // Token modifié dans un autre onglet, recharger l'utilisateur
          verifyToken();
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      // Nettoyer les timers
      if (tokenRefreshTimer) {
        clearTimeout(tokenRefreshTimer);
      }
    };
  }, [tokenRefreshTimer]);

  // Fonction de connexion
  const login = async (credentials) => {
    try {
      setError(null);
      const data = await authService.login(credentials);
      
      if (!data || !data.token) {
        throw new Error('Réponse invalide du serveur lors de la connexion');
      }
      
      // Stocker le token dans le localStorage
      localStorage.setItem('token', data.token);
      
      // Définir la date d'expiration de la session
      const expiry = Date.now() + SESSION_DURATION;
      setSessionExpiry(expiry);
      
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
      
      if (!data || !data.token) {
        throw new Error('Réponse invalide du serveur lors de l\'inscription');
      }
      
      // Stocker le token dans le localStorage
      localStorage.setItem('token', data.token);
      
      // Définir la date d'expiration de la session
      const expiry = Date.now() + SESSION_DURATION;
      setSessionExpiry(expiry);
      
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
  const logout = useCallback(() => {
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    
    // Réinitialiser le state
    setUser(null);
    setIsAuthenticated(false);
    setSessionExpiry(null);
    
    // Nettoyer les timers
    if (tokenRefreshTimer) {
      clearTimeout(tokenRefreshTimer);
      setTokenRefreshTimer(null);
    }
  }, [tokenRefreshTimer]);

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

  // Fonction pour vérifier si la session est proche de l'expiration
  const isSessionExpiringSoon = useCallback(() => {
    if (!sessionExpiry) return false;
    
    // Vérifier si la session expire dans moins de 30 minutes
    const timeUntilExpiry = sessionExpiry - Date.now();
    return timeUntilExpiry > 0 && timeUntilExpiry < 30 * 60 * 1000;
  }, [sessionExpiry]);

  // Les valeurs et fonctions exposées par le contexte
  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isSessionExpiringSoon,
    sessionExpiry
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 