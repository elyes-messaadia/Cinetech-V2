import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { StarIcon, HeartIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import favoriteService from '../services/favoriteService';
import tmdbService from '../services/tmdbService';
import MediaCard from '../components/ui/MediaCard';

const FavoritesPage = () => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtres et tri
  const [mediaType, setMediaType] = useState('all'); // 'all', 'movie', 'tv'
  const [genreFilter, setGenreFilter] = useState('all');
  const [sortBy, setSortBy] = useState('added_date'); // 'added_date', 'title', 'release_date', 'rating'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  const [genres, setGenres] = useState([]);
  
  // Récupérer les genres depuis TMDB
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const movieGenres = await tmdbService.getGenres('movie');
        const tvGenres = await tmdbService.getGenres('tv');
        
        // Fusionner et dédupliquer les genres
        const allGenres = [...movieGenres, ...tvGenres];
        const uniqueGenres = Array.from(new Map(allGenres.map(genre => [genre.id, genre])).values());
        setGenres(uniqueGenres);
      } catch (err) {
        console.error('Erreur lors du chargement des genres:', err);
      }
    };
    
    fetchGenres();
  }, []);
  
  // Récupérer les favoris
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        const data = await favoriteService.getFavorites();
        
        // Filtrer les favoris invalides (où l'API n'a pas trouvé le média)
        const validFavorites = data.filter(fav => fav && fav.mediaDetails);
        setFavorites(validFavorites);
      } catch (err) {
        console.error('Erreur lors du chargement des favoris:', err);
        setError('Une erreur est survenue lors du chargement de vos favoris.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavorites();
  }, [isAuthenticated]);
  
  // Récupérer les genres utilisés dans les favoris
  const getUsedGenres = () => {
    const usedGenreIds = new Set();
    
    favorites.forEach(favorite => {
      const genreIds = favorite.mediaDetails.genres?.map(g => g.id) || [];
      genreIds.forEach(id => usedGenreIds.add(id));
    });
    
    return Array.from(usedGenreIds);
  };
  
  // Filtrer les favoris
  const getFilteredFavorites = () => {
    return favorites.filter(favorite => {
      // Filtre par type de média
      if (mediaType !== 'all' && favorite.mediaType !== mediaType) {
        return false;
      }
      
      // Filtre par genre
      if (genreFilter !== 'all') {
        const genreIds = favorite.mediaDetails.genres?.map(g => g.id) || [];
        if (!genreIds.includes(parseInt(genreFilter))) {
          return false;
        }
      }
      
      return true;
    }).sort((a, b) => {
      // Tri des favoris
      if (sortBy === 'added_date') {
        return sortOrder === 'asc' 
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
      
      if (sortBy === 'title') {
        return sortOrder === 'asc'
          ? a.mediaDetails.title.localeCompare(b.mediaDetails.title || b.mediaDetails.name)
          : b.mediaDetails.title.localeCompare(a.mediaDetails.title || a.mediaDetails.name);
      }
      
      if (sortBy === 'release_date') {
        const dateA = a.mediaDetails.release_date || a.mediaDetails.first_air_date || '';
        const dateB = b.mediaDetails.release_date || b.mediaDetails.first_air_date || '';
        
        return sortOrder === 'asc' 
          ? new Date(dateA) - new Date(dateB)
          : new Date(dateB) - new Date(dateA);
      }
      
      if (sortBy === 'rating') {
        return sortOrder === 'asc' 
          ? a.mediaDetails.vote_average - b.mediaDetails.vote_average
          : b.mediaDetails.vote_average - a.mediaDetails.vote_average;
      }
      
      return 0;
    });
  };
  
  // Supprimer un favori
  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await favoriteService.removeFavorite(favoriteId);
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
    } catch (err) {
      console.error('Erreur lors de la suppression du favori:', err);
      setError('Une erreur est survenue lors de la suppression du favori.');
    }
  };
  
  // Fonction de tri des favoris
  const sortFavorites = (items) => {
    let sorted = [...items];
    let dateA, dateB;
    
    switch (sortBy) {
      case 'added_date':
        sorted.sort((a, b) => {
          dateA = new Date(a.createdAt);
          dateB = new Date(b.createdAt);
          return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        break;
      case 'title':
        sorted.sort((a, b) => {
          const titleA = a.mediaDetails.title || a.mediaDetails.name || '';
          const titleB = b.mediaDetails.title || b.mediaDetails.name || '';
          return sortOrder === 'asc' ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
        });
        break;
      case 'release_date':
        sorted.sort((a, b) => {
          dateA = new Date(a.mediaDetails.release_date || a.mediaDetails.first_air_date || '');
          dateB = new Date(b.mediaDetails.release_date || b.mediaDetails.first_air_date || '');
          return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        break;
      case 'rating':
        sorted.sort((a, b) => {
          const ratingA = a.mediaDetails.vote_average || 0;
          const ratingB = b.mediaDetails.vote_average || 0;
          return sortOrder === 'asc' ? ratingA - ratingB : ratingB - ratingA;
        });
        break;
      default:
        // Par défaut, trier par date d'ajout décroissante
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
    
    return sorted;
  };
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  const filteredFavorites = sortFavorites(getFilteredFavorites());
  const usedGenreIds = getUsedGenres();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Mes Favoris</h1>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="mt-4 md:mt-0 px-4 py-2 bg-background-light hover:bg-gray-700 text-white rounded flex items-center"
        >
          <span>{showFilters ? 'Masquer les filtres' : 'Filtrer et trier'}</span>
          <svg className={`ml-2 w-5 h-5 transform ${showFilters ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {showFilters && (
        <div className="bg-background-light p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtre par type de média */}
          <div className="flex flex-col">
            <label className="text-gray-300 mb-2">Type de média</label>
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
              className="bg-background border border-gray-700 text-white rounded p-2"
            >
              <option value="all">Tous</option>
              <option value="movie">Films</option>
              <option value="tv">Séries</option>
            </select>
          </div>
          
          {/* Filtre par genre */}
          <div className="flex flex-col">
            <label className="text-gray-300 mb-2">Genre</label>
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="bg-background border border-gray-700 text-white rounded p-2"
            >
              <option value="all">Tous les genres</option>
              {genres
                .filter(genre => usedGenreIds.includes(genre.id))
                .map(genre => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))
              }
            </select>
          </div>
          
          {/* Tri */}
          <div className="flex flex-col">
            <label className="text-gray-300 mb-2">Trier par</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-background border border-gray-700 text-white rounded p-2"
            >
              <option value="added_date">Date d'ajout</option>
              <option value="title">Titre</option>
              <option value="release_date">Date de sortie</option>
              <option value="rating">Note</option>
            </select>
          </div>
          
          {/* Ordre de tri */}
          <div className="flex flex-col">
            <label className="text-gray-300 mb-2">Ordre</label>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 bg-background border border-gray-700 rounded flex justify-between items-center"
            >
              <span>{sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}</span>
              <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
            </button>
          </div>
        </div>
      )}
      
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded">
          {error}
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="bg-background-light rounded-lg p-8 text-center">
          <HeartIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl text-white font-medium mb-2">Aucun favori trouvé</h2>
          {favorites.length > 0 ? (
            <p className="text-gray-400 mb-6">
              Aucun favori ne correspond à vos critères de filtrage.
            </p>
          ) : (
            <p className="text-gray-400 mb-6">
              Vous n'avez pas encore ajouté de favoris. Explorez des films et séries et ajoutez-les à vos favoris!
            </p>
          )}
          <a 
            href="/movies" 
            className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded"
          >
            Explorer du contenu
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFavorites.map(favorite => (
            <div 
              key={favorite.id} 
              className="bg-background-light rounded-lg overflow-hidden flex flex-col relative group"
            >
              <MediaCard 
                item={favorite.mediaDetails} 
                type={favorite.mediaType}
                showRating
              />
              <button
                onClick={() => handleRemoveFavorite(favorite.id)}
                className="absolute top-2 right-2 p-2 bg-background/80 rounded-full text-white hover:text-red-500"
                title="Retirer des favoris"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage; 