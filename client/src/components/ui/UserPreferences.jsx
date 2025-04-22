import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import { CheckIcon } from '@heroicons/react/24/solid';
import LoadingSpinner from '../common/LoadingSpinner';

const PreferenceToggle = ({ label, enabled, onChange }) => {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-white">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${
          enabled ? 'bg-primary justify-end' : 'bg-gray-600 justify-start'
        }`}
      >
        <span className={`bg-white w-5 h-5 rounded-full shadow-md transform mx-0.5 transition-transform duration-300`} />
      </button>
    </div>
  );
};

const UserPreferences = () => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('notifications');

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        const data = await userService.getUserPreferences();
        setPreferences(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des préférences:', err);
        setError('Impossible de charger vos préférences. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const handleToggleChange = (category, setting, value) => {
    if (!preferences) return;
    
    setPreferences({
      ...preferences,
      [category]: {
        ...preferences[category],
        [setting]: value
      }
    });
  };

  const handleSavePreferences = async () => {
    if (!preferences) return;
    
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage('');
      
      await userService.updateUserPreferences(preferences);
      setSuccessMessage('Vos préférences ont été enregistrées avec succès !');
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde des préférences:', err);
      setError('Une erreur est survenue lors de la sauvegarde de vos préférences.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetPreferences = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage('');
      
      const { preferences: defaultPreferences } = await userService.resetUserPreferences();
      setPreferences(defaultPreferences);
      setSuccessMessage('Vos préférences ont été réinitialisées avec succès !');
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Erreur lors de la réinitialisation des préférences:', err);
      setError('Une erreur est survenue lors de la réinitialisation de vos préférences.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded">
        {error}
      </div>
    );
  }

  if (!preferences) {
    return null;
  }

  return (
    <div className="bg-background-light rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-6">Paramètres et préférences</h2>
      
      {successMessage && (
        <div className="bg-green-500/20 border border-green-500 text-green-500 p-4 rounded mb-6 flex items-center">
          <CheckIcon className="w-5 h-5 mr-2" />
          {successMessage}
        </div>
      )}
      
      {/* Onglets */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'notifications' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'display' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('display')}
        >
          Affichage
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'privacy' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('privacy')}
        >
          Confidentialité
        </button>
      </div>
      
      {/* Contenu des onglets */}
      <div className="mb-6">
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <PreferenceToggle
              label="Recevoir des emails"
              enabled={preferences.notifications.email}
              onChange={(value) => handleToggleChange('notifications', 'email', value)}
            />
            <PreferenceToggle
              label="Notifications de nouvelles fonctionnalités"
              enabled={preferences.notifications.newFeatures}
              onChange={(value) => handleToggleChange('notifications', 'newFeatures', value)}
            />
            <PreferenceToggle
              label="Recommandations personnalisées"
              enabled={preferences.notifications.recommendations}
              onChange={(value) => handleToggleChange('notifications', 'recommendations', value)}
            />
          </div>
        )}
        
        {activeTab === 'display' && (
          <div className="space-y-4">
            <PreferenceToggle
              label="Mode sombre"
              enabled={preferences.displayPreferences.darkMode}
              onChange={(value) => handleToggleChange('displayPreferences', 'darkMode', value)}
            />
            
            <div className="flex items-center justify-between py-2">
              <span className="text-white">Langue</span>
              <select
                value={preferences.displayPreferences.language}
                onChange={(e) => handleToggleChange('displayPreferences', 'language', e.target.value)}
                className="bg-background border border-gray-600 rounded p-2 text-white"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-white">Taille des affiches</span>
              <select
                value={preferences.displayPreferences.posterSize}
                onChange={(e) => handleToggleChange('displayPreferences', 'posterSize', e.target.value)}
                className="bg-background border border-gray-600 rounded p-2 text-white"
              >
                <option value="small">Petite</option>
                <option value="medium">Moyenne</option>
                <option value="large">Grande</option>
              </select>
            </div>
          </div>
        )}
        
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <PreferenceToggle
              label="Partager mon activité"
              enabled={preferences.privacy.shareActivity}
              onChange={(value) => handleToggleChange('privacy', 'shareActivity', value)}
            />
            <PreferenceToggle
              label="Partager ma liste à voir"
              enabled={preferences.privacy.shareWatchlist}
              onChange={(value) => handleToggleChange('privacy', 'shareWatchlist', value)}
            />
            <PreferenceToggle
              label="Profil public"
              enabled={preferences.privacy.publicProfile}
              onChange={(value) => handleToggleChange('privacy', 'publicProfile', value)}
            />
          </div>
        )}
      </div>
      
      {/* Boutons d'action */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handleResetPreferences}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
          disabled={saving}
        >
          Réinitialiser
        </button>
        <button
          onClick={handleSavePreferences}
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded"
          disabled={saving}
        >
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
};

export default UserPreferences; 