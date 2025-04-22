import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MediaCard from '../components/ui/MediaCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ClockIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const WatchlistPage = () => {
  const { isAuthenticated } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'movies', 'tvshows'
  const [sortBy, setSortBy] = useState('date_added'); // 'date_added', 'name', 'year'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  
  // Simulation de la récupération de la watchlist
  // Dans un cas réel, cela viendrait d'une API
  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        
        // Simulation - à remplacer par un appel à l'API
        // Exemple: const data = await watchlistService.getWatchlist();
        
        // Données fictives pour la démonstration
        const dummyWatchlist = [
          {
            id: 1,
            tmdbId: 550,
            mediaType: 'movie',
            title: 'Fight Club',
            posterPath: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
            overview: 'Un employé de bureau insomniaque et un fabricant de savons forment un club de combat clandestin qui devient beaucoup plus.',
            releaseDate: '1999-10-15',
            addedAt: new Date('2023-01-15'),
            priority: 'medium'
          },
          {
            id: 2,
            tmdbId: 278,
            mediaType: 'movie',
            title: 'Les Évadés',
            posterPath: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
            overview: 'Deux hommes emprisonnés se lient d\'amitié sur plusieurs années, trouvant réconfort et rédemption à travers des actes de décence commune.',
            releaseDate: '1994-09-23',
            addedAt: new Date('2023-02-20'),
            priority: 'high'
          },
          {
            id: 3,
            tmdbId: 66732,
            mediaType: 'tv',
            title: 'Stranger Things',
            posterPath: '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
            overview: 'Quand un jeune garçon disparaît, une petite ville découvre un mystère impliquant des expériences secrètes, des forces surnaturelles et une étrange petite fille.',
            releaseDate: '2016-07-15',
            addedAt: new Date('2023-03-10'),
            priority: 'low'
          },
          {
            id: 4,
            tmdbId: 1399,
            mediaType: 'tv',
            title: 'Game of Thrones',
            posterPath: '/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
            overview: 'Sept familles nobles luttent pour le contrôle du Trône de Fer dans le royaume déchiré de Westeros.',
            releaseDate: '2011-04-17',
            addedAt: new Date('2023-01-05'),
            priority: 'medium'
          },
          {
            id: 5,
            tmdbId: 299534,
            mediaType: 'movie',
            title: 'Avengers: Endgame',
            posterPath: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
            overview: 'Après les événements dévastateurs d\'Infinity War, l\'univers est en ruine. Avec l\'aide des alliés restants, les Avengers se rassemblent pour annuler les actions de Thanos et rétablir l\'ordre dans l\'univers.',
            releaseDate: '2019-04-24',
            addedAt: new Date('2023-04-02'),
            priority: 'high'
          }
        ];
        
        setWatchlist(dummyWatchlist);
      } catch (err) {
        console.error('Erreur lors du chargement de la watchlist:', err);
        setError('Une erreur est survenue lors du chargement de votre watchlist.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWatchlist();
  }, [isAuthenticated]);
  
  // Filtrer la watchlist
  const filteredWatchlist = watchlist.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'movies') return item.mediaType === 'movie';
    if (filter === 'tvshows') return item.mediaType === 'tv';
    return true;
  });
  
  // Trier la watchlist
  const sortedWatchlist = [...filteredWatchlist].sort((a, b) => {
    if (sortBy === 'date_added') {
      return sortOrder === 'asc' 
        ? new Date(a.addedAt) - new Date(b.addedAt)
        : new Date(b.addedAt) - new Date(a.addedAt);
    }
    
    if (sortBy === 'name') {
      return sortOrder === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    
    if (sortBy === 'year') {
      const yearA = new Date(a.releaseDate).getFullYear();
      const yearB = new Date(b.releaseDate).getFullYear();
      return sortOrder === 'asc' ? yearA - yearB : yearB - yearA;
    }
    
    return 0;
  });
  
  // Supprimer un élément de la watchlist
  const handleRemoveFromWatchlist = (id) => {
    // Dans un cas réel, appel à l'API
    // Exemple: await watchlistService.removeFromWatchlist(id);
    setWatchlist(prev => prev.filter(item => item.id !== id));
  };
  
  // Changer la priorité d'un élément
  const handleChangePriority = (id, newPriority) => {
    // Dans un cas réel, appel à l'API
    // Exemple: await watchlistService.updatePriority(id, newPriority);
    setWatchlist(prev => prev.map(item => 
      item.id === id ? { ...item, priority: newPriority } : item
    ));
  };
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Ma Watchlist</h1>
        
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
              <option value="date_added">Date d'ajout</option>
              <option value="name">Nom</option>
              <option value="year">Année</option>
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
      ) : sortedWatchlist.length === 0 ? (
        <div className="bg-background-light rounded-lg p-8 text-center">
          <ClockIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl text-white font-medium mb-2">Votre watchlist est vide</h2>
          <p className="text-gray-400 mb-6">
            Ajoutez des films et des séries à votre watchlist pour les retrouver facilement plus tard.
          </p>
          <a 
            href="/movies" 
            className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Découvrir des films
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {sortedWatchlist.map(item => (
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
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl text-white font-medium">
                        {item.title}
                      </h2>
                      <p className="text-sm text-gray-400">
                        {new Date(item.releaseDate).getFullYear()} • {item.mediaType === 'movie' ? 'Film' : 'Série'}
                      </p>
                    </div>
                    
                    <div className="flex items-center">
                      {/* Badge de priorité */}
                      <span className={`px-2 py-1 text-xs rounded-full mr-2 ${
                        item.priority === 'high' 
                          ? 'bg-red-500/20 text-red-500' 
                          : item.priority === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-blue-500/20 text-blue-500'
                      }`}>
                        {item.priority === 'high' 
                          ? 'Priorité haute' 
                          : item.priority === 'medium'
                            ? 'Priorité moyenne'
                            : 'Priorité basse'}
                      </span>
                      
                      {/* Bouton supprimer */}
                      <button
                        onClick={() => handleRemoveFromWatchlist(item.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                    {item.overview}
                  </p>
                </div>
                
                <div className="mt-4 flex flex-wrap justify-between items-center">
                  <div className="text-xs text-gray-400">
                    Ajouté le {new Date(item.addedAt).toLocaleDateString('fr-FR')}
                  </div>
                  
                  <div className="flex items-center mt-2 sm:mt-0">
                    <span className="text-xs text-gray-400 mr-2">Priorité:</span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleChangePriority(item.id, 'low')}
                        className={`w-6 h-6 rounded-full ${
                          item.priority === 'low' 
                            ? 'bg-blue-500' 
                            : 'bg-blue-500/30 hover:bg-blue-500/50'
                        }`}
                      ></button>
                      <button
                        onClick={() => handleChangePriority(item.id, 'medium')}
                        className={`w-6 h-6 rounded-full ${
                          item.priority === 'medium' 
                            ? 'bg-yellow-500' 
                            : 'bg-yellow-500/30 hover:bg-yellow-500/50'
                        }`}
                      ></button>
                      <button
                        onClick={() => handleChangePriority(item.id, 'high')}
                        className={`w-6 h-6 rounded-full ${
                          item.priority === 'high' 
                            ? 'bg-red-500' 
                            : 'bg-red-500/30 hover:bg-red-500/50'
                        }`}
                      ></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage; 