import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, message } from 'antd';
import axios from 'axios';
import MenuForm from './MenuForm';

const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/menus');
      setMenus(response.data.data);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to fetch menus');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/menus/${id}`);
      message.success('Menu deleted successfully');
      fetchMenus();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete menu');
    }
  };

  const handleEdit = (menu) => {
    setEditingMenu(menu);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingMenu(null);
  };

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
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => category.name || 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (menu) => (
        <span>
          <Button onClick={() => handleEdit(menu)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this menu?"
            onConfirm={() => handleDelete(menu.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div>
      <h1>Menu List</h1>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Add New Menu
      </Button>
      <Table
        dataSource={menus}
        columns={columns}
        loading={loading}
        rowKey={(record) => record.id.toString()}
      />
      <MenuForm
        visible={isModalVisible}
        onCancel={handleModalClose}
        onSuccess={fetchMenus}
        initialValues={editingMenu}
      />
    </div>
  );
};

export default MenuList;