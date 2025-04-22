import { useState, useEffect } from 'react';
import Carousel from '../components/ui/Carousel';
import MediaSection from '../components/ui/MediaSection';
import LoadingSpinner from '../components/common/LoadingSpinner';
import tmdbService from '../services/tmdbService';

const HomePage = () => {
  const [trendingMedia, setTrendingMedia] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularSeries, setPopularSeries] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les films et séries tendances pour le carrousel
        const trendingData = await tmdbService.getTrending();
        setTrendingMedia(trendingData.results.slice(0, 10)); // Limiter à 10 pour le carrousel
        
        // Récupérer les films populaires
        const moviesData = await tmdbService.getPopularMovies();
        setPopularMovies(moviesData.results);
        
        // Récupérer les séries populaires
        const seriesData = await tmdbService.getPopularSeries();
        setPopularSeries(seriesData.results);
        
        // Récupérer les films à venir
        const upcomingData = await tmdbService.getUpcomingMovies();
        setUpcomingMovies(upcomingData.results);
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des données :', err);
        setError('Une erreur est survenue lors du chargement des données.');
        setLoading(false);
      }
    };
    
    fetchHomePageData();
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
    <div className="min-h-screen bg-background text-white">
      {/* Carrousel en tête de page */}
      <section className="w-full">
        <Carousel items={trendingMedia} />
      </section>
      
      {/* Sections de médias */}
      <div className="container mx-auto px-4 py-8 space-y-12">
        <MediaSection 
          title="Films populaires" 
          items={popularMovies} 
          type="movie"
          viewMoreLink="/movies"
        />
        
        <MediaSection 
          title="Séries populaires" 
          items={popularSeries} 
          type="tv"
          viewMoreLink="/series"
        />
        
        <MediaSection 
          title="Films à venir" 
          items={upcomingMovies} 
          type="movie"
          viewMoreLink="/movies/upcoming"
        />
      </div>
    </div>
  );
};

export default HomePage; 