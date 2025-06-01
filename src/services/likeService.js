import { databases, DATABASE_ID, COLLECTIONS, ID, Query } from './appwrite';

export const likeService = {
    // Ajouter/Retirer un like
    async toggleLike(userId, targetId, targetType) {
        try {
            // Vérifier si le like existe déjà
            const existingLikes = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.LIKES,
                [
                    Query.equal('userId', userId),
                    Query.equal('targetId', targetId),
                    Query.equal('targetType', targetType)
                ]
            );

            if (existingLikes.documents.length > 0) {
                // Supprimer le like
                await databases.deleteDocument(
                    DATABASE_ID,
                    COLLECTIONS.LIKES,
                    existingLikes.documents[0].$id
                );

                // Décrémenter le compteur
                await this.updateLikeCount(targetId, targetType, -1);
                
                return { success: true, liked: false };
            } else {
                // Ajouter le like
                await databases.createDocument(
                    DATABASE_ID,
                    COLLECTIONS.LIKES,
                    ID.unique(),
                    {
                        userId,
                        targetId,
                        targetType,
                        createdAt: new Date().toISOString()
                    }
                );

                // Incrémenter le compteur
                await this.updateLikeCount(targetId, targetType, 1);
                
                return { success: true, liked: true };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Mettre à jour le compteur de likes
    async updateLikeCount(targetId, targetType, increment) {
        try {
            const collection = targetType === 'video' ? COLLECTIONS.VIDEOS : COLLECTIONS.COMMENTS;
            const document = await databases.getDocument(DATABASE_ID, collection, targetId);
            
            await databases.updateDocument(
                DATABASE_ID,
                collection,
                targetId,
                {
                    likesCount: Math.max(0, (document.likesCount || 0) + increment)
                }
            );
        } catch (error) {
            console.error('Erreur mise à jour compteur likes:', error);
        }
    },

    // Vérifier si un élément est liké
    async checkIfLiked(userId, targetId, targetType) {
        try {
            const likes = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.LIKES,
                [
                    Query.equal('userId', userId),
                    Query.equal('targetId', targetId),
                    Query.equal('targetType', targetType)
                ]
            );

            return likes.documents.length > 0;
        } catch (error) {
            return false;
        }
    },

    // Récupérer les vidéos likées par un utilisateur
    async getUserLikedVideos(userId) {
        try {
            const likes = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.LIKES,
                [
                    Query.equal('userId', userId),
                    Query.equal('targetType', 'video'),
                    Query.orderDesc('createdAt')
                ]
            );

            const videoIds = likes.documents.map(like => like.targetId);
            const videos = [];

            for (const videoId of videoIds) {
                try {
                    const video = await databases.getDocument(DATABASE_ID, COLLECTIONS.VIDEOS, videoId);
                    videos.push(video);
                } catch (error) {
                    console.error('Vidéo non trouvée:', videoId);
                }
            }

            return { success: true, videos };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

