import React, { useEffect, useState } from "react";
import { Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const VideoForm = ({ video, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (video) {
      form.setFieldsValue({
        title: video.title,
      });
    }
  }, [video, form]);

  const onFinish = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", values.title);

    if (fileList.length > 0) {
      formData.append("video", fileList[0].originFileObj);
    }

    try {
      const token = localStorage.getItem("token");
      const url = video
        ? `https://demcalo.onrender.com/api/videos/${video._id}`
        : "https://demcalo.onrender.com/api/videos";

      const method = video ? "put" : "post";

      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        message.success(`Video ${video ? "updated" : "uploaded"} successfully`);
        onSuccess();
        form.resetFields();
        setFileList([]);
      }
    } catch (error) {
      console.error("Submit error:", error);
      message.error(
        `Failed to ${video ? "update" : "upload"} video: ` +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      if (!file.type.startsWith("video/")) {
        message.error("Please upload a video file!");
        return false;
      }
      return false;
    },
    onChange: (info) => {
      setFileList(info.fileList.slice(-1));
    },
  };

  return (
    <div style={{ maxWidth: 600, margin: "24px auto", padding: "0 24px" }}>
      <h2>{video ? "Edit Video" : "Upload Video"}</h2>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="title"
          label="Video Title"
          rules={[{ required: true, message: "Please input video title!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Video File">
          <Upload {...uploadProps} fileList={fileList}>
            <Button icon={<UploadOutlined />}>Select Video</Button>
          </Upload>
          {video && <p>Leave empty to keep existing video</p>}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {video ? "Update" : "Upload"} Video
          </Button>
          {onCancel && (
            <Button onClick={onCancel} style={{ marginLeft: 8 }}>
              Cancel
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default VideoForm;
