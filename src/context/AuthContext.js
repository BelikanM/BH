import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/appwrite';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
        
        // Écouter les changements d'URL pour détecter le retour OAuth
        const handleOAuthCallback = () => {
            if (window.location.pathname === '/auth/success') {
                handleOAuthSuccess();
            } else if (window.location.pathname === '/auth/failure') {
                handleOAuthFailure();
            }
        };

        handleOAuthCallback();
        window.addEventListener('popstate', handleOAuthCallback);
        
        return () => window.removeEventListener('popstate', handleOAuthCallback);
    }, []);

    const checkAuth = async () => {
        try {
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
                console.log('Utilisateur connecté:', currentUser);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.log('Utilisateur non connecté');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Connexion avec Google OAuth
    const loginWithGoogle = async () => {
        try {
            setLoading(true);
            await authService.loginWithGoogle();
            // La redirection se fait automatiquement
        } catch (error) {
            console.error('Erreur connexion Google:', error);
            setLoading(false);
            throw error;
        }
    };

    // Gérer le succès OAuth
    const handleOAuthSuccess = async () => {
        try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            console.log('Connexion Google réussie:', currentUser);
            
            // Rediriger vers la page principale
            window.history.replaceState({}, '', '/');
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            window.history.replaceState({}, '', '/auth/failure');
        } finally {
            setLoading(false);
        }
    };

    // Gérer l'échec OAuth
    const handleOAuthFailure = () => {
        console.error('Échec de la connexion Google');
        setLoading(false);
        // Rediriger vers la page principale avec un message d'erreur
        window.history.replaceState({}, '', '/');
    };

    // Connexion traditionnelle (optionnelle)
    const loginWithEmail = async (email, password) => {
        try {
            setLoading(true);
            const session = await authService.loginWithEmail(email, password);
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            return { success: true, user: currentUser };
        } catch (error) {
            console.error('Erreur connexion email:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Déconnexion
    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            console.log('Déconnexion réussie');
            return { success: true };
        } catch (error) {
            console.error('Erreur déconnexion:', error);
            setUser(null);
            return { success: true };
        }
    };

    const value = {
        user,
        loginWithGoogle,
        loginWithEmail,
        logout,
        loading,
        isAuthenticated: !!user,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

