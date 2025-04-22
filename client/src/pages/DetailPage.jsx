import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import tmdbService from '../services/tmdbService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { StarIcon } from '@heroicons/react/24/solid';

const DetailPage = ({ mediaType }) => {
  const { id } = useParams();
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        setLoading(true);
        
        if (mediaType === 'movie') {
          const data = await tmdbService.getMovieDetails(id);
          setMedia(data);
        } else if (mediaType === 'tv') {
          const data = await tmdbService.getSeriesDetails(id);
          setMedia(data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error(`Erreur lors du chargement des détails du ${mediaType}:`, err);
        setError(`Une erreur est survenue lors du chargement des détails.`);
        setLoading(false);
      }
    };
    
    fetchMediaDetails();
  }, [id, mediaType]);
  
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
  
  if (!media) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-500 p-4 rounded">
          Aucune information trouvée pour ce contenu.
        </div>
      </div>
    );
  }

  // Définir les variables en fonction du type de média
  const title = mediaType === 'movie' ? media.title : media.name;
  const releaseDate = mediaType === 'movie' ? media.release_date : media.first_air_date;
  const formattedDate = releaseDate ? new Date(releaseDate).toLocaleDateString('fr-FR') : 'Date inconnue';
  
  // Construire l'URL de l'image
  const getBackdropUrl = (path) => {
    if (!path) return '';
    return `https://image.tmdb.org/t/p/original${path}`;
  };
  
  const getPosterUrl = (path) => {
    if (!path) return '/images/poster-placeholder.png';
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Arrière-plan du film/série */}
      <div 
        className="relative h-[50vh] bg-cover bg-center" 
        style={{ backgroundImage: `url(${getBackdropUrl(media.backdrop_path)})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>
      
      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 -mt-32 relative z-10">
          {/* Affiche */}
          <div className="flex-none w-64 mx-auto md:mx-0">
            <img 
              src={getPosterUrl(media.poster_path)} 
              alt={title}
              className="rounded-lg shadow-xl w-full"
            />
          </div>
          
          {/* Informations */}
          <div className="flex-grow">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {title}
            </h1>
            
            <div className="flex items-center gap-4 text-gray-400 text-sm mb-6">
              <span>{formattedDate}</span>
              {media.genres && (
                <span>
                  {media.genres.map(genre => genre.name).join(', ')}
                </span>
              )}
              {media.vote_average && (
                <div className="flex items-center">
                  <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="text-white">{Math.round(media.vote_average * 10) / 10}</span>
                </div>
              )}
            </div>
            
            {media.tagline && (
              <p className="text-gray-300 italic mb-4">
                "{media.tagline}"
              </p>
            )}
            
            <h2 className="text-xl font-semibold text-white mb-2">Synopsis</h2>
            <p className="text-gray-300 mb-6">
              {media.overview || "Aucune description disponible."}
            </p>
            
            {/* Section à implémenter : Casting, vidéos, recommandations */}
            <div className="bg-background-light rounded-lg p-4 text-center">
              <p className="text-gray-400">
                Les sections de casting, vidéos et recommandations seront implémentées prochainement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage; 