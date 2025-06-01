import React, { useState } from 'react';
import { X, Mail, Lock, User, AtSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose, defaultMode = 'login' }) => {
    const [mode, setMode] = useState(defaultMode);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
        displayName: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let result;
            if (mode === 'login') {
                result = await login(formData.email, formData.password);
            } else {
                result = await register(
                    formData.email, 
                    formData.password, 
                    formData.username, 
                    formData.displayName
                );
            }

            if (result.success) {
                onClose();
                setFormData({ email: '', password: '', username: '', displayName: '' });
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="auth-header">
                    <h2>{mode === 'login' ? 'Connexion' : 'Inscription'}</h2>
                    <p>
                        {mode === 'login' 
                            ? 'Connectez-vous pour partager vos vidéos' 
                            : 'Créez votre compte TikTok Clone'
                        }
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {mode === 'register' && (
                        <>
                            <div className="form-group">
                                <User size={20} />
                                <input
                                    type="text"
                                    name="displayName"
                                    placeholder="Nom d'affichage"
                                    value={formData.displayName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <AtSign size={20} />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Nom d'utilisateur"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <Mail size={20} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <Lock size={20} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Mot de passe"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={8}
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Chargement...' : (mode === 'login' ? 'Se connecter' : 'S\'inscrire')}
                    </button>
                </form>

                <div className="auth-switch">
                    <p>
                        {mode === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
                        <button 
                            type="button"
                            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                            className="switch-button"
                        >
                            {mode === 'login' ? 'S\'inscrire' : 'Se connecter'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
