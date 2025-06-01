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
