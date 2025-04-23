import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      <h1 className="text-5xl md:text-7xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-medium text-white mb-8">Page non trouvée</h2>
      <p className="text-gray-400 text-center max-w-md mb-8">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link 
        to="/"
        className="bg-primary hover:bg-primary-dark transition-colors text-white py-3 px-6 rounded-lg font-medium"
      >
        Retourner à l'accueil
      </Link>
    </div>
  );
};

export default NotFoundPage; 