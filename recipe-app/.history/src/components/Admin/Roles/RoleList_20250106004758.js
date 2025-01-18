import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import RoleForm from './RoleForm';

const RoleList = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  // Fetch roles
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://demcalo.onrender.com/api/roles');
      const data = Array.isArray(response.data?.data)
        ? response.data.data.map(item => ({ ...item, key: item.id }))
        : [];
      setRoles(data);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to fetch roles');
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchRoles();
  }, []);

  // Delete role
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://demcalo.onrender.com/api/roles/${id}`);
      message.success('Role deleted successfully');
      fetchRoles();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete role');
    }
  };

  // Edit role
  const handleEdit = (record) => {
    setEditingRole(record);
    setIsModalVisible(true);
  };

  // Close modal
  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingRole(null);
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
            title="Are you sure you want to delete this role?"
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
        <h1 className="text-2xl font-bold">Role Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Add Role
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={roles}
        rowKey="id"
        loading={loading}
      />

      <RoleForm
        visible={isModalVisible}
        onCancel={handleModalClose}
        onSuccess={() => {
          handleModalClose();
          fetchRoles();
        }}
        initialValues={editingRole}
      />
    </div>
  );
};

export default RoleList;
