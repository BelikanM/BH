import { databases, DATABASE_ID, COLLECTIONS, ID, Query } from './appwrite';

export const followService = {
    // Suivre/Ne plus suivre un utilisateur
    async toggleFollow(followerId, followingId) {
        try {
            // Vérifier si le follow existe
            const existingFollows = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.FOLLOWS,
                [
                    Query.equal('followerId', followerId),
                    Query.equal('followingId', followingId)
                ]
            );

            if (existingFollows.documents.length > 0) {
                // Ne plus suivre
                await databases.deleteDocument(
                    DATABASE_ID,
                    COLLECTIONS.FOLLOWS,
                    existingFollows.documents[0].$id
                );

                // Mettre à jour les compteurs
                await this.updateFollowCounts(followerId, followingId, -1);
                
                return { success: true, following: false };
            } else {
                // Suivre
                await databases.createDocument(
                    DATABASE_ID,
                    COLLECTIONS.FOLLOWS,
                    ID.unique(),
                    {
                        followerId,
                        followingId,
                        createdAt: new Date().toISOString()
                    }
                );

                // Mettre à jour les compteurs
                await this.updateFollowCounts(followerId, followingId, 1);
                
                return { success: true, following: true };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Mettre à jour les compteurs de followers/following
    async updateFollowCounts(followerId, followingId, increment) {
        try {
            // Mettre à jour followingCount du follower
            const follower = await databases.getDocument(DATABASE_ID, COLLECTIONS.USERS, followerId);
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.USERS,
                followerId,
                {
                    followingCount: Math.max(0, (follower.followingCount || 0) + increment)
                }
            );

            // Mettre à jour followersCount du suivi
            const following = await databases.getDocument(DATABASE_ID, COLLECTIONS.USERS, followingId);
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.USERS,
                followingId,
                {
                    followersCount: Math.max(0, (following.followersCount || 0) + increment)
                }
            );
        } catch (error) {
            console.error('Erreur mise à jour compteurs follows:', error);
        }
    },

    // Vérifier si on suit un utilisateur
    async checkIfFollowing(followerId, followingId) {
        try {
            const follows = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.FOLLOWS,
                [
                    Query.equal('followerId', followerId),
                    Query.equal('followingId', followingId)
                ]
            );

            return follows.documents.length > 0;
        } catch (error) {
            return false;
        }
    },

    // Récupérer les followers d'un utilisateur
    async getFollowers(userId) {
        try {
            const follows = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.FOLLOWS,
                [
                    Query.equal('followingId', userId),
                    Query.orderDesc('createdAt')
                ]
            );

            const followers = await Promise.all(
                follows.documents.map(async (follow) => {
                    try {
                        return await databases.getDocument(
                            DATABASE_ID,
                            COLLECTIONS.USERS,
                            follow.followerId
                        );
                    } catch (error) {
                        return null;
                    }
                })
            );

            return { success: true, followers: followers.filter(f => f !== null) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Récupérer les utilisateurs suivis
    async getFollowing(userId) {
        try {
            const follows = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.FOLLOWS,
                [
                    Query.equal('followerId', userId),
                    Query.orderDesc('createdAt')
                ]
            );

            const following = await Promise.all(
                follows.documents.map(async (follow) => {
                    try {
                        return await databases.getDocument(
                            DATABASE_ID,
                            COLLECTIONS.USERS,
                            follow.followingId
                        );
                    } catch (error) {
                        return null;
                    }
                })
            );

            return { success: true, following: following.filter(f => f !== null) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

