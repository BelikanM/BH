import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { databases, storage, DATABASE_ID, COLLECTIONS, BUCKET_ID } from '../services/appwrite';
import { 
    Settings, 
    User, 
    Lock, 
    Bell, 
    Shield, 
    Palette, 
    Globe, 
    HelpCircle,
    Info,
    LogOut,
    Camera,
    Edit3,
    Save,
    X,
    Eye,
    EyeOff,
    Smartphone,
    Monitor,
    Moon,
    Sun,
    Volume2,
    VolumeX,
    Download,
    Upload,
    Trash2,
    AlertTriangle,
    CheckCircle,
    ExternalLink,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Link as LinkIcon,
    Instagram,
    Twitter,
    Youtube,
    Facebook
} from 'lucide-react';

const SettingsPage = () => {
    const { user, userProfile, logout, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');
    const fileInputRef = useRef(null);

    // États pour les différentes sections
    const [profileData, setProfileData] = useState({
        displayName: '',
        username: '',
        bio: '',
        email: '',
        phone: '',
        website: '',
        location: '',
        birthDate: '',
        profilePicture: null,
        coverImage: null,
        socialLinks: {
            instagram: '',
            twitter: '',
            youtube: '',
            facebook: ''
        }
    });

    const [privacySettings, setPrivacySettings] = useState({
        isPrivateAccount: false,
        allowComments: 'everyone', // everyone, followers, none
        allowDuets: 'everyone',
        allowDownloads: true,
        showInSearch: true,
        showOnlineStatus: true,
        allowDirectMessages: 'everyone'
    });

    const [notificationSettings, setNotificationSettings] = useState({
        likes: true,
        comments: true,
        follows: true,
        mentions: true,
        shares: true,
        liveStreams: true,
        directMessages: true,
        pushNotifications: true,
        emailNotifications: false,
        soundEnabled: true
    });

    const [securitySettings, setSecuritySettings] = useState({
        twoFactorEnabled: false,
        loginAlerts: true,
        deviceManagement: true,
        passwordLastChanged: null
    });

    const [appSettings, setAppSettings] = useState({
        theme: 'auto', // light, dark, auto
        language: 'fr',
        autoplay: true,
        dataUsage: 'normal', // low, normal, high
        downloadQuality: 'hd',
        cacheSize: '500MB'
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        showPasswords: false
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    useEffect(() => {
        if (user && userProfile) {
            loadUserData();
        }
    }, [user, userProfile]);

    const loadUserData = () => {
        setProfileData({
            displayName: userProfile.displayName || '',
            username: userProfile.username || '',
            bio: userProfile.bio || '',
            email: user.email || '',
            phone: userProfile.phone || '',
            website: userProfile.website || '',
            location: userProfile.location || '',
            birthDate: userProfile.birthDate || '',
            profilePicture: userProfile.profilePicture || null,
            coverImage: userProfile.coverImage || null,
            socialLinks: userProfile.socialLinks || {
                instagram: '',
                twitter: '',
                youtube: '',
                facebook: ''
            }
        });

        // Charger les autres paramètres depuis localStorage ou base de données
        const savedPrivacy = localStorage.getItem('privacySettings');
        if (savedPrivacy) {
            setPrivacySettings(JSON.parse(savedPrivacy));
        }

        const savedNotifications = localStorage.getItem('notificationSettings');
        if (savedNotifications) {
            setNotificationSettings(JSON.parse(savedNotifications));
        }

        const savedApp = localStorage.getItem('appSettings');
        if (savedApp) {
            setAppSettings(JSON.parse(savedApp));
        }
    };

    const handleProfileUpdate = async () => {
        setLoading(true);
        setSaveStatus('saving');
        
        try {
            const result = await updateProfile(profileData);
            if (result.success) {
                setSaveStatus('success');
                setTimeout(() => setSaveStatus(''), 3000);
            } else {
                setSaveStatus('error');
                setTimeout(() => setSaveStatus(''), 3000);
            }
        } catch (error) {
            console.error('Erreur mise à jour profil:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (type) => {
        const file = fileInputRef.current?.files[0];
        if (!file) return;

        setLoading(true);
        try {
            // Upload vers Appwrite Storage
            const uploadResult = await storage.createFile(BUCKET_ID, 'unique()', file);
            const imageUrl = storage.getFileView(BUCKET_ID, uploadResult.$id);

            setProfileData(prev => ({
                ...prev,
                [type]: imageUrl
            }));

            setSaveStatus('success');
            setTimeout(() => setSaveStatus(''), 3000);
        } catch (error) {
            console.error('Erreur upload image:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            alert('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }

        setLoading(true);
        try {
            // Ici vous implémenteriez le changement de mot de passe avec Appwrite
            // await account.updatePassword(passwordData.newPassword, passwordData.currentPassword);
            
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
                showPasswords: false
            });
            
            setSaveStatus('success');
            setTimeout(() => setSaveStatus(''), 3000);
        } catch (error) {
            console.error('Erreur changement mot de passe:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = (settingsType, settings) => {
        localStorage.setItem(settingsType, JSON.stringify(settings));
        setSaveStatus('success');
        setTimeout(() => setSaveStatus(''), 3000);
    };

    const handleAccountDeletion = async () => {
        if (deleteConfirmation !== 'SUPPRIMER') {
            alert('Veuillez taper "SUPPRIMER" pour confirmer');
            return;
        }

        setLoading(true);
        try {
            // Ici vous implémenteriez la suppression du compte
            // await account.deleteSession('current');
            // await databases.deleteDocument(DATABASE_ID, COLLECTIONS.USERS, user.$id);
            
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Erreur suppression compte:', error);
            alert('Erreur lors de la suppression du compte');
        } finally {
            setLoading(false);
        }
    };

    const exportData = async () => {
        try {
            const userData = {
                profile: profileData,
                settings: {
                    privacy: privacySettings,
                    notifications: notificationSettings,
                    app: appSettings
                },
                exportDate: new Date().toISOString()
            };

            const dataStr = JSON.stringify(userData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `tiktok-clone-data-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erreur export données:', error);
        }
    };

    const settingsSections = [
        { id: 'profile', name: 'Profil', icon: User },
        { id: 'privacy', name: 'Confidentialité', icon: Shield },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'security', name: 'Sécurité', icon: Lock },
        { id: 'appearance', name: 'Apparence', icon: Palette },
        { id: 'language', name: 'Langue et région', icon: Globe },
        { id: 'data', name: 'Données', icon: Download },
        { id: 'help', name: 'Aide', icon: HelpCircle },
        { id: 'about', name: 'À propos', icon: Info }
    ];

    if (!user) {
        return (
            <div className="page-container">
                <div className="auth-required">
                    <span className="auth-icon">🔒</span>
                    <h3>Connexion requise</h3>
                    <p>Connectez-vous pour accéder aux paramètres</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container settings-page">
            <div className="settings-layout">
                {/* Sidebar */}
                <div className="settings-sidebar">
                    <div className="sidebar-header">
                        <h2><Settings size={24} /> Paramètres</h2>
                    </div>
                    
                    <nav className="settings-nav">
                        {settingsSections.map((section) => {
                            const IconComponent = section.icon;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                                >
                                    <IconComponent size={20} />
                                    <span>{section.name}</span>
                                </button>
                            );
                        })}
                    </nav>

                    <div className="sidebar-footer">
                        <button onClick={logout} className="logout-button">
                            <LogOut size={20} />
                            Déconnexion
                        </button>
                    </div>
                </div>

                {/* Contenu principal */}
                <div className="settings-content">
                    {/* Status de sauvegarde */}
                    {saveStatus && (
                        <div className={`save-status ${saveStatus}`}>
                            {saveStatus === 'saving' && '💾 Sauvegarde en cours...'}
                            {saveStatus === 'success' && '✅ Modifications sauvegardées'}
                            {saveStatus === 'error' && '❌ Erreur lors de la sauvegarde'}
                        </div>
                    )}

                    {/* Section Profil */}
                    {activeSection === 'profile' && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h3><User size={24} /> Informations du profil</h3>
                                <p>Gérez vos informations personnelles</p>
                            </div>

                            <div className="profile-images">
                                <div className="profile-picture-section">
                                    <h4>Photo de profil</h4>
                                    <div className="image-upload">
                                        <div className="current-image">
                                            {profileData.profilePicture ? (
                                                <img src={profileData.profilePicture} alt="Profil" />
                                            ) : (
                                                <div className="placeholder">
                                                    <User size={40} />
                                                </div>
                                            )}
                                        </div>
                                        <button 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="upload-button"
                                        >
                                            <Camera size={16} />
                                            Changer
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={() => handleImageUpload('profilePicture')}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                </div>

                                <div className="cover-image-section">
                                    <h4>Image de couverture</h4>
                                    <div className="cover-upload">
                                        <div className="current-cover">
                                            {profileData.coverImage ? (
                                                <img src={profileData.coverImage} alt="Couverture" />
                                            ) : (
                                                <div className="placeholder">
                                                    <Camera size={40} />
                                                </div>
                                            )}
                                        </div>
                                        <button className="upload-button">
                                            <Upload size={16} />
                                            Changer la couverture
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Nom d'affichage</label>
                                    <input
                                        type="text"
                                        value={profileData.displayName}
                                        onChange={(e) => setProfileData(prev => ({...prev, displayName: e.target.value}))}
                                        placeholder="Votre nom d'affichage"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Nom d'utilisateur</label>
                                    <input
                                        type="text"
                                        value={profileData.username}
                                        onChange={(e) => setProfileData(prev => ({...prev, username: e.target.value}))}
                                        placeholder="@votre_nom_utilisateur"
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Biographie</label>
                                    <textarea
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
                                        placeholder="Parlez-nous de vous..."
                                        rows={3}
                                        maxLength={150}
                                    />
                                    <small>{profileData.bio.length}/150 caractères</small>
                                </div>

                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData(prev => ({...prev, email: e.target.value}))}
                                        placeholder="votre@email.com"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Téléphone</label>
                                    <input
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData(prev => ({...prev, phone: e.target.value}))}
                                        placeholder="+33 6 12 34 56 78"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Site web</label>
                                    <input
                                        type="url"
                                        value={profileData.website}
                                        onChange={(e) => setProfileData(prev => ({...prev, website: e.target.value}))}
                                        placeholder="https://votre-site.com"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Localisation</label>
                                    <input
                                        type="text"
                                        value={profileData.location}
                                        onChange={(e) => setProfileData(prev => ({...prev, location: e.target.value}))}
                                        placeholder="Ville, Pays"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Date de naissance</label>
                                    <input
                                        type="date"
                                        value={profileData.birthDate}
                                        onChange={(e) => setProfileData(prev => ({...prev, birthDate: e.target.value}))}
                                    />
                                </div>
                            </div>

                            <div className="social-links">
                                <h4>Réseaux sociaux</h4>
                                <div className="social-grid">
                                    <div className="social-item">
                                        <Instagram size={20} />
                                        <input
                                            type="text"
                                            value={profileData.socialLinks.instagram}
                                            onChange={(e) => setProfileData(prev => ({
                                                ...prev,
                                                socialLinks: {...prev.socialLinks, instagram: e.target.value}
                                            }))}
                                            placeholder="@votre_instagram"
                                        />
                                    </div>
                                    <div className="social-item">
                                        <Twitter size={20} />
                                        <input
                                            type="text"
                                            value={profileData.socialLinks.twitter}
                                            onChange={(e) => setProfileData(prev => ({
                                                ...prev,
                                                socialLinks: {...prev.socialLinks, twitter: e.target.value}
                                            }))}
                                            placeholder="@votre_twitter"
                                        />
                                    </div>
                                    <div className="social-item">
                                        <Youtube size={20} />
                                        <input
                                            type="text"
                                            value={profileData.socialLinks.youtube}
                                            onChange={(e) => setProfileData(prev => ({
                                                ...prev,
                                                socialLinks: {...prev.socialLinks, youtube: e.target.value}
                                            }))}
                                            placeholder="Votre chaîne YouTube"
                                        />
                                    </div>
                                    <div className="social-item">
                                        <Facebook size={20} />
                                        <input
                                            type="text"
                                            value={profileData.socialLinks.facebook}
                                            onChange={(e) => setProfileData(prev => ({
                                                ...prev,
                                                socialLinks: {...prev.socialLinks, facebook: e.target.value}
                                            }))}
                                            placeholder="Votre page Facebook"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="section-actions">
                                <button 
                                    onClick={handleProfileUpdate}
                                    disabled={loading}
                                    className="save-button"
                                >
                                    <Save size={16} />
                                    {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Section Confidentialité */}
                    {activeSection === 'privacy' && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h3><Shield size={24} /> Confidentialité et sécurité</h3>
                                <p>Contrôlez qui peut voir votre contenu et interagir avec vous</p>
                            </div>

                            <div className="privacy-settings">
                                <div className="setting-group">
                                    <h4>Visibilité du compte</h4>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span>Compte privé</span>
                                            <small>Seuls vos abonnés peuvent voir vos vidéos</small>
                                        </div>
                                        <label className="toggle">
                                            <input
                                                type="checkbox"
                                                checked={privacySettings.isPrivateAccount}
                                                onChange={(e) => setPrivacySettings(prev => ({
                                                    ...prev, 
                                                    isPrivateAccount: e.target.checked
                                                }))}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                </div>

                                <div className="setting-group">
                                    <h4>Interactions</h4>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span>Qui peut commenter</span>
                                        </div>
                                        <select 
                                            value={privacySettings.allowComments}
                                            onChange={(e) => setPrivacySettings(prev => ({
                                                ...prev, 
                                                allowComments: e.target.value
                                            }))}
                                        >
                                            <option value="everyone">Tout le monde</option>
                                            <option value="followers">Abonnés uniquement</option>
                                            <option value="none">Personne</option>
                                        </select>
                                    </div>

                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span>Qui peut faire des duos</span>
                                        </div>
                                        <select 
                                            value={privacySettings.allowDuets}
                                            onChange={(e) => setPrivacySettings(prev => ({
                                                ...prev, 
                                                allowDuets: e.target.value
                                            }))}
                                        >
                                            <option value="everyone">Tout le monde</option>
                                            <option value="followers">Abonnés uniquement</option>
                                            <option value="none">Personne</option>
                                        </select>
                                    </div>

                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span>Autoriser les téléchargements</span>
                                            <small>Permettre aux autres de télécharger vos vidéos</small>
                                        </div>
                                        <label className="toggle">
                                            <input
                                                type="checkbox"
                                                checked={privacySettings.allowDownloads}
                                                onChange={(e) => setPrivacySettings(prev => ({
                                                    ...prev, 
                                                    allowDownloads: e.target.checked
                                                }))}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                </div>

                                <div className="setting-group">
                                    <h4>Découvrabilité</h4>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span>Apparaître dans les recherches</span>
                                            <small>Permettre aux autres de vous trouver via la recherche</small>
                                        </div>
                                        <label className="toggle">
                                            <input
                                                type="checkbox"
                                                checked={privacySettings.showInSearch}
                                                onChange={(e) => setPrivacySettings(prev => ({
                                                    ...prev, 
                                                    showInSearch: e.target.checked
                                                }))}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                    </div>

                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span>Afficher le statut en ligne</span>
                                            <small>Montrer quand vous êtes actif</small>
                                        </div>
                                        <label className="toggle">
                                            <input
                                                type="checkbox"
                                                checked={privacySettings.showOnlineStatus}
                                                onChange={(e) => setPrivacySettings(prev => ({
                                                    ...prev, 
                                                    showOnlineStatus: e.target.checked
                                                }))}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="section-actions">
                                <button 
                                    onClick={() => saveSettings('privacySettings', privacySettings)}
                                    className="save-button"
                                >
                                    <Save size={16} />
                                    Sauvegarder
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Section Notifications */}
                    {activeSection === 'notifications' && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h3><Bell size={24} /> Notifications</h3>
                                <p>Choisissez les notifications que vous souhaitez recevoir</p>
                            </div>

                            <div className="notification-settings">
                                <div className="setting-group">
                                    <h4>Activité sur vos contenus</h4>
                                    {Object.entries({
                                        likes: 'J\'aime sur vos vidéos',
                                        comments: 'Commentaires sur vos vidéos',
                                        shares: 'Partages de vos vidéos'
                                    }).map(([key, label]) => (
                                        <div key={key} className="setting-item">
                                            <div className="setting-info">
                                                <span>{label}</span>
                                            </div>
                                            <label className="toggle">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings[key]}
                                                    onChange={(e) => setNotificationSettings(prev => ({
                                                        ...prev, 
                                                        [key]: e.target.checked
                                                    }))}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <div className="setting-group">
                                    <h4>Interactions sociales</h4>
                                    {Object.entries({
                                        follows: 'Nouveaux abonnés',
                                        mentions: 'Mentions dans les commentaires',
                                        directMessages: 'Messages privés'
                                    }).map(([key, label]) => (
                                        <div key={key} className="setting-item">
                                            <div className="setting-info">
                                                <span>{label}</span>
                                            </div>
                                            <label className="toggle">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings[key]}
                                                    onChange={(e) => setNotificationSettings(prev => ({
                                                        ...prev, 
                                                        [key]: e.target.checked
                                                    }))}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <div className="setting-group">
                                    <h4>Paramètres généraux</h4>
                                    {Object.entries({
                                        pushNotifications: 'Notifications push',
                                        emailNotifications: 'Notifications par email',
                                        soundEnabled: 'Sons de notification'
                                    }).map(([key, label]) => (
                                        <div key={key} className="setting-item">
                                            <div className="setting-info">
                                                <span>{label}</span>
                                            </div>
                                            <label className="toggle">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings[key]}
                                                    onChange={(e) => setNotificationSettings(prev => ({
                                                        ...prev, 
                                                        [key]: e.target.checked
                                                    }))}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="section-actions">
                                <button 
                                    onClick={() => saveSettings('notificationSettings', notificationSettings)}
                                    className="save-button"
                                >
                                    <Save size={16} />
                                    Sauvegarder
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Section Sécurité */}
                    {activeSection === 'security' && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h3><Lock size={24} /> Sécurité</h3>
                                <p>Protégez votre compte avec des mesures de sécurité avancées</p>
                            </div>

                            <div className="security-settings">
                                <div className="setting-group">
                                    <h4>Mot de passe</h4>
                                    <div className="password-change">
                                        <div className="form-group">
                                            <label>Mot de passe actuel</label>
                                            <div className="password-input">
                                                <input
                                                    type={passwordData.showPasswords ? 'text' : 'password'}
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData(prev => ({
                                                        ...prev, 
                                                        currentPassword: e.target.value
                                                    }))}
                                                    placeholder="Entrez votre mot de passe actuel"
                                                />
                                                <button 
                                                    onClick={() => setPasswordData(prev => ({
                                                        ...prev, 
                                                        showPasswords: !prev.showPasswords
                                                    }))}
                                                    className="password-toggle"
                                                >
                                                    {passwordData.showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Nouveau mot de passe</label>
                                            <input
                                                type={passwordData.showPasswords ? 'text' : 'password'}
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData(prev => ({
                                                    ...prev, 
                                                    newPassword: e.target.value
                                                }))}
                                                placeholder="Entrez votre nouveau mot de passe"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Confirmer le nouveau mot de passe</label>
                                            <input
                                                type={passwordData.showPasswords ? 'text' : 'password'}
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData(prev => ({
                                                    ...prev, 
                                                    confirmPassword: e.target.value
                                                }))}
                                                placeholder="Confirmez votre nouveau mot de passe"
                                            />
                                        </div>

                                        <button 
                                            onClick={handlePasswordChange}
                                            disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                                            className="change-password-button"
                                        >
                                            Changer le mot de passe
                                        </button>
                                    </div>
                                </div>

                                <div className="setting-group">
                                    <h4>Authentification à deux facteurs</h4>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span>Activer 2FA</span>
                                            <small>Ajoutez une couche de sécurité supplémentaire</small>
                                        </div>
                                        <label className="toggle">
                                            <input
                                                type="checkbox"
                                                checked={securitySettings.twoFactorEnabled}
                                                onChange={(e) => setSecuritySettings(prev => ({
                                                    ...prev, 
                                                    twoFactorEnabled: e.target.checked
                                                }))}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                </div>

                                <div className="setting-group">
                                    <h4>Alertes de sécurité</h4>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span>Alertes de connexion</span>
                                            <small>Recevoir une notification lors de nouvelles connexions</small>
                                        </div>
                                        <label className="toggle">
                                            <input
                                                type="checkbox"
                                                checked={securitySettings.loginAlerts}
                                                onChange={(e) => setSecuritySettings(prev => ({
                                                    ...prev, 
                                                    loginAlerts: e.target.checked
                                                }))}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section Apparence */}
                    {activeSection === 'appearance' && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h3><Palette size={24} /> Apparence</h3>
                                <p>Personnalisez l'apparence de l'application</p>
                            </div>

                            <div className="appearance-settings">
                                <div className="setting-group">
                                    <h4>Thème</h4>
                                    <div className="theme-selector">
                                        {[
                                            { value: 'light', label: 'Clair', icon: Sun },
                                            { value: 'dark', label: 'Sombre', icon: Moon },
                                            { value: 'auto', label: 'Automatique', icon: Monitor }
                                        ].map(({ value, label, icon: Icon }) => (
                                            <button
                                                key={value}
                                                onClick={() => setAppSettings(prev => ({...prev, theme: value}))}
                                                className={`theme-option ${appSettings.theme === value ? 'active' : ''}`}
                                            >
                                                <Icon size={24} />
                                                <span>{label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="setting-group">
                                    <h4>Lecture automatique</h4>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span>Lecture automatique des vidéos</span>
                                            <small>Les vidéos se lancent automatiquement</small>
                                        </div>
                                        <label className="toggle">
                                            <input
                                                type="checkbox"
                                                checked={appSettings.autoplay}
                                                onChange={(e) => setAppSettings(prev => ({
                                                    ...prev, 
                                                    autoplay: e.target.checked
                                                }))}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="section-actions">
                                <button 
                                    onClick={() => saveSettings('appSettings', appSettings)}
                                    className="save-button"
                                >
                                    <Save size={16} />
                                    Sauvegarder
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Section Données */}
                    {activeSection === 'data' && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h3><Download size={24} /> Gestion des données</h3>
                                <p>Gérez vos données et votre utilisation</p>
                            </div>

                            <div className="data-settings">
                                <div className="setting-group">
                                    <h4>Exportation des données</h4>
                                    <p>Téléchargez une copie de vos données</p>
                                    <button onClick={exportData} className="export-button">
                                        <Download size={16} />
                                        Exporter mes données
                                    </button>
                                </div>

                                <div className="setting-group danger-zone">
                                    <h4>Zone de danger</h4>
                                    <div className="danger-actions">
                                        <button 
                                            onClick={() => setShowDeleteModal(true)}
                                            className="delete-account-button"
                                        >
                                            <Trash2 size={16} />
                                            Supprimer mon compte
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section Aide */}
                    {activeSection === 'help' && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h3><HelpCircle size={24} /> Aide et support</h3>
                                <p>Trouvez de l'aide et contactez le support</p>
                            </div>

                            <div className="help-links">
                                <a href="#" className="help-link">
                                    <HelpCircle size={20} />
                                    <span>Centre d'aide</span>
                                    <ExternalLink size={16} />
                                </a>
                                <a href="#" className="help-link">
                                    <Mail size={20} />
                                    <span>Contacter le support</span>
                                    <ExternalLink size={16} />
                                </a>
                                <a href="#" className="help-link">
                                    <Info size={20} />
                                    <span>Signaler un problème</span>
                                    <ExternalLink size={16} />
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Section À propos */}
                    {activeSection === 'about' && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h3><Info size={24} /> À propos</h3>
                                <p>Informations sur l'application</p>
                            </div>

                            <div className="about-info">
                                <div className="app-info">
                                    <h4>TikTok Clone</h4>
                                    <p>Version 1.0.0</p>
                                    <p>© 2024 TikTok Clone. Tous droits réservés.</p>
                                </div>

                                <div className="legal-links">
                                    <a href="#">Conditions d'utilisation</a>
                                    <a href="#">Politique de confidentialité</a>
                                    <a href="#">Politique des cookies</a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de suppression de compte */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal delete-modal">
                        <div className="modal-header">
                            <h3><AlertTriangle size={24} /> Supprimer le compte</h3>
                            <button 
                                onClick={() => setShowDeleteModal(false)}
                                className="close-button"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="modal-content">
                            <p>⚠️ Cette action est irréversible. Toutes vos données seront définitivement supprimées.</p>
                            <p>Pour confirmer, tapez <strong>SUPPRIMER</strong> ci-dessous :</p>
                            
                            <input
                                type="text"
                                value={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e.target.value)}
                                placeholder="Tapez SUPPRIMER"
                                className="confirmation-input"
                            />
                        </div>
                        
                        <div className="modal-actions">
                            <button 
                                onClick={() => setShowDeleteModal(false)}
                                className="cancel-button"
                            >
                                Annuler
                            </button>
                            <button 
                                onClick={handleAccountDeletion}
                                disabled={deleteConfirmation !== 'SUPPRIMER' || loading}
                                className="delete-button"
                            >
                                {loading ? 'Suppression...' : 'Supprimer définitivement'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;

