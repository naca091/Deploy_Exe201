import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      console.log('Login data:', {
        username: values.username.trim(),
        password: values.password,
      });
  
      const response = await axios.post('https://demcalo.onrender.com/login', {
        username: values.username.trim(),
        password: values.password,
      });
  
      if (response.data.success) {
        const { user } = response.data;
        localStorage.setItem('user', JSON.stringify(user));
        message.success('Login successful');
        navigate(user.role.roleId === 0 ? '/admin/dashboard' : '/user/homepage');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data);
      message.error(error.response?.data?.message || 'Invalid username or password');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-96">
        <h2 className="text-center text-2xl mb-4">Login</h2>
        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username or email!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username or Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
              Login
            </Button>
          </Form.Item>
          <div className="text-center">
            <Button type="link" onClick={() => navigate('/register')}>
              Don't have an account? Register
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;