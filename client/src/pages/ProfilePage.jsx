import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Initialiser le formulaire avec les données de l'utilisateur
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || ''
      });
    }
  }, [user]);
  
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
    
    try {
      // Cette fonction sera implémentée plus tard
      await updateUser(formData);
      setSuccessMessage('Profil mis à jour avec succès !');
      setIsEditing(false);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil:', err);
      setError('Une erreur est survenue lors de la mise à jour de votre profil.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    // Réinitialiser le formulaire avec les données de l'utilisateur
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || ''
      });
    }
    setIsEditing(false);
    setError(null);
  };
  
  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Mon Profil</h1>
      
      <div className="bg-background-light rounded-lg p-6 max-w-2xl mx-auto">
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
  );
};

export default ProfilePage; 