import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { videoService } from '../services/videoService';
import { followService } from '../services/followService';
import { likeService } from '../services/likeService';
import { 
    Settings, 
    Edit3, 
    Grid, 
    Heart, 
    Bookmark, 
    Users, 
    UserPlus, 
    UserMinus,
    Share,
    MoreHorizontal,
    Camera,
    MapPin,
    Calendar,
    Link as LinkIcon
} from 'lucide-react';
import VideoCard from '../components/VideoCard';

const ProfilePage = () => {
    const { user, userProfile, updateProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('videos'); // videos, liked, saved
    const [userVideos, setUserVideos] = useState([]);
    const [likedVideos, setLikedVideos] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({
        displayName: '',
        bio: '',
        website: '',
        location: ''
    });
    const [stats, setStats] = useState({
        totalViews: 0,
        totalLikes: 0,
        avgViews: 0
    });

    useEffect(() => {
        if (userProfile) {
            loadUserData();
            setEditData({
                displayName: userProfile.displayName || '',
                bio: userProfile.bio || '',
                website: userProfile.website || '',
                location: userProfile.location || ''
            });
        }
    }, [userProfile]);

    const loadUserData = async () => {
        if (!userProfile) return;

        setLoading(true);
        try {
            await Promise.all([
                loadUserVideos(),
                loadLikedVideos(),
                loadFollowData(),
                calculateStats()
            ]);
        } catch (error) {
            console.error('Erreur chargement données profil:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadUserVideos = async () => {
        try {
            const result = await videoService.getUserVideos(userProfile.$id, 50);
            if (result.success) {
                setUserVideos(result.videos);
            }
        } catch (error) {
            console.error('Erreur chargement vidéos utilisateur:', error);
        }
    };

    const loadLikedVideos = async () => {
        try {
            const result = await likeService.getUserLikedVideos(userProfile.$id);
            if (result.success) {
                setLikedVideos(result.videos);
            }
        } catch (error) {
            console.error('Erreur chargement vidéos likées:', error);
        }
    };

    const loadFollowData = async () => {
        try {
            const [followersResult, followingResult] = await Promise.all([
                followService.getFollowers(userProfile.$id),
                followService.getFollowing(userProfile.$id)
            ]);

            if (followersResult.success) setFollowers(followersResult.followers);
            if (followingResult.success) setFollowing(followingResult.following);

            // Vérifier si l'utilisateur actuel suit ce profil
            if (user && user.$id !== userProfile.$id) {
                const following = await followService.checkIfFollowing(user.$id, userProfile.$id);
                setIsFollowing(following);
            }
        } catch (error) {
            console.error('Erreur chargement données follow:', error);
        }
    };

    const calculateStats = async () => {
        try {
            const totalViews = userVideos.reduce((sum, video) => sum + (video.viewsCount || 0), 0);
            const totalLikes = userVideos.reduce((sum, video) => sum + (video.likesCount || 0), 0);
            const avgViews = userVideos.length > 0 ? Math.round(totalViews / userVideos.length) : 0;

            setStats({ totalViews, totalLikes, avgViews });
        } catch (error) {
            console.error('Erreur calcul statistiques:', error);
        }
    };

    const handleFollow = async () => {
        if (!user || user.$id === userProfile.$id) return;

        try {
            const result = await followService.toggleFollow(user.$id, userProfile.$id);
            if (result.success) {
                setIsFollowing(result.following);
                // Recharger les données de follow
                await loadFollowData();
            }
        } catch (error) {
            console.error('Erreur toggle follow:', error);
        }
    };

    const handleSaveProfile = async () => {
        try {
            const result = await updateProfile(editData);
            if (result.success) {
                setEditMode(false);
            }
        } catch (error) {
            console.error('Erreur mise à jour profil:', error);
        }
    };

    const handleProfilePictureChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Ici vous pouvez implémenter l'upload d'image
        console.log('Upload image profil:', file);
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num?.toString() || '0';
    };

    const isOwnProfile = user && userProfile && user.$id === userProfile.$id;

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Chargement du profil...</p>
                </div>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="page-container">
                <div className="error-container">
                    <span className="error-icon">👤</span>
                    <h3>Profil non trouvé</h3>
                    <p>Ce profil n'existe pas ou a été supprimé</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            {/* Header du profil */}
            <div className="profile-header">
                <div className="profile-cover">
                    <div className="profile-avatar-container">
                        <div className="profile-avatar">
                            {userProfile.profilePicture ? (
                                <img src={userProfile.profilePicture} alt={userProfile.displayName} />
                            ) : (
                                <span className="avatar-placeholder">
                                    {userProfile.displayName?.[0] || '👤'}
                                </span>
                            )}
                            {isOwnProfile && (
                                <label className="avatar-edit">
                                    <Camera size={16} />
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleProfilePictureChange}
                                        hidden 
                                    />
                                </label>
                            )}
                        </div>
                        
                        {userProfile.isVerified && (
                            <div className="verified-badge">✓</div>
                        )}
                    </div>
                </div>

                <div className="profile-info">
                    <div className="profile-main">
                        {editMode ? (
                            <div className="edit-form">
                                <input
                                    type="text"
                                    value={editData.displayName}
                                    onChange={(e) => setEditData({...editData, displayName: e.target.value})}
                                    placeholder="Nom d'affichage"
                                    className="edit-input"
                                />
                                <textarea
                                    value={editData.bio}
                                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                                    placeholder="Biographie"
                                    className="edit-textarea"
                                    rows={3}
                                />
                                <input
                                    type="text"
                                    value={editData.location}
                                    onChange={(e) => setEditData({...editData, location: e.target.value})}
                                    placeholder="Localisation"
                                    className="edit-input"
                                />
                                <input
                                    type="url"
                                    value={editData.website}
                                    onChange={(e) => setEditData({...editData, website: e.target.value})}
                                    placeholder="Site web"
                                    className="edit-input"
                                />
                                <div className="edit-actions">
                                    <button onClick={() => setEditMode(false)} className="cancel-button">
                                        Annuler
                                    </button>
                                    <button onClick={handleSaveProfile} className="save-button">
                                        Sauvegarder
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h1>{userProfile.displayName}</h1>
                                <p className="username">@{userProfile.username}</p>
                                
                                {userProfile.bio && (
                                    <p className="bio">{userProfile.bio}</p>
                                )}

                                <div className="profile-meta">
                                    {userProfile.location && (
                                        <div className="meta-item">
                                            <MapPin size={14} />
                                            <span>{userProfile.location}</span>
                                        </div>
                                    )}
                                    
                                    {userProfile.website && (
                                        <div className="meta-item">
                                            <LinkIcon size={14} />
                                            <a href={userProfile.website} target="_blank" rel="noopener noreferrer">
                                                {userProfile.website}
                                            </a>
                                        </div>
                                    )}
                                    
                                    <div className="meta-item">
                                        <Calendar size={14} />
                                        <span>Rejoint en {new Date(userProfile.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="profile-actions">
                        {isOwnProfile ? (
                            <div className="own-profile-actions">
                                <button 
                                    onClick={() => setEditMode(!editMode)}
                                    className="edit-profile-button"
                                >
                                    <Edit3 size={16} />
                                    {editMode ? 'Annuler' : 'Modifier'}
                                </button>
                                <button className="settings-button">
                                    <Settings size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="other-profile-actions">
                                <button 
                                    onClick={handleFollow}
                                    className={`follow-button ${isFollowing ? 'following' : ''}`}
                                >
                                    {isFollowing ? (
                                        <>
                                            <UserMinus size={16} />
                                            Ne plus suivre
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus size={16} />
                                            Suivre
                                        </>
                                    )}
                                </button>
                                <button className="share-button">
                                    <Share size={16} />
                                </button>
                                <button className="more-button">
                                    <MoreHorizontal size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Statistiques */}
                <div className="profile-stats">
                    <div className="stat-item">
                        <span className="stat-number">{formatNumber(userProfile.followersCount || 0)}</span>
                        <span className="stat-label">Abonnés</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{formatNumber(userProfile.followingCount || 0)}</span>
                        <span className="stat-label">Abonnements</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{formatNumber(stats.totalLikes)}</span>
                        <span className="stat-label">J'aime</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{formatNumber(stats.totalViews)}</span>
                        <span className="stat-label">Vues</span>
                    </div>
                </div>
            </div>

            {/* Onglets de contenu */}
            <div className="profile-tabs">
                <button 
                    className={activeTab === 'videos' ? 'active' : ''}
                    onClick={() => setActiveTab('videos')}
                >
                    <Grid size={16} />
                    Vidéos ({userVideos.length})
                </button>
                
                {isOwnProfile && (
                    <>
                        <button 
                            className={activeTab === 'liked' ? 'active' : ''}
                            onClick={() => setActiveTab('liked')}
                        >
                            <Heart size={16} />
                            J'aime ({likedVideos.length})
                        </button>
                        <button 
                            className={activeTab === 'saved' ? 'active' : ''}
                            onClick={() => setActiveTab('saved')}
                        >
                            <Bookmark size={16} />
                            Sauvegardées
                        </button>
                    </>
                )}
            </div>

            {/* Contenu des onglets */}
            <div className="profile-content">
                {activeTab === 'videos' && (
                    <div className="videos-grid">
                        {userVideos.length === 0 ? (
                            <div className="empty-state">
                                <span className="empty-icon">📹</span>
                                <h3>Aucune vidéo</h3>
                                <p>
                                    {isOwnProfile 
                                        ? 'Commencez à créer du contenu !' 
                                        : 'Cet utilisateur n\'a pas encore publié de vidéos.'
                                    }
                                </p>
                            </div>
                        ) : (
                            userVideos.map((video) => (
                                <VideoCard
                                    key={video.$id}
                                    video={{...video, user: userProfile}}
                                    compact={true}
                                />
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'liked' && isOwnProfile && (
                    <div className="videos-grid">
                        {likedVideos.length === 0 ? (
                            <div className="empty-state">
                                <span className="empty-icon">❤️</span>
                                <h3>Aucune vidéo likée</h3>
                                <p>Les vidéos que vous aimez apparaîtront ici</p>
                            </div>
                        ) : (
                            likedVideos.map((video) => (
                                <VideoCard
                                    key={video.$id}
                                    video={video}
                                    compact={true}
                                />
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'saved' && isOwnProfile && (
                    <div className="videos-grid">
                        <div className="empty-state">
                            <span className="empty-icon">🔖</span>
                            <h3>Aucune vidéo sauvegardée</h3>
                            <p>Fonctionnalité à venir</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;

