import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  message,
  Popconfirm,
  Input,
  Tag,
  Modal,
  InputNumber,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import axios from "axios";
import UserForm from "./UserForm";

const { Search } = Input;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddXuModalVisible, setIsAddXuModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [xuAmount, setXuAmount] = useState(0);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://demcalo.onrender.com/api/users", {
        params: { search: searchTerm },
      });
      const data = Array.isArray(response.data?.data)
        ? response.data.data.map((item) => ({ ...item, key: item._id }))
        : [];
      setUsers(data);
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  // Handle add xu
  const handleAddXu = async () => {
    try {
      await axios.post(
        `https://demcalo.onrender.com/api/users/${selectedUser._id}/add-xu`,
        {
          amount: xuAmount,
        }
      );
      message.success("Xu added successfully");
      setIsAddXuModalVisible(false);
      setSelectedUser(null);
      setXuAmount(0);
      fetchUsers();
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to add xu");
    }
  };

  // Show add xu modal
  const showAddXuModal = (user) => {
    setSelectedUser(user);
    setIsAddXuModalVisible(true);
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://demcalo.onrender.com/api/users/${id}`);
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  // Toggle user activation
  const toggleActivation = async (id, isActive) => {
    try {
      await axios.patch(`https://demcalo.onrender.com/api/users/${id}`, {
        isActive: !isActive,
      });
      message.success(
        `User ${isActive ? "deactivated" : "activated"} successfully`
      );
      fetchUsers();
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to update user status"
      );
    }
  };

  // Edit user
  const handleEdit = (record) => {
    setEditingUser(record);
    setIsModalVisible(true);
  };

  // Close modal
  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingUser(null);
  };

  // Table columns
  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Xu",
      dataIndex: "xu",
      key: "xu",
      render: (xu) => <Tag color="gold">{xu}</Tag>,
    },
    {
      title: "Role",
      dataIndex: ["role", "name"],
      key: "role",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<WalletOutlined />}
            onClick={() => showAddXuModal(record)}
            style={{ backgroundColor: "#ffd700", color: "#fff" }}
          >
            Add Xu
          </Button>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title={`Are you sure you want to ${
              record.isActive ? "deactivate" : "activate"
            } this user?`}
            onConfirm={() => toggleActivation(record._id, record.isActive)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary">
              {record.isActive ? "Deactivate" : "Activate"}
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Are you sure you want to delete this user?"
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
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex space-x-4">
          <Search
            placeholder="Search by username or email"
            allowClear
            onSearch={(value) => setSearchTerm(value)}
            style={{ width: 300 }}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchUsers}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Add User
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <UserForm
        visible={isModalVisible}
        onCancel={handleModalClose}
        onSuccess={() => {
          handleModalClose();
          fetchUsers();
        }}
        initialValues={editingUser}
      />

      <Modal
        title={`Add Xu for ${selectedUser?.username}`}
        open={isAddXuModalVisible}
        onOk={handleAddXu}
        onCancel={() => {
          setIsAddXuModalVisible(false);
          setSelectedUser(null);
          setXuAmount(0);
        }}
      >
        <div className="mb-4">
          <p>
            Current Xu: <Tag color="gold">{selectedUser?.xu}</Tag>
          </p>
        </div>
        <div>
          <InputNumber
            className="w-full"
            min={1}
            placeholder="Enter amount of xu to add"
            value={xuAmount}
            onChange={(value) => setXuAmount(value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default UserList;
