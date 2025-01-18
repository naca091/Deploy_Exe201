// AdminVideoUpload.js
import React, { useState } from 'react';
import { Form, Input, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const AdminVideoUpload = () => {
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);

    const onFinish = async (values) => {
        if (fileList.length === 0) {
            message.error('Please select a video file');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('video', fileList[0].originFileObj);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/videos/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                message.success('Video uploaded successfully');
                setFileList([]);
                form.resetFields();
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to upload video');
        } finally {
            setLoading(false);
        }
    };

    const props = {
        beforeUpload: file => {
            if (!file.type.startsWith('video/')) {
                message.error('Please upload a video file!');
                return false;
            }
            return false;
        },
        onChange: info => {
            setFileList(info.fileList.slice(-1));
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: '24px auto', padding: '0 24px' }}>
            <h2>Upload Video</h2>
            <Form onFinish={onFinish} layout="vertical">
                <Form.Item
                    name="title"
                    label="Video Title"
                    rules={[{ required: true, message: 'Please input video title!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="Video File">
                    <Upload {...props} fileList={fileList}>
                        <Button icon={<UploadOutlined />}>Select Video</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Upload Video
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};