import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import CategoryForm from './CategoryForm';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://demcalo.onrender.com/api/categories');
      const data = Array.isArray(response.data?.data)
        ? response.data.data.map(item => ({ ...item, key: item.id }))
        : [];
        setCategories(data);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Delete ingredient
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://demcalo.onrender.com/api/categories/${id}`);
      message.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  // Edit category
  const handleEdit = (record) => {
    setEditingIngredient(record);
    setIsModalVisible(true);
  };

  // Close modal
  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingIngredient(null);
  };

  // Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Add Category
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
      />

      <CategoryForm
        visible={isModalVisible}
        onCancel={handleModalClose}
        onSuccess={() => {
          handleModalClose();
          fetchCategories();
        }}
        initialValues={editingCategory}
      />
    </div>
  );
};

export default CategoryList;
