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
      // Log để debug
      console.log('Submitting values:', values);
      
      const response = await axios.post('http://localhost:5000/api/ingredients', values);
      console.log('Response:', response.data);
      
      message.success('Ingredient added successfully');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Log chi tiết lỗi
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
