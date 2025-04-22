import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background-dark py-8 mt-auto">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">Cinetech</h3>
            <p className="text-gray-400">
              Votre plateforme pour découvrir et suivre vos films et séries préférés.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/movies" className="text-gray-400 hover:text-primary transition-colors">
                  Films
                </Link>
              </li>
              <li>
                <Link to="/series" className="text-gray-400 hover:text-primary transition-colors">
                  Séries
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Compte</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-gray-400 hover:text-primary transition-colors">
                  Se connecter
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-primary transition-colors">
                  S'inscrire
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-400 hover:text-primary transition-colors">
                  Mes favoris
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">À propos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary transition-colors">
                  À propos de nous
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors">
                  Confidentialité
                </Link>
              </li>
              <li>
                <a 
                  href="https://www.themoviedb.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  TMDb API
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Cinetech. Tous droits réservés.</p>
          <p className="mt-2 text-sm">
            Ce produit utilise l'API TMDb mais n'est pas approuvé ou certifié par TMDb.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 