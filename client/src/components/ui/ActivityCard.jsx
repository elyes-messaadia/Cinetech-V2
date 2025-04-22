import React from 'react';
import { Link } from 'react-router-dom';
import { ClockIcon, HeartIcon, EyeIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';

const ActivityCard = ({ activity }) => {
  const renderIcon = () => {
    switch (activity.type) {
      case 'favorite':
        return <HeartIcon className="w-5 h-5 text-red-500" />;
      case 'view':
        return <EyeIcon className="w-5 h-5 text-blue-500" />;
      case 'watchlist':
        return <BookmarkIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const renderActionText = () => {
    switch (activity.type) {
      case 'favorite':
        return 'a ajouté à ses favoris';
      case 'view':
        return 'a regardé';
      case 'watchlist':
        return 'a ajouté à sa liste à voir';
      default:
        return 'a interagi avec';
    }
  };

  const formattedDate = formatDistance(new Date(activity.date), new Date(), {
    addSuffix: true,
    locale: fr
  });

  return (
    <div className="bg-background rounded-lg p-4 flex items-start space-x-3 hover:bg-background-dark transition duration-200">
      <div className="bg-background-dark/50 p-2 rounded-full">
        {renderIcon()}
      </div>
      
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white font-medium">
              <span>Vous {renderActionText()}</span>{' '}
              <Link 
                to={`/${activity.mediaType}/${activity.mediaId}`}
                className="text-primary hover:text-primary-dark"
              >
                {activity.mediaTitle}
              </Link>
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {formattedDate}
            </p>
          </div>
          
          <div className="shrink-0 ml-4">
            <Link to={`/${activity.mediaType}/${activity.mediaId}`}>
              <img 
                src={`https://image.tmdb.org/t/p/w92${activity.posterPath}`}
                alt={activity.mediaTitle}
                className="w-12 h-16 object-cover rounded"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard; 