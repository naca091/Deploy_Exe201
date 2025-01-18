import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, message } from 'antd';

const Register = () => {
    const [loading, setLoading] = useState(false);

    const handleRegister = async (values) => {
        setLoading(true);

        try {
            const response = await axios.post('https://demcalo.onrender.com/api/users/register', values);

            if (response.data.success) {
                message.success(response.data.message);
            } else {
                message.error(response.data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            const errorMessage = error.response?.data?.message || 'An error occurred during registration';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Register</h2>
            <Form layout="vertical" onFinish={handleRegister}>
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input placeholder="Enter your username" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password placeholder="Enter your password" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' },
                    ]}
                >
                    <Input placeholder="Enter your email" />
                </Form.Item>

                <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[{ required: true, message: 'Please input your full name!' }]}
                >
                    <Input placeholder="Enter your full name" />
                </Form.Item>

                <Form.Item label="Phone" name="phone">
                    <Input placeholder="Enter your phone number" />
                </Form.Item>

                <Form.Item label="Address" name="address">
                    <Input placeholder="Enter your address" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Register;
