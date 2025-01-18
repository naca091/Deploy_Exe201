// SeeVideo.js
import React, { useState, useEffect, useRef } from 'react';
import { Card, message } from 'antd';
import axios from 'axios';

const SeeVideo = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const videoRefs = useRef({});
    const watchTimers = useRef({});

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://demcalo.onrender.com/api/videos/videos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setVideos(response.data.videos);
            }
        } catch (error) {
            message.error('Failed to fetch videos');
        } finally {
            setLoading(false);
        }
    };

    const handleVideoStart = (videoId) => {
        // Start 30-second timer
        watchTimers.current[videoId] = setTimeout(async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post('https://demcalo.onrender.com/api/videos/award-xu', null, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    message.success(response.data.message);
                }
            } catch (error) {
                message.error('Failed to award XU');
            }
        }, 30000);
    };

    const handleVideoEnd = (videoId) => {
        if (watchTimers.current[videoId]) {
            clearTimeout(watchTimers.current[videoId]);
            delete watchTimers.current[videoId];
        }
    };

    const handleVideoClose = (videoId) => {
        if (watchTimers.current[videoId]) {
            clearTimeout(watchTimers.current[videoId]);
            delete watchTimers.current[videoId];
            message.warning("Can't have gift 100 xu");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ maxWidth: 800, margin: '24px auto', padding: '0 24px' }}>
            <h2>Available Videos</h2>
            <div style={{ display: 'grid', gap: '24px' }}>
                {videos.map(video => (
                    <Card key={video._id} title={video.title}>
                        <video
                            ref={el => videoRefs.current[video._id] = el}
                            width="100%"
                            controls
                            onPlay={() => handleVideoStart(video._id)}
                            onPause={() => handleVideoClose(video._id)}
                            onEnded={() => handleVideoEnd(video._id)}
                        >
                            <source src={`https://demcalo.onrender.com/${video.videoPath}`} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SeeVideo;