import { Client, Databases, Storage, Account, ID, Query, Permission, Role } from 'appwrite';

// Configuration Appwrite
const client = new Client();

client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '67bb24ad002378e79e38');

// Services Appwrite
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Configuration
export const DATABASE_ID = import.meta.env.VITE_DATABASE_ID || 'tiktok_clone';
export const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID || '68284595002f12395db2';

// Collections IDs
export const COLLECTIONS = {
    USERS: 'users',
    VIDEOS: 'videos',
    COMMENTS: 'comments',
    LIKES: 'likes',
    FOLLOWS: 'follows'
};

export { ID, Query, Permission, Role };
export default client;

