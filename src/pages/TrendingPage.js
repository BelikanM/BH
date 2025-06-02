import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Hash, Music, MapPin, Calendar, Filter, BarChart3, Users, Eye, Heart } from 'lucide-react';
import { videoService } from '../services/videoService';
import { databases, DATABASE_ID, COLLECTIONS, Query } from '../services/appwrite';
import VideoCard from '../components/VideoCard';

const TrendingPage = () => {
    const [activeTab, setActiveTab] = useState('videos'); // videos, hashtags, sounds, creators
    const [timeRange, setTimeRange] = useState('today'); // today, week, month, all
    const [trendingVideos, setTrendingVideos] = useState([]);
    const [trendingHashtags, setTrendingHashtags] = useState([]);
    const [trendingCreators, setTrendingCreators] = useState([]);
    const [trendingSounds, setTrendingSounds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalViews: 0,
        totalCreators: 0,
        totalVideos: 0,
        growthRate: 0
    });

    useEffect(() => {
        loadTrendingData();
    }, [timeRange]);

    const loadTrendingData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                loadTrendingVideos(),
                loadTrendingHashtags(),
                loadTrendingCreators(),
                loadTrendingSounds(),
                loadStats()
            ]);
        } catch (error) {
            console.error('Erreur chargement tendances:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadTrendingVideos = async () => {
        try {
            const dateFilter = getDateFilter();
            const queries = [
                Query.equal('isPublic', true),
                Query.orderDesc('viewsCount'),
                Query.limit(50)
            ];

            if (dateFilter) {
                queries.push(Query.greaterThanEqual('createdAt', dateFilter));
            }

            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.VIDEOS,
                queries
            );

            // Enrichir avec données utilisateur et calculer score de tendance
            const videosWithTrending = await Promise.all(
                response.documents.map(async (video) => {
                    try {
                        const user = await databases.getDocument(
                            DATABASE_ID,
                            COLLECTIONS.USERS,
                            video.userId
                        );

                        // Calculer score de tendance basé sur engagement récent
                        const trendingScore = calculateTrendingScore(video);
                        
                        return { ...video, user, trendingScore };
                    } catch (error) {
                        return { ...video, trendingScore: 0 };
                    }
                })
            );

            // Trier par score de tendance
            videosWithTrending.sort((a, b) => b.trendingScore - a.trendingScore);
            setTrendingVideos(videosWithTrending);
        } catch (error) {
            console.error('Erreur chargement vidéos tendances:', error);
        }
    };

    const loadTrendingHashtags = async () => {
        try {
            // Simuler l'analyse des hashtags tendances
            // Dans une vraie app, vous analyseriez les hashtags des vidéos récentes
            const mockHashtags = [
                { tag: 'fyp', count: 15420, growth: '+45%', videos: 1542 },
                { tag: 'viral', count: 12350, growth: '+32%', videos: 1235 },
                { tag: 'dance', count: 9876, growth: '+28%', videos: 987 },
                { tag: 'comedy', count: 8765, growth: '+25%', videos: 876 },
                { tag: 'music', count: 7654, growth: '+22%', videos: 765 },
                { tag: 'art', count: 6543, growth: '+18%', videos: 654 },
                { tag: 'food', count: 5432, growth: '+15%', videos: 543 },
                { tag: 'travel', count: 4321, growth: '+12%', videos: 432 },
                { tag: 'fashion', count: 3210, growth: '+10%', videos: 321 },
                { tag: 'tech', count: 2109, growth: '+8%', videos: 210 }
            ];

            setTrendingHashtags(mockHashtags);
        } catch (error) {
            console.error('Erreur chargement hashtags tendances:', error);
        }
    };

    const loadTrendingCreators = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.USERS,
                [
                    Query.orderDesc('followersCount'),
                    Query.limit(20)
                ]
            );

            // Calculer croissance et engagement pour chaque créateur
            const creatorsWithStats = await Promise.all(
                response.documents.map(async (creator) => {
                    try {
                        // Récupérer les vidéos récentes du créateur
                        const videosResponse = await databases.listDocuments(
                            DATABASE_ID,
                            COLLECTIONS.VIDEOS,
                            [
                                Query.equal('userId', creator.$id),
                                Query.orderDesc('createdAt'),
                                Query.limit(10)
                            ]
                        );

                        const recentVideos = videosResponse.documents;
                        const totalViews = recentVideos.reduce((sum, video) => sum + (video.viewsCount || 0), 0);
                        const totalLikes = recentVideos.reduce((sum, video) => sum + (video.likesCount || 0), 0);
                        const avgEngagement = recentVideos.length > 0 ? 
                            ((totalLikes / totalViews) * 100).toFixed(2) : 0;

                        return {
                            ...creator,
                            recentViews: totalViews,
                            avgEngagement: parseFloat(avgEngagement),
                            videosCount: recentVideos.length,
                            growthRate: Math.floor(Math.random() * 50) + 5 // Simulé
                        };
                    } catch (error) {
                        return {
                            ...creator,
                            recentViews: 0,
                            avgEngagement: 0,
                            videosCount: 0,
                            growthRate: 0
                        };
                    }
                })
            );

            // Trier par engagement et croissance
            creatorsWithStats.sort((a, b) => 
                (b.avgEngagement + b.growthRate) - (a.avgEngagement + a.growthRate)
            );

            setTrendingCreators(creatorsWithStats);
        } catch (error) {
            console.error('Erreur chargement créateurs tendances:', error);
        }
    };

    const loadTrendingSounds = async () => {
        try {
            // Simuler les sons tendances
            const mockSounds = [
                { 
                    id: 1, 
                    title: 'Original Sound - @user1', 
                    artist: 'user1', 
                    duration: 30, 
                    usageCount: 15420,
                    growth: '+67%'
                },
                { 
                    id: 2, 
                    title: 'Trending Beat 2024', 
                    artist: 'DJ Producer', 
                    duration: 45, 
                    usageCount: 12350,
                    growth: '+45%'
                },
                { 
                    id: 3, 
                    title: 'Viral Dance Song', 
                    artist: 'Dance Master', 
                    duration: 60, 
                    usageCount: 9876,
                    growth: '+38%'
                },
                { 
                    id: 4, 
                    title: 'Comedy Sound Effect', 
                    artist: 'Funny Sounds', 
                    duration: 15, 
                    usageCount: 8765,
                    growth: '+32%'
                },
                { 
                    id: 5, 
                    title: 'Motivational Speech', 
                    artist: 'Speaker Pro', 
                    duration: 90, 
                    usageCount: 7654,
                    growth: '+28%'
                }
            ];

            setTrendingSounds(mockSounds);
        } catch (error) {
            console.error('Erreur chargement sons tendances:', error);
        }
    };

    const loadStats = async () => {
        try {
            // Calculer les statistiques globales
            const totalViews = trendingVideos.reduce((sum, video) => sum + (video.viewsCount || 0), 0);
            const totalCreators = trendingCreators.length;
            const totalVideos = trendingVideos.length;
            const growthRate = Math.floor(Math.random() * 20) + 10; // Simulé

            setStats({
                totalViews,
                totalCreators,
                totalVideos,
                growthRate
            });
        } catch (error) {
            console.error('Erreur chargement statistiques:', error);
        }
    };

    const calculateTrendingScore = (video) => {
        const now = new Date();
        const videoDate = new Date(video.createdAt);
        const hoursOld = (now - videoDate) / (1000 * 60 * 60);
        
        // Score basé sur vues, likes, commentaires et récence
        const viewsScore = (video.viewsCount || 0) / Math.max(hoursOld, 1);
        const likesScore = (video.likesCount || 0) * 2;
        const commentsScore = (video.commentsCount || 0) * 3;
        const recencyBonus = Math.max(0, 24 - hoursOld) * 10;
        
        return viewsScore + likesScore + commentsScore + recencyBonus;
    };

    const getDateFilter = () => {
        const now = new Date();
        switch (timeRange) {
            case 'today':
                return new Date(now.setHours(0, 0, 0, 0)).toISOString();
            case 'week':
                return new Date(now.setDate(now.getDate() - 7)).toISOString();
            case 'month':
                return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
            default:
                return null;
        }
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num?.toString() || '0';
    };

    const getTimeRangeLabel = () => {
        switch (timeRange) {
            case 'today': return "aujourd'hui";
            case 'week': return 'cette semaine';
            case 'month': return 'ce mois';
            default: return 'de tous les temps';
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Analyse des tendances...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            {/* Header avec stats */}
            <div className="trending-header">
                <div className="header-content">
                    <h1><TrendingUp size={28} /> Tendances</h1>
                    <p>Découvrez ce qui fait le buzz {getTimeRangeLabel()}</p>
                    
                    <div className="trending-stats">
                        <div className="stat-card">
                            <Eye size={20} />
                            <div>
                                <span className="stat-number">{formatNumber(stats.totalViews)}</span>
                                <span className="stat-label">Vues</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <Users size={20} />
                            <div>
                                <span className="stat-number">{stats.totalCreators}</span>
                                <span className="stat-label">Créateurs</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <BarChart3 size={20} />
                            <div>
                                <span className="stat-number">+{stats.growthRate}%</span>
                                <span className="stat-label">Croissance</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtres de temps */}
                <div className="time-filters">
                    <button 
                        className={timeRange === 'today' ? 'active' : ''}
                        onClick={() => setTimeRange('today')}
                    >
                        Aujourd'hui
                    </button>
                    <button 
                        className={timeRange === 'week' ? 'active' : ''}
                        onClick={() => setTimeRange('week')}
                    >
                        Cette semaine
                    </button>
                    <button 
                        className={timeRange === 'month' ? 'active' : ''}
                        onClick={() => setTimeRange('month')}
                    >
                        Ce mois
                    </button>
                    <button 
                        className={timeRange === 'all' ? 'active' : ''}
                        onClick={() => setTimeRange('all')}
                    >
                        Tout temps
                    </button>
                </div>
            </div>

            {/* Onglets */}
            <div className="trending-tabs">
                <button 
                    className={activeTab === 'videos' ? 'active' : ''}
                    onClick={() => setActiveTab('videos')}
                >
                    <TrendingUp size={16} />
                    Vidéos ({trendingVideos.length})
                </button>
                <button 
                    className={activeTab === 'hashtags' ? 'active' : ''}
                    onClick={() => setActiveTab('hashtags')}
                >
                    <Hash size={16} />
                    Hashtags ({trendingHashtags.length})
                </button>
                <button 
                    className={activeTab === 'creators' ? 'active' : ''}
                    onClick={() => setActiveTab('creators')}
                >
                    <Users size={16} />
                    Créateurs ({trendingCreators.length})
                </button>
                <button 
                    className={activeTab === 'sounds' ? 'active' : ''}
                    onClick={() => setActiveTab('sounds')}
                >
                    <Music size={16} />
                    Sons ({trendingSounds.length})
                </button>
            </div>

            {/* Contenu */}
            <div className="trending-content">
                {activeTab === 'videos' && (
                    <div className="trending-videos">
                        <div className="section-header">
                            <h3>🔥 Vidéos en tendance</h3>
                            <p>Les vidéos les plus populaires {getTimeRangeLabel()}</p>
                        </div>
                        
                        <div className="video-grid">
                            {trendingVideos.map((video, index) => (
                                <div key={video.$id} className="trending-video-item">
                                    <div className="trending-rank">#{index + 1}</div>
                                    <VideoCard 
                                        video={video} 
                                        compact={true}
                                        showTrendingScore={true}
                                    />
                                    <div className="trending-metrics">
                                        <span className="metric">
                                            <Eye size={14} />
                                            {formatNumber(video.viewsCount || 0)}
                                        </span>
                                        <span className="metric">
                                            <Heart size={14} />
                                            {formatNumber(video.likesCount || 0)}
                                        </span>
                                        <span className="trending-score">
                                            Score: {Math.round(video.trendingScore)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'hashtags' && (
                    <div className="trending-hashtags">
                        <div className="section-header">
                            <h3># Hashtags tendances</h3>
                            <p>Les hashtags les plus utilisés {getTimeRangeLabel()}</p>
                        </div>
                        
                        <div className="hashtag-list">
                            {trendingHashtags.map((hashtag, index) => (
                                <div key={hashtag.tag} className="hashtag-item">
                                    <div className="hashtag-rank">#{index + 1}</div>
                                    <div className="hashtag-content">
                                        <div className="hashtag-main">
                                            <h4>#{hashtag.tag}</h4>
                                            <div className="hashtag-stats">
                                                <span>{formatNumber(hashtag.count)} utilisations</span>
                                                <span className="growth positive">{hashtag.growth}</span>
                                            </div>
                                        </div>
                                        <div className="hashtag-meta">
                                            <span>{hashtag.videos} vidéos</span>
                                        </div>
                                    </div>
                                    <button className="use-hashtag-button">
                                        Utiliser
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'creators' && (
                    <div className="trending-creators">
                        <div className="section-header">
                            <h3>👑 Créateurs en vogue</h3>
                            <p>Les créateurs qui montent {getTimeRangeLabel()}</p>
                        </div>
                        
                        <div className="creator-list">
                            {trendingCreators.map((creator, index) => (
                                <div key={creator.$id} className="creator-item">
                                    <div className="creator-rank">#{index + 1}</div>
                                    <div className="creator-avatar">
                                        {creator.profilePicture ? (
                                            <img src={creator.profilePicture} alt={creator.displayName} />
                                        ) : (
                                            <span>{creator.displayName?.[0] || '👤'}</span>
                                        )}
                                        {creator.isVerified && <div className="verified-badge">✓</div>}
                                    </div>
                                    <div className="creator-info">
                                        <h4>{creator.displayName}</h4>
                                        <p>@{creator.username}</p>
                                        <div className="creator-stats">
                                            <span>{formatNumber(creator.followersCount || 0)} abonnés</span>
                                            <span className="growth positive">+{creator.growthRate}%</span>
                                        </div>
                                        <div className="creator-metrics">
                                            <span>{formatNumber(creator.recentViews)} vues récentes</span>
                                            <span>{creator.avgEngagement}% engagement</span>
                                        </div>
                                    </div>
                                    <button className="follow-creator-button">
                                        Suivre
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'sounds' && (
                    <div className="trending-sounds">
                        <div className="section-header">
                            <h3>🎵 Sons populaires</h3>
                            <p>Les sons les plus utilisés {getTimeRangeLabel()}</p>
                        </div>
                        
                        <div className="sound-list">
                            {trendingSounds.map((sound, index) => (
                                <div key={sound.id} className="sound-item">
                                    <div className="sound-rank">#{index + 1}</div>
                                    <div className="sound-info">
                                        <div className="sound-main">
                                            <h4>{sound.title}</h4>
                                            <p>par {sound.artist}</p>
                                            <div className="sound-stats">
                                                <span>{formatNumber(sound.usageCount)} utilisations</span>
                                                <span className="growth positive">{sound.growth}</span>
                                                <span>{sound.duration}s</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sound-actions">
                                        <button className="play-sound-button">
                                            ▶️
                                        </button>
                                        <button className="use-sound-button">
                                            Utiliser
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrendingPage;

