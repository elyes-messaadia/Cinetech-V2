import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import favoriteService from '../services/favoriteService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Navigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, FilmIcon, TvIcon, HeartIcon } from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const { user, updateUser, logout, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [stats, setStats] = useState({
    totalFavorites: 0,
    movies: 0,
    tvShows: 0,
    loading: true
  });
  
  // Initialiser le formulaire avec les données de l'utilisateur
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || '',
        email: user.email || ''
      }));
    }
  }, [user]);
  
  // Charger les statistiques des favoris
  useEffect(() => {
    const fetchFavoritesStats = async () => {
      if (!isAuthenticated) return;
      
      try {
        const favorites = await favoriteService.getUserFavorites();
        
        const movieCount = favorites.filter(fav => fav.mediaType === 'movie').length;
        const tvCount = favorites.filter(fav => fav.mediaType === 'tv').length;
        
        setStats({
          totalFavorites: favorites.length,
          movies: movieCount,
          tvShows: tvCount,
          loading: false
        });
      } catch (err) {
        console.error('Erreur lors du chargement des statistiques:', err);
        setStats(prev => ({
          ...prev,
          loading: false
        }));
      }
    };
    
    fetchFavoritesStats();
  }, [isAuthenticated]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');
    
    // Validation du mot de passe si changement demandé
    if (isChangingPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        setLoading(false);
        return;
      }
      
      if (formData.newPassword.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        setLoading(false);
        return;
      }
    }
    
    try {
      // Créer l'objet à envoyer à l'API
      const dataToUpdate = {
        username: formData.username,
        email: formData.email
      };
      
      // Ajouter les champs de mot de passe si nécessaire
      if (isChangingPassword) {
        dataToUpdate.currentPassword = formData.currentPassword;
        dataToUpdate.newPassword = formData.newPassword;
      }
      
      await updateUser(dataToUpdate);
      setSuccessMessage('Profil mis à jour avec succès !');
      setIsEditing(false);
      setIsChangingPassword(false);
      
      // Réinitialiser les champs de mot de passe
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil:', err);
      setError(err.message || 'Une erreur est survenue lors de la mise à jour de votre profil.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    // Réinitialiser le formulaire avec les données de l'utilisateur
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    }
    setIsEditing(false);
    setIsChangingPassword(false);
    setError(null);
  };
  
  // Toggle pour afficher/masquer le mot de passe
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Mon Profil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Informations du profil */}
        <div className="md:col-span-2">
          <div className="bg-background-light rounded-lg p-6">
            {successMessage && (
              <div className="bg-green-500/20 border border-green-500 text-green-500 p-4 rounded mb-6">
                {successMessage}
              </div>
            )}
            
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded mb-6">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label 
                  htmlFor="username" 
                  className="block text-gray-300 mb-2 font-medium"
                >
                  Nom d'utilisateur
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-3 bg-background border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary text-white"
                    disabled={loading}
                    required
                  />
                ) : (
                  <p className="text-white p-3">{formData.username}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label 
                  htmlFor="email" 
                  className="block text-gray-300 mb-2 font-medium"
                >
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 bg-background border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary text-white"
                    disabled={loading}
                    required
                  />
                ) : (
                  <p className="text-white p-3">{formData.email}</p>
                )}
              </div>
              
              {/* Section de changement de mot de passe */}
              {isEditing && (
                <div className="mt-8 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl text-white font-semibold">Changer mon mot de passe</h3>
                    <button 
                      type="button"
                      onClick={() => setIsChangingPassword(!isChangingPassword)}
                      className="text-primary hover:text-primary-light"
                    >
                      {isChangingPassword ? 'Annuler' : 'Modifier'}
                    </button>
                  </div>
                  
                  {isChangingPassword && (
                    <div className="space-y-4">
                      <div>
                        <label 
                          htmlFor="currentPassword" 
                          className="block text-gray-300 mb-2 font-medium"
                        >
                          Mot de passe actuel
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="w-full p-3 bg-background border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary text-white"
                            disabled={loading}
                            required
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                            onClick={toggleShowPassword}
                          >
                            {showPassword ? (
                              <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                              <EyeIcon className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label 
                          htmlFor="newPassword" 
                          className="block text-gray-300 mb-2 font-medium"
                        >
                          Nouveau mot de passe
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="w-full p-3 bg-background border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary text-white"
                            disabled={loading}
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label 
                          htmlFor="confirmPassword" 
                          className="block text-gray-300 mb-2 font-medium"
                        >
                          Confirmer le mot de passe
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-3 bg-background border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary text-white"
                            disabled={loading}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-between mt-8">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
                      disabled={loading}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded"
                      disabled={loading}
                    >
                      {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => logout()}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                      Déconnexion
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded"
                    >
                      Modifier mon profil
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
        
        {/* Statistiques */}
        <div>
          <div className="bg-background-light rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Mes statistiques</h2>
            
            {stats.loading ? (
              <div className="flex justify-center py-6">
                <LoadingSpinner size="small" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-background rounded-lg p-4 flex items-center">
                  <div className="bg-background-dark/50 p-3 rounded-full mr-4">
                    <HeartIcon className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total favoris</p>
                    <p className="text-white text-xl font-bold">{stats.totalFavorites}</p>
                  </div>
                </div>
                
                <div className="bg-background rounded-lg p-4 flex items-center">
                  <div className="bg-background-dark/50 p-3 rounded-full mr-4">
                    <FilmIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Films favoris</p>
                    <p className="text-white text-xl font-bold">{stats.movies}</p>
                  </div>
                </div>
                
                <div className="bg-background rounded-lg p-4 flex items-center">
                  <div className="bg-background-dark/50 p-3 rounded-full mr-4">
                    <TvIcon className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Séries favorites</p>
                    <p className="text-white text-xl font-bold">{stats.tvShows}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <a 
                    href="/favorites" 
                    className="block w-full text-center px-4 py-2 bg-background-dark hover:bg-background-dark/80 text-white rounded"
                  >
                    Voir tous mes favoris
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 