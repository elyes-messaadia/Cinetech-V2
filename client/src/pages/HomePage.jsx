import { useState, useEffect } from 'react';
import Hero from '../components/ui/Hero';
import MediaCarousel from '../components/ui/MediaCarousel';

// Import fictif du service qui sera créé plus tard
// import { fetchTrending, fetchPopular } from '../services/tmdbService';

const HomePage = () => {
  const [featuredMedia, setFeaturedMedia] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTvShows, setTrendingTvShows] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Exemple de données statiques pour le développement
        // Ultérieurement, ces données seraient récupérées via l'API TMDb
        const mockFeaturedMedia = {
          id: 1,
          title: "Dune: Part Two",
          backdrop_path: "/rUoGZuscSG4fQP3I56ndadXRyBV.jpg",
          poster_path: "/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
          overview: "Paul Atreides s'allie à Chani et aux Fremen tout en préparant sa revanche contre ceux qui ont détruit sa famille. Alors qu'il doit faire un choix entre l'amour de sa vie et le destin de la galaxie, il s'efforce d'empêcher le terrible futur qu'il a entrevu.",
          release_date: "2024-03-01",
          vote_average: 8.2,
          genres: [
            { id: 878, name: "Science-Fiction" },
            { id: 12, name: "Aventure" }
          ]
        };
        
        const mockTrendingMovies = Array(10).fill().map((_, i) => ({
          id: i + 1,
          title: `Film Tendance ${i + 1}`,
          poster_path: "/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
          release_date: "2024-03-01",
          vote_average: 8.2 - (i * 0.2)
        }));
        
        const mockTrendingTvShows = Array(10).fill().map((_, i) => ({
          id: i + 1,
          name: `Série Tendance ${i + 1}`,
          poster_path: "/7lTnXOy0iNtBAdRP3TZvaKJ77F6.jpg",
          first_air_date: "2024-01-15",
          vote_average: 7.8 - (i * 0.1)
        }));
        
        const mockPopularMovies = Array(10).fill().map((_, i) => ({
          id: i + 20,
          title: `Film Populaire ${i + 1}`,
          poster_path: "/rz8GGX5Id2hCW1KzAIY4xwbQw1w.jpg",
          release_date: "2023-11-20",
          vote_average: 7.5 - (i * 0.1)
        }));
        
        // Simuler un délai d'API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setFeaturedMedia(mockFeaturedMedia);
        setTrendingMovies(mockTrendingMovies);
        setTrendingTvShows(mockTrendingTvShows);
        setPopularMovies(mockPopularMovies);
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        setError("Une erreur est survenue lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container-custom py-20 flex justify-center">
        <div className="animate-pulse text-white text-xl">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-20">
        <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      {featuredMedia && <Hero media={featuredMedia} />}
      
      <div className="py-6">
        <MediaCarousel 
          title="Films Tendances" 
          mediaList={trendingMovies} 
          mediaType="movie" 
        />
        
        <MediaCarousel 
          title="Séries Tendances" 
          mediaList={trendingTvShows} 
          mediaType="tv" 
        />
        
        <MediaCarousel 
          title="Films Populaires" 
          mediaList={popularMovies} 
          mediaType="movie" 
        />
      </div>
    </div>
  );
};

export default HomePage; 