import React, { useState, useEffect, useRef } from 'react';
import { Card, message, Row, Col, Spin, Button } from 'antd';
import axios from 'axios';

const SeeVideo = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timers, setTimers] = useState({});
    const [countdowns, setCountdowns] = useState({});
    const [rewardedVideos, setRewardedVideos] = useState(new Set());
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
            const response = await axios.get('http://localhost:5000/api/videos/videos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setVideos(response.data.videos);
                // Initialize countdowns and check reward status for each video
                const initialCountdowns = {};
                response.data.videos.forEach(async (video) => {
                    initialCountdowns[video._id] = 30;
                    const rewardStatus = await checkRewardStatus(video._id);
                    if (rewardStatus) {
                        setRewardedVideos(prev => new Set([...prev, video._id]));
                    }
                });
                setCountdowns(initialCountdowns);
            }
        } catch (error) {
            message.error('Failed to fetch videos: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const checkRewardStatus = async (videoId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/videos/check-reward/${videoId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data.isRewarded;
        } catch (error) {
            console.error('Failed to check reward status:', error);
            return false;
        }
    };

    const handlePlayVideo = (videoId) => {
        const videoElement = videoRefs.current[videoId];
        if (videoElement) {
            videoElement.play()
                .then(() => {
                    // Start countdown only if video hasn't been rewarded
                    if (!rewardedVideos.has(videoId) && !timers[videoId]) {
                        startCountdown(videoId);
                    }
                })
                .catch(error => {
                    message.error('Failed to play video: ' + error.message);
                });
        }
    };

    const startCountdown = (videoId) => {
        const timer = setInterval(() => {
            setCountdowns(prev => {
                const newCountdown = prev[videoId] - 1;
                
                if (newCountdown <= 0) {
                    clearInterval(timers[videoId]);
                    awardXu(videoId);
                    return { ...prev, [videoId]: 0 };
                }
                
                return { ...prev, [videoId]: newCountdown };
            });
        }, 1000);

        setTimers(prev => ({ ...prev, [videoId]: timer }));
    };

    const handlePauseVideo = (videoId) => {
        const videoElement = videoRefs.current[videoId];
        if (videoElement) {
            videoElement.pause();
            
            // Clear timer if video hasn't been rewarded
            if (timers[videoId] && !rewardedVideos.has(videoId)) {
                clearInterval(timers[videoId]);
                setTimers(prev => {
                    const newTimers = { ...prev };
                    delete newTimers[videoId];
                    return newTimers;
                });
            }
        }
    };

    const awardXu = async (videoId) => {
        // Skip if already rewarded
        if (rewardedVideos.has(videoId)) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/videos/award-xu',
                { videoId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                message.success('Gift reward 100 xu! 🎁');
                setRewardedVideos(prev => new Set([...prev, videoId]));
            }
        } catch (error) {
            if (error.response?.status === 400) {
                // Already rewarded
                setRewardedVideos(prev => new Set([...prev, videoId]));
            } else {
                message.error('Failed to award XU: ' + error.message);
            }
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
                                controls={false}  // Disable default controls
                            >
                                <source 
                                    src={`http://localhost:5000/api/videos/stream/${video.videoPath.split('/').pop()}`}
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
                                    disabled={rewardedVideos.has(video._id)}
                                >
                                    {rewardedVideos.has(video._id) ? 'Rewarded' : 'Play Video'}
                                </Button>
                                <div style={{ 
                                    fontWeight: 'bold',
                                    color: rewardedVideos.has(video._id) ? '#52c41a' : '#1890ff'
                                }}>
                                    {rewardedVideos.has(video._id) ? 
                                        'Completed! 🎁' : 
                                        countdowns[video._id] ? `${countdowns[video._id]}s` : '30s'
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