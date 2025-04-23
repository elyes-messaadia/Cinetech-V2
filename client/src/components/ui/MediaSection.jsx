import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import MediaCard from './MediaCard';

const MediaSection = ({ title, items = [], type, viewMoreLink, isLoading = false }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const containerRef = useRef(null);
  
  // Vérifier les possibilités de défilement
  useEffect(() => {
    const checkScrollability = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      setCanScrollLeft(scrollPosition > 0);
      setCanScrollRight(scrollPosition < container.scrollWidth - container.clientWidth - 10);
    };
    
    checkScrollability();
    
    // Observer les changements de taille pour mettre à jour l'état de défilement
    const resizeObserver = new ResizeObserver(() => {
      checkScrollability();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [scrollPosition, items]);
  
  // Gestion du défilement horizontal
  const scroll = (direction) => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const cardWidth = container.querySelector('div')?.offsetWidth + 16 || 300; // 16 = gap (4*4)
    const scrollAmount = cardWidth * 3; // Défiler par 3 cartes
    
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(
          container.scrollWidth - container.clientWidth,
          scrollPosition + scrollAmount
        );
    
    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    
    setScrollPosition(newPosition);
  };
  
  // Gestionnaire de défilement
  const handleScroll = (e) => {
    setScrollPosition(e.target.scrollLeft);
  };
  
  // Vérifier si la section est vide
  if (!items || !items.length) {
    if (isLoading) {
      return (
        <div className="py-4">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <div className="flex space-x-4 pb-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="w-64 h-96 bg-gray-800 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      );
    }
    
    return null;
  }

  return (
    <div className="relative">
      {/* En-tête de section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        
        {viewMoreLink && (
          <Link 
            to={viewMoreLink}
            className="text-primary hover:text-primary-light transition-colors"
          >
            Voir plus
          </Link>
        )}
      </div>
      
      {/* Conteneur de défilement */}
      <div className="relative">
        {/* Bouton de défilement gauche */}
        {items.length > 4 && (
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 border border-gray-700 text-white 
              ${canScrollLeft 
                ? 'hover:bg-primary hover:border-primary' 
                : 'opacity-50 cursor-not-allowed'}`}
            aria-label="Défiler vers la gauche"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
        )}
        
        {/* Liste des médias */}
        <div 
          ref={containerRef}
          className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
          onScroll={handleScroll}
        >
          {items.map(item => (
            <MediaCard 
              key={item.id || Math.random().toString(36).substr(2, 9)}
              media={item} 
              type={type || (item.title ? 'movie' : 'tv')} 
            />
          ))}
        </div>
        
        {/* Bouton de défilement droit */}
        {items.length > 4 && (
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 border border-gray-700 text-white 
              ${canScrollRight 
                ? 'hover:bg-primary hover:border-primary' 
                : 'opacity-50 cursor-not-allowed'}`}
            aria-label="Défiler vers la droite"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MediaSection; 