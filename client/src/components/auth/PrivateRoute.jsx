import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Composant PrivateRoute pour protéger les routes qui nécessitent une authentification
 * @param {Object} props - Propriétés du composant
 * @param {React.ReactNode} props.children - Composant enfant à rendre si l'utilisateur est authentifié
 * @returns {JSX.Element} - Composant Route
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
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
    console.log("Redirection vers login: utilisateur non authentifié");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si l'utilisateur est authentifié, rendre le composant enfant
  console.log("Accès autorisé: utilisateur authentifié");
  return children;
};

export default PrivateRoute; 