import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { followService } from '../services/followService';
import { videoService } from '../services/videoService';
import { databases, DATABASE_ID, COLLECTIONS, Query } from '../services/appwrite';
import { 
    Users, 
    UserPlus, 
    UserMinus, 
    Search, 
    Filter,
    TrendingUp,
    Clock,
    Heart,
    MessageCircle,
    Share,
    MoreHorizontal,
    Bell,
    BellOff,
    Star,
    Zap
} from 'lucide-react';
import VideoCard from '../components/VideoCard';

const FollowingPage = () => {
    const { user, userProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('feed'); // feed, following, followers, suggestions
    const [followingFeed, setFollowingFeed] = useState([]);
    const [followingList, setFollowingList] = useState([]);
    const [followersList, setFollowersList] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, verified, recent, active
    const [notifications, setNotifications] = useState({});

    useEffect(() => {
        if (user) {
            loadFollowingData();
        }
    }, [user]);

    const loadFollowingData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                loadFollowingFeed(),
                loadFollowingList(),
                loadFollowersList(),
                loadSuggestions(),
                loadNotificationSettings()
            ]);
        } catch (error) {
            console.error('Erreur chargement données following:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadFollowingFeed = async () => {
        try {
            // Récupérer la liste des utilisateurs suivis
            const followingResult = await followService.getFollowing(user.$id);
            if (!followingResult.success) return;

            const followingIds = followingResult.following.map(f => f.$id);
            if (followingIds.length === 0) return;

            // Récupérer les vidéos des utilisateurs suivis
            const feedVideos = [];
            for (const userId of followingIds) {
                try {
                    const userVideos = await videoService.getUserVideos(userId, 5);
                    if (userVideos.success) {
                        const videosWithUser = userVideos.videos.map(video => ({
                            ...video,
                            user: followingResult.following.find(f => f.$id === userId)
                        }));
                        feedVideos.push(...videosWithUser);
                    }
                } catch (error) {
                    console.error(`Erreur chargement vidéos pour ${userId}:`, error);
                }
            }

            // Trier par date de création
            feedVideos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setFollowingFeed(feedVideos);
        } catch (error) {
            console.error('Erreur chargement feed following:', error);
        }
    };

    const loadFollowingList = async () => {
        try {
            const result = await followService.getFollowing(user.$id);
            if (result.success) {
                // Enrichir avec des données supplémentaires
                const enrichedFollowing = await Promise.all(
                    result.following.map(async (followedUser) => {
                        try {
                            // Récupérer les vidéos récentes
                            const recentVideos = await videoService.getUserVideos(followedUser.$id, 3);
                            
                            // Calculer l'activité récente
                            const lastActivity = await getLastActivity(followedUser.$id);
                            
                            return {
                                ...followedUser,
                                recentVideos: recentVideos.success ? recentVideos.videos : [],
                                lastActivity,
                                isActive: isUserActive(lastActivity)
                            };
                        } catch (error) {
                            return {
                                ...followedUser,
                                recentVideos: [],
                                lastActivity: null,
                                isActive: false
                            };
                        }
                    })
                );

                setFollowingList(enrichedFollowing);
            }
        } catch (error) {
            console.error('Erreur chargement liste following:', error);
        }
    };

    const loadFollowersList = async () => {
        try {
            const result = await followService.getFollowers(user.$id);
            if (result.success) {
                // Vérifier qui suit en retour
                const enrichedFollowers = await Promise.all(
                    result.followers.map(async (follower) => {
                        const isFollowingBack = await followService.checkIfFollowing(user.$id, follower.$id);
                        return {
                            ...follower,
                            isFollowingBack
                        };
                    })
                );

                setFollowersList(enrichedFollowers);
            }
        } catch (error) {
            console.error('Erreur chargement liste followers:', error);
        }
    };

    const loadSuggestions = async () => {
        try {
            // Algorithme de suggestion simple
            // 1. Utilisateurs populaires
            const popularUsers = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.USERS,
                [
                    Query.orderDesc('followersCount'),
                    Query.limit(20)
                ]
            );

            // 2. Filtrer ceux déjà suivis
            const followingResult = await followService.getFollowing(user.$id);
            const followingIds = followingResult.success ? 
                followingResult.following.map(f => f.$id) : [];

            const filteredSuggestions = popularUsers.documents.filter(
                u => u.$id !== user.$id && !followingIds.includes(u.$id)
            );

            // 3. Enrichir avec raisons de suggestion
            const enrichedSuggestions = filteredSuggestions.map(suggestion => ({
                ...suggestion,
                reason: getSuggestionReason(suggestion),
                mutualFollows: Math.floor(Math.random() * 10), // Simulé
                similarity: Math.floor(Math.random() * 100) // Simulé
            }));

            setSuggestions(enrichedSuggestions.slice(0, 10));
        } catch (error) {
            console.error('Erreur chargement suggestions:', error);
        }
    };

    const loadNotificationSettings = async () => {
        try {
            // Charger les paramètres de notification pour chaque utilisateur suivi
            const followingResult = await followService.getFollowing(user.$id);
            if (followingResult.success) {
                const notifSettings = {};
                followingResult.following.forEach(user => {
                    // Simuler les paramètres (dans une vraie app, récupérer depuis la DB)
                    notifSettings[user.$id] = Math.random() > 0.5;
                });
                setNotifications(notifSettings);
            }
        } catch (error) {
            console.error('Erreur chargement paramètres notifications:', error);
        }
    };

    const getLastActivity = async (userId) => {
        try {
            const recentVideos = await videoService.getUserVideos(userId, 1);
            if (recentVideos.success && recentVideos.videos.length > 0) {
                return recentVideos.videos[0].createdAt;
            }
            return null;
        } catch (error) {
            return null;
        }
    };

    const isUserActive = (lastActivity) => {
        if (!lastActivity) return false;
        const daysSinceActivity = (new Date() - new Date(lastActivity)) / (1000 * 60 * 60 * 24);
        return daysSinceActivity <= 7; // Actif si activité dans les 7 derniers jours
    };

    const getSuggestionReason = (user) => {
        const reasons = [
            'Populaire dans votre région',
            'Contenu similaire à vos goûts',
            'Suivi par vos amis',
            'Créateur en tendance',
            'Nouveau sur la plateforme'
        ];
        return reasons[Math.floor(Math.random() * reasons.length)];
    };

    const handleFollow = async (userId) => {
        try {
            const result = await followService.toggleFollow(user.$id, userId);
            if (result.success) {
                // Mettre à jour les listes
                await loadFollowingData();
            }
        } catch (error) {
            console.error('Erreur toggle follow:', error);
        }
    };

    const toggleNotifications = async (userId) => {
        setNotifications(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }));
        // Ici vous sauvegarderiez en base
    };

    const getFilteredList = (list) => {
        let filtered = list;

        // Filtrer par recherche
        if (searchQuery) {
            filtered = filtered.filter(user => 
                user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.username?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filtrer par type
        switch (filterType) {
            case 'verified':
                filtered = filtered.filter(user => user.isVerified);
                break;
            case 'recent':
                filtered = filtered.filter(user => user.isActive);
                break;
            case 'active':
                filtered = filtered.filter(user => user.lastActivity);
                break;
        }

        return filtered;
    };

    const formatLastActivity = (lastActivity) => {
        if (!lastActivity) return 'Aucune activité récente';
        
        const days = Math.floor((new Date() - new Date(lastActivity)) / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Actif aujourd\'hui';
        if (days === 1) return 'Actif hier';
        if (days < 7) return `Actif il y a ${days} jours`;
        return 'Inactif depuis plus d\'une semaine';
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num?.toString() || '0';
    };

    if (!user) {
        return (
            <div className="page-container">
                <div className="auth-required">
                    <span className="auth-icon">🔒</span>
                    <h3>Connexion requise</h3>
                    <p>Connectez-vous pour gérer vos abonnements</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Chargement de vos abonnements...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            {/* Header */}
            <div className="following-header">
                <div className="header-content">
                    <h1><Users size={28} /> Abonnements</h1>
                    <div className="follow-stats">
                        <span>{followingList.length} abonnements</span>
                        <span>{followersList.length} abonnés</span>
                    </div>
                </div>

                {/* Recherche et filtres */}
                <div className="header-controls">
                    <div className="search-bar">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Rechercher des utilisateurs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">Tous</option>
                        <option value="verified">Vérifiés</option>
                        <option value="recent">Actifs récemment</option>
                        <option value="active">Avec activité</option>
                    </select>
                </div>
            </div>

            {/* Onglets */}
            <div className="following-tabs">
                <button 
                    className={activeTab === 'feed' ? 'active' : ''}
                    onClick={() => setActiveTab('feed')}
                >
                    <Zap size={16} />
                    Feed ({followingFeed.length})
                </button>
                <button 
                    className={activeTab === 'following' ? 'active' : ''}
                    onClick={() => setActiveTab('following')}
                >
                    <Heart size={16} />
                    Abonnements ({followingList.length})
                </button>
                <button 
                    className={activeTab === 'followers' ? 'active' : ''}
                    onClick={() => setActiveTab('followers')}
                >
                    <Users size={16} />
                    Abonnés ({followersList.length})
                </button>
                <button 
                    className={activeTab === 'suggestions' ? 'active' : ''}
                    onClick={() => setActiveTab('suggestions')}
                >
                    <UserPlus size={16} />
                    Suggestions ({suggestions.length})
                </button>
            </div>

            {/* Contenu */}
            <div className="following-content">
                {activeTab === 'feed' && (
                    <div className="following-feed">
                        {followingFeed.length === 0 ? (
                            <div className="empty-state">
                                <span className="empty-icon">📱</span>
                                <h3>Aucun contenu</h3>
                                <p>Suivez des créateurs pour voir leur contenu ici</p>
                                <button 
                                    onClick={() => setActiveTab('suggestions')}
                                    className="suggestion-button"
                                >
                                    Découvrir des créateurs
                                </button>
                            </div>
                        ) : (
                            <div className="video-feed">
                                {followingFeed.map((video) => (
                                    <div key={video.$id} className="feed-item">
                                        <div className="feed-header">
                                            <div className="user-info">
                                                <div className="user-avatar">
                                                    {video.user?.profilePicture ? (
                                                        <img src={video.user.profilePicture} alt={video.user.displayName} />
                                                    ) : (
                                                        <span>{video.user?.displayName?.[0] || '👤'}</span>
                                                    )}
                                                </div>
                                                <div className="user-details">
                                                    <h4>{video.user?.displayName}</h4>
                                                    <p>@{video.user?.username}</p>
                                                    <span className="post-time">
                                                        <Clock size={12} />
                                                        {new Date(video.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => toggleNotifications(video.user?.$id)}
                                                className="notification-toggle"
                                            >
                                                {notifications[video.user?.$id] ? 
                                                    <Bell size={16} /> : <BellOff size={16} />
                                                }
                                            </button>
                                        </div>
                                        <VideoCard video={video} compact={false} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'following' && (
                    <div className="following-list">
                        {getFilteredList(followingList).map((followedUser) => (
                            <div key={followedUser.$id} className="user-card">
                                <div className="user-main">
                                    <div className="user-avatar">
                                        {followedUser.profilePicture ? (
                                            <img src={followedUser.profilePicture} alt={followedUser.displayName} />
                                        ) : (
                                            <span>{followedUser.displayName?.[0] || '👤'}</span>
                                        )}
                                        {followedUser.isVerified && <div className="verified-badge">✓</div>}
                                        {followedUser.isActive && <div className="active-indicator"></div>}
                                    </div>
                                    
                                    <div className="user-info">
                                        <h4>{followedUser.displayName}</h4>
                                        <p>@{followedUser.username}</p>
                                        <div className="user-stats">
                                            <span>{formatNumber(followedUser.followersCount || 0)} abonnés</span>
                                            <span>{followedUser.recentVideos.length} vidéos récentes</span>
                                        </div>
                                        <p className="last-activity">
                                            {formatLastActivity(followedUser.lastActivity)}
                                        </p>
                                    </div>
                                </div>

                                <div className="user-actions">
                                    <button 
                                        onClick={() => toggleNotifications(followedUser.$id)}
                                        className={`notification-button ${notifications[followedUser.$id] ? 'active' : ''}`}
                                    >
                                        {notifications[followedUser.$id] ? <Bell size={16} /> : <BellOff size={16} />}
                                    </button>
                                    
                                    <button 
                                        onClick={() => handleFollow(followedUser.$id)}
                                        className="unfollow-button"
                                    >
                                        <UserMinus size={16} />
                                        Ne plus suivre
                                    </button>
                                    
                                    <button className="more-button">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </div>

                                {/* Vidéos récentes */}
                                {followedUser.recentVideos.length > 0 && (
                                    <div className="recent-videos">
                                        <h5>Vidéos récentes</h5>
                                        <div className="video-thumbnails">
                                            {followedUser.recentVideos.slice(0, 3).map((video) => (
                                                <div key={video.$id} className="video-thumbnail">
                                                    <div className="thumbnail-placeholder">
                                                        📹
                                                    </div>
                                                    <span className="video-views">
                                                        {formatNumber(video.viewsCount || 0)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'followers' && (
                    <div className="followers-list">
                        {getFilteredList(followersList).map((follower) => (
                            <div key={follower.$id} className="user-card">
                                <div className="user-main">
                                    <div className="user-avatar">
                                        {follower.profilePicture ? (
                                            <img src={follower.profilePicture} alt={follower.displayName} />
                                        ) : (
                                            <span>{follower.displayName?.[0] || '👤'}</span>
                                        )}
                                        {follower.isVerified && <div className="verified-badge">✓</div>}
                                    </div>
                                    
                                    <div className="user-info">
                                        <h4>{follower.displayName}</h4>
                                        <p>@{follower.username}</p>
                                        <div className="user-stats">
                                            <span>{formatNumber(follower.followersCount || 0)} abonnés</span>
                                            <span>{formatNumber(follower.followingCount || 0)} abonnements</span>
                                        </div>
                                        {follower.isFollowingBack && (
                                            <span className="mutual-follow">Vous suit aussi</span>
                                        )}
                                    </div>
                                </div>

                                <div className="user-actions">
                                    {!follower.isFollowingBack ? (
                                        <button 
                                            onClick={() => handleFollow(follower.$id)}
                                            className="follow-back-button"
                                        >
                                            <UserPlus size={16} />
                                            Suivre
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleFollow(follower.$id)}
                                            className="unfollow-button"
                                        >
                                            <UserMinus size={16} />
                                            Ne plus suivre
                                        </button>
                                    )}
                                    
                                    <button className="more-button">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'suggestions' && (
                    <div className="suggestions-list">
                        <div className="suggestions-header">
                            <h3><Star size={20} /> Suggestions pour vous</h3>
                            <p>Découvrez de nouveaux créateurs</p>
                        </div>
                        
                        {suggestions.map((suggestion) => (
                            <div key={suggestion.$id} className="suggestion-card">
                                <div className="user-main">
                                    <div className="user-avatar">
                                        {suggestion.profilePicture ? (
                                            <img src={suggestion.profilePicture} alt={suggestion.displayName} />
                                        ) : (
                                            <span>{suggestion.displayName?.[0] || '👤'}</span>
                                        )}
                                        {suggestion.isVerified && <div className="verified-badge">✓</div>}
                                    </div>
                                    
                                    <div className="user-info">
                                        <h4>{suggestion.displayName}</h4>
                                        <p>@{suggestion.username}</p>
                                        <div className="user-stats">
                                            <span>{formatNumber(suggestion.followersCount || 0)} abonnés</span>
                                            <span>{suggestion.mutualFollows} amis en commun</span>
                                        </div>
                                        <p className="suggestion-reason">{suggestion.reason}</p>
                                    </div>
                                </div>

                                <div className="suggestion-actions">
                                    <button 
                                        onClick={() => handleFollow(suggestion.$id)}
                                        className="follow-suggestion-button"
                                    >
                                        <UserPlus size={16} />
                                        Suivre
                                    </button>
                                    
                                    <button className="dismiss-button">
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FollowingPage;

