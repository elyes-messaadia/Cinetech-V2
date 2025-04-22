import { useState } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const MediaCard = ({ item, type }) => {
  const { isAuthenticated, user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false); // À connecter avec l'API plus tard
  
  if (!item) return null;
  
  const title = type === 'movie' ? item.title : item.name;
  const releaseDate = type === 'movie' ? item.release_date : item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const rating = item.vote_average ? Math.round(item.vote_average * 10) / 10 : null;
  
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion ou afficher un message
      alert('Veuillez vous connecter pour ajouter des favoris');
      return;
    }
    
    // Logique pour ajouter/retirer des favoris (à implémenter)
    setIsFavorite(!isFavorite);
  };
  
  // Construire l'URL de l'image
  const getImageUrl = (path) => {
    if (!path) return '/images/poster-placeholder.png';
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  return (
    <Link 
      to={`/${type}/${item.id}`}
      className="block group relative rounded-lg overflow-hidden shadow-lg h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image principale */}
      <div className="aspect-[2/3] relative overflow-hidden">
        <img 
          src={getImageUrl(item.poster_path)} 
          alt={title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Overlay au survol */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        {/* Badge de notation */}
        {rating && (
          <div className="absolute top-2 left-2 bg-black/60 text-white text-xs py-1 px-2 rounded flex items-center">
            <StarIcon className="w-3 h-3 text-yellow-400 mr-1" />
            <span>{rating}</span>
          </div>
        )}
        
        {/* Bouton favoris */}
        {isAuthenticated && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-primary/80 transition-colors"
            aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            {isFavorite ? (
              <HeartIcon className="w-4 h-4 text-red-500" />
            ) : (
              <HeartOutlineIcon className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      
      {/* Informations du film/série */}
      <div className="p-3 bg-background-light">
        <h3 className="text-white font-medium text-sm truncate mb-1">{title}</h3>
        <p className="text-gray-400 text-xs">{year}</p>
      </div>
    </Link>
  );
};

export default MediaCard; 