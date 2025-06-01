#!/bin/bash

echo "🚀 Initialisation du frontend TikTok Clone..."

# Créer la structure des dossiers
echo "📁 Création de la structure des dossiers..."
mkdir -p src/components
mkdir -p src/pages
mkdir -p src/styles
mkdir -p src/utils
mkdir -p src/hooks
mkdir -p src/assets
mkdir -p src/context

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install react react-dom react-router-dom lucide-react
npm install --save-dev @vitejs/plugin-react vite

# Créer vite.config.js
echo "⚙️ Configuration de Vite..."
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist'
  }
})
EOF

# Mettre à jour package.json avec les scripts
echo "📝 Configuration des scripts..."
npm pkg set scripts.dev="vite"
npm pkg set scripts.build="vite build"
npm pkg set scripts.preview="vite preview"
npm pkg set scripts.start="vite"

# Créer index.html
echo "🌐 Création de index.html..."
cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#FF0050" />
  <meta name="description" content="TikTok Clone - Partagez vos vidéos créatives" />
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎵</text></svg>" />
  <title>TikTok Clone</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background: #fff;
      overflow-x: hidden;
    }
    
    #root {
      min-height: 100vh;
    }
  </style>
</head>
<body>
  <noscript>Vous devez activer JavaScript pour utiliser cette application.</noscript>
  <div id="root"></div>
</body>
</html>
EOF

# Créer src/index.js
echo "🎯 Création de index.js..."
cat > src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

# Créer src/App.js
echo "📱 Création de App.js..."
cat > src/App.js << 'EOF'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

import './styles/NavBar.css';

function App() {
  return (
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
  );
}

export default App;
EOF

# Créer NavBar.js
echo "🧭 Création de NavBar.js..."
cat > src/components/NavBar.js << 'EOF'
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Search,
  Plus,
  Heart,
  User,
  MessageCircle,
  Compass,
  Music,
  Bookmark,
  Settings,
  TrendingUp,
  Users,
  Video,
  Bell
} from 'lucide-react';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const handleNavigation = (path) => {
    setActiveTab(path);
    navigate(path);
  };

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Accueil',
      color: '#FF0050',
      activeColor: '#FF0050'
    },
    {
      path: '/discover',
      icon: Compass,
      label: 'Découvrir',
      color: '#00F2EA',
      activeColor: '#00F2EA'
    },
    {
      path: '/search',
      icon: Search,
      label: 'Rechercher',
      color: '#9C27B0',
      activeColor: '#9C27B0'
    },
    {
      path: '/create',
      icon: Plus,
      label: 'Créer',
      color: '#FF6B35',
      activeColor: '#FF6B35',
      special: true
    },
    {
      path: '/inbox',
      icon: MessageCircle,
      label: 'Messages',
      color: '#4CAF50',
      activeColor: '#4CAF50'
    },
    {
      path: '/profile',
      icon: User,
      label: 'Profil',
      color: '#2196F3',
      activeColor: '#2196F3'
    }
  ];

  const sidebarItems = [
    {
      path: '/trending',
      icon: TrendingUp,
      label: 'Tendances',
      color: '#FF5722'
    },
    {
      path: '/following',
      icon: Users,
      label: 'Abonnements',
      color: '#E91E63'
    },
    {
      path: '/liked',
      icon: Heart,
      label: 'Aimés',
      color: '#F44336'
    },
    {
      path: '/saved',
      icon: Bookmark,
      label: 'Favoris',
      color: '#FF9800'
    },
    {
      path: '/music',
      icon: Music,
      label: 'Musiques',
      color: '#9C27B0'
    },
    {
      path: '/live',
      icon: Video,
      label: 'Live',
      color: '#F44336'
    },
    {
      path: '/notifications',
      icon: Bell,
      label: 'Notifications',
      color: '#FF5722'
    },
    {
      path: '/settings',
      icon: Settings,
      label: 'Paramètres',
      color: '#607D8B'
    }
  ];

  return (
    <>
      {/* Navigation mobile (bottom) */}
      <nav className="mobile-nav">
        <div className="nav-container">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`nav-item ${isActive ? 'active' : ''} ${item.special ? 'special' : ''}`}
                aria-label={item.label}
              >
                <div className="icon-wrapper">
                  <IconComponent
                    size={item.special ? 28 : 24}
                    color={isActive ? item.activeColor : '#666'}
                    fill={isActive && !item.special ? item.activeColor : 'none'}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {item.special && (
                    <div className="plus-bg"></div>
                  )}
                </div>
                {isActive && <div className="active-indicator"></div>}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Sidebar desktop */}
      <aside className="desktop-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <Music size={32} color="#FF0050" />
            </div>
            <span className="logo-text">TikTok</span>
          </div>
        </div>

        <div className="sidebar-nav">
          {/* Navigation principale */}
          <div className="nav-section">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`sidebar-item ${isActive ? 'active' : ''} ${item.special ? 'special' : ''}`}
                >
                  <div className="sidebar-icon">
                    <IconComponent
                      size={24}
                      color={isActive ? item.activeColor : '#666'}
                      fill={isActive && !item.special ? item.activeColor : 'none'}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </div>
                  <span className="sidebar-label">{item.label}</span>
                  {isActive && <div className="sidebar-indicator"></div>}
                </button>
              );
            })}
          </div>

          {/* Séparateur */}
          <div className="sidebar-divider"></div>

          {/* Navigation secondaire */}
          <div className="nav-section">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                >
                  <div className="sidebar-icon">
                    <IconComponent
                      size={20}
                      color={isActive ? item.color : '#666'}
                      fill={isActive ? item.color : 'none'}
                      strokeWidth={isActive ? 2.5 : 1.5}
                    />
                  </div>
                  <span className="sidebar-label">{item.label}</span>
                  {isActive && <div className="sidebar-indicator"></div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer sidebar */}
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <User size={20} color="#666" />
            </div>
            <div className="user-details">
              <span className="username">@utilisateur</span>
              <span className="followers">1.2M abonnés</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default NavBar;
