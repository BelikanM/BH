import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/NavBar';

// Import des pages
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import SearchPage from './pages/SearchPage';
import CreatePage from './pages/CreatePage';
import InboxPage from './pages/InboxPage';
import ProfilePage from './pages/ProfilePage';
import TrendingPage from './pages/TrendingPage';
import FollowingPage from './pages/FollowingPage';
import LikedPage from './pages/LikedPage';
import SavedPage from './pages/SavedPage';
import MusicPage from './pages/MusicPage';
import LivePage from './pages/LivePage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';

import './styles/global.css';
import './styles/NavBar.css';
import './styles/components.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavBar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/create" element={<CreatePage />} />
              <Route path="/inbox" element={<InboxPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/trending" element={<TrendingPage />} />
              <Route path="/following" element={<FollowingPage />} />
              <Route path="/liked" element={<LikedPage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/music" element={<MusicPage />} />
              <Route path="/live" element={<LivePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
