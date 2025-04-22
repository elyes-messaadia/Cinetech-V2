import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import SeriesPage from './pages/SeriesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import DetailPage from './pages/DetailPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './context/AuthContext';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy loading des composants moins critiques
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const WatchlistPage = lazy(() => import('./pages/WatchlistPage'));
const DiscoverPage = lazy(() => import('./pages/DiscoverPage'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Suspense fallback={<div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="movies" element={<MoviesPage />} />
              <Route path="series" element={<SeriesPage />} />
              <Route path="movie/:id" element={<MovieDetailPage />} />
              <Route path="tv/:id" element={<DetailPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="discover" element={<DiscoverPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="watchlist" element={<WatchlistPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
