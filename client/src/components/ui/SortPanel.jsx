import React from 'react';

const SortPanel = ({ sortOptions, sortBy, sortOrder, onSortChange, onOrderChange }) => {
  return (
    <div className="flex items-center space-x-4">
      <span className="text-gray-300">Trier par:</span>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="bg-background border border-gray-700 text-white rounded p-2"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      <button
        onClick={() => onOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        className="p-2 bg-background border border-gray-700 rounded"
        aria-label={sortOrder === 'asc' ? 'Trier en ordre décroissant' : 'Trier en ordre croissant'}
      >
        {sortOrder === 'asc' ? '↑' : '↓'}
      </button>
    </div>
  );
};

export default SortPanel; 