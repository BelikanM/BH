import React, { useState } from 'react';
import { useVideos } from '../hooks/useVideos';
import { useAuth } from '../context/AuthContext';
import VideoCard from '../components/VideoCard';
import AuthModal from '../components/AuthModal';
import { RefreshCw, Plus } from 'lucide-react';

const HomePage = () => {
    const { videos, loading, error, refresh, loadMore, hasMore } = useVideos();
    const { user } = useAuth();
    const [showAuth, setShowAuth] = useState(false);

    const handleCommentClick = (video) => {
        if (!user) {
            setShowAuth(true);
            return;
        }
        // Ouvrir modal de commentaires
        console.log('Commentaires pour:', video.$id);
    };

    if (loading && videos.length === 0) {
        return (
            <div className="page-container">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Chargement des vidéos...</p>
                </div>
            </div>
        );
    }

    if (error && videos.length === 0) {
        return (
            <div className="page-container">
                <div className="error-container">
                    <p>Erreur lors du chargement: {error}</p>
                    <button onClick={refresh} className="retry-button">
                        <RefreshCw size={20} />
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🏠 Pour vous</h1>
                <p>Découvrez les vidéos tendances</p>
                
                <div className="header-actions">
                    <button onClick={refresh} className="refresh-button">
                        <RefreshCw size={20} />
                        Actualiser
                    </button>
                    
                    {!user && (
                        <button 
                            onClick={() => setShowAuth(true)} 
                            className="auth-prompt-button"
                        >
                            <Plus size={20} />
                            Se connecter
                        </button>
                    )}
                </div>
            </div>
            
            <div className="video-feed">
                {videos.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📹</span>
                        <h3>Aucune vidéo disponible</h3>
                        <p>Soyez le premier à partager du contenu !</p>
                    </div>
                ) : (
                    <>
                        {videos.map((video) => (
                            <VideoCard
                                key={video.$id}
                                video={video}
                                onComment={handleCommentClick}
                            />
                        ))}
                        
                        {hasMore && (
                            <div className="load-more-container">
                                <button 
                                    onClick={loadMore} 
                                    className="load-more-button"
                                    disabled={loading}
                                >
                                    {loading ? 'Chargement...' : 'Charger plus'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <AuthModal 
                isOpen={showAuth} 
                onClose={() => setShowAuth(false)} 
            />
        </div>
    );
};

export default HomePage;
