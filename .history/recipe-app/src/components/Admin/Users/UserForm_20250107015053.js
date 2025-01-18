import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, message, Switch } from 'antd';
import axios from 'axios';

const { Option } = Select;

const UserForm = ({ visible, onCancel, onSuccess, initialValues }) => {
  const [form] = Form.useForm();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialValues?._id;

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/roles');
        if (response.data.success) {
          setRoles(response.data.data);
        }
      } catch (error) {
        message.error('Failed to fetch roles');
      }
    };

    if (visible) {
      fetchRoles();
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (isEditing && initialValues?._id) {
        await axios.put(`http://localhost:5000/api/users/${initialValues._id}`, values);
        message.success('User updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/users', values);
        message.success('User added successfully');
      }
      form.resetFields();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error details:', error.response?.data);
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
        if (onCancel) onCancel();
      }}
      onOk={() => form.submit()}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ isActive: true, ...initialValues }}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[
            { required: true, message: 'Username is required' },
            { min: 4, message: 'Username must be at least 4 characters' },
            { max: 20, message: 'Username cannot exceed 20 characters' },
            { 
              pattern: /^[a-zA-Z0-9_]+$/,
              message: 'Username can only contain letters, numbers and underscores'
            }
          ]}
        >
          <Input />
        </Form.Item>

        {!isEditing && (
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Password is required' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password />
          </Form.Item>
        )}

        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[
            { required: true, message: 'Full name is required' },
            { min: 2, message: 'Name must be at least 2 characters' },
            { max: 50, message: 'Name cannot exceed 50 characters' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Please provide a valid email' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            {
              pattern: /^(\+84|84|0)?[1-9]\d{8,9}$/,
              message: 'Please provide a valid phone number'
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
          rules={[
            { max: 200, message: 'Address cannot exceed 200 characters' }
          ]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Role is required' }]}
        >
          <Select placeholder="Select a role">
            {roles?.map((role) => (
              <Option key={role._id} value={role._id}>
                {role.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="coins"
          label="Coins"

        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          name="avatar"
          label="Avatar URL"
        >
          <Input placeholder="Enter avatar URL" />
        </Form.Item>

        <Form.Item
          name="isActive"
          label="Is Active"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserForm;