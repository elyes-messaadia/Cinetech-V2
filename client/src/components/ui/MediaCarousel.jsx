import { useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import MovieCard from './MovieCard';

const MediaCarousel = ({ title, mediaList, mediaType = 'movie' }) => {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="my-8">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={scrollLeft}
              className="p-1 rounded-full bg-background-light hover:bg-primary transition-colors"
              aria-label="Défiler à gauche"
            >
              <ChevronLeftIcon className="w-6 h-6 text-white" />
            </button>
            <button 
              onClick={scrollRight}
              className="p-1 rounded-full bg-background-light hover:bg-primary transition-colors"
              aria-label="Défiler à droite"
            >
              <ChevronRightIcon className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div 
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide gap-4 pb-4 pl-4 lg:pl-[calc((100%-1280px)/2+16px)]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {mediaList.map(media => (
          <div key={media.id} className="flex-shrink-0 w-[180px]">
            <MovieCard movie={media} type={mediaType} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaCarousel; 