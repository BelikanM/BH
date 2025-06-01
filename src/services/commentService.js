import { databases, DATABASE_ID, COLLECTIONS, ID, Query } from './appwrite';

export const commentService = {
    // Récupérer les commentaires d'une vidéo
    async getVideoComments(videoId, limit = 50) {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.COMMENTS,
                [
                    Query.equal('videoId', videoId),
                    Query.orderDesc('createdAt'),
                    Query.limit(limit)
                ]
            );

            // Enrichir avec les données utilisateur
            const commentsWithUsers = await Promise.all(
                response.documents.map(async (comment) => {
                    try {
                        const user = await databases.getDocument(
                            DATABASE_ID,
                            COLLECTIONS.USERS,
                            comment.userId
                        );
                        return { ...comment, user };
                    } catch (error) {
                        return comment;
                    }
                })
            );

            return { success: true, comments: commentsWithUsers };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Ajouter un commentaire
    async addComment(videoId, userId, content) {
        try {
            const comment = await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.COMMENTS,
                ID.unique(),
                {
                    videoId,
                    userId,
                    content,
                    likesCount: 0,
                    createdAt: new Date().toISOString()
                }
            );

            // Incrémenter le compteur de commentaires de la vidéo
            await this.updateCommentCount(videoId, 1);

            return { success: true, comment };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Supprimer un commentaire
    async deleteComment(commentId, videoId) {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                COLLECTIONS.COMMENTS,
                commentId
            );

            // Décrémenter le compteur
            await this.updateCommentCount(videoId, -1);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Mettre à jour le compteur de commentaires
    async updateCommentCount(videoId, increment) {
        try {
            const video = await databases.getDocument(DATABASE_ID, COLLECTIONS.VIDEOS, videoId);
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.VIDEOS,
                videoId,
                {
                    commentsCount: Math.max(0, (video.commentsCount || 0) + increment)
                }
            );
        } catch (error) {
            console.error('Erreur mise à jour compteur commentaires:', error);
        }
    }
};

