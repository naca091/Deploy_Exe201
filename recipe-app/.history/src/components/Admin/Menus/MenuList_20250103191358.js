import React, { useState, useEffect } from "react";
import { Table, Button, Popconfirm, message, Space } from "antd";
import axios from "axios";
import MenuForm from "./MenuForm";

const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get("https://demcalo.onrender.com/api/menus");
        setMenus(response.data.data);
      } catch (error) {
        console.error("Failed to fetch menus:", error);
      }
    };
  
    fetchMenus();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://demcalo.onrender.com/api/menus/${id}`);
      message.success("Menu deleted successfully");
      fetchMenus();
    } catch (error) {
      message.error("Failed to delete menu");
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
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => category?.name || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this menu?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
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
        rowKey="_id"
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