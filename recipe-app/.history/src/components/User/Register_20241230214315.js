import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Tạo instance axios với base URL
const api = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

const Register = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            // Sử dụng instance api thay vì axios trực tiếp
            const response = await api.post('/api/users/register', values);
            
            if (response.data.success) {
                message.success('Registration successful');
                navigate('/login');
            }
        } catch (error) {
            console.error('Registration error:', error);
            if (error.response) {
                message.error(error.response.data.message || 'Registration failed');
            } else if (error.request) {
                message.error('Network error. Please check your connection.');
            } else {
                message.error('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 py-8">
            <Card className="w-96">
                <h2 className="text-center text-2xl mb-4">Register</h2>
                <Form
                    name="register"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>
                    <Form.Item
                        name="fullName"
                        rules={[{ required: true, message: 'Please input your full name!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Full Name" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please input a valid email!' }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item name="phone">
                        <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
                    </Form.Item>
                    <Form.Item name="address">
                        <Input prefix={<HomeOutlined />} placeholder="Address" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full">
                            Register
                        </Button>
                    </Form.Item>
                    <div className="text-center">
                        <Button type="link" onClick={() => navigate('/login')}>
                            Already have an account? Login
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Register;