import React, { useState } from 'react';
import { Input, Button, Form, message } from 'antd';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, { username, password });
      dispatch(login(response.data.user));
      navigate('/');
    } catch (error) {
      message.error('Đăng nhập thất bại');
    }
  };

  return (
    <div>
      <Form onFinish={handleLogin}>
        <Form.Item label="Username">
          <Input value={username} onChange={(e) => setUsername(e.target.value)} />
        </Form.Item>
        <Form.Item label="Password">
          <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Item>
        <Button type="primary" htmlType="submit">Login</Button>
      </Form>
    </div>
  );
};

export default Login;
