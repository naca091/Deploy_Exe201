import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post('https://demcalo.onrender.com/api/users/login', {
                username: values.username,
                password: values.password
            });

            if (response.data.success) {
                const { user } = response.data;
                // Lưu token vào localStorage
                localStorage.setItem('token', user.token);
                // Lưu thông tin user vào localStorage nếu cần
                localStorage.setItem('user', JSON.stringify(user));

                message.success('Đăng nhập thành công!');

                // Chuyển hướng dựa vào role
                if (user.role && user.role.roleId === 1) {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/user/homepage');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            message.error(error.response?.data?.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-96">
                <h2 className="text-center text-2xl mb-4">Đăng nhập</h2>
                <Form
                    name="login"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập username!' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Username"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full"
                            loading={loading}
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>

                    <div className="text-center">
                        <Button type="link" onClick={() => navigate('/register')}>
                            Chưa có tài khoản? Đăng ký
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Login;