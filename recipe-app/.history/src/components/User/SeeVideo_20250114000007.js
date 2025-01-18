import React, { useState, useEffect, useRef } from 'react';
import { Card, message, Row, Col, Spin, Button } from 'antd';
import axios from 'axios';

const SeeVideo = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timers, setTimers] = useState({});
    const [countdowns, setCountdowns] = useState({});
    const videoRefs = useRef({});

    useEffect(() => {
        fetchVideos();
        return () => {
            // Cleanup timers on unmount
            Object.values(timers).forEach(timer => clearInterval(timer));
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
                // Initialize countdowns for all videos
                const initialCountdowns = {};
                response.data.videos.forEach(video => {
                    initialCountdowns[video._id] = 30;
                });
                setCountdowns(initialCountdowns);
            }
        } catch (error) {
            message.error('Failed to fetch videos: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePlayVideo = (videoId) => {
        const videoElement = videoRefs.current[videoId];
        if (videoElement) {
            videoElement.play();
            
            // Start countdown
            if (!timers[videoId]) {
                const timer = setInterval(() => {
                    setCountdowns(prev => {
                        const newCountdown = prev[videoId] - 1;
                        
                        if (newCountdown <= 0) {
                            clearInterval(timers[videoId]);
                            awardXu();
                            return { ...prev, [videoId]: 0 };
                        }
                        
                        return { ...prev, [videoId]: newCountdown };
                    });
                }, 1000);

                setTimers(prev => ({ ...prev, [videoId]: timer }));
            }
        }
    };

    const handlePauseVideo = (videoId) => {
        const videoElement = videoRefs.current[videoId];
        if (videoElement) {
            videoElement.pause();
            
            // Clear timer
            if (timers[videoId]) {
                clearInterval(timers[videoId]);
                setTimers(prev => {
                    const newTimers = { ...prev };
                    delete newTimers[videoId];
                    return newTimers;
                });
            }
        }
    };

    const awardXu = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('https://demcalo.onrender.com/api/videos/award-xu', null, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                message.success('Gift reward 100 xu! 🎁');
            }
        } catch (error) {
            message.error('Failed to award XU: ' + error.message);
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
                                onEnded={() => handlePauseVideo(video._id)}
                            >
                                <source 
                                    src={`https://demcalo.onrender.com/api/videos/stream/${video.videoPath.split('/').pop()}`}
                                    type="video/mp4"
                                />
                                Your browser does not support the video tag.
                            </video>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                marginTop: '12px'
                            }}>
                                <Button
                                    type="primary"
                                    onClick={() => handlePlayVideo(video._id)}
                                    disabled={countdowns[video._id] === 0}
                                >
                                    Play Video
                                </Button>
                                <div style={{ 
                                    fontWeight: 'bold',
                                    color: countdowns[video._id] === 0 ? '#52c41a' : '#1890ff'
                                }}>
                                    {countdowns[video._id] === 0 ? 
                                        'Completed! 🎁' : 
                                        `${countdowns[video._id]}s`
                                    }
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default SeeVideo;