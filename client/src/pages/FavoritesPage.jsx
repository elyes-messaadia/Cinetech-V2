import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import favoriteService from '../services/favoriteService';
import MediaCard from '../components/ui/MediaCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const FavoritesPage = () => {
  const { user: _user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        // Cette fonction sera implémentée plus tard pour récupérer les favoris
        // depuis notre API backend
        const data = await favoriteService.getUserFavorites();
        setFavorites(data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des favoris:', err);
        setError('Une erreur est survenue lors du chargement de vos favoris.');
        setLoading(false);
      }
    };
    
    fetchFavorites();
  }, []);
  
  // Fonction pour retirer un média des favoris
  const handleRemoveFavorite = async (mediaId, mediaType) => {
    try {
      // Cette fonction sera implémentée plus tard
      await favoriteService.removeFavorite(mediaId, mediaType);
      setFavorites(favorites.filter(
        item => !(item.id === mediaId && item.media_type === mediaType)
      ));
    } catch (err) {
      console.error('Erreur lors de la suppression du favori:', err);
      alert('Une erreur est survenue lors de la suppression de ce favori.');
    }
  };
  
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

  // Pour le moment, utilisons des données fictives
  const dummyFavorites = [
    {
      id: 1,
      title: "Dune: Part Two",
      poster_path: "/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
      media_type: "movie",
      vote_average: 8.5
    },
    {
      id: 2,
      name: "Shogun",
      poster_path: "/oeQ7tJGPaQhBwYwIFSFQH2EvxLM.jpg",
      media_type: "tv",
      vote_average: 8.7
    }
  ];

  const displayFavorites = favorites.length > 0 ? favorites : dummyFavorites;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">
        Mes favoris
      </h1>
      
      {displayFavorites.length === 0 ? (
        <div className="bg-background-light rounded-lg p-6 text-center">
          <p className="text-gray-400">
            Vous n'avez pas encore ajouté de favoris. Explorez des films et séries pour en ajouter à votre liste !
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {displayFavorites.map((item) => (
            <MediaCard 
              key={`${item.media_type}-${item.id}`} 
              item={item} 
              type={item.media_type} 
              isFavorite={true}
              onRemoveFavorite={() => handleRemoveFavorite(item.id, item.media_type)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage; 