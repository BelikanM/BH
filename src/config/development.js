// Configuration pour le développement local
export const developmentConfig = {
    appwrite: {
        endpoint: 'https://cloud.appwrite.io/v1',
        projectId: 'tiktok-clone-dev', // Remplacez par votre ID
        databaseId: 'tiktok-clone-db',
        bucketId: 'tiktok-clone-storage'
    },
    api: {
        baseUrl: 'http://localhost:3000/api'
    },
    features: {
        enableLiveStreaming: true,
        enableAnalytics: false,
        enablePushNotifications: false
    }
};

