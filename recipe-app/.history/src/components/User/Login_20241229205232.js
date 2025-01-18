import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', values);
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                message.success('Login successful');
                navigate('/');
            }
        } catch (error) {
            message.error('Login failed');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <Card className="w-96">
                <h2 className="text-center text-2xl mb-4">Login</h2>
                <Form
                    name="login"
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
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full">
                            Log in
                        </Button>
                    </Form.Item>
                    <div className="text-center">
                        <Button type="link" onClick={() => navigate('/register')}>
                            Register now!
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Login;