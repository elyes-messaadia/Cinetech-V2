import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import tmdbService from '../../services/tmdbService';
import { debounce } from '../../utils/helpers';

const SearchBar = ({ onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState({ movies: [], tvShows: [] });
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Fermer les suggestions quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) && 
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fonction pour charger les suggestions avec debounce
  const fetchSuggestions = debounce(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions({ movies: [], tvShows: [] });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await tmdbService.searchMulti(searchQuery);
      
      // Séparer les résultats par type (film ou série)
      const movies = data.results
        .filter(item => item.media_type === 'movie')
        .slice(0, 5);
        
      const tvShows = data.results
        .filter(item => item.media_type === 'tv')
        .slice(0, 5);
      
      setSuggestions({ movies, tvShows });
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la recherche de suggestions:', error);
      setLoading(false);
    }
  }, 300);

  // Mise à jour des suggestions à chaque changement de requête
  useEffect(() => {
    if (query) {
      fetchSuggestions(query);
    } else {
      setSuggestions({ movies: [], tvShows: [] });
    }
  }, [query, fetchSuggestions]);

  // Gestion du changement dans l'input
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
      if (onClose) onClose();
    }
  };

  // Gestion du clic sur une suggestion
  const handleSuggestionClick = (item) => {
    navigate(`/${item.media_type}/${item.id}`);
    setShowSuggestions(false);
    setQuery('');
    if (onClose) onClose();
  };

  // Réinitialiser la recherche
  const clearSearch = () => {
    setQuery('');
    setSuggestions({ movies: [], tvShows: [] });
    setShowSuggestions(false);
    inputRef.current.focus();
  };

  // Fonction pour obtenir l'URL de l'image
  const getImageUrl = (path) => {
    if (!path) return '/images/poster-placeholder.png';
    return `https://image.tmdb.org/t/p/w92${path}`;
  };

  // Vérifier s'il y a des suggestions à afficher
  const hasSuggestions = suggestions.movies.length > 0 || suggestions.tvShows.length > 0;

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Rechercher des films, séries..."
          className="w-full px-4 py-2 pl-10 pr-10 bg-background-light border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-white"
          autoFocus
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <MagnifyingGlassIcon className="w-5 h-5" />
        </div>
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </form>

      {/* Suggestions */}
      {showSuggestions && query && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 mt-2 w-full bg-background-light border border-gray-600 rounded-lg shadow-lg overflow-hidden"
        >
          {loading ? (
            <div className="p-4 text-center text-gray-400">Recherche en cours...</div>
          ) : hasSuggestions ? (
            <div>
              {/* Films */}
              {suggestions.movies.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-background-dark/50 text-gray-300 font-medium">
                    Films
                  </div>
                  <ul>
                    {suggestions.movies.map(movie => (
                      <li key={`movie-${movie.id}`}>
                        <button
                          className="w-full px-4 py-2 flex items-center hover:bg-background-dark/30 text-left transition-colors"
                          onClick={() => handleSuggestionClick(movie)}
                        >
                          <img
                            src={getImageUrl(movie.poster_path)}
                            alt={movie.title}
                            className="w-10 h-15 object-cover rounded mr-3"
                          />
                          <div>
                            <div className="text-white font-medium">{movie.title}</div>
                            <div className="text-gray-400 text-sm">
                              {movie.release_date ? new Date(movie.release_date).getFullYear() : ''}
                            </div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Séries */}
              {suggestions.tvShows.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-background-dark/50 text-gray-300 font-medium">
                    Séries
                  </div>
                  <ul>
                    {suggestions.tvShows.map(tvShow => (
                      <li key={`tv-${tvShow.id}`}>
                        <button
                          className="w-full px-4 py-2 flex items-center hover:bg-background-dark/30 text-left transition-colors"
                          onClick={() => handleSuggestionClick(tvShow)}
                        >
                          <img
                            src={getImageUrl(tvShow.poster_path)}
                            alt={tvShow.name}
                            className="w-10 h-15 object-cover rounded mr-3"
                          />
                          <div>
                            <div className="text-white font-medium">{tvShow.name}</div>
                            <div className="text-gray-400 text-sm">
                              {tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : ''}
                            </div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Lien vers les résultats complets */}
              <div className="p-2 border-t border-gray-600">
                <button
                  onClick={handleSubmit}
                  className="w-full px-3 py-2 text-center text-primary hover:text-primary-light transition-colors"
                >
                  Voir tous les résultats pour "{query}"
                </button>
              </div>
            </div>
          ) : query ? (
            <div className="p-4 text-center text-gray-400">Aucun résultat trouvé pour "{query}"</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 