import { Link } from 'react-router-dom';
import { PlayIcon } from '@heroicons/react/24/solid';

const Hero = ({ media }) => {
  if (!media) return null;

  const isMovie = media.title && media.release_date;
  const title = isMovie ? media.title : media.name;
  const releaseDate = isMovie 
    ? new Date(media.release_date).getFullYear()
    : new Date(media.first_air_date).getFullYear();
  const detailPath = `/${isMovie ? 'movie' : 'tv'}/${media.id}`;
  
  const backdropPath = media.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${media.backdrop_path}`
    : null;

  return (
    <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
      {/* Image de fond */}
      {backdropPath && (
        <img 
          src={backdropPath}
          alt={title}
          className="absolute w-full h-full object-cover"
        />
      )}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/10 flex items-end md:items-center">
        <div className="container-custom py-10 md:py-0">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
              {title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-white/70 mb-4">
              <span>{releaseDate}</span>
              <span className="flex items-center">
                <span className="text-primary mr-1">★</span> 
                {media.vote_average.toFixed(1)}
              </span>
              {media.genres?.slice(0, 3).map(genre => (
                <span key={genre.id}>{genre.name}</span>
              ))}
            </div>
            <p className="text-white/80 mb-6 line-clamp-3 md:line-clamp-none">
              {media.overview}
            </p>
            <div className="flex items-center gap-4">
              <Link 
                to={detailPath}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md flex items-center gap-2 transition-colors"
              >
                <PlayIcon className="w-5 h-5" />
                <span>Voir les détails</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 