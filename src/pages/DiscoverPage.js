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
