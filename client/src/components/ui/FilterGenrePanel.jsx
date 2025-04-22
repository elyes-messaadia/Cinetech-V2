import React from 'react';

const FilterGenrePanel = ({ genres, selectedGenreId, onGenreChange }) => {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <span className="text-gray-300">Genre:</span>
      <select
        value={selectedGenreId}
        onChange={(e) => onGenreChange(e.target.value)}
        className="px-4 py-2 rounded bg-background text-gray-300 border border-gray-700"
      >
        <option value="all">Tous les genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterGenrePanel; 