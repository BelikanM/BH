import React, { createContext, useContext, useEffect, useState } from 'react';
import { account, databases, DATABASE_ID, COLLECTIONS, ID } from '../services/appwrite';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé dans AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Vérifier la session au chargement
    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const session = await account.get();
            setUser(session);
            await getUserProfile(session.$id);
        } catch (error) {
            console.log('Aucune session active');
        } finally {
            setLoading(false);
        }
    };

    const getUserProfile = async (userId) => {
        try {
            const profile = await databases.getDocument(
                DATABASE_ID,
                COLLECTIONS.USERS,
                userId
            );
            setUserProfile(profile);
            return profile;
        } catch (error) {
            console.error('Erreur lors de la récupération du profil:', error);
            return null;
        }
    };

    const login = async (email, password) => {
        try {
            const session = await account.createEmailSession(email, password);
            setUser(session);
            await getUserProfile(session.userId);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (email, password, username, displayName) => {
        try {
            // Créer le compte
            const newUser = await account.create(ID.unique(), email, password, displayName);
            
            // Se connecter automatiquement
            await account.createEmailSession(email, password);
            
            // Créer le profil utilisateur
            const profile = await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.USERS,
                newUser.$id,
                {
                    username,
                    displayName,
                    email,
                    bio: '',
                    profilePicture: '',
                    isVerified: false,
                    followersCount: 0,
                    followingCount: 0,
                    videosCount: 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            );

            setUser(newUser);
            setUserProfile(profile);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
            setUserProfile(null);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const updateProfile = async (updates) => {
        try {
            if (!userProfile) return { success: false, error: 'Aucun profil trouvé' };

            const updatedProfile = await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.USERS,
                userProfile.$id,
                {
                    ...updates,
                    updatedAt: new Date().toISOString()
                }
            );

            setUserProfile(updatedProfile);
            return { success: true, profile: updatedProfile };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        userProfile,
        loading,
        login,
        register,
        logout,
        updateProfile,
        getUserProfile,
        checkSession
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
