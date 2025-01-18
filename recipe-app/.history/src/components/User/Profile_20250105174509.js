// Profile.jsx
import React, { useEffect, useState } from 'react';
import { Card, Button, Avatar, message, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            message.error('You need to log in first.');
            navigate('/login');
        } else {
            setUser(storedUser);
            form.setFieldsValue(storedUser);
        }
    }, [navigate, form]);

    const handleSaveProfile = async (values) => {
        try {
            const response = await axios.put(`/api/users/${user._id}`, values);
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            message.success('Profile updated successfully');
        } catch (error) {
            message.error('Failed to update profile');
        }
    };

    const handleChangePassword = async (values) => {
        try {
            const response = await axios.post(`/api/users/${user._id}/change-password`, {
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
            });
            message.success('Password changed successfully');
            passwordForm.resetFields();
        } catch (error) {
            message.error('Failed to change password');
        }
    };

    return (
        user && (
            <div className="min-h-screen flex justify-center items-center bg-gray-100">
                <Card className="w-1/2">
                    <div className="text-center mb-6">
                        <Avatar size={100} src={`/uploads/${user.avatar}`} />
                        <h2 className="text-2xl font-bold mt-2">{user.fullName}</h2>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                    <Form form={form} onFinish={handleSaveProfile}>
                        <Form.Item name="fullName" label="Full Name">
                            <Input />
                        </Form.Item>
                        <Form.Item name="address" label="Address">
                            <Input />
                        </Form.Item>
                        <Form.Item name="phone" label="Phone">
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Save Changes
                            </Button>
                        </Form.Item>
                    </Form>

                    <Form form={passwordForm} onFinish={handleChangePassword}>
                        <Form.Item
                            name="oldPassword"
                            label="Old Password"
                            rules={[{ required: true, message: 'Please input your old password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="newPassword"
                            label="New Password"
                            rules={[{ required: true, message: 'Please input your new password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="confirmNewPassword"
                            label="Confirm New Password"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Please confirm your new password!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The two passwords do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Change Password
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        )
    );
};

export default Profile;