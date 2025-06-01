import React, { useState } from 'react';
import { Heart, MessageCircle, Share, Bookmark, Play, Pause } from 'lucide-react';
import { useLikes } from '../hooks/useLikes';
import { useAuth } from '../context/AuthContext';

const VideoCard = ({ video, onComment }) => {
    const { user } = useAuth();
    const [isPlaying, setIsPlaying] = useState(false);
    const { liked, toggleLike } = useLikes(video.$id, 'video');

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
        // Ici vous pouvez ajouter la logique pour play/pause la vidéo
    };

    const formatCount = (count) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count?.toString() || '0';
    };

    return (
        <div className="video-card">
            <div className="video-container" onClick={handlePlayPause}>
                {video.videoUrl ? (
                    <video
                        src={video.videoUrl}
                        poster={video.thumbnailUrl}
                        className="video-element"
                        loop
                        muted
                    />
                ) : (
                    <div className="video-placeholder">
                        <div className="video-overlay">
                            <span className="video-emoji">🎬</span>
                            <p>Vidéo #{video.$id.slice(-4)}</p>
                        </div>
                    </div>
                )}
                
                <div className="video-controls">
                    <button className="play-button">
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                </div>
            </div>
            
            <div className="video-info">
                <div className="user-info">
                    <div className="user-avatar">
                        {video.user?.profilePicture ? (
                            <img src={video.user.profilePicture} alt={video.user.displayName} />
                        ) : (
                            <span>{video.user?.displayName?.[0] || '👤'}</span>
                        )}
                    </div>
                    <div className="user-details">
                        <h3>@{video.user?.username || 'utilisateur'}</h3>
                        <p className="description">{video.description || video.title}</p>
                        {video.createdAt && (
                            <span className="video-date">
                                {new Date(video.createdAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>
                
                <div className="video-actions">
                    <button 
                        className={`action-btn ${liked ? 'liked' : ''}`}
                        onClick={toggleLike}
                        disabled={!user}
                    >
                        <Heart size={20} fill={liked ? '#ff0050' : 'none'} />
                        <span>{formatCount(video.likesCount)}</span>
                    </button>
                    
                    <button 
                        className="action-btn"
                        onClick={() => onComment && onComment(video)}
                    >
                        <MessageCircle size={20} />
                        <span>{formatCount(video.commentsCount)}</span>
                    </button>
                    
                    <button className="action-btn">
                        <Share size={20} />
                        <span>Partager</span>
                    </button>
                    
                    <button className="action-btn">
                        <Bookmark size={20} />
                    </button>
                </div>
            </div>
            
            <div className="video-stats">
                <span>{formatCount(video.viewsCount)} vues</span>
            </div>
        </div>
    );
};

export default VideoCard;
