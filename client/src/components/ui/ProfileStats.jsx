import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, FilmIcon, TvIcon, ClockIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';

const StatCard = ({ icon, label, value, bgColor }) => (
  <div className="bg-background rounded-lg p-4 flex items-center">
    <div className={`${bgColor} p-3 rounded-full mr-4`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-white text-xl font-bold">{value}</p>
    </div>
  </div>
);

const ProfileStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <StatCard 
        icon={<HeartIcon className="w-6 h-6 text-red-500" />}
        label="Total favoris"
        value={stats.totalFavorites || 0}
        bgColor="bg-background-dark/50"
      />
      
      <StatCard 
        icon={<FilmIcon className="w-6 h-6 text-primary" />}
        label="Films favoris"
        value={stats.movies || 0}
        bgColor="bg-background-dark/50"
      />
      
      <StatCard 
        icon={<TvIcon className="w-6 h-6 text-blue-500" />}
        label="Séries favorites"
        value={stats.tvShows || 0}
        bgColor="bg-background-dark/50"
      />
      
      <StatCard 
        icon={<ClockIcon className="w-6 h-6 text-yellow-500" />}
        label="Films/séries vus"
        value={stats.watched || 0}
        bgColor="bg-background-dark/50"
      />
      
      <StatCard 
        icon={<BookmarkIcon className="w-6 h-6 text-green-500" />}
        label="À voir"
        value={stats.watchlist || 0}
        bgColor="bg-background-dark/50"
      />
      
      <div className="mt-6 grid grid-cols-2 gap-2">
        <Link 
          to="/favorites" 
          className="block text-center px-3 py-2 bg-background-dark hover:bg-background-dark/80 text-white rounded"
        >
          Mes favoris
        </Link>
        <Link 
          to="/watchlist" 
          className="block text-center px-3 py-2 bg-background-dark hover:bg-background-dark/80 text-white rounded"
        >
          Ma liste à voir
        </Link>
      </div>
    </div>
  );
};

export default ProfileStats; 