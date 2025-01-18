import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const IngredientForm = ({ visible, onCancel, onSuccess, initialValues }) => {
  const [form] = Form.useForm();
  const isEditing = !!initialValues;

  React.useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async (values) => {
    try {
      if (isEditing) {
        await axios.put(
          `https://demcalo.onrender.com/api/ingredients/${initialValues._id}`,
          values
        );
        message.success('Ingredient updated successfully');
      } else {
        await axios.post('https://demcalo.onrender.com/api/ingredients', values);
        message.success('Ingredient added successfully');
      }
      onSuccess();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Operation failed';
      message.error(errorMsg);
    }
  };

  return (
    <Modal
      title={isEditing ? 'Edit Ingredient' : 'Add New Ingredient'}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnClose
    >
      <Form
        form={form}  // Quan trọng: Thêm prop form vào đây
        layout="vertical"
        onFinish={handleSubmit}
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