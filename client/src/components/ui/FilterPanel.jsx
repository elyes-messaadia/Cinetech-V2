import { useState, useEffect } from 'react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const FilterPanel = ({ genres, filters, onFilterChange, mediaType }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [showFilters, setShowFilters] = useState(true);
  const [years, setYears] = useState([]);
  
  // Générer les années pour le filtre (de l'année courante à 1900)
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearsArray = [];
    
    for (let year = currentYear; year >= 1900; year--) {
      yearsArray.push(year);
    }
    
    setYears(yearsArray);
  }, []);
  
  // Mettre à jour les filtres locaux quand les props changent
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  // Appliquer les filtres
  const applyFilters = () => {
    onFilterChange(localFilters);
  };
  
  // Réinitialiser les filtres
  const resetFilters = () => {
    const resetValues = {
      genres: [],
      year: '',
      minRating: 0
    };
    
    setLocalFilters(resetValues);
    onFilterChange(resetValues);
  };
  
  // Gérer les changements de genre
  const handleGenreChange = (genreId) => {
    const updatedGenres = localFilters.genres.includes(genreId)
      ? localFilters.genres.filter(id => id !== genreId)
      : [...localFilters.genres, genreId];
    
    setLocalFilters({
      ...localFilters,
      genres: updatedGenres
    });
  };
  
  // Gérer les changements d'année
  const handleYearChange = (e) => {
    setLocalFilters({
      ...localFilters,
      year: e.target.value
    });
  };
  
  // Gérer les changements de note minimale
  const handleRatingChange = (e) => {
    setLocalFilters({
      ...localFilters,
      minRating: parseFloat(e.target.value)
    });
  };
  
  // Basculer l'affichage des filtres sur mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div className="bg-background-light rounded-lg p-4">
      {/* Entête avec bouton de basculement sur mobile */}
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-xl font-semibold text-white">Filtres</h2>
        <button 
          onClick={toggleFilters} 
          className="block md:hidden text-gray-400 hover:text-white"
        >
          <AdjustmentsHorizontalIcon className="w-6 h-6" />
        </button>
      </div>
      
      {/* Conteneur de filtres (masquable sur mobile) */}
      <div className={`${showFilters ? 'block' : 'hidden'} md:block space-y-6`}>
        {/* Filtre de genres */}
        <div className="space-y-2">
          <h3 className="text-lg text-white">Genres</h3>
          <div className="max-h-60 overflow-y-auto pr-2 space-y-1">
            {genres.map((genre) => (
              <div key={genre.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`genre-${genre.id}`}
                  checked={localFilters.genres.includes(genre.id)}
                  onChange={() => handleGenreChange(genre.id)}
                  className="mr-2 h-4 w-4 rounded border-gray-600 text-primary focus:ring-primary bg-background"
                />
                <label htmlFor={`genre-${genre.id}`} className="text-gray-300 text-sm">
                  {genre.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Filtre d'année */}
        <div className="space-y-2">
          <h3 className="text-lg text-white">Année</h3>
          <select
            value={localFilters.year}
            onChange={handleYearChange}
            className="w-full bg-background border border-gray-600 rounded p-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Toutes les années</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        {/* Filtre de note */}
        <div className="space-y-2">
          <h3 className="text-lg text-white">Note minimale</h3>
          <div className="flex items-center justify-between">
            <input
              type="range"
              min="0"
              max="9"
              step="0.5"
              value={localFilters.minRating}
              onChange={handleRatingChange}
              className="w-full accent-primary"
            />
            <span className="ml-2 text-white min-w-[40px] text-center">
              {localFilters.minRating > 0 ? localFilters.minRating : 'Tous'}
            </span>
          </div>
        </div>
        
        {/* Boutons d'action */}
        <div className="flex flex-col space-y-2 pt-2">
          <button
            onClick={applyFilters}
            className="w-full py-2 bg-primary hover:bg-primary-dark text-white rounded transition-colors"
          >
            Appliquer
          </button>
          
          <button
            onClick={resetFilters}
            className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel; 