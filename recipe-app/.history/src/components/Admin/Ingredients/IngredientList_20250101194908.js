import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import IngredientForm from './IngredientForm';

const IngredientList = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);

  const fetchIngredients = async () => {  
    setLoading(true);
    try {
      const response = await axios.get('https://demcalo.onrender.com/api/ingredients');
      const data = Array.isArray(response.data) 
        ? response.data.map(item => ({ ...item, key: item._id }))
        : [];
      setIngredients(data);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      message.error(error.response?.data?.message || 'Failed to fetch ingredients');
      setIngredients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchIngredients = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://demcalo.onrender.com/api/ingredients');
        console.log('Fetched ingredients:', response.data);
        const data = Array.isArray(response.data.data)
          ? response.data.data.map(item => ({ ...item, key: item._id }))
          : [];
        setIngredients(data);
      } catch (error) {
        console.error('Error fetching ingredients:', error.response?.data || error.message);
        message.error('Failed to fetch ingredients');
      } finally {
        setLoading(false);
      }
    };
    fetchIngredients();
  }, []);
  

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://demcalo.onrender.com/api/ingredients/${id}`);
      message.success('Ingredient deleted successfully');
      fetchIngredients();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to delete ingredient';
      message.error(errorMsg);
    }
  };

  const handleEdit = (record) => {
    setEditingIngredient(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingIngredient(null);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
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
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this ingredient?"
            onConfirm={() => handleDelete(record._id)}
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
        <h1 className="text-2xl font-bold">Ingredients Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Add Ingredient
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={ingredients}
        rowKey="_id"
        loading={loading}
      />

      <IngredientForm
        visible={isModalVisible}
        onCancel={handleModalClose}
        onSuccess={() => {
          handleModalClose();
          fetchIngredients();
        }}
        initialValues={editingIngredient}
      />
    </div>
  );
};

export default IngredientList;