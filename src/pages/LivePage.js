import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    Radio, 
    Users, 
    MessageCircle, 
    Heart, 
    Share, 
    Gift,
    Settings,
    Mic,
    MicOff,
    Video,
    VideoOff,
    Monitor,
    Smartphone,
    Eye,
    Clock,
    Star,
    Zap,
    Send,
    Smile,
    MoreHorizontal
} from 'lucide-react';

const LivePage = () => {
    const { user, userProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('discover'); // discover, following, create
    const [liveStreams, setLiveStreams] = useState([]);
    const [followingLives, setFollowingLives] = useState([]);
    const [isCreatingLive, setIsCreatingLive] = useState(false);
    const [selectedStream, setSelectedStream] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [liveSettings, setLiveSettings] = useState({
        title: '',
        description: '',
        category: 'general',
        isPrivate: false,
        allowComments: true,
        allowGifts: true
    });
    const [streamStats, setStreamStats] = useState({
        viewers: 0,
        likes: 0,
        duration: 0,
        gifts: 0
    });
    const [deviceSettings, setDeviceSettings] = useState({
        camera: true,
        microphone: true,
        quality: 'hd'
    });

    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const categories = [
        { id: 'general', name: 'Général', icon: '📱' },
        { id: 'gaming', name: 'Gaming', icon: '🎮' },
        { id: 'music', name: 'Musique', icon: '🎵' },
        { id: 'talk', name: 'Discussion', icon: '💬' },
        { id: 'education', name: 'Éducation', icon: '📚' },
        { id: 'cooking', name: 'Cuisine', icon: '👨‍🍳' },
        { id: 'fitness', name: 'Fitness', icon: '💪' },
        { id: 'art', name: 'Art', icon: '🎨' }
    ];

    useEffect(() => {
        loadLiveStreams();
        if (user) {
            loadFollowingLives();
        }
    }, [user]);

    useEffect(() => {
        // Simuler les messages de chat en temps réel
        if (selectedStream) {
            const interval = setInterval(() => {
                addRandomChatMessage();
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [selectedStream]);

    const loadLiveStreams = async () => {
        try {
            // Simuler des streams en direct
            const mockStreams = [
                {
                    id: '1',
                    title: 'Cuisine en direct - Recette de pâtes',
                    streamer: {
                        id: 'user1',
                        name: 'Chef Marie',
                        username: 'chefmarie',
                        avatar: null,
                        isVerified: true,
                        followers: 15420
                    },
                    category: 'cooking',
                    viewers: 1247,
                    likes: 892,
                    duration: 1800, // 30 minutes
                    thumbnail: null,
                    isLive: true,
                    startedAt: new Date(Date.now() - 1800000).toISOString()
                },
                {
                    id: '2',
                    title: 'Session gaming - Nouveau jeu indie',
                    streamer: {
                        id: 'user2',
                        name: 'GameMaster',
                        username: 'gamemaster',
                        avatar: null,
                        isVerified: false,
                        followers: 8765
                    },
                    category: 'gaming',
                    viewers: 892,
                    likes: 654,
                    duration: 3600, // 1 heure
                    thumbnail: null,
                    isLive: true,
                    startedAt: new Date(Date.now() - 3600000).toISOString()
                },
                {
                    id: '3',
                    title: 'Cours de guitare pour débutants',
                    streamer: {
                        id: 'user3',
                        name: 'Music Teacher',
                        username: 'musicteacher',
                        avatar: null,
                        isVerified: true,
                        followers: 12340
                    },
                    category: 'music',
                    viewers: 567,
                    likes: 423,
                    duration: 2700, // 45 minutes
                    thumbnail: null,
                    isLive: true,
                    startedAt: new Date(Date.now() - 2700000).toISOString()
                }
            ];

            setLiveStreams(mockStreams);
        } catch (error) {
            console.error('Erreur chargement streams:', error);
        }
    };

    const loadFollowingLives = async () => {
        try {
            // Filtrer les streams des utilisateurs suivis
            const followingStreams = liveStreams.filter(stream => 
                // Simuler que l'utilisateur suit certains streamers
                ['user1', 'user3'].includes(stream.streamer.id)
            );
            setFollowingLives(followingStreams);
        } catch (error) {
            console.error('Erreur chargement lives following:', error);
        }
    };

    const addRandomChatMessage = () => {
        const randomMessages = [
            { user: 'User123', message: 'Salut tout le monde ! 👋', type: 'message' },
            { user: 'Fan456', message: 'Super stream !', type: 'message' },
            { user: 'Viewer789', message: '❤️❤️❤️', type: 'like' },
            { user: 'Supporter', message: 'a envoyé un cadeau 🎁', type: 'gift' },
            { user: 'NewViewer', message: 'Première fois ici, c\'est génial !', type: 'message' }
        ];

        const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        setChatMessages(prev => [...prev.slice(-50), {
            id: Date.now(),
            ...randomMessage,
            timestamp: new Date().toISOString()
        }]);
    };

    const startLiveStream = async () => {
        try {
            // Demander l'accès à la caméra et au microphone
            const stream = await navigator.mediaDevices.getUserMedia({
                video: deviceSettings.camera,
                audio: deviceSettings.microphone
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            streamRef.current = stream;
            setIsCreatingLive(true);

            // Simuler le démarrage du stream
            setStreamStats({
                viewers: 1,
                likes: 0,
                duration: 0,
                gifts: 0
            });

            // Démarrer le compteur de durée
            const durationInterval = setInterval(() => {
                setStreamStats(prev => ({
                    ...prev,
                    duration: prev.duration + 1
                }));
            }, 1000);

            return () => clearInterval(durationInterval);
        } catch (error) {
            console.error('Erreur démarrage stream:', error);
            alert('Impossible d\'accéder à la caméra/microphone');
        }
    };

    const stopLiveStream = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        setIsCreatingLive(false);
        setStreamStats({ viewers: 0, likes: 0, duration: 0, gifts: 0 });
    };

    const toggleDevice = (device) => {
        setDeviceSettings(prev => ({
            ...prev,
            [device]: !prev[device]
        }));

        if (streamRef.current) {
            const tracks = streamRef.current.getTracks();
            tracks.forEach(track => {
                if (device === 'camera' && track.kind === 'video') {
                    track.enabled = !deviceSettings.camera;
                }
                if (device === 'microphone' && track.kind === 'audio') {
                    track.enabled = !deviceSettings.microphone;
                }
            });
        }
    };

    const sendChatMessage = () => {
        if (!newMessage.trim() || !user) return;

        const message = {
            id: Date.now(),
            user: userProfile?.displayName || user.name,
            message: newMessage,
            type: 'message',
            timestamp: new Date().toISOString(),
            isOwn: true
        };

        setChatMessages(prev => [...prev, message]);
        setNewMessage('');
    };

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num?.toString() || '0';
    };

    return (
        <div className="page-container">
            {/* Header */}
            <div className="live-header">
                <div className="header-content">
                    <h1><Radio size={28} /> Live</h1>
                    <p>Diffusez en direct ou regardez des streams</p>
                </div>
                
                {user && (
                    <button 
                        onClick={() => setActiveTab('create')}
                        className="start-live-button"
                    >
                        <Radio size={20} />
                        Démarrer un live
                    </button>
                )}
            </div>

            {/* Onglets */}
            <div className="live-tabs">
                <button 
                    className={activeTab === 'discover' ? 'active' : ''}
                    onClick={() => setActiveTab('discover')}
                >
                    <Zap size={16} />
                    Découvrir
                </button>
                {user && (
                    <button 
                        className={activeTab === 'following' ? 'active' : ''}
                        onClick={() => setActiveTab('following')}
                    >
                        <Heart size={16} />
                        Abonnements
                    </button>
                )}
                {user && (
                    <button 
                        className={activeTab === 'create' ? 'active' : ''}
                        onClick={() => setActiveTab('create')}
                    >
                        <Radio size={16} />
                        Créer
                    </button>
                )}
            </div>

            {/* Contenu */}
            <div className="live-content">
                {activeTab === 'discover' && (
                    <div className="discover-lives">
                        <div className="section-header">
                            <h3>🔴 En direct maintenant</h3>
                            <p>{liveStreams.length} streams actifs</p>
                        </div>
                        
                        <div className="live-grid">
                            {liveStreams.map((stream) => (
                                <div 
                                    key={stream.id} 
                                    className="live-card"
                                    onClick={() => setSelectedStream(stream)}
                                >
                                    <div className="live-thumbnail">
                                        <div className="thumbnail-placeholder">
                                            📺 LIVE
                                        </div>
                                        <div className="live-badge">🔴 LIVE</div>
                                        <div className="viewer-count">
                                            <Eye size={12} />
                                            {formatNumber(stream.viewers)}
                                        </div>
                                    </div>
                                    
                                    <div className="live-info">
                                        <h4>{stream.title}</h4>
                                        <div className="streamer-info">
                                            <div className="streamer-avatar">
                                                {stream.streamer.avatar ? (
                                                    <img src={stream.streamer.avatar} alt={stream.streamer.name} />
                                                ) : (
                                                    <span>{stream.streamer.name[0]}</span>
                                                )}
                                                {stream.streamer.isVerified && <div className="verified-badge">✓</div>}
                                            </div>
                                            <div className="streamer-details">
                                                <span className="streamer-name">{stream.streamer.name}</span>
                                                <span className="streamer-category">
                                                    {categories.find(c => c.id === stream.category)?.icon} 
                                                    {categories.find(c => c.id === stream.category)?.name}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="live-stats">
                                            <span>
                                                <Heart size={12} />
                                                {formatNumber(stream.likes)}
                                            </span>
                                            <span>
                                                <Clock size={12} />
                                                {formatDuration(stream.duration)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'following' && user && (
                    <div className="following-lives">
                        {followingLives.length === 0 ? (
                            <div className="empty-state">
                                <span className="empty-icon">📺</span>
                                <h3>Aucun live d'abonnement</h3>
                                <p>Vos créateurs préférés ne sont pas en direct actuellement</p>
                            </div>
                        ) : (
                            <div className="live-grid">
                                {followingLives.map((stream) => (
                                    <div 
                                        key={stream.id} 
                                        className="live-card following"
                                        onClick={() => setSelectedStream(stream)}
                                    >
                                        {/* Même structure que discover mais avec style différent */}
                                        <div className="live-thumbnail">
                                            <div className="thumbnail-placeholder">
                                                📺 LIVE
                                            </div>
                                            <div className="live-badge following">🔴 ABONNEMENT</div>
                                            <div className="viewer-count">
                                                <Eye size={12} />
                                                {formatNumber(stream.viewers)}
                                            </div>
                                        </div>
                                        
                                        <div className="live-info">
                                            <h4>{stream.title}</h4>
                                            <div className="streamer-info">
                                                <div className="streamer-avatar">
                                                    <span>{stream.streamer.name[0]}</span>
                                                    {stream.streamer.isVerified && <div className="verified-badge">✓</div>}
                                                </div>
                                                <div className="streamer-details">
                                                    <span className="streamer-name">{stream.streamer.name}</span>
                                                    <span className="streamer-category">
                                                        {categories.find(c => c.id === stream.category)?.icon} 
                                                        {categories.find(c => c.id === stream.category)?.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'create' && user && (
                    <div className="create-live">
                        {!isCreatingLive ? (
                            <div className="live-setup">
                                <div className="setup-form">
                                    <h3>Configurer votre live</h3>
                                    
                                    <div className="form-group">
                                        <label>Titre du live</label>
                                        <input
                                            type="text"
                                            value={liveSettings.title}
                                            onChange={(e) => setLiveSettings(prev => ({...prev, title: e.target.value}))}
                                            placeholder="Donnez un titre à votre live"
                                            maxLength={100}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea
                                            value={liveSettings.description}
                                            onChange={(e) => setLiveSettings(prev => ({...prev, description: e.target.value}))}
                                            placeholder="Décrivez votre live"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Catégorie</label>
                                        <div className="category-selector">
                                            {categories.map((category) => (
                                                <button
                                                    key={category.id}
                                                    onClick={() => setLiveSettings(prev => ({...prev, category: category.id}))}
                                                    className={`category-option ${liveSettings.category === category.id ? 'active' : ''}`}
                                                >
                                                    <span>{category.icon}</span>
                                                    <span>{category.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="device-settings">
                                        <h4>Paramètres de diffusion</h4>
                                        <div className="device-controls">
                                            <button 
                                                onClick={() => toggleDevice('camera')}
                                                className={`device-button ${deviceSettings.camera ? 'active' : ''}`}
                                            >
                                                {deviceSettings.camera ? <Video size={20} /> : <VideoOff size={20} />}
                                                Caméra
                                            </button>
                                            
                                            <button 
                                                onClick={() => toggleDevice('microphone')}
                                                className={`device-button ${deviceSettings.microphone ? 'active' : ''}`}
                                            >
                                                {deviceSettings.microphone ? <Mic size={20} /> : <MicOff size={20} />}
                                                Microphone
                                            </button>
                                        </div>

                                        <div className="quality-selector">
                                            <label>Qualité</label>
                                            <select 
                                                value={deviceSettings.quality}
                                                onChange={(e) => setDeviceSettings(prev => ({...prev, quality: e.target.value}))}
                                            >
                                                <option value="sd">SD (480p)</option>
                                                <option value="hd">HD (720p)</option>
                                                <option value="fhd">Full HD (1080p)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="privacy-settings">
                                        <div className="setting-item">
                                            <span>Live privé</span>
                                            <label className="toggle">
                                                <input
                                                    type="checkbox"
                                                    checked={liveSettings.isPrivate}
                                                    onChange={(e) => setLiveSettings(prev => ({...prev, isPrivate: e.target.checked}))}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                        
                                        <div className="setting-item">
                                            <span>Autoriser les commentaires</span>
                                            <label className="toggle">
                                                <input
                                                    type="checkbox"
                                                    checked={liveSettings.allowComments}
                                                    onChange={(e) => setLiveSettings(prev => ({...prev, allowComments: e.target.checked}))}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={startLiveStream}
                                        className="start-streaming-button"
                                        disabled={!liveSettings.title.trim()}
                                    >
                                        <Radio size={20} />
                                        Commencer le live
                                    </button>
                                </div>

                                <div className="preview-area">
                                    <video 
                                        ref={videoRef}
                                        autoPlay 
                                        muted 
                                        className="camera-preview"
                                    />
                                    <div className="preview-overlay">
                                        <span>Aperçu de votre caméra</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="live-streaming">
                                <div className="streaming-interface">
                                    <div className="stream-video">
                                        <video 
                                            ref={videoRef}
                                            autoPlay 
                                            muted 
                                            className="live-video"
                                        />
                                        
                                        <div className="stream-overlay">
                                            <div className="live-indicator">
                                                🔴 EN DIRECT
                                            </div>
                                            
                                            <div className="stream-stats">
                                                <span><Eye size={16} /> {streamStats.viewers}</span>
                                                <span><Heart size={16} /> {streamStats.likes}</span>
                                                <span><Clock size={16} /> {formatDuration(streamStats.duration)}</span>
                                            </div>
                                        </div>

                                        <div className="stream-controls">
                                            <button 
                                                onClick={() => toggleDevice('camera')}
                                                className={`control-button ${!deviceSettings.camera ? 'disabled' : ''}`}
                                            >
                                                {deviceSettings.camera ? <Video size={20} /> : <VideoOff size={20} />}
                                            </button>
                                            
                                            <button 
                                                onClick={() => toggleDevice('microphone')}
                                                className={`control-button ${!deviceSettings.microphone ? 'disabled' : ''}`}
                                            >
                                                {deviceSettings.microphone ? <Mic size={20} /> : <MicOff size={20} />}
                                            </button>
                                            
                                            <button className="control-button">
                                                <Settings size={20} />
                                            </button>
                                            
                                            <button 
                                                onClick={stopLiveStream}
                                                className="stop-button"
                                            >
                                                Arrêter
                                            </button>
                                        </div>
                                    </div>

                                    <div className="live-chat">
                                        <div className="chat-header">
                                            <h4><MessageCircle size={16} /> Chat en direct</h4>
                                            <span>{streamStats.viewers} spectateurs</span>
                                        </div>
                                        
                                        <div className="chat-messages">
                                            {chatMessages.map((message) => (
                                                <div 
                                                    key={message.id} 
                                                    className={`chat-message ${message.type} ${message.isOwn ? 'own' : ''}`}
                                                >
                                                    <span className="message-user">{message.user}:</span>
                                                    <span className="message-text">{message.message}</span>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="chat-input">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                                                placeholder="Tapez votre message..."
                                            />
                                            <button onClick={sendChatMessage}>
                                                <Send size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal de visualisation de stream */}
            {selectedStream && (
                <div className="stream-modal">
                    <div className="modal-content">
                        <div className="stream-player">
                            <div className="player-placeholder">
                                📺 Stream de {selectedStream.streamer.name}
                            </div>
                            <button 
                                onClick={() => setSelectedStream(null)}
                                className="close-button"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="stream-info">
                            <h3>{selectedStream.title}</h3>
                            <div className="stream-meta">
                                <span><Eye size={14} /> {formatNumber(selectedStream.viewers)} spectateurs</span>
                                <span><Heart size={14} /> {formatNumber(selectedStream.likes)} likes</span>
                                <span><Clock size={14} /> {formatDuration(selectedStream.duration)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LivePage;
