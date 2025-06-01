import { useState, useEffect } from 'react';
import { likeService } from '../services/likeService';
import { useAuth } from '../context/AuthContext';

export const useLikes = (targetId, targetType, initialLiked = false) => {
    const { user } = useAuth();
    const [liked, setLiked] = useState(initialLiked);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && targetId) {
            checkLikeStatus();
        }
    }, [user, targetId]);

    const checkLikeStatus = async () => {
        if (!user) return;
        
        const isLiked = await likeService.checkIfLiked(user.$id, targetId, targetType);
        setLiked(isLiked);
    };

    const toggleLike = async () => {
        if (!user || loading) return;

        setLoading(true);
        const result = await likeService.toggleLike(user.$id, targetId, targetType);
        
        if (result.success) {
            setLiked(result.liked);
        }
        setLoading(false);
    };

    return {
        liked,
        loading,
        toggleLike
    };
};
