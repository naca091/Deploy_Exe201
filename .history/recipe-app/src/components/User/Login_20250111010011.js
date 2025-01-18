import React, { useState } from 'react';  
import { Form, Input, Button, Card, message } from 'antd';  
import { UserOutlined, LockOutlined } from '@ant-design/icons';  
import { useNavigate } from 'react-router-dom';  
import axios from 'axios';  
import authUtils from '../User/authUtils';  

const Login = () => {  
  const navigate = useNavigate();  
  const [loading, setLoading] = useState(false);  
  const [form] = Form.useForm();  

  const onFinish = async (values) => {  
    setLoading(true);  
    try {  
      const response = await axios.post('localhost:5000/api/users/login', values);  
      // Lưu token và user vào localStorage hoặc context  
      localStorage.setItem('token', response.data.token);  
      localStorage.setItem('user', JSON.stringify(response.data.user));  
      navigate('/');  
    } catch (error) {  
      console.error('Login error:', error);  
      const errorMsg =  
        error.response?.data?.message || 'An error occurred during login.';  
      message.error(errorMsg);  
    } finally {  
      setLoading(false);  
    }  
  };  

  return (  
    <div className="flex justify-center items-center min-h-screen bg-gray-100">  
      <Card className="w-96 shadow-md">  
        <h2 className="text-center text-2xl font-bold mb-6">Login</h2>  
        <Form  
          form={form}  
          name="login"  
          onFinish={onFinish}  
          layout="vertical"  
          size="large"  
        >  
          <Form.Item  
            name="email"  
            rules={[  
              { required: true, message: 'Please enter your email!' },  
              { type: 'email', message: 'Please enter a valid email!' },  
            ]}  
          >  
            <Input  
              prefix={<UserOutlined className="text-gray-400" />}  
              placeholder="Email"  
              autoComplete="email"  
            />  
          </Form.Item>  

          <Form.Item  
            name="password"  
            rules={[  
              { required: true, message: 'Please enter your password!' },  
              { min: 6, message: 'Password must be at least 6 characters!' },  
            ]}  
          >  
            <Input.Password  
              prefix={<LockOutlined className="text-gray-400" />}  
              placeholder="Password"  
              autoComplete="current-password"  
            />  
          </Form.Item>  

          <Form.Item>  
            <Button  
              type="primary"  
              htmlType="submit"  
              className="w-full"  
              loading={loading}  
            >  
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