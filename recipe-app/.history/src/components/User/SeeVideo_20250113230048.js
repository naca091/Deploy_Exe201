import React, { useState, useEffect, useRef } from 'react';
import { Card, message, Row, Col, Spin } from 'antd';
import axios from 'axios';

const SeeVideo = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const videoRefs = useRef({});
    const watchTimers = useRef({});

    useEffect(() => {
        fetchVideos();
        // Cleanup function to clear all timers when component unmounts
        return () => {
            Object.keys(watchTimers.current).forEach(timerId => {
                clearTimeout(watchTimers.current[timerId]);
            });
        };
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
            message.error('Failed to fetch videos: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVideoStart = (videoId) => {
        // Clear any existing timer for this video
        if (watchTimers.current[videoId]) {
            clearTimeout(watchTimers.current[videoId]);
        }

        // Start new 30-second timer
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
                message.error('Failed to award XU: ' + error.message);
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
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            <h2 style={{ marginBottom: '24px' }}>Available Videos</h2>
            <Row gutter={[16, 16]}>
                {videos.map(video => (
                    <Col xs={24} sm={12} md={6} key={video._id}>
                        <Card 
                            title={video.title}
                            style={{ height: '100%' }}
                            bodyStyle={{ padding: '12px' }}
                        >
                            <video
                                ref={el => videoRefs.current[video._id] = el}
                                style={{ 
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: '200px',
                                    objectFit: 'cover'
                                }}
                                controls
                                onPlay={() => handleVideoStart(video._id)}
                                onPause={() => handleVideoClose(video._id)}
                                onEnded={() => handleVideoEnd(video._id)}
                                preload="metadata"
                            >
                                <source 
                                    src={`https://demcalo.onrender.com/${video.videoPath}`} 
                                    type="video/mp4"
                                />
                                Your browser does not support the video tag.
                            </video>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default SeeVideo;