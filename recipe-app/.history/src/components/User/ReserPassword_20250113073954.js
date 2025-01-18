import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Steps } from 'antd';
import { UserOutlined, LockOutlined, NumberOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Step } = Steps;

const ResetPassword = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleEmailSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/reset-password-request', {
                email: values.email
            });

            if (response.data.success) {
                setEmail(values.email);
                message.success('Verification code sent to your email');
                setCurrentStep(1);
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to send verification code');
        } finally {
            setLoading(false);
        }
    };

    const handleVerificationSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/verify-reset-code', {
                email,
                verificationCode: values.verificationCode,
                newPassword: values.newPassword
            });

            if (response.data.success) {
                message.success('Password reset successful');
                navigate('/login');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    const EmailForm = () => (
        <Form onFinish={handleEmailSubmit} layout="vertical">
            <Form.Item
                name="email"
                rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                ]}
            >
                <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                    Send Verification Code
                </Button>
            </Form.Item>
        </Form>
    );

    const VerificationForm = () => (
        <Form onFinish={handleVerificationSubmit} layout="vertical">
            <Form.Item
                name="verificationCode"
                rules={[
                    { required: true, message: 'Please input verification code!' },
                    { len: 6, message: 'Verification code must be 6 digits!' }
                ]}
            >
                <Input prefix={<NumberOutlined />} placeholder="6-digit verification code" />
            </Form.Item>

            <Form.Item
                name="newPassword"
                rules={[
                    { required: true, message: 'Please input your new password!' },
                    { min: 6, message: 'Password must be at least 6 characters!' }
                ]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder="New Password" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                    Reset Password
                </Button>
            </Form.Item>
        </Form>
    );

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#f0f2f5'
        }}>
            <Card
                title={<h2 style={{ textAlign: 'center' }}>Reset Password</h2>}
                style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
            >
                <Steps current={currentStep} style={{ marginBottom: 24 }}>
                    <Step title="Email" />
                    <Step title="Verify" />
                </Steps>

                {currentStep === 0 ? <EmailForm /> : <VerificationForm />}
            </Card>
        </div>
    );
};

export default ResetPassword;