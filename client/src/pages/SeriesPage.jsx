import { useState, useEffect } from 'react';
import tmdbService from '../services/tmdbService';
import MediaCard from '../components/ui/MediaCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import FilterPanel from '../components/ui/FilterPanel';

const SeriesPage = () => {
  const [series, setSeries] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filtres
  const [filters, setFilters] = useState({
    genres: [],
    year: '',
    minRating: 0
  });
  
  // Charger les genres lors du chargement initial
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresList = await tmdbService.getTvGenres();
        setGenres(genresList);
      } catch (err) {
        console.error('Erreur lors du chargement des genres:', err);
      }
    };
    
    fetchGenres();
  }, []);
  
  // Charger les séries avec filtres
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);
        
        // Appeler l'API avec les filtres
        const data = await tmdbService.discoverTVShows({
          page,
          with_genres: filters.genres.join(','),
          first_air_date_year: filters.year || undefined,
          'vote_average.gte': filters.minRating > 0 ? filters.minRating : undefined
        });
        
        setSeries(data.results);
        setTotalPages(Math.min(data.total_pages, 500)); // TMDb limite à 500 pages max
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des séries:', err);
        setError('Une erreur est survenue lors du chargement des séries.');
        setLoading(false);
      }
    };
    
    fetchSeries();
  }, [page, filters]);
  
  // Gérer le changement de filtre
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Réinitialiser à la première page lors du changement de filtres
  };
  
  // Pagination
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Séries TV</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Panneau de filtres */}
        <div className="w-full md:w-1/4 lg:w-1/5">
          <FilterPanel 
            genres={genres}
            filters={filters}
            onFilterChange={handleFilterChange}
            mediaType="tv"
          />
        </div>
        
        {/* Grille de séries */}
        <div className="w-full md:w-3/4 lg:w-4/5">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded">
              {error}
            </div>
          ) : series.length === 0 ? (
            <div className="bg-background-light rounded-lg p-6 text-center">
              <p className="text-gray-400">
                Aucune série ne correspond à vos critères. Essayez de modifier vos filtres.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {series.map((show) => (
                  <MediaCard 
                    key={show.id} 
                    item={show} 
                    type="tv" 
                  />
                ))}
              </div>
              
              {/* Pagination */}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeriesPage; 
import tmdbService from '../services/tmdbService';
import MediaCard from '../components/ui/MediaCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import FilterPanel from '../components/ui/FilterPanel';

const SeriesPage = () => {
  const [series, setSeries] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filtres
  const [filters, setFilters] = useState({
    genres: [],
    year: '',
    minRating: 0
  });
  
  // Charger les genres lors du chargement initial
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresList = await tmdbService.getTvGenres();
        setGenres(genresList);
      } catch (err) {
        console.error('Erreur lors du chargement des genres:', err);
      }
    };
    
    fetchGenres();
  }, []);
  
  // Charger les séries avec filtres
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);
        
        // Appeler l'API avec les filtres
        const data = await tmdbService.discoverTVShows({
          page,
          with_genres: filters.genres.join(','),
          first_air_date_year: filters.year || undefined,
          'vote_average.gte': filters.minRating > 0 ? filters.minRating : undefined
        });
        
        setSeries(data.results);
        setTotalPages(Math.min(data.total_pages, 500)); // TMDb limite à 500 pages max
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des séries:', err);
        setError('Une erreur est survenue lors du chargement des séries.');
        setLoading(false);
      }
    };
    
    fetchSeries();
  }, [page, filters]);
  
  // Gérer le changement de filtre
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Réinitialiser à la première page lors du changement de filtres
  };
  
  // Pagination
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Séries TV</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Panneau de filtres */}
        <div className="w-full md:w-1/4 lg:w-1/5">
          <FilterPanel 
            genres={genres}
            filters={filters}
            onFilterChange={handleFilterChange}
            mediaType="tv"
          />
        </div>
        
        {/* Grille de séries */}
        <div className="w-full md:w-3/4 lg:w-4/5">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded">
              {error}
            </div>
          ) : series.length === 0 ? (
            <div className="bg-background-light rounded-lg p-6 text-center">
              <p className="text-gray-400">
                Aucune série ne correspond à vos critères. Essayez de modifier vos filtres.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {series.map((show) => (
                  <MediaCard 
                    key={show.id} 
                    item={show} 
                    type="tv" 
                  />
                ))}
              </div>
              
              {/* Pagination */}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeriesPage; 