import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Upload, message, FormList } from 'antd';
import axios from 'axios';

const { Option } = Select;

const MenuForm = ({ visible, onCancel, onSuccess, initialValues }) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [ingredientsList, setIngredientsList] = useState([]);

  useEffect(() => {
    // Fetch categories and ingredients for dropdowns
    axios.get('http://localhost:5000/api/categories')
      .then(response => setCategories(response.data.data))
      .catch(error => message.error('Failed to fetch categories'));

    axios.get('http://localhost:5000/api/ingredients')
      .then(response => setIngredientsList(response.data.data))
      .catch(error => message.error('Failed to fetch ingredients'));

    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleSubmit = async (values) => {
    try {
      if (initialValues && initialValues._id) {
        await axios.put(`http://localhost:5000/api/menus/${initialValues._id}`, values);
        message.success('Menu updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/menus', values);
        message.success('Menu added successfully');
      }
      form.resetFields();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <Modal
      title={initialValues ? 'Edit Menu' : 'Add New Menu'}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
      >
        {/* Menu fields */}
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input the menu name!' }]}
        >
          <Input />
        </Form.Item>

        {/* Ingredients list */}
        <Form.List name="ingredients">
          {(fields) => (
            <div>
              {fields.map((field) => (
                <Form.Item key={field.key}>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues !== currentValues}
                  >
                    {() => (
                      <Select
                        name="ingredient"
                        placeholder="Select an ingredient"
                        options={ingredientsList.map(ing => ({ label: ing.name, value: ing.id }))}
                      />
                    )}
                  </Form.Item>
                  {/* Weight input */}
                  <Form.Item
                    name={[field.name, 'weight']}
                    label="Weight"
                    rules={[{ required: true, message: 'Please input the weight!' }]}
                  >
                    <Input />
                  </Form.Item>
                  {/* Unit input */}
                  <Form.Item
                    name={[field.name, 'unit']}
                    label="Unit"
                    rules={[{ required: true, message: 'Please input the unit!' }]}
                  >
                    <Input />
                  </Form.Item>
                  {/* Remove ingredient button */}
                  <Button type="link" onClick={() => form.remove(field.name)}>Remove</Button>
                </Form.Item>
              ))}
              {/* Add ingredient button */}
              <Form.Item>
                <Button type="dashed" onClick={() => form.push('ingredients', { ingredient: '', weight: '', unit: '' })} block>
                  Add Ingredient
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>

        {/* Other fields like description, cookingTime, difficulty, etc. */}
        {/* ... */}

        {/* Category dropdown */}
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select a category!' }]}
        >
          <Select>
            {categories.map(category => (
              <Option key={category.id} value={category.id}>{category.name}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* Submit button */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {initialValues ? 'Update Menu' : 'Add Menu'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MenuForm;