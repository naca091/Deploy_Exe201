import React, { useState, useEffect, useRef } from "react";
import { Card, message, Row, Col, Spin, Button, Space } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

const SeeVideo = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timers, setTimers] = useState({});
  const [countdowns, setCountdowns] = useState({});
  const [rewardedVideos, setRewardedVideos] = useState(new Set());
  const [playingVideos, setPlayingVideos] = useState(new Set());
  const videoRefs = useRef({});

  useEffect(() => {
    const validateUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login first");
        navigate("/user/login");
        return;
      }
      try {
        const response = await axios.get("https://demcalo.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (error) {
        message.error("Failed to fetch user data.");
        localStorage.clear("token");
        navigate("/user/login");
      }
    };
    validateUser();
  }, [navigate]);

  useEffect(() => {
    fetchVideos();
    return () => {
      Object.values(timers).forEach((timer) => clearInterval(timer));
    };
  }, []);

  const checkRewardStatus = async (videoId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://demcalo.onrender.com/api/videos/check-reward/${videoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success && response.data.isRewarded) {
        setRewardedVideos((prev) => new Set([...prev, videoId]));
      }
    } catch (error) {
      console.error("Check reward status error:", error);
    }
  };

  // Modify fetchVideos to check reward status
  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://demcalo.onrender.com/api/videos/videos",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setVideos(response.data.videos);
        const initialCountdowns = {};
        // Check reward status for each video
        response.data.videos.forEach(async (video) => {
          initialCountdowns[video._id] = 30;
          await checkRewardStatus(video._id);
        });
        setCountdowns(initialCountdowns);
      }
    } catch (error) {
      message.error("Failed to fetch videos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayVideo = async (videoId) => {
    const videoElement = videoRefs.current[videoId];
    if (videoElement) {
      try {
        await videoElement.play();
        setPlayingVideos((prev) => new Set([...prev, videoId]));

        if (!rewardedVideos.has(videoId) && !timers[videoId]) {
          const timer = setInterval(() => {
            setCountdowns((prev) => {
              const newCountdown = prev[videoId] - 1;

              if (newCountdown <= 0) {
                clearInterval(timer);
                awardXu(videoId);
                return { ...prev, [videoId]: 0 };
              }

              return { ...prev, [videoId]: newCountdown };
            });
          }, 1000);

          setTimers((prev) => ({ ...prev, [videoId]: timer }));
        }
      } catch (error) {
        message.error("Failed to play video: " + error.message);
      }
    }
  };

  const handlePauseVideo = (videoId) => {
    const videoElement = videoRefs.current[videoId];
    if (videoElement) {
      videoElement.pause();
      setPlayingVideos((prev) => {
        const newPlaying = new Set(prev);
        newPlaying.delete(videoId);
        return newPlaying;
      });

      if (timers[videoId] && !rewardedVideos.has(videoId)) {
        clearInterval(timers[videoId]);
        setTimers((prev) => {
          const newTimers = { ...prev };
          delete newTimers[videoId];
          return newTimers;
        });
      }
    }
  };

  const awardXu = async (videoId) => {
    if (rewardedVideos.has(videoId)) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://demcalo.onrender.com/api/videos/award-xu",
        { videoId: videoId }, // Make sure videoId is properly sent
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        message.success(
          `Gift reward 100 xu! New balance: ${response.data.newBalance} xu 🎁`
        );
        setRewardedVideos((prev) => new Set([...prev, videoId]));
      }
    } catch (error) {
      console.error("Award XU error:", error);
      if (
        error.response?.status === 400 &&
        error.response?.data?.message.includes("Already received")
      ) {
        setRewardedVideos((prev) => new Set([...prev, videoId]));
      } else {
        message.error(
          "Failed to award XU: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Header
        userEmail={user.email}
        userXu={user.xu}
        navigateToProfile={() => navigate("/user/profile")}
        handleLogout={() => {
          // localStorage.clear();
          navigate("/login");
        }}
      />
      <div style={{ padding: "24px" }}>
        <h2 style={{ marginBottom: "24px" }}>Available Videos</h2>
        <Row gutter={[16, 16]}>
          {videos.map((video) => (
            <Col xs={24} sm={12} md={6} key={video._id}>
              <Card
                title={video.title}
                style={{ height: "100%" }}
                bodyStyle={{ padding: "12px" }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "56.25%",
                  }}
                >
                  <video
                    ref={(el) => (videoRefs.current[video._id] = el)}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      background: "#000",
                    }}
                    preload="metadata"
                    onEnded={() => handlePauseVideo(video._id)}
                  >
                    <source
                      src={`https://demcalo.onrender.com${video.videoPath}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "12px",
                  }}
                >
                  <Space>
                    <Button
                      type="primary"
                      onClick={() => handlePlayVideo(video._id)}
                      disabled={rewardedVideos.has(video._id)}
                    >
                      {rewardedVideos.has(video._id) ? "Rewarded" : "Play"}
                    </Button>
                    <Button
                      onClick={() => handlePauseVideo(video._id)}
                      disabled={!playingVideos.has(video._id)}
                    >
                      Pause
                    </Button>
                  </Space>
                  <div
                    style={{
                      fontWeight: "bold",
                      color: rewardedVideos.has(video._id)
                        ? "#52c41a"
                        : "#1890ff",
                    }}
                  >
                    {rewardedVideos.has(video._id)
                      ? "Completed! 🎁"
                      : `${countdowns[video._id]}s`}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <Footer />
    </div>
  );
};

export default SeeVideo;