EOF

# Créer les pages
echo "📄 Création des pages..."

# HomePage
cat > src/pages/HomePage.js << 'EOF'
import React from 'react';
import { Heart, MessageCircle, Share, Bookmark, Music } from 'lucide-react';

const HomePage = () => {
  const videos = [
    {
      id: 1,
      user: '@marie_dance',
      description: 'Nouvelle chorégraphie sur cette musique 🔥 #dance #trending',
      music: 'Son original - Marie',
      likes: '12.5K',
      comments: '1.2K',
      shares: '856',
      avatar: '👩‍🦰'
    },
    {
      id: 2,
      user: '@chef_tom',
      description: 'Recette rapide de pâtes carbonara en 2 minutes ! 🍝',
      music: 'Musique de cuisine - Chef Tom',
      likes: '8.9K',
      comments: '567',
      shares: '234',
      avatar: '👨‍🍳'
    },
    {
      id: 3,
      user: '@pet_lover',
      description: 'Mon chat qui fait semblant de dormir 😸 #cats #funny',
      music: 'Musique mignonne - Pet Sounds',
      likes: '25.1K',
      comments: '2.1K',
      shares: '1.5K',
      avatar: '🐱'
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🏠 Pour vous</h1>
        <p>Découvrez les vidéos tendances</p>
      </div>
      
      <div className="video-feed">
        {videos.map((video) => (
          <div key={video.id} className="video-card">
            <div className="video-placeholder">
              <div className="video-overlay">
                <span className="video-emoji">🎬</span>
                <p>Vidéo #{video.id}</p>
              </div>
            </div>
            
            <div className="video-info">
              <div className="user-info">
                <span className="avatar">{video.avatar}</span>
                <div>
                  <h3>{video.user}</h3>
                  <p className="description">{video.description}</p>
                  <div className="music-info">
                    <Music size={16} />
                    <span>{video.music}</span>
                  </div>
                </div>
              </div>
              
              <div className="video-actions">
                <button className="action-btn">
                  <Heart size={20} />
                  <span>{video.likes}</span>
                </button>
                <button className="action-btn">
                  <MessageCircle size={20} />
                  <span>{video.comments}</span>
                </button>
                <button className="action-btn">
                  <Share size={20} />
                  <span>{video.shares}</span>
                </button>
                <button className="action-btn">
                  <Bookmark size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
EOF

# DiscoverPage
cat > src/pages/DiscoverPage.js << 'EOF'
import React from 'react';
import { TrendingUp, Hash, Music, Users } from 'lucide-react';

const DiscoverPage = () => {
  const categories = [
    { icon: '🔥', name: 'Tendances', count: '2.5M vidéos' },
    { icon: '💃', name: 'Danse', count: '1.8M vidéos' },
    { icon: '🍳', name: 'Cuisine', count: '950K vidéos' },
    { icon: '😂', name: 'Humour', count: '3.2M vidéos' },
    { icon: '🎵', name: 'Musique', count: '1.5M vidéos' },
    { icon: '🐾', name: 'Animaux', count: '800K vidéos' }
  ];

  const hashtags = [
    '#fyp', '#viral', '#trending', '#dance', '#funny', '#music', '#food', '#pets'
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🧭 Découvrir</h1>
        <p>Explorez les contenus populaires</p>
      </div>

      <div className="discover-content">
        <section className="section">
          <h2><TrendingUp size={24} /> Catégories populaires</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div key={index} className="category-card">
                <span className="category-icon">{category.icon}</span>
                <h3>{category.name}</h3>
                <p>{category.count}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2><Hash size={24} /> Hashtags tendances</h2>
          <div className="hashtags-container">
            {hashtags.map((hashtag, index) => (
              <span key={index} className="hashtag">{hashtag}</span>
            ))}
          </div>
        </section>

        <section className="section">
          <h2><Users size={24} /> Créateurs populaires</h2>
          <div className="creators-list">
            {['👩‍🎤 @singer_star', '🎭 @comedy_king', '🍳 @chef_master', '💃 @dance_queen'].map((creator, index) => (
              <div key={index} className="creator-item">
                <span>{creator}</span>
                <button className="follow-btn">Suivre</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DiscoverPage;
EOF

# SearchPage
cat > src/pages/SearchPage.js << 'EOF'
import React, { useState } from 'react';
import { Search, Filter, Clock } from 'lucide-react';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const recentSearches = [
    'danse trending', 'recette rapide', 'chat drôle', 'musique 2024'
  ];

  const suggestions = [
    '🔥 #fyp', '💃 #dance', '🍳 #cooking', '😂 #funny', '🎵 #music'
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🔍 Recherche</h1>
        <p>Trouvez des vidéos, utilisateurs et hashtags</p>
      </div>

      <div className="search-content">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Rechercher des vidéos, utilisateurs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="filter-btn">
            <Filter size={20} />
          </button>
        </div>

        {!searchQuery && (
          <>
            <section className="section">
              <h2><Clock size={20} /> Recherches récentes</h2>
              <div className="recent-searches">
                {recentSearches.map((search, index) => (
                  <div key={index} className="search-item">
                    <Clock size={16} />
                    <span>{search}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="section">
              <h2>💡 Suggestions</h2>
              <div className="suggestions">
                {suggestions.map((suggestion, index) => (
                  <span key={index} className="suggestion-tag">{suggestion}</span>
                ))}
              </div>
            </section>
          </>
        )}

        {searchQuery && (
          <div className="search-results">
            <p>Résultats pour "{searchQuery}"</p>
            <div className="results-placeholder">
              <span>🔍</span>
              <p>Fonctionnalité de recherche en développement</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
EOF

# CreatePage
cat > src/pages/CreatePage.js << 'EOF'
import React, { useState } from 'react';
import { Upload, Camera, Music, Palette, Sparkles } from 'lucide-react';

const CreatePage = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const createOptions = [
    {
      id: 'upload',
      icon: Upload,
      title: 'Télécharger une vidéo',
      description: 'Importez une vidéo depuis votre appareil',
      color: '#FF0050'
    },
    {
      id: 'camera',
      icon: Camera,
      title: 'Enregistrer',
      description: 'Filmez directement avec votre caméra',
      color: '#00F2EA'
    },
    {
      id: 'music',
      icon: Music,
      title: 'Ajouter de la musique',
      description: 'Choisissez un son pour votre vidéo',
      color: '#9C27B0'
    },
    {
      id: 'effects',
      icon: Sparkles,
      title: 'Effets spéciaux',
      description: 'Ajoutez des filtres et effets',
      color: '#FF6B35'
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>➕ Créer</h1>
        <p>Partagez votre créativité avec le monde</p>
      </div>

      <div className="create-content">
        <div className="create-options">
          {createOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.id}
                className={`create-option ${selectedOption === option.id ? 'selected' : ''}`}
                onClick={() => setSelectedOption(option.id)}
              >
                <div className="option-icon" style={{ backgroundColor: option.color }}>
                  <IconComponent size={32} color="white" />
                </div>
                <div className="option-info">
                  <h3>{option.title}</h3>
                  <p>{option.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {selectedOption && (
          <div className="create-workspace">
            <div className="workspace-placeholder">
              <Palette size={48} color="#ccc" />
              <h3>Zone de création</h3>
              <p>Fonctionnalité "{createOptions.find(o => o.id === selectedOption)?.title}" en développement</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePage;
EOF

# Créer les autres pages avec du contenu basique
pages=("InboxPage" "ProfilePage" "TrendingPage" "FollowingPage" "LikedPage" "SavedPage" "MusicPage" "LivePage" "NotificationsPage" "SettingsPage")
icons=("💬" "👤" "📈" "👥" "❤️" "🔖" "🎵" "📹" "🔔" "⚙️")
titles=("Messages" "Profil" "Tendances" "Abonnements" "Aimés" "Favoris" "Musiques" "Live" "Notifications" "Paramètres")

for i in "${!pages[@]}"; do
  page="${pages[$i]}"
  icon="${icons[$i]}"
  title="${titles[$i]}"
  
  cat > "src/pages/${page}.js" << EOF
import React from 'react';

const ${page} = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>${icon} ${title}</h1>
        <p>Page ${title} en développement</p>
      </div>
      
      <div className="page-content">
        <div className="placeholder-content">
          <span className="placeholder-icon">${icon}</span>
          <h2>${title}</h2>
          <p>Cette fonctionnalité sera bientôt disponible !</p>
          <div className="feature-list">
            <div className="feature-item">✨ Interface moderne</div>
            <div className="feature-item">🚀 Performance optimisée</div>
            <div className="feature-item">📱 Design responsive</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ${page};
EOF
done

# Créer les styles CSS
echo "🎨 Création des styles CSS..."

# Global CSS
cat > src/styles/global.css << 'EOF'
/* Variables globales */
:root {
  --primary-color: #FF0050;
  --secondary-color: #00F2EA;
  --accent-color: #FF6B35;
  --background: #fff;
  --surface: #f8f9fa;
  --text-primary: #161823;
  --text-secondary: #666;
  --border-color: #e1e1e1;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --border-radius: 12px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Reset et base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: var(--background);
  color: var(--text-primary);
  line-height: 1.6;
}

/* Layout principal */
.main-content {
  margin-left: 0;
  margin-bottom: 80px;
  min-height: 100vh;
}

@media (min-width: 768px) {
  .main-content {
    margin-left: 240px;
    margin-bottom: 0;
  }
}

/* Pages */
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 32px;
  text-align: center;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 8px;
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-header p {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

/* Contenu des pages */
.page-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.placeholder-content {
  text-align: center;
  padding: 60px 20px;
  background: var(--surface);
  border-radius: var(--border-radius);
  border: 2px dashed var(--border-color);
}

.placeholder-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 16px;
}

.placeholder-content h2 {
  font-size: 1.8rem;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.placeholder-content p {
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 300px;
  margin: 0 auto;
}

.feature-item {
  padding: 8px 16px;
  background: white;
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* Sections */
.section {
  margin-bottom: 32px;
}

.section h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.5rem;
  margin-bottom: 16px;
  color: var(--text-primary);
}

/* Responsive */
@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .placeholder-content {
    padding: 40px 16px;
  }
}
EOF

# NavBar CSS (version complète)
cat > src/styles/NavBar.css << 'EOF'
/* Variables CSS */
:root {
  --primary-color: #FF0050;
  --secondary-color: #00F2EA;
  --background-dark: #000;
  --background-light: #fff;
  --text-primary: #161823;
  --text-secondary: #666;
  --border-color: #e1e1e1;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --border-radius: 12px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Navigation mobile (bottom) */
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--background-light);
  border-top: 1px solid var(--border-color);
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: block;
}

.nav-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 16px;
  max-width: 600px;
  margin: 0 auto;
  height: 60px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  padding: 8px;
  border-radius: 12px;
  min-width: 48px;
  height: 48px;
}

.nav-item:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.nav-item.active {
  transform: translateY(-2px);
}

.nav-item.special {
  background: linear-gradient(45deg, #FF0050, #FF6B35);
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(255, 0, 80, 0.3);
}

.nav-item.special:hover {
  background: linear-gradient(45deg, #FF0050, #FF6B35);
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(255, 0, 80, 0.4);
}

.icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plus-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  z-index: -1;
}

.active-indicator {
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: var(--primary-color);
  border-radius: 2px;
  animation: slideIn 0.3s ease;
}

/* Sidebar desktop */
.desktop-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 240px;
  background: var(--background-light);
  border-right: 1px solid var(--border-color);
  box-shadow: var(--shadow);
  z-index: 1000;
  display: none;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, #FF0050, #FF6B35);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(255, 0, 80, 0.3);
}

.logo-text {
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(45deg, #FF0050, #FF6B35);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 0;
}

.nav-section {
  padding: 0 12px;
  margin-bottom: 16px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  cursor: pointer;
  transition: var(--transition);
  border-radius: var(--border-radius);
  position: relative;
  margin-bottom: 4px;
  text-align: left;
}

.sidebar-item:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: translateX(4px);
}

.sidebar-item.active {
  background: rgba(255, 0, 80, 0.1);
  transform: translateX(4px);
}

.sidebar-item.special {
  background: linear-gradient(45deg, rgba(255, 0, 80, 0.1), rgba(255, 107, 53, 0.1));
  border: 1px solid rgba(255, 0, 80, 0.2);
}

.sidebar-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.sidebar-label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  flex: 1;
}

.sidebar-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: var(--primary-color);
  border-radius: 0 4px 4px 0;
  animation: slideIn 0.3s ease;
}

.sidebar-divider {
  height: 1px;
  background: var(--border-color);
  margin: 16px 12px;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--border-color);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: var(--border-radius);
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, #FF0050, #00F2EA);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.followers {
  font-size: 12px;
  color: var(--text-secondary);
}

/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive */
@media (min-width: 768px) {
  .mobile-nav {
    display: none;
  }
  
  .desktop-sidebar {
    display: flex;
  }
}

@media (max-width: 767px) {
  .desktop-sidebar {
    display: none;
  }
  
  .mobile-nav {
    display: block;
  }
}

/* HomePage styles */
.video-feed {
  display: grid;
  gap: 24px;
  max-width: 600px;
  margin: 0 auto;
}

.video-card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: var(--transition);
}

.video-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.video-placeholder {
  height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.video-overlay {
  text-align: center;
  color: white;
}

.video-emoji {
  font-size: 3rem;
  display: block;
  margin-bottom: 8px;
}

.video-info {
  padding: 16px;
}

.user-info {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.avatar {
  font-size: 2rem;
}

.user-info h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.description {
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.music-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.video-actions {
  display: flex;
  justify-content: space-around;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  transition: var(--transition);
  padding: 8px;
  border-radius: 8px;
}

.action-btn:hover {
  color: var(--primary-color);
  background: rgba(255, 0, 80, 0.1);
}

.action-btn span {
  font-size: 0.8rem;
  font-weight: 500;
}

/* DiscoverPage styles */
.discover-content {
  max-width: 800px;
  margin: 0 auto;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.category-card {
  background: white;
  padding: 24px;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  text-align: center;
  transition: var(--transition);
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.category-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 12px;
}

.category-card h3 {
  font-size: 1.2rem;
  margin-bottom: 8px;
}

.category-card p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.hashtags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hashtag {
  background: var(--surface);
  padding: 8px 16px;
  border-radius: 20px;
  color: var(--primary-color);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.hashtag:hover {
  background: var(--primary-color);
  color: white;
}

.creators-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.creator-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.follow-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
}

.follow-btn:hover {
  background: #e6004a;
}

/* SearchPage styles */
.search-content {
  max-width: 600px;
  margin: 0 auto;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 12px 16px;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  margin-bottom: 24px;
}

.search-bar input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  background: transparent;
}

.filter-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 4px;
}

.recent-searches {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition);
}

.search-item:hover {
  background: var(--surface);
}

.suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.suggestion-tag {
  background: var(--surface);
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: var(--transition);
}

.suggestion-tag:hover {
  background: var(--primary-color);
  color: white;
}

.search-results {
  text-align: center;
  padding: 40px 20px;
}

.results-placeholder {
  background: var(--surface);
  padding: 40px;
  border-radius: var(--border-radius);
  border: 2px dashed var(--border-color);
}

.results-placeholder span {
  font-size: 3rem;
  display: block;
  margin-bottom: 16px;
}

/* CreatePage styles */
.create-content {
  max-width: 800px;
  margin: 0 auto;
}

.create-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.create-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  text-align: left;
}

.create-option:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.create-option.selected {
  border-color: var(--primary-color);
  background: rgba(255, 0, 80, 0.05);
}

.option-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.option-info h3 {
  font-size: 1.2rem;
  margin-bottom: 4px;
}

.option-info p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.create-workspace {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.workspace-placeholder {
  padding: 60px 20px;
  text-align: center;
  background: var(--surface);
}

.workspace-placeholder h3 {
  margin: 16px 0 8px;
  font-size: 1.5rem;
}

.workspace-placeholder p {
  color: var(--text-secondary);
}
EOF

echo "✅ Structure frontend créée avec succès !"
echo ""
echo "📁 Structure créée :"
echo "   ├── src/"
echo "   │   ├── components/NavBar.js"
echo "   │   ├── pages/ (14 pages)"
echo "   │   ├── styles/ (CSS complet)"
echo "   │   ├── utils/"
echo "   │   ├── hooks/"
echo "   │   └── context/"
echo "   ├── public/index.html"
echo "   └── vite.config.js"
echo ""
echo "🚀 Pour lancer l'application :"
echo "   npm run dev"
echo ""
echo "🎉 Votre TikTok Clone frontend est prêt !"
EOF

# Rendre le script exécutable
chmod +x setup-frontend.sh

echo "✅ Script setup-frontend.sh créé !"
echo ""
echo "🚀 Pour exécuter le script :"
echo "   ./setup-frontend.sh"
echo ""
echo "📋 Le script va :"
echo "   ✅ Créer toute la structure des dossiers"
echo "   ✅ Installer toutes les dépendances"
echo "   ✅ Générer 14 pages avec contenu"
echo "   ✅ Créer NavBar complète avec icônes"
echo "   ✅ Configurer Vite et les styles CSS"
echo "   ✅ Préparer l'application prête à lancer"

