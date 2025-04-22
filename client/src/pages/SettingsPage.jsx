import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const SettingsPage = () => {
  const { user, updateUser, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Paramètres du compte
  const [accountSettings, setAccountSettings] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Préférences d'affichage
  const [preferences, setPreferences] = useState({
    darkMode: true,
    language: 'fr',
    adultContent: false,
    notifications: true,
    subtitles: true,
  });
  
  // Chargement des données de l'utilisateur
  useEffect(() => {
    if (user) {
      setAccountSettings(prev => ({
        ...prev,
        username: user.username || '',
        email: user.email || '',
      }));
      
      // Charger les préférences à partir du localStorage ou des paramètres par défaut
      const savedPreferences = localStorage.getItem('userPreferences');
      if (savedPreferences) {
        try {
          setPreferences(JSON.parse(savedPreferences));
        } catch (e) {
          console.error('Erreur lors du chargement des préférences:', e);
        }
      }
    }
  }, [user]);
  
  // Mettre à jour les paramètres du compte
  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Mettre à jour les préférences
  const handlePreferenceChange = (e) => {
    const { name, type, checked, value } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setPreferences(prev => {
      const updated = {
        ...prev,
        [name]: newValue
      };
      
      // Sauvegarder dans localStorage
      localStorage.setItem('userPreferences', JSON.stringify(updated));
      return updated;
    });
  };
  
  // Soumettre les modifications du compte
  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Validation du mot de passe
    if (accountSettings.newPassword) {
      if (accountSettings.newPassword !== accountSettings.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        setLoading(false);
        return;
      }
      
      if (accountSettings.newPassword.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        setLoading(false);
        return;
      }
      
      if (!accountSettings.currentPassword) {
        setError('Veuillez saisir votre mot de passe actuel');
        setLoading(false);
        return;
      }
    }
    
    try {
      const dataToUpdate = {
        username: accountSettings.username,
        email: accountSettings.email,
      };
      
      if (accountSettings.newPassword) {
        dataToUpdate.currentPassword = accountSettings.currentPassword;
        dataToUpdate.newPassword = accountSettings.newPassword;
      }
      
      await updateUser(dataToUpdate);
      setSuccess('Vos paramètres de compte ont été mis à jour avec succès !');
      
      // Réinitialiser les champs de mot de passe
      setAccountSettings(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err) {
      console.error('Erreur lors de la mise à jour du compte:', err);
      setError(err.message || 'Une erreur est survenue lors de la mise à jour de votre compte');
    } finally {
      setLoading(false);
    }
  };
  
  // Afficher/masquer le mot de passe
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Rediriger si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!user) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Paramètres</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Menu de navigation des paramètres */}
        <div className="lg:col-span-1">
          <div className="bg-background-light rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-white mb-4">Catégories</h2>
            <nav className="space-y-2">
              <a href="#account" className="block text-primary hover:text-primary-light py-2 border-l-2 border-primary pl-3">
                Compte
              </a>
              <a href="#preferences" className="block text-gray-300 hover:text-primary hover:border-primary py-2 border-l-2 border-transparent pl-3">
                Préférences d'affichage
              </a>
              <a href="#privacy" className="block text-gray-300 hover:text-primary hover:border-primary py-2 border-l-2 border-transparent pl-3">
                Confidentialité
              </a>
            </nav>
          </div>
        </div>
        
        {/* Contenu des paramètres */}
        <div className="lg:col-span-2 space-y-8">
          {/* Messages de succès/erreur */}
          {success && (
            <div className="bg-green-500/20 border border-green-500 text-green-500 p-4 rounded">
              {success}
            </div>
          )}
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded">
              {error}
            </div>
          )}
          
          {/* Paramètres du compte */}
          <section id="account" className="bg-background-light rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Paramètres du compte</h2>
            
            <form onSubmit={handleAccountSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-gray-300 mb-2">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={accountSettings.username}
                  onChange={handleAccountChange}
                  className="w-full p-3 bg-background border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gray-300 mb-2">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={accountSettings.email}
                  onChange={handleAccountChange}
                  className="w-full p-3 bg-background border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary text-white"
                  required
                />
              </div>
              
              <div className="border-t border-gray-700 pt-4 mt-4">
                <h3 className="text-lg font-medium text-white mb-4">Changer de mot de passe</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-gray-300 mb-2">
                      Mot de passe actuel
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="currentPassword"
                        name="currentPassword"
                        value={accountSettings.currentPassword}
                        onChange={handleAccountChange}
                        className="w-full p-3 bg-background border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary text-white pr-10"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-gray-300 mb-2">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="newPassword"
                        name="newPassword"
                        value={accountSettings.newPassword}
                        onChange={handleAccountChange}
                        className="w-full p-3 bg-background border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary text-white pr-10"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={accountSettings.confirmPassword}
                      onChange={handleAccountChange}
                      className="w-full p-3 bg-background border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary text-white"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded"
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </div>
            </form>
          </section>
          
          {/* Préférences d'affichage */}
          <section id="preferences" className="bg-background-light rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Préférences d'affichage</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Mode sombre</h3>
                  <p className="text-gray-400 text-sm">Activer l'interface sombre</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="darkMode"
                    checked={preferences.darkMode}
                    onChange={handlePreferenceChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <div className="flex flex-col">
                  <h3 className="text-white font-medium mb-2">Langue</h3>
                  <select
                    name="language"
                    value={preferences.language}
                    onChange={handlePreferenceChange}
                    className="w-full p-3 bg-background border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary text-white"
                  >
                    <option value="fr">Français</option>
                    <option value="en">Anglais</option>
                    <option value="es">Espagnol</option>
                    <option value="de">Allemand</option>
                  </select>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Afficher le contenu pour adultes</h3>
                    <p className="text-gray-400 text-sm">Afficher les films et séries classés pour adultes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="adultContent"
                      checked={preferences.adultContent}
                      onChange={handlePreferenceChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Notifications</h3>
                    <p className="text-gray-400 text-sm">Recevoir des notifications sur les nouveautés</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="notifications"
                      checked={preferences.notifications}
                      onChange={handlePreferenceChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          </section>
          
          {/* Confidentialité */}
          <section id="privacy" className="bg-background-light rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Confidentialité</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Historique de visionnage</h3>
                  <p className="text-gray-400 text-sm">Enregistrer mon historique de visionnage</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="saveHistory"
                    checked={true}
                    onChange={() => {}}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <button className="text-red-500 hover:text-red-400">
                  Effacer tout mon historique de visionnage
                </button>
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <button className="text-red-500 hover:text-red-400">
                  Supprimer mon compte
                </button>
                <p className="text-gray-400 text-sm mt-1">
                  Cette action est irréversible et supprimera toutes vos données.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 