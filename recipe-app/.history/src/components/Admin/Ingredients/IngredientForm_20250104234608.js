// IngredientForm.js
import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const IngredientForm = ({ visible, onCancel, onSuccess, initialValues }) => {
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
          `http://localhost:5000/api/categories/${initialValues._id}`,
          values
        );
        message.success('Category updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/categories', values);
        message.success('Category added successfully');
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
      title={isEditing ? 'Edit Ingredient' : 'Add New Ingredient'}
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
          name="name"
          label="Ingredient Name"
          rules={[
            { required: true, message: 'Please input the ingredient name!' },
            { min: 2, message: 'Name must be at least 2 characters long' }
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default IngredientForm;