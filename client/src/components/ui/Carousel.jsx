import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Carousel = ({ items = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Fonction pour passer à la slide suivante
  const nextSlide = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  }, [items.length]);
  
  // Fonction pour passer à la slide précédente
  const prevSlide = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  }, [items.length]);
  
  // Défilement automatique
  useEffect(() => {
    let intervalId;
    
    if (isAutoPlaying && items.length > 1) {
      intervalId = setInterval(() => {
        nextSlide();
      }, 6000); // Changer de slide toutes les 6 secondes
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAutoPlaying, nextSlide, items.length]);
  
  // Arrêter le défilement automatique lorsque l'utilisateur interagit
  const handleInteraction = () => {
    setIsAutoPlaying(false);
    // Redémarrer après 10 secondes d'inactivité
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 10000);
  };
  
  // Si pas d'éléments, ne rien afficher
  if (!items.length) {
    return null;
  }

  const getMediaType = (item) => {
    return item.title ? 'movie' : 'tv';
  };
  
  const getMediaId = (item) => {
    return item.id;
  };
  
  const getMediaTitle = (item) => {
    return item.title || item.name;
  };
  
  const getBackdropUrl = (path) => {
    return path ? `https://image.tmdb.org/t/p/original${path}` : '';
  };

  return (
    <div 
      className="relative h-[70vh] overflow-hidden" 
      onMouseEnter={handleInteraction}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      <div className="h-full">
        {items.map((item, index) => {
          const mediaType = getMediaType(item);
          const mediaId = getMediaId(item);
          const title = getMediaTitle(item);
          const backdropUrl = getBackdropUrl(item.backdrop_path);
          
          return (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Arrière-plan d'image avec gradient */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${backdropUrl})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              </div>
              
              {/* Contenu de la slide */}
              <div className="relative z-20 h-full flex items-end justify-start">
                <div className="container mx-auto px-4 pb-16 md:pb-20">
                  <div className="max-w-2xl">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
                      {title}
                    </h2>
                    
                    <p className="text-white/90 text-sm md:text-base mb-6 line-clamp-3 drop-shadow-md">
                      {item.overview}
                    </p>
                    
                    <Link 
                      to={`/${mediaType}/${mediaId}`}
                      className="inline-block bg-primary hover:bg-primary-dark transition-colors py-3 px-6 rounded-lg text-white font-medium"
                    >
                      Plus d'infos
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Flèches de navigation */}
      {items.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
            onClick={() => {
              handleInteraction();
              prevSlide();
            }}
            aria-label="Précédent"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
            onClick={() => {
              handleInteraction();
              nextSlide();
            }}
            aria-label="Suivant"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}
      
      {/* Indicateurs */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                handleInteraction();
                setCurrentIndex(index);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Aller à la slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel; 