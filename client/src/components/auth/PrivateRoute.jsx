import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Composant PrivateRoute pour protéger les routes qui nécessitent une authentification
 * @param {Object} props - Propriétés du composant
 * @param {React.ReactNode} props.children - Composant enfant à rendre si l'utilisateur est authentifié
 * @returns {JSX.Element} - Composant Route
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
  // Sauvegarder l'URL actuelle pour rediriger l'utilisateur après connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si l'utilisateur est authentifié, rendre le composant enfant
  return children;
};

export default PrivateRoute; 