import { useState, useEffect } from 'react';
import { videoService } from '../services/videoService';

export const useVideos = (limit = 20) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const loadVideos = async (offset = 0, refresh = false) => {
        try {
            setLoading(true);
            const result = await videoService.getVideos(limit, offset);
            
            if (result.success) {
                if (refresh) {
                    setVideos(result.videos);
                } else {
                    setVideos(prev => [...prev, ...result.videos]);
                }
                setHasMore(result.videos.length === limit);
                setError(null);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVideos(0, true);
    }, []);

    const refresh = () => loadVideos(0, true);
    const loadMore = () => loadVideos(videos.length);

    return {
        videos,
        loading,
        error,
        hasMore,
        refresh,
        loadMore
    };
};
