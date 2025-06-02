import { Client, Databases, Storage, Account, ID, Query, Permission, Role } from 'appwrite';

// Configuration Appwrite pour Create React App
const client = new Client();

client
    .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID || '67bb24ad002378e79e38');

// Services Appwrite
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Configuration
export const DATABASE_ID = process.env.REACT_APP_DATABASE_ID || 'tiktok_clone';
export const BUCKET_ID = process.env.REACT_APP_APPWRITE_BUCKET_ID || '68284595002f12395db2';

// Collections IDs
export const COLLECTIONS = {
    USERS: 'users',
    VIDEOS: 'videos',
    COMMENTS: 'comments',
    LIKES: 'likes',
    FOLLOWS: 'follows'
};

// 🔐 SERVICE D'AUTHENTIFICATION COMPLET
export const authService = {
    // ✅ Inscription
    async signUp(email, password, name) {
        try {
            console.log('📝 Création du compte pour:', email);
            const user = await account.create(ID.unique(), email, password, name);
            console.log('✅ Compte créé avec succès:', user);
            return user;
        } catch (error) {
            console.error('❌ Erreur lors de l\'inscription:', error);
            
            // Messages d'erreur personnalisés
            if (error.code === 409) {
                throw new Error('Un compte avec cet email existe déjà');
            } else if (error.code === 400) {
                throw new Error('Données invalides. Vérifiez votre email et mot de passe');
            } else {
                throw new Error(error.message || 'Erreur lors de la création du compte');
            }
        }
    },

    // ✅ Connexion avec Google OAuth2
    async loginWithGoogle() {
        try {
            console.log('🚀 Redirection vers Google OAuth...');
            
            // Vérifier si la méthode existe
            if (typeof account.createOAuth2Session !== 'function') {
                throw new Error('OAuth2 non disponible dans cette version d\'Appwrite');
            }
            
            // Redirection vers Google OAuth
            account.createOAuth2Session(
                'google',
                `${window.location.origin}/auth/success`, // URL de succès
                `${window.location.origin}/auth/failure`  // URL d'échec
            );
        } catch (error) {
            console.error('❌ Erreur OAuth Google:', error);
            throw new Error('Impossible de se connecter avec Google');
        }
    },

    // ✅ Connexion avec email et mot de passe
    async loginWithEmail(email, password) {
        try {
            console.log('📧 Tentative de connexion email...');
            
            let session;
            
            // Tester différentes méthodes selon la version d'Appwrite
            if (typeof account.createEmailSession === 'function') {
                console.log('🔄 Utilisation de createEmailSession');
                session = await account.createEmailSession(email, password);
            } else if (typeof account.createEmailPasswordSession === 'function') {
                console.log('🔄 Utilisation de createEmailPasswordSession');
                session = await account.createEmailPasswordSession(email, password);
            } else if (typeof account.createSession === 'function') {
                console.log('🔄 Utilisation de createSession');
                session = await account.createSession(email, password);
            } else {
                throw new Error('Aucune méthode de connexion email disponible');
            }
            
            console.log('✅ Session créée avec succès');
            return session;
        } catch (error) {
            console.error('❌ Erreur lors de la connexion:', error);
            
            // Messages d'erreur personnalisés
            if (error.code === 401) {
                throw new Error('Email ou mot de passe incorrect');
            } else if (error.code === 429) {
                throw new Error('Trop de tentatives. Réessayez plus tard');
            } else {
                throw new Error(error.message || 'Erreur de connexion');
            }
        }
    },

    // ✅ Obtenir l'utilisateur actuel
    async getCurrentUser() {
        try {
            const user = await account.get();
            return user;
        } catch (error) {
            // Ne pas logger cette erreur car elle est normale quand l'utilisateur n'est pas connecté
            return null;
        }
    },

    // ✅ Déconnexion
    async logout() {
        try {
            console.log('👋 Déconnexion en cours...');
            const result = await account.deleteSession('current');
            console.log('✅ Déconnexion réussie');
            return result;
        } catch (error) {
            console.error('❌ Erreur lors de la déconnexion:', error);
            throw error;
        }
    },

    // ✅ Vérifier si l'utilisateur est connecté
    async isAuthenticated() {
        try {
            await account.get();
            return true;
        } catch {
            return false;
        }
    },

    // ✅ Debug - Lister les méthodes disponibles
    debugMethods() {
        console.log('🔍 Méthodes disponibles sur account:');
        console.log('createEmailSession:', typeof account.createEmailSession === 'function');
        console.log('createEmailPasswordSession:', typeof account.createEmailPasswordSession === 'function');
        console.log('createSession:', typeof account.createSession === 'function');
        console.log('createOAuth2Session:', typeof account.createOAuth2Session === 'function');
        
        // Lister toutes les méthodes
        console.log('Toutes les méthodes:', Object.getOwnPropertyNames(Object.getPrototypeOf(account)));
    }
};

export { ID, Query, Permission, Role };
export default client;

