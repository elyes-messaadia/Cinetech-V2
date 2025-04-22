import { useState, useEffect } from 'react';
import tmdbService from '../services/tmdbService';
import MediaCard from '../components/ui/MediaCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SeriesPage = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);
        const data = await tmdbService.getPopularSeries();
        setSeries(data.results);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des séries:', err);
        setError('Une erreur est survenue lors du chargement des séries.');
        setLoading(false);
      }
    };
    
    fetchSeries();
  }, []);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Séries populaires</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {series.map((show) => (
          <MediaCard key={show.id} item={show} type="tv" />
        ))}
      </div>
    </div>
  );
};

export default SeriesPage; 