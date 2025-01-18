import React, { useState } from 'react';
import { Input, Button, Form, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, { username, password, fullName, email });
      message.success('Đăng ký thành công');
      navigate('/login');
    } catch (error) {
      message.error('Đăng ký thất bại');
    }
  };

  return (
    <div>
      <Form onFinish={handleRegister}>
        <Form.Item label="Full Name">
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </Form.Item>
        <Form.Item label="Username">
          <Input value={username} onChange={(e) => setUsername(e.target.value)} />
        </Form.Item>
        <Form.Item label="Email">
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>
        <Form.Item label="Password">
          <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Item>
        <Button type="primary" htmlType="submit">Register</Button>
      </Form>
    </div>
  );
};

export default Register;
