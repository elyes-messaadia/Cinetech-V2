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
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        console.log("Début du chargement des données de la page d'accueil");
        setLoading(true);
        setError(null);
        
        // Vérifier que la clé API TMDB est définie
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        if (!apiKey) {
          console.error("Clé API TMDB manquante");
          throw new Error('La clé API TMDB n\'est pas définie. Vérifiez votre fichier .env');
        }
        
        console.log("Utilisation de la clé API:", apiKey.substring(0, 5) + "...");
        
        // Récupérer les films et séries tendances pour le carrousel
        console.log("Récupération des tendances...");
        const trendingData = await tmdbService.getTrending();
        console.log("Tendances reçues:", trendingData?.results?.length || 0, "items");
        
        if (!trendingData || !trendingData.results) {
          console.error("Format de données invalide depuis l'API TMDB (tendances)");
          throw new Error('Format de données invalide depuis l\'API TMDB');
        }
        
        setTrendingMedia(trendingData.results.slice(0, 10)); // Limiter à 10 pour le carrousel
        
        // Récupérer les films populaires
        console.log("Récupération des films populaires...");
        const moviesData = await tmdbService.getPopularMovies();
        console.log("Films populaires reçus:", moviesData?.results?.length || 0, "items");
        
        if (moviesData && moviesData.results) {
          setPopularMovies(moviesData.results);
        }
        
        // Récupérer les séries populaires
        console.log("Récupération des séries populaires...");
        const seriesData = await tmdbService.getPopularSeries();
        console.log("Séries populaires reçues:", seriesData?.results?.length || 0, "items");
        
        if (seriesData && seriesData.results) {
          setPopularSeries(seriesData.results);
        }
        
        // Récupérer les films à venir
        console.log("Récupération des films à venir...");
        const upcomingData = await tmdbService.getUpcomingMovies();
        console.log("Films à venir reçus:", upcomingData?.results?.length || 0, "items");
        
        if (upcomingData && upcomingData.results) {
          setUpcomingMovies(upcomingData.results);
        }
        
        // Créer un résumé des données pour le débogage
        const debugSummary = {
          trendingCount: trendingData?.results?.length || 0,
          popularMoviesCount: moviesData?.results?.length || 0,
          popularSeriesCount: seriesData?.results?.length || 0,
          upcomingMoviesCount: upcomingData?.results?.length || 0,
          trendingSample: trendingData?.results?.[0] ? {
            id: trendingData.results[0].id,
            title: trendingData.results[0].title || trendingData.results[0].name,
            hasBackdrop: !!trendingData.results[0].backdrop_path,
            hasPoster: !!trendingData.results[0].poster_path
          } : null
        };
        
        setDebugInfo(debugSummary);
        console.log("Résumé des données:", debugSummary);
        
        setLoading(false);
        console.log("Chargement des données terminé avec succès");
      } catch (err) {
        console.error('Erreur lors du chargement des données :', err);
        setError(err.message || 'Une erreur est survenue lors du chargement des données.');
        setLoading(false);
      }
    };
    
    fetchHomePageData();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Erreur</h2>
          <p>{error}</p>
          <p className="mt-2 text-sm">Veuillez vérifier votre connexion internet et réessayer plus tard.</p>
          
          {debugInfo && (
            <div className="mt-4 p-4 bg-gray-800 rounded">
              <h3 className="font-bold mb-2">Informations de débogage:</h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Si aucun contenu n'a été chargé
  if (!trendingMedia.length && !popularMovies.length && !popularSeries.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-600 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Aucun contenu disponible</h2>
          <p>Nous n'avons pas pu charger les films et séries. Veuillez réessayer plus tard.</p>
          
          {debugInfo && (
            <div className="mt-4 p-4 bg-gray-800 rounded">
              <h3 className="font-bold mb-2">Informations de débogage:</h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Carrousel en tête de page */}
      {trendingMedia.length > 0 && (
        <section className="w-full">
          <Carousel items={trendingMedia} />
        </section>
      )}
      
      {/* Sections de médias */}
      <div className="container mx-auto px-4 py-8 space-y-12">
        {popularMovies.length > 0 && (
          <MediaSection 
            title="Films populaires" 
            items={popularMovies} 
            type="movie"
            viewMoreLink="/movies"
          />
        )}
        
        {popularSeries.length > 0 && (
          <MediaSection 
            title="Séries populaires" 
            items={popularSeries} 
            type="tv"
            viewMoreLink="/series"
          />
        )}
        
        {upcomingMovies.length > 0 && (
          <MediaSection 
            title="Films à venir" 
            items={upcomingMovies} 
            type="movie"
            viewMoreLink="/movies/upcoming"
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;