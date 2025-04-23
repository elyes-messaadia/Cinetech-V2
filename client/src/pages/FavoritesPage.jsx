import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import favoriteService from '../services/favoriteService';
import tmdbService from '../services/tmdbService';
import MediaCard from '../components/ui/MediaCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const FavoritesPage = () => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    genre: 'all',
    sortBy: 'date'
  });
  const [genres, setGenres] = useState([]);
  
  // Récupérer les genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const movieGenres = await tmdbService.getMovieGenres();
        const tvGenres = await tmdbService.getTvGenres();
        
        // Fusionner les genres en enlevant les doublons
        const allGenres = [...movieGenres, ...tvGenres];
        const uniqueGenres = allGenres.filter((genre, index, self) =>
          index === self.findIndex((g) => g.id === genre.id)
        );
        
        setGenres(uniqueGenres);
      } catch (error) {
        console.error('Erreur lors de la récupération des genres', error);
        setError('Erreur lors du chargement des genres. Certains filtres peuvent ne pas être disponibles.');
      }
    };

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userFavorites = await favoriteService.getUserFavorites();
        
        // Récupérer les détails pour chaque favori depuis TMDB
        const favoriteDetails = await Promise.all(
          userFavorites.map(async (favorite) => {
            try {
              const details = favorite.mediaType === 'movie'
                ? await tmdbService.getMovieDetails(favorite.mediaId)
                : await tmdbService.getTvDetails(favorite.mediaId);
              
              return {
                ...details,
                mediaType: favorite.mediaType,
                addedAt: favorite.createdAt
              };
            } catch (error) {
              console.error(`Erreur lors de la récupération des détails pour ${favorite.mediaId}`, error);
              return null; // Ignorer les favoris avec des erreurs
            }
          })
        );
        
        // Filtrer les favoris null (qui ont échoué)
        const validFavorites = favoriteDetails.filter(f => f !== null);
        setFavorites(validFavorites);
        setFilteredFavorites(validFavorites);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des favoris', error);
        setError('Impossible de récupérer vos favoris. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchGenres();
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);
  
  useEffect(() => {
    const applyFilters = () => {
      let result = [...favorites];
      
      // Filtrer par type
      if (filters.type !== 'all') {
        result = result.filter(item => item.mediaType === filters.type);
      }
      
      // Filtrer par genre
      if (filters.genre !== 'all') {
        const genreId = parseInt(filters.genre);
        result = result.filter(item => 
          item.genres && item.genres.some(genre => genre.id === genreId)
        );
      }
      
      // Trier
      const sortedFavorites = [...result];
      
      switch (filters.sortBy) {
        case 'date':
          sortedFavorites.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
          break;
        case 'title':
          sortedFavorites.sort((a, b) => {
            const titleA = a.mediaType === 'movie' ? a.title : a.name;
            const titleB = b.mediaType === 'movie' ? b.title : b.name;
            return titleA.localeCompare(titleB);
          });
          break;
        case 'rating':
          sortedFavorites.sort((a, b) => b.vote_average - a.vote_average);
          break;
        default:
          break;
      }
      
      setFilteredFavorites(sortedFavorites);
    };
    
    applyFilters();
  }, [favorites, filters]);
  
  // Gestion du changement de filtre
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Basculer l'affichage des filtres
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Rediriger vers la page de connexion si non connecté
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Mes Favoris</h1>
        
        <button 
          onClick={toggleFilters}
          className="flex items-center gap-1 px-3 py-1.5 rounded bg-background-light text-white hover:bg-background-light/80"
        >
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Filtrer</span>
        </button>
      </div>
      
      {/* Panneau de filtres */}
      {showFilters && (
        <div className="bg-background-light rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Filtrer et trier</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Type de média */}
            <div className="space-y-2">
              <label htmlFor="type" className="block text-gray-300 font-medium">
                Type
              </label>
              <select
                id="type"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full bg-background border border-gray-600 rounded p-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">Tous</option>
                <option value="movie">Films uniquement</option>
                <option value="tv">Séries uniquement</option>
              </select>
            </div>
            
            {/* Genre */}
            <div className="space-y-2">
              <label htmlFor="genre" className="block text-gray-300 font-medium">
                Genre
              </label>
              <select
                id="genre"
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="w-full bg-background border border-gray-600 rounded p-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">Tous les genres</option>
                {genres.map(genre => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Tri */}
            <div className="space-y-2">
              <label htmlFor="sortBy" className="block text-gray-300 font-medium">
                Trier par
              </label>
              <select
                id="sortBy"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full bg-background border border-gray-600 rounded p-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="date">Date d'ajout</option>
                <option value="title">Titre</option>
                <option value="rating">Note</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Contenu principal */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded">
          {error}
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-background-light rounded-lg p-6 text-center">
          <p className="text-gray-400">
            Vous n'avez pas encore de favoris. Explorez notre catalogue et ajoutez des films et séries à vos favoris !
          </p>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="bg-background-light rounded-lg p-6 text-center">
          <p className="text-gray-400">
            Aucun favori ne correspond à vos critères de filtrage.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {filteredFavorites.map((item) => (
            <MediaCard 
              key={`${item.mediaType}-${item.id}`} 
              item={item} 
              type={item.mediaType} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage; 