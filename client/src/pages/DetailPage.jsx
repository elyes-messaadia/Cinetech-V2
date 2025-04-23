import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import tmdbService from '../services/tmdbService';
import favoriteService from '../services/favoriteService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { StarIcon, HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
import MediaCard from '../components/ui/MediaCard';
import CommentSection from '../components/ui/CommentSection';

const DetailPage = ({ mediaType }) => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  
  const [media, setMedia] = useState(null);
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToFavorites, setAddingToFavorites] = useState(false);
  
  // Charger les détails du film/série
  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        setLoading(true);
        
        let data;
        if (mediaType === 'movie') {
          data = await tmdbService.getMovieDetails(id);
        } else if (mediaType === 'tv') {
          data = await tmdbService.getTvDetails(id);
        }
        
        setMedia(data);
        
        // Extraire les crédits et recommandations
        if (data.credits) {
          setCredits({
            cast: data.credits.cast || [],
            crew: data.credits.crew || []
          });
        }
        
        if (data.recommendations) {
          setRecommendations(data.recommendations.results || []);
        }
        
        setLoading(false);
        
        // Vérifier si le média est dans les favoris
        if (isAuthenticated) {
          checkFavoriteStatus(id);
        }
      } catch (err) {
        console.error(`Erreur lors du chargement des détails du ${mediaType}:`, err);
        setError(`Une erreur est survenue lors du chargement des détails.`);
        setLoading(false);
      }
    };
    
    fetchMediaDetails();
  }, [id, mediaType, isAuthenticated]);
  
  // Vérifier si le média est dans les favoris
  const checkFavoriteStatus = async (mediaId) => {
    try {
      const status = await favoriteService.isFavorite(mediaId, mediaType);
      setIsFavorite(status);
    } catch (err) {
      console.error('Erreur lors de la vérification des favoris:', err);
    }
  };
  
  // Ajouter/retirer des favoris
  const toggleFavorite = async () => {
    if (!isAuthenticated) return;
    
    try {
      setAddingToFavorites(true);
      
      if (isFavorite) {
        await favoriteService.removeFavorite(id, mediaType);
      } else {
        await favoriteService.addFavorite(id, mediaType);
      }
      
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Erreur lors de la modification des favoris:', err);
    } finally {
      setAddingToFavorites(false);
    }
  };
  
  // Extraire les principaux membres de l'équipe
  const getDirector = () => {
    if (!credits.crew) return 'Non disponible';
    const director = credits.crew.find(person => person.job === 'Director');
    return director ? director.name : 'Non disponible';
  };
  
  const getMainCast = () => {
    return credits.cast ? credits.cast.slice(0, 10) : [];
  };
  
  // Formater la durée en heures et minutes
  const formatRuntime = (minutes) => {
    if (!minutes) return 'Non disponible';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };
  
  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Non disponible';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
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
  
  if (!media) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-500 p-4 rounded">
          Aucune information trouvée pour ce contenu.
        </div>
      </div>
    );
  }
  
  // Variables pour une meilleure lisibilité
  const title = mediaType === 'movie' ? media.title : media.name;
  const releaseDate = mediaType === 'movie' ? media.release_date : media.first_air_date;
  const formattedDate = formatDate(releaseDate);
  const runtime = mediaType === 'movie' ? formatRuntime(media.runtime) : 
    (media.episode_run_time && media.episode_run_time.length ? 
      `${media.episode_run_time[0]} min / épisode` : 'Non disponible');
  
  // Obtenir l'URL de l'image de fond
  const backdropUrl = media.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${media.backdrop_path}`
    : null;
  
  // Obtenir l'URL de l'affiche
  const posterUrl = media.poster_path 
    ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
    : '/images/poster-placeholder.png';
  
  return (
    <div className="pb-12">
      {/* Hero section avec image de fond et informations principales */}
      <div 
        className="relative min-h-[60vh] flex items-end bg-cover bg-center"
        style={backdropUrl ? { backgroundImage: `url(${backdropUrl})` } : {}}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Affiche */}
            <div className="w-48 h-72 md:w-64 md:h-96 shrink-0 rounded-lg overflow-hidden shadow-lg">
              <img 
                src={posterUrl} 
                alt={title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Informations */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {title}
                {media.release_date && <span className="text-xl font-normal text-gray-300 ml-2">
                  ({new Date(media.release_date).getFullYear()})
                </span>}
              </h1>
              
              <div className="flex items-center flex-wrap gap-3 mb-4">
                {/* Note */}
                {media.vote_average > 0 && (
                  <div className="flex items-center bg-primary/20 text-white px-2 py-1 rounded">
                    <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{media.vote_average.toFixed(1)}</span>
                  </div>
                )}
                
                {/* Date de sortie */}
                <div className="text-gray-300 text-sm">
                  {formattedDate}
                </div>
                
                {/* Durée */}
                <div className="text-gray-300 text-sm">
                  {runtime}
                </div>
                
                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {media.genres && media.genres.map(genre => (
                    <span 
                      key={genre.id} 
                      className="px-2 py-1 bg-background-light rounded-full text-xs text-white"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
                
                {/* Bouton Favoris */}
                {isAuthenticated && (
                  <button
                    onClick={toggleFavorite}
                    disabled={addingToFavorites}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
                      isFavorite 
                        ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
                        : 'bg-background-light text-white hover:bg-background-light/80'
                    }`}
                  >
                    {isFavorite ? (
                      <HeartIcon className="w-4 h-4" />
                    ) : (
                      <HeartOutlineIcon className="w-4 h-4" />
                    )}
                    <span>{isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}</span>
                  </button>
                )}
              </div>
              
              {/* Synopsis */}
              <div className="mt-4">
                <h2 className="text-xl text-white font-semibold mb-2">Synopsis</h2>
                <p className="text-gray-300">
                  {media.overview || 'Aucun synopsis disponible.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonne de gauche: Informations supplémentaires */}
          <div className="md:col-span-1">
            <h2 className="text-xl text-white font-semibold mb-4">Informations</h2>
            
            <div className="bg-background-light rounded-lg p-4 space-y-4">
              {/* Réalisateur / Créateur */}
              {mediaType === 'movie' ? (
                <div>
                  <h3 className="text-gray-400 text-sm">Réalisateur</h3>
                  <p className="text-white">{getDirector()}</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-gray-400 text-sm">Créé par</h3>
                  <p className="text-white">
                    {media.created_by && media.created_by.length
                      ? media.created_by.map(creator => creator.name).join(', ')
                      : 'Non disponible'}
                  </p>
                </div>
              )}
              
              {/* Status et autres détails spécifiques aux séries */}
              {mediaType === 'tv' && (
                <>
                  <div>
                    <h3 className="text-gray-400 text-sm">Statut</h3>
                    <p className="text-white">{media.status || 'Non disponible'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-gray-400 text-sm">Saisons</h3>
                    <p className="text-white">{media.number_of_seasons || '0'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-gray-400 text-sm">Épisodes</h3>
                    <p className="text-white">{media.number_of_episodes || '0'}</p>
                  </div>
                </>
              )}
              
              {/* Pays de production */}
              <div>
                <h3 className="text-gray-400 text-sm">Pays d'origine</h3>
                <p className="text-white">
                  {media.production_countries && media.production_countries.length
                    ? media.production_countries.map(country => country.name).join(', ')
                    : 'Non disponible'}
                </p>
              </div>
              
              {/* Langue originale */}
              <div>
                <h3 className="text-gray-400 text-sm">Langue originale</h3>
                <p className="text-white">
                  {media.original_language 
                    ? new Intl.DisplayNames(['fr'], { type: 'language' }).of(media.original_language)
                    : 'Non disponible'}
                </p>
              </div>
              
              {/* Budget et revenus pour les films */}
              {mediaType === 'movie' && (
                <>
                  <div>
                    <h3 className="text-gray-400 text-sm">Budget</h3>
                    <p className="text-white">
                      {media.budget 
                        ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(media.budget)
                        : 'Non disponible'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-gray-400 text-sm">Recettes</h3>
                    <p className="text-white">
                      {media.revenue 
                        ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(media.revenue)
                        : 'Non disponible'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Colonne de droite: Casting, recommandations, commentaires */}
          <div className="md:col-span-2">
            {/* Casting */}
            <section className="mb-8">
              <h2 className="text-xl text-white font-semibold mb-4">Casting</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {getMainCast().map(actor => (
                  <div key={actor.id} className="bg-background-light rounded-lg overflow-hidden">
                    <div className="aspect-[2/3] relative overflow-hidden">
                      <img 
                        src={actor.profile_path 
                          ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                          : '/images/actor-placeholder.png'
                        } 
                        alt={actor.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-2">
                      <h3 className="text-white text-sm font-medium truncate">{actor.name}</h3>
                      <p className="text-gray-400 text-xs truncate">{actor.character}</p>
                    </div>
                  </div>
                ))}
                
                {getMainCast().length === 0 && (
                  <div className="col-span-full text-gray-400">
                    Aucune information sur le casting disponible.
                  </div>
                )}
              </div>
            </section>
            
            {/* Recommandations */}
            {recommendations.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl text-white font-semibold mb-4">Recommandations</h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {recommendations.slice(0, 8).map(item => (
                    <MediaCard 
                      key={item.id}
                      item={item}
                      type={mediaType}
                    />
                  ))}
                </div>
              </section>
            )}
            
            {/* Section commentaires */}
            <section>
              <h2 className="text-xl text-white font-semibold mb-4">Commentaires</h2>
              <CommentSection mediaId={id} mediaType={mediaType} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage; 