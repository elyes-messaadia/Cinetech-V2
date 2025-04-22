import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

const MovieCard = ({ movie, isFavorite = false, type = 'movie' }) => {
  const [favorite, setFavorite] = useState(isFavorite);
  
  const toggleFavorite = (e) => {
    e.preventDefault();
    setFavorite(!favorite);
    // Ici, vous ajouterez la logique pour sauvegarder le favori dans la BDD
  };

  const imagePath = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';
  
  const detailPath = `/${type === 'movie' ? 'movie' : 'tv'}/${movie.id}`;
  
  return (
    <div className="card relative group">
      <Link to={detailPath}>
        <div className="relative overflow-hidden aspect-[2/3]">
          <img 
            src={imagePath} 
            alt={movie.title || movie.name} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
            <h3 className="text-white font-bold">{movie.title || movie.name}</h3>
            <p className="text-gray-300 text-sm">
              {movie.release_date 
                ? new Date(movie.release_date).getFullYear() 
                : movie.first_air_date 
                  ? new Date(movie.first_air_date).getFullYear()
                  : 'Date inconnue'}
            </p>
            <div className="flex items-center mt-2">
              <span className="bg-primary px-2 py-0.5 text-xs font-medium rounded text-white">
                {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} ★
              </span>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Bouton favori */}
      <button 
        onClick={toggleFavorite}
        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full transition-colors hover:bg-black/70"
      >
        {favorite ? (
          <HeartSolidIcon className="w-5 h-5 text-primary" />
        ) : (
          <HeartIcon className="w-5 h-5 text-white" />
        )}
      </button>
    </div>
  );
};

export default MovieCard; 