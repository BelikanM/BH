import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, TrendingUp, Clock, Heart } from 'lucide-react';
import { videoService } from '../services/videoService';
import { databases, DATABASE_ID, COLLECTIONS, Query } from '../services/appwrite';
import VideoCard from '../components/VideoCard';

const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('videos'); // videos, users, hashtags
    const [filters, setFilters] = useState({
        sortBy: 'recent', // recent, popular, views
        dateRange: 'all', // all, today, week, month
        minViews: 0
    });
    const [showFilters, setShowFilters] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const [trendingSearches] = useState([
        'danse', 'cuisine', 'voyage', 'musique', 'sport', 'art', 'tech', 'mode'
    ]);

    useEffect(() => {
        // Charger l'historique de recherche
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        setSearchHistory(history);
    }, []);

    const saveToHistory = (searchTerm) => {
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        const newHistory = [searchTerm, ...history.filter(h => h !== searchTerm)].slice(0, 10);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        setSearchHistory(newHistory);
    };

    const searchVideos = useCallback(async (searchQuery, searchFilters = filters) => {
        if (!searchQuery.trim()) return [];

        try {
            const queries = [Query.search('title', searchQuery)];
            
            // Appliquer les filtres
            switch (searchFilters.sortBy) {
                case 'popular':
                    queries.push(Query.orderDesc('likesCount'));
                    break;
                case 'views':
                    queries.push(Query.orderDesc('viewsCount'));
                    break;
                default:
                    queries.push(Query.orderDesc('createdAt'));
            }

            if (searchFilters.minViews > 0) {
                queries.push(Query.greaterThanEqual('viewsCount', searchFilters.minViews));
            }

            // Filtrer par date
            if (searchFilters.dateRange !== 'all') {
                const now = new Date();
                let dateLimit;
                
                switch (searchFilters.dateRange) {
                    case 'today':
                        dateLimit = new Date(now.setHours(0, 0, 0, 0));
                        break;
                    case 'week':
                        dateLimit = new Date(now.setDate(now.getDate() - 7));
                        break;
                    case 'month':
                        dateLimit = new Date(now.setMonth(now.getMonth() - 1));
                        break;
                }
                
                if (dateLimit) {
                    queries.push(Query.greaterThanEqual('createdAt', dateLimit.toISOString()));
                }
            }

            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.VIDEOS,
                queries
            );

            // Enrichir avec les données utilisateur
            const videosWithUsers = await Promise.all(
                response.documents.map(async (video) => {
                    try {
                        const user = await databases.getDocument(
                            DATABASE_ID,
                            COLLECTIONS.USERS,
                            video.userId
                        );
                        return { ...video, user };
                    } catch (error) {
                        return video;
                    }
                })
            );

            return videosWithUsers;
        } catch (error) {
            console.error('Erreur recherche vidéos:', error);
            return [];
        }
    }, [filters]);

    const searchUsers = useCallback(async (searchQuery) => {
        if (!searchQuery.trim()) return [];

        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.USERS,
                [
                    Query.search('username', searchQuery),
                    Query.orderDesc('followersCount'),
                    Query.limit(20)
                ]
            );

            return response.documents;
        } catch (error) {
            console.error('Erreur recherche utilisateurs:', error);
            return [];
        }
    }, []);

    const handleSearch = async (searchQuery = query) => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        saveToHistory(searchQuery);

        try {
            if (activeTab === 'videos') {
                const videoResults = await searchVideos(searchQuery);
                setResults(videoResults);
            } else if (activeTab === 'users') {
                const userResults = await searchUsers(searchQuery);
                setUsers(userResults);
            }
        } catch (error) {
            console.error('Erreur de recherche:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        if (query.trim()) {
            handleSearch();
        }
    };

    const clearSearch = () => {
        setQuery('');
        setResults([]);
        setUsers([]);
    };

    const handleTrendingClick = (trend) => {
        setQuery(trend);
        handleSearch(trend);
    };

    return (
        <div className="page-container">
            <div className="search-header">
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Rechercher des vidéos, utilisateurs..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    {query && (
                        <button onClick={clearSearch} className="clear-button">
                            <X size={16} />
                        </button>
                    )}
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`filter-button ${showFilters ? 'active' : ''}`}
                    >
                        <Filter size={20} />
                    </button>
                </div>

                {/* Filtres */}
                {showFilters && (
                    <div className="filters-panel">
                        <div className="filter-group">
                            <label>Trier par:</label>
                            <select 
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange({...filters, sortBy: e.target.value})}
                            >
                                <option value="recent">Plus récent</option>
                                <option value="popular">Plus populaire</option>
                                <option value="views">Plus de vues</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Période:</label>
                            <select 
                                value={filters.dateRange}
                                onChange={(e) => handleFilterChange({...filters, dateRange: e.target.value})}
                            >
                                <option value="all">Toute période</option>
                                <option value="today">Aujourd'hui</option>
                                <option value="week">Cette semaine</option>
                                <option value="month">Ce mois</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Vues minimum:</label>
                            <input
                                type="number"
                                value={filters.minViews}
                                onChange={(e) => handleFilterChange({...filters, minViews: parseInt(e.target.value) || 0})}
                                placeholder="0"
                            />
                        </div>
                    </div>
                )}

                {/* Onglets */}
                <div className="search-tabs">
                    <button 
                        className={activeTab === 'videos' ? 'active' : ''}
                        onClick={() => setActiveTab('videos')}
                    >
                        Vidéos
                    </button>
                    <button 
                        className={activeTab === 'users' ? 'active' : ''}
                        onClick={() => setActiveTab('users')}
                    >
                        Utilisateurs
                    </button>
                </div>
            </div>

            <div className="search-content">
                {!query ? (
                    <div className="search-suggestions">
                        {/* Recherches tendances */}
                        <div className="suggestion-section">
                            <h3><TrendingUp size={20} /> Tendances</h3>
                            <div className="trending-tags">
                                {trendingSearches.map((trend, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => handleTrendingClick(trend)}
                                        className="trending-tag"
                                    >
                                        #{trend}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Historique */}
                        {searchHistory.length > 0 && (
                            <div className="suggestion-section">
                                <h3><Clock size={20} /> Recherches récentes</h3>
                                <div className="search-history">
                                    {searchHistory.map((item, index) => (
                                        <button 
                                            key={index}
                                            onClick={() => handleTrendingClick(item)}
                                            className="history-item"
                                        >
                                            <Clock size={16} />
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Recherche en cours...</p>
                    </div>
                ) : (
                    <div className="search-results">
                        {activeTab === 'videos' && (
                            <div className="video-results">
                                {results.length === 0 ? (
                                    <div className="no-results">
                                        <span className="no-results-icon">🔍</span>
                                        <h3>Aucune vidéo trouvée</h3>
                                        <p>Essayez avec d'autres mots-clés</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="results-header">
                                            <p>{results.length} vidéo(s) trouvée(s) pour "{query}"</p>
                                        </div>
                                        <div className="video-grid">
                                            {results.map((video) => (
                                                <VideoCard
                                                    key={video.$id}
                                                    video={video}
                                                    compact={true}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="user-results">
                                {users.length === 0 ? (
                                    <div className="no-results">
                                        <span className="no-results-icon">👤</span>
                                        <h3>Aucun utilisateur trouvé</h3>
                                        <p>Essayez avec d'autres noms d'utilisateur</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="results-header">
                                            <p>{users.length} utilisateur(s) trouvé(s) pour "{query}"</p>
                                        </div>
                                        <div className="user-grid">
                                            {users.map((user) => (
                                                <div key={user.$id} className="user-card">
                                                    <div className="user-avatar">
                                                        {user.profilePicture ? (
                                                            <img src={user.profilePicture} alt={user.displayName} />
                                                        ) : (
                                                            <span>{user.displayName?.[0] || '👤'}</span>
                                                        )}
                                                    </div>
                                                    <div className="user-info">
                                                        <h4>{user.displayName}</h4>
                                                        <p>@{user.username}</p>
                                                        <div className="user-stats">
                                                            <span>{user.followersCount || 0} abonnés</span>
                                                            <span>{user.videosCount || 0} vidéos</span>
                                                        </div>
                                                    </div>
                                                    <button className="follow-button">
                                                        Suivre
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;

