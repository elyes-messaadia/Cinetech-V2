import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, UserIcon, HeartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import SearchBar from '../common/SearchBar';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  // Fermer le menu profil au clic à l'extérieur
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Gérer la déconnexion
  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
  };

  return (
    <header className="bg-background-dark fixed w-full z-50 shadow-md">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            Cinetech
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-primary transition-colors">
              Accueil
            </Link>
            <Link to="/movies" className="text-white hover:text-primary transition-colors">
              Films
            </Link>
            <Link to="/series" className="text-white hover:text-primary transition-colors">
              Séries
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleSearch}
              className="text-white hover:text-primary transition-colors"
            >
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>
            <Link to="/favorites" className="text-white hover:text-primary transition-colors">
              <HeartIcon className="w-6 h-6" />
            </Link>
            
            {isAuthenticated ? (
              <div className="relative" ref={profileMenuRef}>
                <button 
                  onClick={toggleProfileMenu}
                  className="text-white hover:text-primary transition-colors"
                >
                  <UserIcon className="w-6 h-6" />
                </button>
                
                {/* Menu déroulant du profil */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-background-dark border border-gray-700 rounded-lg shadow-lg py-2 z-50">
                    {/* En-tête avec info utilisateur */}
                    <div className="px-4 py-3 border-b border-gray-700">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <UserCircleIcon className="w-10 h-10 text-gray-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-white">{user?.username || 'Utilisateur'}</p>
                          <p className="text-xs text-gray-400">
                            {user?.isPremium ? (
                              <span className="flex items-center">
                                <span className="mr-1 text-yellow-500">★</span> Membre Premium
                              </span>
                            ) : 'Membre'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Options du menu */}
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-background hover:text-white"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <UserCircleIcon className="mr-3 h-5 w-5" />
                        Changer de profil
                      </Link>
                      
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-background hover:text-white"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Cog6ToothIcon className="mr-3 h-5 w-5" />
                        Paramètres
                      </Link>
                      
                      <Link
                        to="/watchlist"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-background hover:text-white"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <DocumentTextIcon className="mr-3 h-5 w-5" />
                        Watchlist
                      </Link>
                      
                      <Link
                        to="/history"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-background hover:text-white"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <ClockIcon className="mr-3 h-5 w-5" />
                        Historique
                      </Link>
                      
                      <div className="border-t border-gray-700 my-1"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-background hover:text-white"
                      >
                        <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-white hover:text-primary transition-colors">
                <UserIcon className="w-6 h-6" />
              </Link>
            )}
            
            <button 
              onClick={toggleMenu}
              className="text-white md:hidden hover:text-primary transition-colors"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-white hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                to="/movies" 
                className="text-white hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Films
              </Link>
              <Link 
                to="/series" 
                className="text-white hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Séries
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/profile"
                    className="text-white hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mon profil
                  </Link>
                  <Link
                    to="/watchlist"
                    className="text-white hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Watchlist
                  </Link>
                  <Link
                    to="/history"
                    className="text-white hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Historique
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-white hover:text-primary transition-colors text-left"
                  >
                    Se déconnecter
                  </button>
                </>
              )}
            </nav>
          </div>
        )}

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 animate-fadeIn">
            <SearchBar onClose={() => setIsSearchOpen(false)} />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 