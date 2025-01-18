import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('https://demcalo.onrender.com/api/users/login', {
        username: values.username.trim(),
        password: values.password
      });

      if (response.data.success) {
        const { user } = response.data;
        
        // Lưu thông tin xác thực
        authUtils.setAuthToken(user.token);
        localStorage.setItem('user', JSON.stringify(user));

        message.success('Đăng nhập thành công!');

        // Chuyển hướng dựa vào role
        const redirectPath = user.role?.roleId === 1 
          ? '/admin/dashboard' 
          : '/user/homepage';
        
        navigate(redirectPath, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      
      const errorMsg = error.response?.data?.message || 'Đăng nhập thất bại';
      message.error(errorMsg);
      
      // Reset form nếu credentials không hợp lệ
      if (error.response?.status === 401) {
        form.setFields([
          {
            name: 'password',
            errors: [''],
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-96 shadow-md">
        <h2 className="text-center text-2xl font-bold mb-6">Đăng nhập</h2>
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Vui lòng nhập username!' },
              { min: 3, message: 'Username phải có ít nhất 3 ký tự!' }
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Username"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập password!' },
              { min: 6, message: 'Password phải có ít nhất 6 ký tự!' }
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