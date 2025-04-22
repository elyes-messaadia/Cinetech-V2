import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, UserIcon, HeartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
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
            <Link to="/login" className="text-white hover:text-primary transition-colors">
              <UserIcon className="w-6 h-6" />
            </Link>
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
            </nav>
          </div>
        )}

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 animate-fadeIn">
            <form className="flex items-center">
              <input 
                type="text" 
                placeholder="Rechercher des films, séries..." 
                className="w-full p-2 rounded-l-md bg-background-light text-white border-r-0 focus:outline-none"
              />
              <button 
                type="submit"
                className="bg-primary p-2 rounded-r-md"
              >
                <MagnifyingGlassIcon className="w-6 h-6 text-white" />
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 