import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Cog6ToothIcon, BellIcon, ShieldCheckIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import UserPreferences from '../components/ui/UserPreferences';

const SettingsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('preferences');

  // Rediriger vers la page de connexion si non connecté
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Paramètres</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Menu latéral */}
        <div className="lg:col-span-1">
          <div className="bg-background-light rounded-lg p-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('preferences')}
                className={`w-full flex items-center px-3 py-2 text-left rounded-md ${
                  activeTab === 'preferences' 
                    ? 'bg-primary/20 text-primary' 
                    : 'text-gray-300 hover:bg-background hover:text-white'
                }`}
              >
                <Cog6ToothIcon className="w-5 h-5 mr-3" />
                <span>Préférences générales</span>
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-3 py-2 text-left rounded-md ${
                  activeTab === 'notifications' 
                    ? 'bg-primary/20 text-primary' 
                    : 'text-gray-300 hover:bg-background hover:text-white'
                }`}
              >
                <BellIcon className="w-5 h-5 mr-3" />
                <span>Notifications</span>
              </button>
              
              <button
                onClick={() => setActiveTab('privacy')}
                className={`w-full flex items-center px-3 py-2 text-left rounded-md ${
                  activeTab === 'privacy' 
                    ? 'bg-primary/20 text-primary' 
                    : 'text-gray-300 hover:bg-background hover:text-white'
                }`}
              >
                <ShieldCheckIcon className="w-5 h-5 mr-3" />
                <span>Confidentialité</span>
              </button>
              
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full flex items-center px-3 py-2 text-left rounded-md ${
                  activeTab === 'account' 
                    ? 'bg-primary/20 text-primary' 
                    : 'text-gray-300 hover:bg-background hover:text-white'
                }`}
              >
                <UserCircleIcon className="w-5 h-5 mr-3" />
                <span>Compte</span>
              </button>
            </nav>
          </div>
        </div>
        
        {/* Contenu principal */}
        <div className="lg:col-span-3">
          {activeTab === 'preferences' && <UserPreferences />}
          
          {activeTab === 'notifications' && (
            <div className="bg-background-light rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6">Paramètres de notifications</h2>
              <p className="text-gray-400">
                Cette section sera bientôt disponible. Vous pourrez configurer vos préférences de 
                notifications par email, push et dans l'application.
              </p>
            </div>
          )}
          
          {activeTab === 'privacy' && (
            <div className="bg-background-light rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6">Paramètres de confidentialité</h2>
              <p className="text-gray-400">
                Cette section sera bientôt disponible. Vous pourrez gérer quelles informations sont 
                partagées publiquement et définir vos préférences de confidentialité.
              </p>
            </div>
          )}
          
          {activeTab === 'account' && (
            <div className="bg-background-light rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6">Paramètres du compte</h2>
              <p className="text-gray-400">
                Cette section sera bientôt disponible. Vous pourrez gérer les informations de votre compte,
                changer votre mot de passe, et contrôler vos données personnelles.
              </p>
              
              <div className="mt-6 p-4 bg-red-900/20 border border-red-600 rounded-lg">
                <h3 className="text-lg font-semibold text-red-500 mb-2">Zone de danger</h3>
                <p className="text-gray-400 mb-4">
                  Attention, les actions ci-dessous sont permanentes et ne peuvent pas être annulées.
                </p>
                
                <button
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                  onClick={() => {
                    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
                      // Action de suppression de compte à implémenter
                      alert('Fonctionnalité non implémentée');
                    }
                  }}
                >
                  Supprimer mon compte
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 