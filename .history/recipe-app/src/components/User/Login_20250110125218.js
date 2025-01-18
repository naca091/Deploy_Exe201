import React, { useState } from 'react';  
import { Form, Input, Button, Card, message } from 'antd';  
import { UserOutlined, LockOutlined } from '@ant-design/icons';  
import { useNavigate } from 'react-router-dom';  
import axios from 'axios';  

const Login = () => {  
  const navigate = useNavigate();  
  const [loading, setLoading] = useState(false);  

  const loginUser = async (username, password) => {  
    try {  
        const response = await axios.post('https://demcalo.onrender.com/api/auth/login', { // Cập nhật URL nếu cần  
            username,  
            password  
        });  

        if (response.data.success) {  
            // Lưu token vào local storage  
            localStorage.setItem('token', response.data.token);  
            message.success('Login successful!');  
            
            // Nếu có thông tin người dùng, có thể lưu vào localStorage (nếu cần)  
            const { user } = response.data;  
            if (user && user._id) {  
                localStorage.setItem('user', JSON.stringify(user));  
            }  

            // Điều hướng dựa trên vai trò người dùng  
            navigate(user.role.roleId === 1 ? '/admin/dashboard' : '/user/homepage');  
        } else {  
            message.error(response.data.message || 'Login failed');  
        }  
    } catch (error) {  
        console.error('Login error:', error);  
        message.error('Login failed');  
    }  
};  

  const onFinish = async (values) => {  
    setLoading(true);  
    const { username, password } = values;  
    await loginUser(username, password); // Gọi hàm loginUser khi form được submit  
    setLoading(false);  
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