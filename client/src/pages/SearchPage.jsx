import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import tmdbService from '../services/tmdbService';
import MediaCard from '../components/ui/MediaCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtres
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || 'all', // all, movie, tv
    genre: searchParams.get('genre') || '',
    year: searchParams.get('year') || '',
    sortBy: searchParams.get('sortBy') || 'popularity.desc'
  });
  
  // Listes des années et des genres pour les filtres
  const [years, setYears] = useState([]);
  const [genres, setGenres] = useState({
    movie: [],
    tv: []
  });
  
  // Charger les années pour le filtre (de l'année courante à 1900)
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearsArray = [];
    
    for (let year = currentYear; year >= 1900; year--) {
      yearsArray.push(year);
    }
    
    setYears(yearsArray);
  }, []);
  
  // Charger les genres pour les filtres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [movieGenres, tvGenres] = await Promise.all([
          tmdbService.getMovieGenres(),
          tmdbService.getTvGenres()
        ]);
        
        setGenres({
          movie: movieGenres,
          tv: tvGenres
        });
      } catch (err) {
        console.error('Erreur lors du chargement des genres:', err);
      }
    };
    
    fetchGenres();
  }, []);
  
  // Effectuer la recherche
  useEffect(() => {
    const searchMedia = async () => {
      if (!query.trim()) {
        setResults([]);
        setTotalPages(0);
        return;
      }
      
      try {
        setLoading(true);
        
        let data;
        if (filters.type === 'movie') {
          // Recherche de films uniquement
          data = await tmdbService.searchMovies(query, page, {
            with_genres: filters.genre || undefined,
            primary_release_year: filters.year || undefined,
            sort_by: filters.sortBy
          });
        } else if (filters.type === 'tv') {
          // Recherche de séries uniquement
          data = await tmdbService.searchTVShows(query, page, {
            with_genres: filters.genre || undefined,
            first_air_date_year: filters.year || undefined,
            sort_by: filters.sortBy
          });
        } else {
          // Recherche mixte
          data = await tmdbService.searchMulti(query, page);
        }
        
        // Filtrer pour conserver uniquement les films et séries (pas les personnes)
        // et ajouter le type pour les résultats multi si ce n'est pas déjà présent
        const filteredResults = data.results
          .filter(item => item.media_type === 'movie' || item.media_type === 'tv' || filters.type !== 'all')
          .map(item => ({
            ...item,
            media_type: item.media_type || filters.type
          }));
        
        // Filtrer par année si nécessaire (pour recherche multi)
        let processedResults = filteredResults;
        if (filters.type === 'all' && filters.year) {
          const year = filters.year.toString();
          processedResults = filteredResults.filter(item => {
            const releaseDate = item.media_type === 'movie' 
              ? item.release_date 
              : item.first_air_date;
            
            return releaseDate && releaseDate.startsWith(year);
          });
        }
        
        // Filtrer par genre si nécessaire (pour recherche multi)
        if (filters.type === 'all' && filters.genre) {
          const genreId = parseInt(filters.genre);
          processedResults = processedResults.filter(item => 
            item.genre_ids && item.genre_ids.includes(genreId)
          );
        }
        
        setResults(processedResults);
        setTotalPages(Math.min(data.total_pages, 500)); // TMDb limite à 500 pages max
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la recherche:', err);
        setError('Une erreur est survenue lors de la recherche.');
        setLoading(false);
      }
    };
    
    searchMedia();
  }, [query, page, filters]);
  
  // Appliquer les filtres et mettre à jour l'URL
  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Réinitialiser à la première page
    
    // Mettre à jour les paramètres de l'URL
    const updatedParams = new URLSearchParams(searchParams);
    
    // Ajouter ou supprimer les paramètres selon leur valeur
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        updatedParams.set(key, value);
      } else {
        updatedParams.delete(key);
      }
    });
    
    // Maintenir le paramètre de requête
    if (query) {
      updatedParams.set('q', query);
    }
    
    setSearchParams(updatedParams);
  };
  
  // Réinitialiser les filtres
  const resetFilters = () => {
    const defaultFilters = {
      type: 'all',
      genre: '',
      year: '',
      sortBy: 'popularity.desc'
    };
    
    applyFilters(defaultFilters);
  };
  
  // Basculer l'affichage des filtres
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Changer de page
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Obtenir les genres actuels en fonction du type sélectionné
  const getCurrentGenres = () => {
    if (filters.type === 'movie') return genres.movie;
    if (filters.type === 'tv') return genres.tv;
    
    // Fusionner les genres pour l'affichage mixte et éviter les doublons
    const allGenres = [...genres.movie];
    genres.tv.forEach(tvGenre => {
      if (!allGenres.some(genre => genre.id === tvGenre.id)) {
        allGenres.push(tvGenre);
      }
    });
    
    return allGenres;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">
          {query 
            ? `Résultats de recherche pour "${query}"`
            : 'Recherche'
          }
        </h1>
        
        <button 
          onClick={toggleFilters}
          className="flex items-center gap-1 px-3 py-1.5 rounded bg-background-light text-white hover:bg-background-light/80"
        >
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Filtres</span>
        </button>
      </div>
      
      {/* Panneau de filtres */}
      {showFilters && (
        <div className="bg-background-light rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Filtrer les résultats</h2>
            <button 
              onClick={toggleFilters} 
              className="text-gray-400 hover:text-white"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Type de média */}
            <div className="space-y-2">
              <label htmlFor="type" className="block text-gray-300 font-medium">
                Type
              </label>
              <select
                id="type"
                value={filters.type}
                onChange={(e) => applyFilters({...filters, type: e.target.value, genre: ''})}
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
                onChange={(e) => applyFilters({...filters, genre: e.target.value})}
                className="w-full bg-background border border-gray-600 rounded p-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Tous les genres</option>
                {getCurrentGenres().map(genre => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Année */}
            <div className="space-y-2">
              <label htmlFor="year" className="block text-gray-300 font-medium">
                Année
              </label>
              <select
                id="year"
                value={filters.year}
                onChange={(e) => applyFilters({...filters, year: e.target.value})}
                className="w-full bg-background border border-gray-600 rounded p-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Toutes les années</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
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
                onChange={(e) => applyFilters({...filters, sortBy: e.target.value})}
                className="w-full bg-background border border-gray-600 rounded p-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="popularity.desc">Popularité</option>
                <option value="vote_average.desc">Note (décroissant)</option>
                <option value="vote_average.asc">Note (croissant)</option>
                <option value="release_date.desc">Date (récent d'abord)</option>
                <option value="release_date.asc">Date (ancien d'abord)</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors mr-2"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      )}
      
      {/* Résultats */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded">
          {error}
        </div>
      ) : query && results.length === 0 ? (
        <div className="bg-background-light rounded-lg p-6 text-center">
          <p className="text-gray-400">
            Aucun résultat ne correspond à votre recherche. Essayez d'autres termes ou modifiez vos filtres.
          </p>
        </div>
      ) : (
        <>
          {/* Grille de résultats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {results.map((item) => (
              <MediaCard 
                key={`${item.media_type}-${item.id}`} 
                item={item} 
                type={item.media_type} 
              />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-4">
              <button 
                onClick={handlePreviousPage}
                disabled={page === 1}
                className="px-4 py-2 bg-background-light rounded hover:bg-primary disabled:opacity-50 disabled:hover:bg-background-light"
              >
                Précédent
              </button>
              
              <span className="text-white">
                Page {page} sur {totalPages}
              </span>
              
              <button 
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="px-4 py-2 bg-background-light rounded hover:bg-primary disabled:opacity-50 disabled:hover:bg-background-light"
              >
                Suivant
              </button>
            </div>
          )}
        </>
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