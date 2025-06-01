import React from 'react';

const LivePage = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📹 Live</h1>
        <p>Page Live en développement</p>
      </div>
      
      <div className="page-content">
        <div className="placeholder-content">
          <span className="placeholder-icon">📹</span>
          <h2>Live</h2>
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

export default LivePage;
