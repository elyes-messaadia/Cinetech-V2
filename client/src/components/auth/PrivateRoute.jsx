import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Composant PrivateRoute pour protéger les routes qui nécessitent une authentification
 * @param {Object} props - Propriétés du composant
 * @param {React.ReactNode} props.children - Composant enfant à rendre si l'utilisateur est authentifié
 * @param {Boolean} props.requireAdmin - Indique si la route nécessite des privilèges d'administrateur
 * @returns {JSX.Element} - Composant Route
 */
const PrivateRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, loading, user, isSessionExpiringSoon } = useAuth();
  const location = useLocation();

  // Attendre que la vérification de l'authentification soit terminée
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
  // Sauvegarder l'URL actuelle pour rediriger l'utilisateur après connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Vérifier si la route nécessite des privilèges d'administrateur
  if (requireAdmin && (!user || user.role !== 'admin')) {
    // Rediriger vers la page d'accueil si l'utilisateur n'est pas administrateur
    return <Navigate to="/" replace />;
  }
  
  // Afficher une alerte si la session est proche de l'expiration
  if (isSessionExpiringSoon) {
    // Vous pourriez afficher une notification ou une modal ici
    console.warn('Session proche de l\'expiration');
  }

  // Si l'utilisateur est authentifié, rendre le composant enfant
  return children;
};

export default PrivateRoute; 