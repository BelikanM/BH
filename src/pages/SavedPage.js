import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { databases, DATABASE_ID, COLLECTIONS, Query } from '../services/appwrite';
import VideoCard from '../components/VideoCard';
import { 
    Bookmark, 
    BookmarkCheck,
    Search, 
    Filter,
    Grid3X3,
    List,
    Calendar,
    Clock,
    Heart,
    Play,
    Download,
    Share2,
    Trash2,
    FolderPlus,
    Folder,
    MoreHorizontal,
    SortAsc,
    SortDesc,
    Eye,
    MessageCircle,
    Star,
    Archive,
    Tag,
    X,
    Check,
    Plus
} from 'lucide-react';

const SavedPage = () => {
    const { user, userProfile } = useAuth();
    const [savedItems, setSavedItems] = useState([]);
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCollection, setSelectedCollection] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // grid, list
    const [sortBy, setSortBy] = useState('newest'); // newest, oldest, most_liked, most_viewed
    const [filterType, setFilterType] = useState('all'); // all, videos, posts, comments
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [showCreateCollection, setShowCreateCollection] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [showMoveModal, setShowMoveModal] = useState(false);

    useEffect(() => {
        if (user) {
            loadSavedItems();
            loadCollections();
        }
    }, [user, selectedCollection, sortBy, filterType]);

    const loadSavedItems = async () => {
        setLoading(true);
        try {
            // Simuler des éléments sauvegardés
            const mockSavedItems = [
                {
                    id: '1',
                    type: 'video',
                    contentId: 'video1',
                    userId: user.$id,
                    collectionId: 'favorites',
                    content: {
                        id: 'video1',
                        title: 'Danse virale TikTok',
                        description: 'Apprenez cette danse tendance en 30 secondes !',
                        videoUrl: '/api/placeholder/video/400/600',
                        thumbnailUrl: '/api/placeholder/400/600',
                        duration: 30,
                        viewsCount: 125000,
                        likesCount: 8500,
                        commentsCount: 342,
                        creator: {
                            id: 'creator1',
                            name: 'Alice Danse',
                            username: 'alice_dance',
                            avatar: '/api/placeholder/50/50',
                            isVerified: true
                        },
                        createdAt: new Date(Date.now() - 86400000).toISOString()
                    },
                    savedAt: new Date(Date.now() - 3600000).toISOString(),
                    tags: ['danse', 'viral', 'tendance']
                },
                {
                    id: '2',
                    type: 'video',
                    contentId: 'video2',
                    userId: user.$id,
                    collectionId: 'cooking',
                    content: {
                        id: 'video2',
                        title: 'Recette rapide pasta',
                        description: 'Pasta délicieuse en 10 minutes chrono',
                        videoUrl: '/api/placeholder/video/400/600',
                        thumbnailUrl: '/api/placeholder/400/600',
                        duration: 45,
                        viewsCount: 89000,
                        likesCount: 5200,
                        commentsCount: 156,
                        creator: {
                            id: 'creator2',
                            name: 'Chef Marco',
                            username: 'chef_marco',
                            avatar: '/api/placeholder/50/50',
                            isVerified: false
                        },
                        createdAt: new Date(Date.now() - 172800000).toISOString()
                    },
                    savedAt: new Date(Date.now() - 7200000).toISOString(),
                    tags: ['cuisine', 'rapide', 'pasta']
                },
                {
                    id: '3',
                    type: 'video',
                    contentId: 'video3',
                    userId: user.$id,
                    collectionId: 'tutorials',
                    content: {
                        id: 'video3',
                        title: 'Tutoriel maquillage naturel',
                        description: 'Look naturel pour tous les jours',
                        videoUrl: '/api/placeholder/video/400/600',
                        thumbnailUrl: '/api/placeholder/400/600',
                        duration: 120,
                        viewsCount: 67000,
                        likesCount: 4100,
                        commentsCount: 89,
                        creator: {
                            id: 'creator3',
                            name: 'Beauty Emma',
                            username: 'beauty_emma',
                            avatar: '/api/placeholder/50/50',
                            isVerified: true
                        },
                        createdAt: new Date(Date.now() - 259200000).toISOString()
                    },
                    savedAt: new Date(Date.now() - 10800000).toISOString(),
                    tags: ['beauté', 'maquillage', 'tutoriel']
                },
                {
                    id: '4',
                    type: 'video',
                    contentId: 'video4',
                    userId: user.$id,
                    collectionId: 'favorites',
                    content: {
                        id: 'video4',
                        title: 'Workout à la maison',
                        description: 'Exercices efficaces sans équipement',
                        videoUrl: '/api/placeholder/video/400/600',
                        thumbnailUrl: '/api/placeholder/400/600',
                        duration: 180,
                        viewsCount: 156000,
                        likesCount: 12000,
                        commentsCount: 445,
                        creator: {
                            id: 'creator4',
                            name: 'Fit Coach',
                            username: 'fit_coach',
                            avatar: '/api/placeholder/50/50',
                            isVerified: true
                        },
                        createdAt: new Date(Date.now() - 345600000).toISOString()
                    },
                    savedAt: new Date(Date.now() - 14400000).toISOString(),
                    tags: ['fitness', 'workout', 'maison']
                },
                {
                    id: '5',
                    type: 'video',
                    contentId: 'video5',
                    userId: user.$id,
                    collectionId: 'music',
                    content: {
                        id: 'video5',
                        title: 'Cover guitare acoustique',
                        description: 'Ma version de cette chanson populaire',
                        videoUrl: '/api/placeholder/video/400/600',
                        thumbnailUrl: '/api/placeholder/400/600',
                        duration: 90,
                        viewsCount: 34000,
                        likesCount: 2800,
                        commentsCount: 67,
                        creator: {
                            id: 'creator5',
                            name: 'Guitar Sam',
                            username: 'guitar_sam',
                            avatar: '/api/placeholder/50/50',
                            isVerified: false
                        },
                        createdAt: new Date(Date.now() - 432000000).toISOString()
                    },
                    savedAt: new Date(Date.now() - 18000000).toISOString(),
                    tags: ['musique', 'guitare', 'cover']
                }
            ];

            setSavedItems(mockSavedItems);
        } catch (error) {
            console.error('Erreur chargement éléments sauvegardés:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCollections = async () => {
        try {
            // Simuler des collections
            const mockCollections = [
                {
                    id: 'favorites',
                    name: 'Favoris',
                    description: 'Mes vidéos préférées',
                    itemsCount: 15,
                    isDefault: true,
                    createdAt: new Date(Date.now() - 2592000000).toISOString()
                },
                {
                    id: 'cooking',
                    name: 'Cuisine',
                    description: 'Recettes et astuces culinaires',
                    itemsCount: 8,
                    isDefault: false,
                    createdAt: new Date(Date.now() - 1296000000).toISOString()
                },
                {
                    id: 'tutorials',
                    name: 'Tutoriels',
                    description: 'Guides et tutoriels utiles',
                    itemsCount: 12,
                    isDefault: false,
                    createdAt: new Date(Date.now() - 864000000).toISOString()
                },
                {
                    id: 'music',
                    name: 'Musique',
                    description: 'Covers et performances musicales',
                    itemsCount: 6,
                    isDefault: false,
                    createdAt: new Date(Date.now() - 432000000).toISOString()
                },
                {
                    id: 'fitness',
                    name: 'Fitness',
                    description: 'Workouts et conseils santé',
                    itemsCount: 4,
                    isDefault: false,
                    createdAt: new Date(Date.now() - 216000000).toISOString()
                }
            ];

            setCollections(mockCollections);
        } catch (error) {
            console.error('Erreur chargement collections:', error);
        }
    };

    const getFilteredItems = () => {
        let filtered = savedItems;

        // Filtrer par collection
        if (selectedCollection !== 'all') {
            filtered = filtered.filter(item => item.collectionId === selectedCollection);
        }

        // Filtrer par type
        if (filterType !== 'all') {
            filtered = filtered.filter(item => item.type === filterType);
        }

        // Filtrer par recherche
        if (searchQuery) {
            filtered = filtered.filter(item => 
                item.content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.content.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Trier
        switch (sortBy) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.savedAt) - new Date(b.savedAt));
                break;
            case 'most_liked':
                filtered.sort((a, b) => b.content.likesCount - a.content.likesCount);
                break;
            case 'most_viewed':
                filtered.sort((a, b) => b.content.viewsCount - a.content.viewsCount);
                break;
        }

        return filtered;
    };

    const handleSaveItem = async (contentId, contentType = 'video', collectionId = 'favorites') => {
        try {
            // Ici vous implémenteriez la sauvegarde avec Appwrite
            console.log('Sauvegarde:', { contentId, contentType, collectionId });
        } catch (error) {
            console.error('Erreur sauvegarde:', error);
        }
    };

    const handleUnsaveItem = async (itemId) => {
        try {
            setSavedItems(prev => prev.filter(item => item.id !== itemId));
        } catch (error) {
            console.error('Erreur suppression sauvegarde:', error);
        }
    };

    const handleCreateCollection = async () => {
        if (!newCollectionName.trim()) return;

        try {
            const newCollection = {
                id: Date.now().toString(),
                name: newCollectionName,
                description: '',
                itemsCount: 0,
                isDefault: false,
                createdAt: new Date().toISOString()
            };

            setCollections(prev => [...prev, newCollection]);
            setNewCollectionName('');
            setShowCreateCollection(false);
        } catch (error) {
            console.error('Erreur création collection:', error);
        }
    };

    const handleMoveItems = async (targetCollectionId) => {
        try {
            const itemsToMove = Array.from(selectedItems);
            setSavedItems(prev => prev.map(item => 
                itemsToMove.includes(item.id) 
                    ? { ...item, collectionId: targetCollectionId }
                    : item
            ));
            
            setSelectedItems(new Set());
            setIsSelectionMode(false);
            setShowMoveModal(false);
        } catch (error) {
            console.error('Erreur déplacement éléments:', error);
        }
    };

    const handleDeleteSelected = async () => {
        try {
            const itemsToDelete = Array.from(selectedItems);
            setSavedItems(prev => prev.filter(item => !itemsToDelete.includes(item.id)));
            setSelectedItems(new Set());
            setIsSelectionMode(false);
        } catch (error) {
            console.error('Erreur suppression éléments:', error);
        }
    };

    const toggleItemSelection = (itemId) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return 'À l\'instant';
        } else if (diffInHours < 24) {
            return `Il y a ${Math.floor(diffInHours)} h`;
        } else if (diffInHours < 168) {
            return `Il y a ${Math.floor(diffInHours / 24)} j`;
        } else {
            return date.toLocaleDateString('fr-FR');
        }
    };

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    if (!user) {
        return (
            <div className="page-container">
                <div className="auth-required">
                    <span className="auth-icon">🔒</span>
                    <h3>Connexion requise</h3>
                    <p>Connectez-vous pour voir vos éléments sauvegardés</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Chargement de vos sauvegardes...</p>
                </div>
            </div>
        );
    }

    const filteredItems = getFilteredItems();

    return (
        <div className="page-container saved-page">
            {/* Header */}
            <div className="saved-header">
                <div className="header-content">
                    <h1>
                        <Bookmark size={28} /> 
                        Éléments sauvegardés
                    </h1>
                    <p>Retrouvez tous vos contenus favoris</p>
                </div>

                <div className="header-actions">
                    {isSelectionMode ? (
                        <div className="selection-actions">
                            <button onClick={() => setIsSelectionMode(false)}>
                                <X size={16} />
                                Annuler
                            </button>
                            <button 
                                onClick={() => setShowMoveModal(true)}
                                disabled={selectedItems.size === 0}
                            >
                                <Archive size={16} />
                                Déplacer ({selectedItems.size})
                            </button>
                            <button 
                                onClick={handleDeleteSelected}
                                disabled={selectedItems.size === 0}
                                className="delete-button"
                            >
                                <Trash2 size={16} />
                                Supprimer ({selectedItems.size})
                            </button>
                        </div>
                    ) : (
                        <>
                            <button onClick={() => setIsSelectionMode(true)}>
                                Sélectionner
                            </button>
                            <button onClick={() => setShowCreateCollection(true)}>
                                <FolderPlus size={16} />
                                Nouvelle collection
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="saved-layout">
                {/* Sidebar des collections */}
                <div className="collections-sidebar">
                    <div className="sidebar-header">
                        <h3>Collections</h3>
                        <button 
                            onClick={() => setShowCreateCollection(true)}
                            className="add-collection-button"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    <div className="collections-list">
                        <button
                            onClick={() => setSelectedCollection('all')}
                            className={`collection-item ${selectedCollection === 'all' ? 'active' : ''}`}
                        >
                            <Bookmark size={20} />
                            <div className="collection-info">
                                <span>Tous les éléments</span>
                                <small>{savedItems.length} éléments</small>
                            </div>
                        </button>

                        {collections.map((collection) => (
                            <button
                                key={collection.id}
                                onClick={() => setSelectedCollection(collection.id)}
                                className={`collection-item ${selectedCollection === collection.id ? 'active' : ''}`}
                            >
                                <Folder size={20} />
                                <div className="collection-info">
                                    <span>{collection.name}</span>
                                    <small>{collection.itemsCount} éléments</small>
                                </div>
                                {collection.isDefault && (
                                    <Star size={14} className="default-indicator" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Contenu principal */}
                <div className="saved-content">
                    {/* Barre de recherche et filtres */}
                    <div className="content-controls">
                        <div className="search-bar">
                            <Search size={16} />
                            <input
                                type="text"
                                placeholder="Rechercher dans vos sauvegardes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="controls-right">
                            <select 
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">Tous les types</option>
                                <option value="video">Vidéos</option>
                                <option value="post">Posts</option>
                                <option value="comment">Commentaires</option>
                            </select>

                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="sort-select"
                            >
                                <option value="newest">Plus récents</option>
                                <option value="oldest">Plus anciens</option>
                                <option value="most_liked">Plus aimés</option>
                                <option value="most_viewed">Plus vus</option>
                            </select>

                            <div className="view-toggle">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={viewMode === 'grid' ? 'active' : ''}
                                >
                                    <Grid3X3 size={16} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={viewMode === 'list' ? 'active' : ''}
                                >
                                    <List size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Liste des éléments sauvegardés */}
                    {filteredItems.length === 0 ? (
                        <div className="empty-state">
                            <Bookmark size={64} />
                            <h3>
                                {searchQuery || selectedCollection !== 'all' || filterType !== 'all'
                                    ? 'Aucun résultat'
                                    : 'Aucun élément sauvegardé'
                                }
                            </h3>
                            <p>
                                {searchQuery || selectedCollection !== 'all' || filterType !== 'all'
                                    ? 'Essayez de modifier vos filtres de recherche'
                                    : 'Commencez à sauvegarder vos contenus préférés'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className={`saved-items ${viewMode}`}>
                            {filteredItems.map((item) => (
                                <div
                                    key={item.id}
                                    className={`saved-item ${selectedItems.has(item.id) ? 'selected' : ''}`}
                                    onClick={() => isSelectionMode && toggleItemSelection(item.id)}
                                >
                                    {isSelectionMode && (
                                        <div className="selection-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.has(item.id)}
                                                onChange={() => toggleItemSelection(item.id)}
                                            />
                                        </div>
                                    )}

                                    <div className="item-thumbnail">
                                        <img 
                                            src={item.content.thumbnailUrl} 
                                            alt={item.content.title}
                                        />
                                        <div className="thumbnail-overlay">
                                            <div className="duration">
                                                {formatDuration(item.content.duration)}
                                            </div>
                                            <button className="play-button">
                                                <Play size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="item-content">
                                        <div className="item-header">
                                            <h4>{item.content.title}</h4>
                                            <div className="item-actions">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUnsaveItem(item.id);
                                                    }}
                                                    className="unsave-button"
                                                >
                                                    <BookmarkCheck size={16} />
                                                </button>
                                                <button className="more-button">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="item-description">
                                            {item.content.description}
                                        </p>

                                        <div className="item-creator">
                                            <img 
                                                src={item.content.creator.avatar} 
                                                alt={item.content.creator.name}
                                                className="creator-avatar"
                                            />
                                            <span className="creator-name">
                                                {item.content.creator.name}
                                                {item.content.creator.isVerified && (
                                                    <span className="verified">✓</span>
                                                )}
                                            </span>
                                        </div>

                                        <div className="item-stats">
                                            <div className="stat">
                                                <Eye size={14} />
                                                <span>{item.content.viewsCount.toLocaleString()}</span>
                                            </div>
                                            <div className="stat">
                                                <Heart size={14} />
                                                <span>{item.content.likesCount.toLocaleString()}</span>
                                            </div>
                                            <div className="stat">
                                                <MessageCircle size={14} />
                                                <span>{item.content.commentsCount}</span>
                                            </div>
                                        </div>

                                        <div className="item-meta">
                                            <div className="tags">
                                                {item.tags.map((tag, index) => (
                                                    <span key={index} className="tag">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="saved-info">
                                                <Clock size={12} />
                                                <span>Sauvegardé {formatTime(item.savedAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal création de collection */}
            {showCreateCollection && (
                <div className="modal-overlay">
                    <div className="modal create-collection-modal">
                        <div className="modal-header">
                            <h3>Nouvelle collection</h3>
                            <button 
                                onClick={() => setShowCreateCollection(false)}
                                className="close-button"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="modal-content">
                            <div className="form-group">
                                <label>Nom de la collection</label>
                                <input
                                    type="text"
                                    value={newCollectionName}
                                    onChange={(e) => setNewCollectionName(e.target.value)}
                                    placeholder="Ex: Recettes, Tutoriels..."
                                    maxLength={50}
                                />
                                <small>{newCollectionName.length}/50 caractères</small>
                            </div>
                        </div>
                        
                        <div className="modal-actions">
                            <button 
                                onClick={() => setShowCreateCollection(false)}
                                className="cancel-button"
                            >
                                Annuler
                            </button>
                            <button 
                                onClick={handleCreateCollection}
                                disabled={!newCollectionName.trim()}
                                className="create-button"
                            >
                                <FolderPlus size={16} />
                                Créer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal déplacement d'éléments */}
            {showMoveModal && (
                <div className="modal-overlay">
                    <div className="modal move-modal">
                        <div className="modal-header">
                            <h3>Déplacer vers une collection</h3>
                            <button 
                                onClick={() => setShowMoveModal(false)}
                                className="close-button"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="modal-content">
                            <p>Sélectionnez la collection de destination :</p>
                            <div className="collections-grid">
                                {collections.map((collection) => (
                                    <button
                                        key={collection.id}
                                        onClick={() => handleMoveItems(collection.id)}
                                        className="collection-option"
                                    >
                                        <Folder size={24} />
                                        <span>{collection.name}</span>
                                        <small>{collection.itemsCount} éléments</small>
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="modal-actions">
                            <button 
                                onClick={() => setShowMoveModal(false)}
                                className="cancel-button"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavedPage;

