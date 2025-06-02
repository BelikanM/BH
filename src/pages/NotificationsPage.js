import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { databases, DATABASE_ID, COLLECTIONS, Query } from '../services/appwrite';
import { 
    Bell, 
    Heart, 
    MessageCircle, 
    UserPlus, 
    Share, 
    Star,
    Gift,
    TrendingUp,
    Video,
    Music,
    Award,
    Settings,
    Check,
    CheckCheck,
    Trash2,
    Filter,
    Clock,
    Eye,
    EyeOff,
    Volume2,
    VolumeX
} from 'lucide-react';

const NotificationPage = () => {
    const { user, userProfile } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState('all'); // all, mentions, likes, follows, system
    const [loading, setLoading] = useState(true);
    const [selectedNotifications, setSelectedNotifications] = useState(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [filterType, setFilterType] = useState('all'); // all, unread, today, week
    const [notificationSettings, setNotificationSettings] = useState({
        likes: true,
        comments: true,
        follows: true,
        mentions: true,
        shares: true,
        system: true,
        sound: true,
        push: true
    });

    useEffect(() => {
        if (user) {
            loadNotifications();
            loadNotificationSettings();
        }
    }, [user]);

    const loadNotifications = async () => {
        setLoading(true);
        try {
            // Simuler des notifications
            const mockNotifications = [
                {
                    id: '1',
                    type: 'like',
                    title: 'Nouveau like',
                    message: 'Alice Martin a aimé votre vidéo',
                    user: {
                        id: 'user1',
                        name: 'Alice Martin',
                        username: 'alice_m',
                        avatar: null,
                        isVerified: false
                    },
                    relatedContent: {
                        type: 'video',
                        id: 'video1',
                        title: 'Ma dernière création',
                        thumbnail: null
                    },
                    timestamp: new Date(Date.now() - 300000).toISOString(),
                    isRead: false,
                    priority: 'normal'
                },
                {
                    id: '2',
                    type: 'comment',
                    title: 'Nouveau commentaire',
                    message: 'Bob Dupont a commenté votre vidéo: "Incroyable ! Comment tu fais ça ?"',
                    user: {
                        id: 'user2',
                        name: 'Bob Dupont',
                        username: 'bob_d',
                        avatar: null,
                        isVerified: true
                    },
                    relatedContent: {
                        type: 'video',
                        id: 'video2',
                        title: 'Tutoriel danse',
                        thumbnail: null
                    },
                    timestamp: new Date(Date.now() - 900000).toISOString(),
                    isRead: false,
                    priority: 'high'
                },
                {
                    id: '3',
                    type: 'follow',
                    title: 'Nouvel abonné',
                    message: 'Charlie Brown a commencé à vous suivre',
                    user: {
                        id: 'user3',
                        name: 'Charlie Brown',
                        username: 'charlie_b',
                        avatar: null,
                        isVerified: false
                    },
                    timestamp: new Date(Date.now() - 1800000).toISOString(),
                    isRead: true,
                    priority: 'normal'
                },
                {
                    id: '4',
                    type: 'mention',
                    title: 'Mention',
                    message: 'Diana Prince vous a mentionné dans un commentaire',
                    user: {
                        id: 'user4',
                        name: 'Diana Prince',
                        username: 'diana_p',
                        avatar: null,
                        isVerified: true
                    },
                    relatedContent: {
                        type: 'comment',
                        id: 'comment1',
                        text: '@vous Regardez cette vidéo !',
                        videoTitle: 'Vidéo virale'
                    },
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    isRead: true,
                    priority: 'high'
                },
                {
                    id: '5',
                    type: 'share',
                    title: 'Partage',
                    message: 'Eve Wilson a partagé votre vidéo',
                    user: {
                        id: 'user5',
                        name: 'Eve Wilson',
                        username: 'eve_w',
                        avatar: null,
                        isVerified: false
                    },
                    relatedContent: {
                        type: 'video',
                        id: 'video3',
                        title: 'Recette facile',
                        thumbnail: null
                    },
                    timestamp: new Date(Date.now() - 7200000).toISOString(),
                    isRead: true,
                    priority: 'normal'
                },
                {
                    id: '6',
                    type: 'system',
                    title: 'Mise à jour',
                    message: 'Nouvelle fonctionnalité disponible : Effets AR !',
                    icon: '🎉',
                    timestamp: new Date(Date.now() - 86400000).toISOString(),
                    isRead: false,
                    priority: 'low'
                },
                {
                    id: '7',
                    type: 'achievement',
                    title: 'Succès débloqué',
                    message: 'Félicitations ! Vous avez atteint 1000 abonnés',
                    icon: '🏆',
                    relatedContent: {
                        type: 'achievement',
                        name: '1K Followers',
                        description: 'Atteignez 1000 abonnés'
                    },
                    timestamp: new Date(Date.now() - 172800000).toISOString(),
                    isRead: true,
                    priority: 'high'
                },
                {
                    id: '8',
                    type: 'trending',
                    title: 'Tendance',
                    message: 'Votre vidéo est en tendance ! 🔥',
                    relatedContent: {
                        type: 'video',
                        id: 'video4',
                        title: 'Challenge viral',
                        thumbnail: null,
                        views: 50000
                    },
                    timestamp: new Date(Date.now() - 259200000).toISOString(),
                    isRead: true,
                    priority: 'high'
                }
            ];

            setNotifications(mockNotifications);
        } catch (error) {
            console.error('Erreur chargement notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadNotificationSettings = async () => {
        try {
            // Charger les paramètres depuis le localStorage ou la base
            const savedSettings = localStorage.getItem('notificationSettings');
            if (savedSettings) {
                setNotificationSettings(JSON.parse(savedSettings));
            }
        } catch (error) {
            console.error('Erreur chargement paramètres:', error);
        }
    };

    const markAsRead = useCallback(async (notificationIds) => {
        const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds];
        
        setNotifications(prev => prev.map(notif => 
            ids.includes(notif.id) ? { ...notif, isRead: true } : notif
        ));
    }, []);

    const markAllAsRead = useCallback(async () => {
        setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    }, []);

    const deleteNotifications = useCallback(async (notificationIds) => {
        const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds];
        
        setNotifications(prev => prev.filter(notif => !ids.includes(notif.id)));
        setSelectedNotifications(new Set());
    }, []);

    const toggleNotificationSelection = (notificationId) => {
        setSelectedNotifications(prev => {
            const newSet = new Set(prev);
            if (newSet.has(notificationId)) {
                newSet.delete(notificationId);
            } else {
                newSet.add(notificationId);
            }
            return newSet;
        });
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'like':
                return <Heart size={20} className="text-red-500" />;
            case 'comment':
                return <MessageCircle size={20} className="text-blue-500" />;
            case 'follow':
                return <UserPlus size={20} className="text-green-500" />;
            case 'mention':
                return <MessageCircle size={20} className="text-purple-500" />;
            case 'share':
                return <Share size={20} className="text-orange-500" />;
            case 'system':
                return <Bell size={20} className="text-gray-500" />;
            case 'achievement':
                return <Award size={20} className="text-yellow-500" />;
            case 'trending':
                return <TrendingUp size={20} className="text-pink-500" />;
            case 'gift':
                return <Gift size={20} className="text-purple-500" />;
            default:
                return <Bell size={20} className="text-gray-500" />;
        }
    };

    const getFilteredNotifications = () => {
        let filtered = notifications;

        // Filtrer par onglet
        if (activeTab !== 'all') {
            switch (activeTab) {
                case 'mentions':
                    filtered = filtered.filter(n => n.type === 'mention' || n.type === 'comment');
                    break;
                case 'likes':
                    filtered = filtered.filter(n => n.type === 'like');
                    break;
                case 'follows':
                    filtered = filtered.filter(n => n.type === 'follow');
                    break;
                case 'system':
                    filtered = filtered.filter(n => ['system', 'achievement', 'trending'].includes(n.type));
                    break;
            }
        }

        // Filtrer par type
        switch (filterType) {
            case 'unread':
                filtered = filtered.filter(n => !n.isRead);
                break;
            case 'today':
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                filtered = filtered.filter(n => new Date(n.timestamp) >= today);
                break;
            case 'week':
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                filtered = filtered.filter(n => new Date(n.timestamp) >= weekAgo);
                break;
        }

        return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = (now - date) / (1000 * 60);

        if (diffInMinutes < 1) {
            return 'À l\'instant';
        } else if (diffInMinutes < 60) {
            return `Il y a ${Math.floor(diffInMinutes)} min`;
        } else if (diffInMinutes < 1440) {
            return `Il y a ${Math.floor(diffInMinutes / 60)} h`;
        } else {
            return `Il y a ${Math.floor(diffInMinutes / 1440)} j`;
        }
    };

    const updateNotificationSettings = (key, value) => {
        const newSettings = { ...notificationSettings, [key]: value };
        setNotificationSettings(newSettings);
        localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (!user) {
        return (
            <div className="page-container">
                <div className="auth-required">
                    <span className="auth-icon">🔒</span>
                    <h3>Connexion requise</h3>
                    <p>Connectez-vous pour voir vos notifications</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Chargement des notifications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            {/* Header */}
            <div className="notifications-header">
                <div className="header-content">
                    <h1>
                        <Bell size={28} /> 
                        Notifications
                        {unreadCount > 0 && (
                            <span className="unread-badge">{unreadCount}</span>
                        )}
                    </h1>
                    <p>Restez au courant de toute l'activité</p>
                </div>

                <div className="header-actions">
                    {isSelectionMode ? (
                        <div className="selection-actions">
                            <button onClick={() => setIsSelectionMode(false)}>
                                Annuler
                            </button>
                            <button 
                                onClick={() => markAsRead(Array.from(selectedNotifications))}
                                disabled={selectedNotifications.size === 0}
                            >
                                <Check size={16} />
                                Marquer comme lu
                            </button>
                            <button 
                                onClick={() => deleteNotifications(Array.from(selectedNotifications))}
                                disabled={selectedNotifications.size === 0}
                                className="delete-button"
                            >
                                <Trash2 size={16} />
                                Supprimer
                            </button>
                        </div>
                    ) : (
                        <>
                            <button onClick={markAllAsRead} disabled={unreadCount === 0}>
                                <CheckCheck size={16} />
                                Tout marquer comme lu
                            </button>
                            <button onClick={() => setIsSelectionMode(true)}>
                                Sélectionner
                            </button>
                            <button className="settings-button">
                                <Settings size={16} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Onglets */}
            <div className="notification-tabs">
                <button 
                    className={activeTab === 'all' ? 'active' : ''}
                    onClick={() => setActiveTab('all')}
                >
                    Toutes ({notifications.length})
                </button>
                <button 
                    className={activeTab === 'mentions' ? 'active' : ''}
                    onClick={() => setActiveTab('mentions')}
                >
                    <MessageCircle size={16} />
                    Mentions
                </button>
                <button 
                    className={activeTab === 'likes' ? 'active' : ''}
                    onClick={() => setActiveTab('likes')}
                >
                    <Heart size={16} />
                    J'aime
                </button>
                <button 
                    className={activeTab === 'follows' ? 'active' : ''}
                    onClick={() => setActiveTab('follows')}
                >
                    <UserPlus size={16} />
                    Abonnés
                </button>
                <button 
                    className={activeTab === 'system' ? 'active' : ''}
                    onClick={() => setActiveTab('system')}
                >
                    <Bell size={16} />
                    Système
                </button>
            </div>

            {/* Filtres */}
            <div className="notification-filters">
                <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="all">Toutes les notifications</option>
                    <option value="unread">Non lues uniquement</option>
                    <option value="today">Aujourd'hui</option>
                    <option value="week">Cette semaine</option>
                </select>
            </div>

            {/* Liste des notifications */}
            <div className="notifications-list">
                {getFilteredNotifications().length === 0 ? (
                    <div className="empty-state">
                        <Bell size={64} />
                        <h3>Aucune notification</h3>
                        <p>
                            {filterType === 'unread' 
                                ? 'Toutes vos notifications sont lues !' 
                                : 'Vous n\'avez pas encore de notifications.'
                            }
                        </p>
                    </div>
                ) : (
                    getFilteredNotifications().map((notification) => (
                        <div
                            key={notification.id}
                            className={`notification-item ${!notification.isRead ? 'unread' : ''} ${selectedNotifications.has(notification.id) ? 'selected' : ''} priority-${notification.priority}`}
                            onClick={() => {
                                if (isSelectionMode) {
                                    toggleNotificationSelection(notification.id);
                                } else if (!notification.isRead) {
                                    markAsRead(notification.id);
                                }
                            }}
                        >
                            {isSelectionMode && (
                                <div className="selection-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectedNotifications.has(notification.id)}
                                        onChange={() => toggleNotificationSelection(notification.id)}
                                    />
                                </div>
                            )}

                            <div className="notification-icon">
                                {notification.user ? (
                                    <div className="user-avatar">
                                        {notification.user.avatar ? (
                                            <img src={notification.user.avatar} alt={notification.user.name} />
                                        ) : (
                                            <span>{notification.user.name[0]}</span>
                                        )}
                                        {notification.user.isVerified && (
                                            <div className="verified-badge">✓</div>
                                        )}
                                        <div className="notification-type-badge">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="system-icon">
                                        {notification.icon ? (
                                            <span className="emoji-icon">{notification.icon}</span>
                                        ) : (
                                            getNotificationIcon(notification.type)
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="notification-content">
                                <div className="notification-header">
                                    <h4>{notification.title}</h4>
                                    <span className="notification-time">
                                        {formatTime(notification.timestamp)}
                                    </span>
                                </div>
                                
                                <p className="notification-message">
                                    {notification.message}
                                </p>

                                {notification.relatedContent && (
                                    <div className="related-content">
                                        {notification.relatedContent.type === 'video' && (
                                            <div className="video-preview">
                                                <div className="video-thumbnail">
                                                    📹
                                                </div>
                                                <div className="video-info">
                                                    <span className="video-title">
                                                        {notification.relatedContent.title}
                                                    </span>
                                                    {notification.relatedContent.views && (
                                                        <span className="video-views">
                                                            {notification.relatedContent.views.toLocaleString()} vues
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {notification.relatedContent.type === 'comment' && (
                                            <div className="comment-preview">
                                                <p>"{notification.relatedContent.text}"</p>
                                                <span>sur {notification.relatedContent.videoTitle}</span>
                                            </div>
                                        )}
                                        
                                        {notification.relatedContent.type === 'achievement' && (
                                            <div className="achievement-preview">
                                                <div className="achievement-icon">🏆</div>
                                                <div className="achievement-info">
                                                    <h5>{notification.relatedContent.name}</h5>
                                                    <p>{notification.relatedContent.description}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {!notification.isRead && (
                                <div className="unread-indicator"></div>
                            )}

                            {!isSelectionMode && (
                                <div className="notification-actions">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            markAsRead(notification.id);
                                        }}
                                        className="mark-read-button"
                                    >
                                        {notification.isRead ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteNotifications(notification.id);
                                        }}
                                        className="delete-button"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Paramètres de notification (modal ou section) */}
            <div className="notification-settings">
                <h3><Settings size={20} /> Paramètres de notification</h3>
                
                <div className="settings-grid">
                    <div className="setting-item">
                        <div className="setting-info">
                            <span>J'aime sur vos vidéos</span>
                            <small>Recevoir une notification quand quelqu'un aime vos vidéos</small>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={notificationSettings.likes}
                                onChange={(e) => updateNotificationSettings('likes', e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <span>Commentaires</span>
                            <small>Recevoir une notification pour les nouveaux commentaires</small>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={notificationSettings.comments}
                                onChange={(e) => updateNotificationSettings('comments', e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <span>Nouveaux abonnés</span>
                            <small>Recevoir une notification pour les nouveaux abonnés</small>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={notificationSettings.follows}
                                onChange={(e) => updateNotificationSettings('follows', e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <span>Mentions</span>
                            <small>Recevoir une notification quand vous êtes mentionné</small>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={notificationSettings.mentions}
                                onChange={(e) => updateNotificationSettings('mentions', e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <span>Sons de notification</span>
                            <small>Jouer un son pour les nouvelles notifications</small>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={notificationSettings.sound}
                                onChange={(e) => updateNotificationSettings('sound', e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <span>Notifications push</span>
                            <small>Recevoir des notifications même quand l'app est fermée</small>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={notificationSettings.push}
                                onChange={(e) => updateNotificationSettings('push', e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationPage;

