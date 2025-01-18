import React from 'react';
import { Form, Input, Button, message } from 'antd';

const RoleForm = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      // Make sure both name and id are included in values
      const response = await fetch('https://demcalo.onrender.com/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          id: Number(values.id)  // Convert to number since form inputs return strings
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }

      message.success('Role created successfully');
      form.resetFields();
    } catch (error) {
      message.error(`Error: ${error.message}`);
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item
        name="name"
        label="Role Name"
        rules={[{ required: true, message: 'Please input the role name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="id"
        label="Role ID"
        rules={[{ required: true, message: 'Please input the role ID!' }]}
      >
        <Input type="number" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Role
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RoleForm;