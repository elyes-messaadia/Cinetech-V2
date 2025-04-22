import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DiscoverPage = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simuler un chargement
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Découvrir</h1>
      
      <div className="bg-background-light p-6 rounded-lg">
        <p className="text-gray-300">
          Cette page est en cours de développement. Elle permettra aux utilisateurs de découvrir 
          des films et séries basés sur différents filtres comme le genre, l'année, la popularité, etc.
        </p>
      </div>
    </div>
  );
};

export default DiscoverPage; 