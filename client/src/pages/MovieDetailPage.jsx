import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HeartIcon, ClockIcon, CalendarIcon, FilmIcon, UserIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import MediaCarousel from '../components/ui/MediaCarousel';
import tmdbService from '../services/tmdbService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les détails du film depuis l'API TMDb
        const movieData = await tmdbService.getMovieDetails(id);
        setMovie(movieData);
        
        // Les crédits et films similaires sont inclus dans la réponse avec append_to_response
        setCredits({
          cast: movieData.credits.cast.slice(0, 10),
          crew: movieData.credits.crew.filter(person => person.job === 'Director' || person.job === 'Producer')
        });
        
        setSimilarMovies(movieData.similar.results.slice(0, 10));
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        setError("Une erreur est survenue lors du chargement des données du film.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Ici, vous ajouterez la logique pour enregistrer le favori en BDD
  };

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  if (loading) {
    return (
      <div className="container-custom py-20 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container-custom py-20">
        <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded">
          {error || "Film non trouvé"}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Backdrop et infos principales */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background-dark">
          <img 
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
            alt={movie.title}
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        
        <div className="relative z-10 container-custom pt-8 pb-16">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0 w-full md:w-1/4">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title}
                  className="w-full h-auto"
                />
              </div>
            </div>
            
            {/* Infos */}
            <div className="flex-grow">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-6">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="w-5 h-5" />
                  {new Date(movie.release_date).getFullYear()}
                </span>
                <span className="flex items-center gap-1">
                  <ClockIcon className="w-5 h-5" />
                  {formatRuntime(movie.runtime)}
                </span>
                <span className="flex items-center bg-primary px-2 py-0.5 rounded text-white font-medium">
                  {movie.vote_average.toFixed(1)} ★
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map(genre => (
                  <span 
                    key={genre.id}
                    className="bg-background-light px-3 py-1 rounded-full text-sm text-white"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-medium text-white mb-2">Synopsis</h2>
                <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={toggleFavorite}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                    isFavorite 
                      ? 'bg-primary text-white' 
                      : 'bg-background-light text-white hover:bg-primary/80'
                  }`}
                >
                  {isFavorite ? (
                    <>
                      <HeartSolidIcon className="w-5 h-5" />
                      Favori
                    </>
                  ) : (
                    <>
                      <HeartIcon className="w-5 h-5" />
                      Ajouter aux favoris
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Équipe et casting */}
          {credits && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-6">Casting</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {credits.cast.slice(0, 5).map(person => (
                  <div key={person.id} className="bg-background-light rounded-lg overflow-hidden">
                    <div className="aspect-[2/3] overflow-hidden">
                      {person.profile_path ? (
                        <img 
                          src={`https://image.tmdb.org/t/p/w200${person.profile_path}`} 
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-background flex items-center justify-center">
                          <UserIcon className="w-12 h-12 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-medium text-white">{person.name}</p>
                      <p className="text-sm text-gray-400">{person.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Films similaires */}
      {similarMovies.length > 0 && (
        <div className="py-8 bg-background">
          <MediaCarousel 
            title="Films similaires" 
            mediaList={similarMovies} 
            mediaType="movie" 
          />
        </div>
      )}
      
      {/* Section commentaires (sera implémentée dans la prochaine étape) */}
      <div className="container-custom py-12">
        <h2 className="text-2xl font-bold text-white mb-6">Commentaires</h2>
        <div className="bg-background-light p-6 rounded-lg">
          <p className="text-gray-400">
            La section commentaires sera implémentée ultérieurement.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage; 