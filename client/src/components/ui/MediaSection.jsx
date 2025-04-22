import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import MediaCard from './MediaCard';

const MediaSection = ({ title, items = [], type, viewMoreLink }) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef(null);

  // Vérifier si les flèches doivent être affichées
  useEffect(() => {
    const checkArrows = () => {
      const container = scrollContainerRef.current;
      if (!container) return;
      
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(container.scrollLeft < (container.scrollWidth - container.clientWidth - 10));
    };
    
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkArrows);
      checkArrows(); // Vérifier au montage
      
      // Vérifier après le chargement complet des images
      setTimeout(checkArrows, 1000);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkArrows);
      }
    };
  }, [items]);
  
  // Faire défiler vers la gauche
  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({
        left: -container.clientWidth + 100,
        behavior: 'smooth'
      });
    }
  };
  
  // Faire défiler vers la droite
  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({
        left: container.clientWidth - 100,
        behavior: 'smooth'
      });
    }
  };
  
  // Si pas d'éléments, ne rien afficher
  if (!items.length) {
    return null;
  }

  return (
    <section className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {viewMoreLink && (
          <Link 
            to={viewMoreLink} 
            className="text-primary hover:text-primary-light transition-colors font-medium"
          >
            Voir plus
          </Link>
        )}
      </div>
      
      <div className="relative">
        {/* Flèche gauche */}
        {showLeftArrow && (
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-full px-2 py-20 flex items-center justify-center bg-gradient-to-r from-background to-transparent"
            aria-label="Défiler vers la gauche"
          >
            <div className="bg-black/50 hover:bg-black/70 transition p-2 rounded-full">
              <ChevronLeftIcon className="w-6 h-6 text-white" />
            </div>
          </button>
        )}
        
        {/* Liste de médias défilante */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto hide-scrollbar snap-x gap-4 pb-4"
          style={{ scrollbarWidth: 'none' }}
        >
          {items.map((item, index) => (
            <div key={index} className="flex-none snap-start" style={{ width: '200px' }}>
              <MediaCard item={item} type={type} />
            </div>
          ))}
        </div>
        
        {/* Flèche droite */}
        {showRightArrow && (
          <button 
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-full px-2 py-20 flex items-center justify-center bg-gradient-to-l from-background to-transparent"
            aria-label="Défiler vers la droite"
          >
            <div className="bg-black/50 hover:bg-black/70 transition p-2 rounded-full">
              <ChevronRightIcon className="w-6 h-6 text-white" />
            </div>
          </button>
        )}
      </div>
    </section>
  );
};

export default MediaSection; 