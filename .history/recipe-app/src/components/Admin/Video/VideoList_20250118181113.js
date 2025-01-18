import React, { useState, useEffect } from "react";
import { Table, Button, Space, Modal, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import VideoForm from "./VideoForm";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://demcalo.onrender.com/api/videos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVideos(response.data); // Lấy trực tiếp data vì backend đã trả về mảng videos
    } catch (error) {
      console.error("Fetch error:", error);
      message.error(
        "Failed to fetch videos: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://demcalo.onrender.com/api/videos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("Video deleted successfully");
      fetchVideos();
    } catch (error) {
      message.error("Failed to delete video");
    }
  };

  const columns = [
    {
      title: "No.",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Upload Date",
      dataIndex: "uploadDate",
      key: "uploadDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedVideo(record);
              setModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: "Are you sure you want to delete this video?",
                content: "This action cannot be undone.",
                onOk: () => handleDelete(record._id),
              });
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedVideo(null);
            setModalVisible(true);
          }}
        >
          Add Video
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={videos}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title={selectedVideo ? "Edit Video" : "Add Video"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <VideoForm
          video={selectedVideo}
          onSuccess={() => {
            setModalVisible(false);
            fetchVideos();
          }}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </div>
  );
};

export default VideoList;
