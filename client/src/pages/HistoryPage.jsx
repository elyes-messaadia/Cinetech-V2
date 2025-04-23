import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ClockIcon, TrashIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HistoryPage = () => {
  const { isAuthenticated } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'movies', 'tvshows'
  const [sortBy, setSortBy] = useState('date_watched'); // 'date_watched', 'name', 'rating'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  
  // Simulation de la récupération de l'historique
  // Dans un cas réel, cela viendrait d'une API
  useEffect(() => {
    const fetchHistory = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        
        // Simulation - à remplacer par un appel à l'API
        // Exemple: const data = await historyService.getHistory();
        
        // Données fictives pour la démonstration
        const dummyHistory = [
          {
            id: 1,
            tmdbId: 299534,
            mediaType: 'movie',
            title: 'Avengers: Endgame',
            posterPath: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
            overview: 'Après les événements dévastateurs d\'Infinity War, l\'univers est en ruine. Avec l\'aide des alliés restants, les Avengers se rassemblent pour annuler les actions de Thanos et rétablir l\'ordre dans l\'univers.',
            releaseDate: '2019-04-24',
            watchedAt: new Date('2023-05-15'),
            rating: 4.5,
            comment: 'Un film captivant avec une conclusion épique pour cette saga Marvel.'
          },
          {
            id: 2,
            tmdbId: 550,
            mediaType: 'movie',
            title: 'Fight Club',
            posterPath: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
            overview: 'Un employé de bureau insomniaque et un fabricant de savons forment un club de combat clandestin qui devient beaucoup plus.',
            releaseDate: '1999-10-15',
            watchedAt: new Date('2023-04-20'),
            rating: 5,
            comment: 'Chef-d\'œuvre intemporel qui mérite d\'être revu.'
          },
          {
            id: 3,
            tmdbId: 66732,
            mediaType: 'tv',
            title: 'Stranger Things',
            posterPath: '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
            overview: 'Quand un jeune garçon disparaît, une petite ville découvre un mystère impliquant des expériences secrètes, des forces surnaturelles et une étrange petite fille.',
            releaseDate: '2016-07-15',
            watchedAt: new Date('2023-03-10'),
            rating: 4,
            comment: 'Excellente ambiance des années 80, intrigue captivante.'
          },
          {
            id: 4,
            tmdbId: 1399,
            mediaType: 'tv',
            title: 'Game of Thrones',
            posterPath: '/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
            overview: 'Sept familles nobles luttent pour le contrôle du Trône de Fer dans le royaume déchiré de Westeros.',
            releaseDate: '2011-04-17',
            watchedAt: new Date('2023-02-05'),
            rating: 3.5,
            comment: 'Très bonne série malgré une fin décevante.'
          },
          {
            id: 5,
            tmdbId: 278,
            mediaType: 'movie',
            title: 'Les Évadés',
            posterPath: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
            overview: 'Deux hommes emprisonnés se lient d\'amitié sur plusieurs années, trouvant réconfort et rédemption à travers des actes de décence commune.',
            releaseDate: '1994-09-23',
            watchedAt: new Date('2023-01-20'),
            rating: 5,
            comment: 'Un des plus grands films de tous les temps, histoire magnifique.'
          }
        ];
        
        setHistory(dummyHistory);
      } catch (err) {
        console.error('Erreur lors du chargement de l\'historique:', err);
        setError('Une erreur est survenue lors du chargement de votre historique de visionnage.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, [isAuthenticated]);
  
  // Filtrer l'historique
  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'movies') return item.mediaType === 'movie';
    if (filter === 'tvshows') return item.mediaType === 'tv';
    return true;
  });
  
  // Trier l'historique
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (sortBy === 'date_watched') {
      return sortOrder === 'asc' 
        ? new Date(a.watchedAt) - new Date(b.watchedAt)
        : new Date(b.watchedAt) - new Date(a.watchedAt);
    }
    
    if (sortBy === 'name') {
      return sortOrder === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    
    if (sortBy === 'rating') {
      return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
    }
    
    return 0;
  });
  
  // Supprimer un élément de l'historique
  const handleRemoveFromHistory = (id) => {
    // Dans un cas réel, appel à l'API
    // Exemple: await historyService.removeFromHistory(id);
    setHistory(prev => prev.filter(item => item.id !== id));
  };
  
  // Formater une date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Afficher les étoiles de notation
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Étoiles pleines
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon key={`full-${i}`} className="w-5 h-5 text-yellow-500 fill-current" />
      );
    }
    
    // Demi-étoile si nécessaire
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <StarIcon className="w-5 h-5 text-gray-400" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <StarIcon className="w-5 h-5 text-yellow-500 fill-current" />
          </div>
        </div>
      );
    }
    
    // Étoiles vides
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="w-5 h-5 text-gray-400" />
      );
    }
    
    return <div className="flex">{stars}</div>;
  };
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Mon Historique</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
          {/* Filtres */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Filtrer:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-background border border-gray-700 text-white rounded p-2"
            >
              <option value="all">Tous</option>
              <option value="movies">Films</option>
              <option value="tvshows">Séries</option>
            </select>
          </div>
          
          {/* Tri */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Trier par:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-background border border-gray-700 text-white rounded p-2"
            >
              <option value="date_watched">Date de visionnage</option>
              <option value="name">Nom</option>
              <option value="rating">Note</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 bg-background border border-gray-700 rounded"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded">
          {error}
        </div>
      ) : sortedHistory.length === 0 ? (
        <div className="bg-background-light rounded-lg p-8 text-center">
          <ClockIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl text-white font-medium mb-2">Votre historique est vide</h2>
          <p className="text-gray-400 mb-6">
            Les films et séries que vous avez regardés apparaîtront ici.
          </p>
          <a 
            href="/movies" 
            className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded"
          >
            Explorer du contenu
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {sortedHistory.map(item => (
            <div 
              key={item.id} 
              className="bg-background-light rounded-lg overflow-hidden flex flex-col sm:flex-row"
            >
              {/* Affiche */}
              <div className="sm:w-32 md:w-48 flex-shrink-0">
                <img
                  src={`https://image.tmdb.org/t/p/w342${item.posterPath}`}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Détails */}
              <div className="p-4 flex-grow flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl text-white font-medium">
                      {item.title}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {new Date(item.releaseDate).getFullYear()} • {item.mediaType === 'movie' ? 'Film' : 'Série'}
                    </p>
                    <div className="mt-1 flex items-center">
                      {renderRatingStars(item.rating)}
                      <span className="ml-2 text-gray-300 text-sm">{item.rating}/5</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm text-gray-400 mr-2">
                      Visionné le {formatDate(item.watchedAt)}
                    </span>
                    <button
                      onClick={() => handleRemoveFromHistory(item.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mt-3 line-clamp-2">
                  {item.overview}
                </p>
                
                {item.comment && (
                  <div className="mt-3 bg-background/50 p-3 rounded border border-gray-700">
                    <h3 className="text-sm font-medium text-gray-300 mb-1">Votre commentaire:</h3>
                    <p className="text-gray-400 text-sm italic">"{item.comment}"</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage; 