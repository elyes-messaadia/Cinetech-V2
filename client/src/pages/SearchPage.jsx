import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import tmdbService from '../services/tmdbService';
import MediaCard from '../components/ui/MediaCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const searchMedia = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      
      try {
        setLoading(true);
        const data = await tmdbService.searchMulti(query);
        
        // Filtrer pour conserver uniquement les films et séries (pas les personnes)
        const filteredResults = data.results.filter(
          item => item.media_type === 'movie' || item.media_type === 'tv'
        );
        
        setResults(filteredResults);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la recherche:', err);
        setError('Une erreur est survenue lors de la recherche.');
        setLoading(false);
      }
    };
    
    searchMedia();
  }, [query]);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">
        {query 
          ? `Résultats de recherche pour "${query}"`
          : 'Recherche'
        }
      </h1>
      
      {query && results.length === 0 ? (
        <div className="bg-background-light rounded-lg p-6 text-center">
          <p className="text-gray-400">
            Aucun résultat trouvé pour "{query}". Essayez d'autres termes de recherche.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {results.map((item) => (
            <MediaCard 
              key={`${item.media_type}-${item.id}`} 
              item={item} 
              type={item.media_type} 
            />
          ))}
        </div>
      )}
      
      {!query && (
        <div className="bg-background-light rounded-lg p-6 text-center">
          <p className="text-gray-400">
            Utilisez la barre de recherche ci-dessus pour trouver des films et séries.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage; 