import { databases, storage, DATABASE_ID, COLLECTIONS, BUCKET_ID, ID, Query } from './appwrite';

export const videoService = {
    // Récupérer les vidéos (feed principal)
    async getVideos(limit = 20, offset = 0) {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.VIDEOS,
                [
                    Query.equal('isPublic', true),
                    Query.orderDesc('createdAt'),
                    Query.limit(limit),
                    Query.offset(offset)
                ]
            );

            // Enrichir avec les données utilisateur
            const videosWithUsers = await Promise.all(
                response.documents.map(async (video) => {
                    try {
                        const user = await databases.getDocument(
                            DATABASE_ID,
                            COLLECTIONS.USERS,
                            video.userId
                        );
                        return { ...video, user };
                    } catch (error) {
                        console.error('Erreur récupération utilisateur:', error);
                        return video;
                    }
                })
            );

            return { success: true, videos: videosWithUsers, total: response.total };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Récupérer les vidéos d'un utilisateur
    async getUserVideos(userId, limit = 20) {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.VIDEOS,
                [
                    Query.equal('userId', userId),
                    Query.equal('isPublic', true),
                    Query.orderDesc('createdAt'),
                    Query.limit(limit)
                ]
            );

            return { success: true, videos: response.documents };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Créer une vidéo
    async createVideo(videoData, file) {
        try {
            let videoUrl = '';
            
            // Upload du fichier vidéo
            if (file) {
                const uploadResult = await storage.createFile(
                    BUCKET_ID,
                    ID.unique(),
                    file
                );
                videoUrl = storage.getFileView(BUCKET_ID, uploadResult.$id);
            }

            const video = await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.VIDEOS,
                ID.unique(),
                {
                    ...videoData,
                    videoUrl,
                    viewsCount: 0,
                    likesCount: 0,
                    commentsCount: 0,
                    isPublic: true,
                    createdAt: new Date().toISOString()
                }
            );

            return { success: true, video };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Incrementer les vues
    async incrementViews(videoId) {
        try {
            const video = await databases.getDocument(DATABASE_ID, COLLECTIONS.VIDEOS, videoId);
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.VIDEOS,
                videoId,
                {
                    viewsCount: (video.viewsCount || 0) + 1
                }
            );
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

