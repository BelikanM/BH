import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { videoService } from '../services/videoService';
import { storage, BUCKET_ID, ID } from '../services/appwrite';
import { 
    Upload, 
    Camera, 
    Film, 
    Image, 
    Music, 
    Hash, 
    MapPin, 
    Users, 
    Eye, 
    EyeOff,
    X,
    Play,
    Pause,
    Volume2,
    VolumeX,
    Crop,
    Filter,
    Type,
    Palette
} from 'lucide-react';

const CreatePage = () => {
    const { user, userProfile } = useAuth();
    const [step, setStep] = useState(1); // 1: upload, 2: edit, 3: details, 4: publish
    const [selectedFile, setSelectedFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    
    // Données de la vidéo
    const [videoData, setVideoData] = useState({
        title: '',
        description: '',
        hashtags: [],
        location: '',
        isPublic: true,
        allowComments: true,
        allowDuet: true,
        allowStitch: true,
        category: 'general'
    });

    // États d'édition
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentHashtag, setCurrentHashtag] = useState('');
    const [suggestedHashtags] = useState([
        'fyp', 'viral', 'trending', 'dance', 'music', 'comedy', 'art', 'food', 'travel', 'fashion'
    ]);

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);

    const categories = [
        { id: 'general', name: 'Général', icon: '📱' },
        { id: 'dance', name: 'Danse', icon: '💃' },
        { id: 'music', name: 'Musique', icon: '🎵' },
        { id: 'comedy', name: 'Comédie', icon: '😂' },
        { id: 'art', name: 'Art', icon: '🎨' },
        { id: 'food', name: 'Cuisine', icon: '🍳' },
        { id: 'travel', name: 'Voyage', icon: '✈️' },
        { id: 'fashion', name: 'Mode', icon: '👗' },
        { id: 'sports', name: 'Sport', icon: '⚽' },
        { id: 'education', name: 'Éducation', icon: '📚' }
    ];

    const handleFileSelect = useCallback((event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Vérifications
        if (!file.type.startsWith('video/')) {
            alert('Veuillez sélectionner un fichier vidéo');
            return;
        }

        if (file.size > 100 * 1024 * 1024) { // 100MB max
            alert('Le fichier est trop volumineux (max 100MB)');
            return;
        }

        setSelectedFile(file);
        
        // Créer preview
        const url = URL.createObjectURL(file);
        setVideoPreview(url);
        setStep(2);
    }, []);

    const handleDrop = useCallback((event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            const fakeEvent = { target: { files: [file] } };
            handleFileSelect(fakeEvent);
        }
    }, [handleFileSelect]);

    const handleDragOver = useCallback((event) => {
        event.preventDefault();
    }, []);

    const addHashtag = (hashtag) => {
        const tag = hashtag.startsWith('#') ? hashtag.slice(1) : hashtag;
        if (tag && !videoData.hashtags.includes(tag)) {
            setVideoData(prev => ({
                ...prev,
                hashtags: [...prev.hashtags, tag]
            }));
        }
        setCurrentHashtag('');
    };

    const removeHashtag = (hashtag) => {
        setVideoData(prev => ({
            ...prev,
            hashtags: prev.hashtags.filter(h => h !== hashtag)
        }));
    };

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handlePublish = async () => {
        if (!selectedFile || !user) return;

        setUploading(true);
        setUploadProgress(0);

        try {
            // Simuler progression upload
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            // Upload de la vidéo
            const uploadResult = await storage.createFile(
                BUCKET_ID,
                ID.unique(),
                selectedFile
            );

            clearInterval(progressInterval);
            setUploadProgress(95);

            // Créer l'entrée vidéo dans la base
            const result = await videoService.createVideo({
                userId: user.$id,
                title: videoData.title || `Vidéo de ${userProfile?.displayName || 'Utilisateur'}`,
                description: videoData.description,
                hashtags: videoData.hashtags.join(','),
                location: videoData.location,
                isPublic: videoData.isPublic,
                allowComments: videoData.allowComments,
                category: videoData.category,
                duration: Math.floor(Math.random() * 60) + 15 // Durée simulée
            }, selectedFile);

            setUploadProgress(100);

            if (result.success) {
                // Rediriger vers le profil ou la vidéo
                alert('Vidéo publiée avec succès !');
                resetForm();
            } else {
                throw new Error(result.error);
            }

        } catch (error) {
            console.error('Erreur publication:', error);
            alert('Erreur lors de la publication: ' + error.message);
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const resetForm = () => {
        setStep(1);
        setSelectedFile(null);
        setVideoPreview(null);
        setVideoData({
            title: '',
            description: '',
            hashtags: [],
            location: '',
            isPublic: true,
            allowComments: true,
            allowDuet: true,
            allowStitch: true,
            category: 'general'
        });
        setCurrentHashtag('');
        setIsPlaying(false);
        setIsMuted(false);
    };

    if (!user) {
        return (
            <div className="page-container">
                <div className="auth-required">
                    <span className="auth-icon">🔒</span>
                    <h3>Connexion requise</h3>
                    <p>Vous devez être connecté pour créer du contenu</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="create-header">
                <h1>✨ Créer</h1>
                <div className="step-indicator">
                    <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
                    <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
                    <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
                </div>
            </div>

            {step === 1 && (
                <div className="upload-section">
                    <div 
                        className="upload-area"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="upload-content">
                            <Upload size={48} />
                            <h3>Télécharger une vidéo</h3>
                            <p>Glissez-déposez ou cliquez pour sélectionner</p>
                            <div className="upload-specs">
                                <span>MP4, MOV, AVI</span>
                                <span>Max 100MB</span>
                                <span>Durée max 3min</span>
                            </div>
                        </div>
                        
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/*"
                            onChange={handleFileSelect}
                            hidden
                        />
                    </div>

                    <div className="upload-options">
                        <button className="option-button">
                            <Camera size={24} />
                            <span>Enregistrer</span>
                        </button>
                        <button className="option-button">
                            <Film size={24} />
                            <span>Live</span>
                        </button>
                        <button className="option-button">
                            <Image size={24} />
                            <span>Photo</span>
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && videoPreview && (
                <div className="edit-section">
                    <div className="video-editor">
                        <div className="video-preview">
                            <video
                                ref={videoRef}
                                src={videoPreview}
                                className="preview-video"
                                loop
                                muted={isMuted}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                            />
                            
                            <div className="video-controls">
                                <button onClick={togglePlayPause} className="play-button">
                                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                                </button>
                                <button onClick={toggleMute} className="mute-button">
                                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="edit-tools">
                            <h3>Outils d'édition</h3>
                            <div className="tool-buttons">
                                <button className="tool-button">
                                    <Crop size={20} />
                                    <span>Recadrer</span>
                                </button>
                                <button className="tool-button">
                                    <Filter size={20} />
                                    <span>Filtres</span>
                                </button>
                                <button className="tool-button">
                                    <Type size={20} />
                                    <span>Texte</span>
                                </button>
                                <button className="tool-button">
                                    <Music size={20} />
                                    <span>Musique</span>
                                </button>
                                <button className="tool-button">
                                    <Palette size={20} />
                                    <span>Effets</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="edit-actions">
                        <button onClick={() => setStep(1)} className="back-button">
                            Retour
                        </button>
                        <button onClick={() => setStep(3)} className="next-button">
                            Suivant
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="details-section">
                    <div className="details-form">
                        <div className="form-group">
                            <label>Titre de la vidéo</label>
                            <input
                                type="text"
                                value={videoData.title}
                                onChange={(e) => setVideoData(prev => ({...prev, title: e.target.value}))}
                                placeholder="Donnez un titre accrocheur à votre vidéo"
                                maxLength={100}
                            />
                            <small>{videoData.title.length}/100</small>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={videoData.description}
                                onChange={(e) => setVideoData(prev => ({...prev, description: e.target.value}))}
                                placeholder="Décrivez votre vidéo..."
                                rows={4}
                                maxLength={500}
                            />
                            <small>{videoData.description.length}/500</small>
                        </div>

                        <div className="form-group">
                            <label>Hashtags</label>
                            <div className="hashtag-input">
                                <Hash size={16} />
                                <input
                                    type="text"
                                    value={currentHashtag}
                                    onChange={(e) => setCurrentHashtag(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            addHashtag(currentHashtag);
                                        }
                                    }}
                                    placeholder="Ajouter des hashtags"
                                />
                            </div>
                            
                            {videoData.hashtags.length > 0 && (
                                <div className="hashtag-list">
                                    {videoData.hashtags.map((hashtag, index) => (
                                        <span key={index} className="hashtag-tag">
                                            #{hashtag}
                                            <button onClick={() => removeHashtag(hashtag)}>
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="suggested-hashtags">
                                <p>Suggestions:</p>
                                <div className="suggestion-list">
                                    {suggestedHashtags.map((hashtag, index) => (
                                        <button
                                            key={index}
                                            onClick={() => addHashtag(hashtag)}
                                            className="suggestion-tag"
                                        >
                                            #{hashtag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Catégorie</label>
                            <div className="category-grid">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setVideoData(prev => ({...prev, category: category.id}))}
                                        className={`category-button ${videoData.category === category.id ? 'active' : ''}`}
                                    >
                                        <span className="category-icon">{category.icon}</span>
                                        <span>{category.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Localisation (optionnel)</label>
                            <div className="location-input">
                                <MapPin size={16} />
                                <input
                                    type="text"
                                    value={videoData.location}
                                    onChange={(e) => setVideoData(prev => ({...prev, location: e.target.value}))}
                                    placeholder="Où avez-vous filmé cette vidéo ?"
                                />
                            </div>
                        </div>

                        <div className="privacy-settings">
                            <h4>Paramètres de confidentialité</h4>
                            
                            <div className="setting-item">
                                <div className="setting-info">
                                    <span>Vidéo publique</span>
                                    <small>Tout le monde peut voir votre vidéo</small>
                                </div>
                                <label className="toggle">
                                    <input
                                        type="checkbox"
                                        checked={videoData.isPublic}
                                        onChange={(e) => setVideoData(prev => ({...prev, isPublic: e.target.checked}))}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <span>Autoriser les commentaires</span>
                                    <small>Les utilisateurs peuvent commenter</small>
                                </div>
                                <label className="toggle">
                                    <input
                                        type="checkbox"
                                        checked={videoData.allowComments}
                                        onChange={(e) => setVideoData(prev => ({...prev, allowComments: e.target.checked}))}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <span>Autoriser les duos</span>
                                    <small>D'autres peuvent créer des duos avec votre vidéo</small>
                                </div>
                                <label className="toggle">
                                    <input
                                        type="checkbox"
                                        checked={videoData.allowDuet}
                                        onChange={(e) => setVideoData(prev => ({...prev, allowDuet: e.target.checked}))}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="details-actions">
                        <button onClick={() => setStep(2)} className="back-button">
                            Retour
                        </button>
                        <button 
                            onClick={handlePublish} 
                            className="publish-button"
                            disabled={uploading || !videoData.title.trim()}
                        >
                            {uploading ? 'Publication...' : 'Publier'}
                        </button>
                    </div>
                </div>
            )}

            {/* Progress modal */}
            {uploading && (
                <div className="upload-modal">
                    <div className="upload-progress">
                        <h3>Publication en cours...</h3>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                        <p>{uploadProgress}% terminé</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreatePage;
