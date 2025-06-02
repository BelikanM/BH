import React, { useState, useEffect, useCallback } from 'react';
import { useVideos } from '../hooks/useVideos';
import { useAuth } from '../context/AuthContext';
import { videoService } from '../services/videoService';
import VideoCard from '../components/VideoCard';
import AuthModal from '../components/AuthModal';
import { RefreshCw, Plus, TrendingUp, Users } from 'lucide-react';

const HomePage = () => {
    const { videos, loading, error, refresh, loadMore, hasMore } = useVideos(10);
    const { user } = useAuth();
    const [showAuth, setShowAuth] = useState(false);
    const [stats, setStats] = useState({ totalVideos: 0, totalUsers: 0 });
    const [refreshing, setRefreshing] = useState(false);

    // Charger les statistiques
    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            // Simuler des stats (vous pouvez créer un service dédié)
            setStats({
                totalVideos: videos.length || 0,
                totalUsers: Math.floor(Math.random() * 1000) + 500
            });
        } catch (error) {
            console.error('Erreur chargement stats:', error);
        }
    };

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await refresh();
        await loadStats();
        setRefreshing(false);
    }, [refresh]);

    const handleVideoView = useCallback(async (videoId) => {
        try {
            await videoService.incrementViews(videoId);
        } catch (error) {
            console.error('Erreur incrémentation vues:', error);
        }
    }, []);

    const handleCommentClick = (video) => {
        if (!user) {
            setShowAuth(true);
            return;
        }
        // Ouvrir modal de commentaires (à implémenter)
        console.log('Commentaires pour:', video.$id);
    };

    if (loading && videos.length === 0) {
        return (
            <div className="page-container">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Chargement du feed...</p>
                    <small>Récupération des dernières vidéos</small>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            {/* Header avec stats */}
            <div className="page-header">
                <div className="header-content">
                    <h1>🏠 Pour vous</h1>
                    <p>Découvrez les vidéos tendances</p>
                    
                    <div className="stats-bar">
                        <div className="stat-item">
                            <TrendingUp size={16} />
                            <span>{stats.totalVideos} vidéos</span>
                        </div>
                        <div className="stat-item">
                            <Users size={16} />
                            <span>{stats.totalUsers} créateurs</span>
                        </div>
                    </div>
                </div>
                
                <div className="header-actions">
                    <button 
                        onClick={handleRefresh} 
                        className={`refresh-button ${refreshing ? 'refreshing' : ''}`}
                        disabled={refreshing}
                    >
                        <RefreshCw size={20} />
                        {refreshing ? 'Actualisation...' : 'Actualiser'}
                    </button>
                    
                    {!user && (
                        <button 
                            onClick={() => setShowAuth(true)} 
                            className="auth-prompt-button"
                        >
                            <Plus size={20} />
                            Rejoindre
                        </button>
                    )}
                </div>
            </div>

            {/* Contenu principal */}
            {error && videos.length === 0 ? (
                <div className="error-container">
                    <span className="error-icon">⚠️</span>
                    <h3>Erreur de chargement</h3>
                    <p>{error}</p>
                    <button onClick={handleRefresh} className="retry-button">
                        <RefreshCw size={20} />
                        Réessayer
                    </button>
                </div>
            ) : videos.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📹</span>
                    <h3>Aucune vidéo disponible</h3>
                    <p>Soyez le premier à partager du contenu !</p>
                    {user && (
                        <button className="create-button">
                            <Plus size={20} />
                            Créer une vidéo
                        </button>
                    )}
                </div>
            ) : (
                <div className="video-feed">
                    {videos.map((video, index) => (
                        <VideoCard
                            key={`${video.$id}-${index}`}
                            video={video}
                            onComment={handleCommentClick}
                            onView={() => handleVideoView(video.$id)}
                            showStats={true}
                        />
                    ))}
                    
                    {/* Bouton charger plus */}
                    {hasMore && (
                        <div className="load-more-container">
                            <button 
                                onClick={loadMore} 
                                className="load-more-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="mini-spinner"></div>
                                        Chargement...
                                    </>
                                ) : (
                                    'Charger plus de vidéos'
                                )}
                            </button>
                        </div>
                    )}
                    
                    {!hasMore && videos.length > 0 && (
                        <div className="end-message">
                            <p>🎉 Vous avez vu toutes les vidéos !</p>
                            <button onClick={handleRefresh} className="refresh-small">
                                Actualiser le feed
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Modal d'authentification */}
            <AuthModal 
                isOpen={showAuth} 
                onClose={() => setShowAuth(false)} 
            />
        </div>
    );
};

export default HomePage;

