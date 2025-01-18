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

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://demcalo.onrender.com/api/roles');
            setRoles(response.data?.data || []);
        } catch (error) {
            message.error('Failed to fetch roles');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://demcalo.onrender.com/api/roles/${id}`);
            message.success('Role deleted successfully');
            fetchRoles();
        } catch (error) {
            message.error('Failed to delete role');
        }
    };

    const handleEdit = (role) => {
        setEditingRole(role);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setEditingRole(null);
    };

    const columns = [
        {
            title: 'Role ID',
            dataIndex: 'roleId',
            key: 'roleId',
        },
        {
            title: 'Role Name',
            dataIndex: 'roleName',
            key: 'roleName',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm
                        title="Are you sure you want to delete this role?"
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
        <div>
            <div className="mb-4 flex justify-between">
                <h2 className="text-lg font-bold">Role Management</h2>
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
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 5 }}
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
