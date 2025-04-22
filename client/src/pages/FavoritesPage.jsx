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
  
  // Filtres et tri
  const [filters, setFilters] = useState({
    type: 'all', // all, movie, tv
    genre: '',
    sortBy: 'added_date_desc' // added_date_desc, title_asc, vote_average_desc
  });
  
  // Récupérer les genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        await Promise.all([
          tmdbService.getMovieGenres(),
          tmdbService.getTvGenres()
        ]);
      } catch (err) {
        console.error('Erreur lors du chargement des genres:', err);
      }
    };
    
    fetchGenres();
  }, []);
  
  // Charger les favoris
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        const favoritesList = await favoriteService.getFavorites();
        
        // Récupérer les détails de chaque élément favori
        const detailedFavorites = await Promise.all(
          favoritesList.map(async favorite => {
            try {
              const details = favorite.mediaType === 'movie'
                ? await tmdbService.getMovieDetails(favorite.mediaId)
                : await tmdbService.getSeriesDetails(favorite.mediaId);
              
              return {
                ...details,
                media_type: favorite.mediaType,
                added_date: favorite.createdAt
              };
            } catch (err) {
              console.error(`Erreur lors de la récupération des détails pour ${favorite.mediaId}:`, err);
              return null;
            }
          })
        );
        
        // Filtrer les éléments nuls (erreurs)
        const validFavorites = detailedFavorites.filter(item => item !== null);
        setFavorites(validFavorites);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des favoris:', err);
        setError('Une erreur est survenue lors du chargement de vos favoris.');
        setLoading(false);
      }
    };
    
    fetchFavorites();
  }, [isAuthenticated]);
  
  // Filtrer et trier les favoris
  const getFilteredFavorites = () => {
    if (!favorites.length) return [];
    
    // 1. Filtrer par type
    let filtered = favorites;
    if (filters.type !== 'all') {
      filtered = filtered.filter(item => item.media_type === filters.type);
    }
    
    // 2. Filtrer par genre
    if (filters.genre) {
      const genreId = parseInt(filters.genre);
      filtered = filtered.filter(item => {
        if (!item.genres) return false;
        return item.genres.some(genre => genre.id === genreId);
      });
    }
    
    // 3. Trier
    return filtered.sort((a, b) => {
      let titleA, titleB;
      
      switch (filters.sortBy) {
        case 'title_asc':
          titleA = a.media_type === 'movie' ? a.title : a.name;
          titleB = b.media_type === 'movie' ? b.title : b.name;
          return titleA.localeCompare(titleB);
        
        case 'vote_average_desc':
          return b.vote_average - a.vote_average;
        
        case 'added_date_desc':
        default:
          // Tri par date d'ajout (plus récent d'abord)
          return new Date(b.added_date) - new Date(a.added_date);
      }
    });
  };
  
  // Obtenir tous les genres utilisés dans les favoris
  const getUsedGenres = () => {
    const genreSet = new Set();
    
    favorites.forEach(item => {
      if (!item.genres) return;
      
      item.genres.forEach(genre => {
        genreSet.add(JSON.stringify(genre));
      });
    });
    
    return Array.from(genreSet).map(genreString => JSON.parse(genreString));
  };
  
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
  
  const filteredFavorites = getFilteredFavorites();
  
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
                <option value="">Tous les genres</option>
                {getUsedGenres().map(genre => (
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
                <option value="added_date_desc">Date d'ajout</option>
                <option value="title_asc">Titre (A-Z)</option>
                <option value="vote_average_desc">Note</option>
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
              key={`${item.media_type}-${item.id}`} 
              item={item} 
              type={item.media_type} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage; 