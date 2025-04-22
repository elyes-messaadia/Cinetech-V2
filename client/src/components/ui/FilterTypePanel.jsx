import React from 'react';

const FilterTypePanel = ({ mediaType, onTypeChange }) => {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <span className="text-gray-300">Type:</span>
      <div className="flex space-x-2">
        <button
          onClick={() => onTypeChange('all')}
          className={`px-4 py-2 rounded ${
            mediaType === 'all' 
              ? 'bg-primary text-white' 
              : 'bg-background text-gray-300 border border-gray-700'
          }`}
        >
          Tous
        </button>
        <button
          onClick={() => onTypeChange('movie')}
          className={`px-4 py-2 rounded ${
            mediaType === 'movie' 
              ? 'bg-primary text-white' 
              : 'bg-background text-gray-300 border border-gray-700'
          }`}
        >
          Films
        </button>
        <button
          onClick={() => onTypeChange('tv')}
          className={`px-4 py-2 rounded ${
            mediaType === 'tv' 
              ? 'bg-primary text-white' 
              : 'bg-background text-gray-300 border border-gray-700'
          }`}
        >
          Séries
        </button>
      </div>
    </div>
  );
};

export default FilterTypePanel; 