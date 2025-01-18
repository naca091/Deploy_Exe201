import React from 'react';
import { Modal, Form, Input, Select, InputNumber, message, Switch } from 'antd';
import axios from 'axios';

const { Option } = Select;

const UserForm = ({ visible, onCancel, onSuccess, initialValues, roles }) => {
  const [form] = Form.useForm();
  const isEditing = !!initialValues?._id;

  React.useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async (values) => {
    try {
      if (isEditing && initialValues?._id) {
        await axios.put(
          `http://localhost:5000/api/users/${initialValues._id}`,
          values
        );
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
      const errorMsg = error.response?.data?.message || 'Operation failed';
      message.error(errorMsg);
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
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[
            { required: true, message: 'Please input the username!' },
            { min: 4, message: 'Username must be at least 4 characters long' },
            { max: 20, message: 'Username cannot exceed 20 characters' },
            { pattern: /^[a-zA-Z0-9_]+$/, message: 'Only letters, numbers, and underscores are allowed' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[
            { required: true, message: 'Please input the full name!' },
            { min: 2, message: 'Full name must be at least 2 characters long' },
            { max: 50, message: 'Full name cannot exceed 50 characters' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input the email!' },
            { type: 'email', message: 'Please provide a valid email' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            { pattern: /^(\+84|84|0)?[1-9]\d{8,9}$/, message: 'Please provide a valid phone number' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please select a role!' }]}
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
          rules={[
            { type: 'integer', message: 'Coins must be an integer' },
            { min: 0, message: 'Coins cannot be negative' },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          name="isActive"
          label="Is Active"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="avatar"
          label="Avatar URL"
          rules={[{ type: 'url', message: 'Please provide a valid URL' }]}
        >
          <Input placeholder="Enter avatar URL (optional)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserForm;
