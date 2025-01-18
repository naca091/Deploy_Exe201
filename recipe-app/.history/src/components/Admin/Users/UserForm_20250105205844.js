import React from 'react';
import { Modal, Form, Input, message, Select } from 'antd';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://demcalo.onrender.com';

const UserForm = ({ visible, onCancel, onSuccess, initialValues }) => {
    const [form] = Form.useForm();
    const [roles, setRoles] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const isEditing = !!initialValues?._id;

    React.useEffect(() => {
        if (visible) {
            if (initialValues) {
                form.setFieldsValue(initialValues);
            } else {
                form.resetFields();
            }
            fetchRoles();
        }
    }, [visible, initialValues, form]);

    const fetchRoles = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/roles`);
            setRoles(response.data.data);
        } catch (error) {
            message.error('Failed to fetch roles');
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            if (isEditing && initialValues?._id) {
                await axios.put(`${API_BASE_URL}/api/users/${initialValues._id}`, values);
                message.success('User updated successfully');
            } else {
                await axios.post(`${API_BASE_URL}/api/users`, values);
                message.success('User added successfully');
            }
            form.resetFields();
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={isEditing ? 'Edit User' : 'Add New User'}
            open={visible}
            onCancel={() => {
                form.resetFields();
                if (onCancel) {
                    onCancel();
                }
            }}
            onOk={() => form.submit()}
            confirmLoading={loading}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={initialValues}
            >
                <Form.Item
                    name="fullName"
                    label="Full Name"
                    rules={[{ required: true, message: 'Please input the full name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Please input the email!' },
                        { type: 'email', message: 'Please enter a valid email!' },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="Phone"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="address"
                    label="Address"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="role"
                    label="Role"
                    rules={[{ required: true, message: 'Please select a role!' }]}
                >
                    <Select>
                        {roles.map((role) => (
                            <Select.Option key={role._id} value={role._id}>
                                {role.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UserForm;