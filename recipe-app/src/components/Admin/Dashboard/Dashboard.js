import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  DashboardOutlined,
  MenuOutlined,
  UserOutlined,
  InsertRowLeftOutlined,
  UserAddOutlined,
  VideoCameraAddOutlined,
  CaretDownOutlined,
  ControlOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CategoryList from "../Categories/CategoryList";
import IngredientList from "../Ingredients/IngredientList";
import MenuList from "../Menus/MenuList";
import RoleList from "../Roles/RoleList";
import UserList from "../Users/UserList";
import VideoList from "../Video/VideoList";
import CounterLogin from "../CounterLogin/LoginCounter";

const { Sider, Content } = Layout;

const AdminDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("1");
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // Chức năng logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token từ localStorage
    navigate("/login"); // Điều hướng về trang đăng nhập
  };

  // Render nội dung dựa trên menu được chọn
  const renderContent = () => {
    switch (selectedMenu) {
      case "1":
        return <IngredientList />;
      case "2":
        return <CategoryList />;
      case "3":
        return <MenuList />;
      case "4":
        return <RoleList />;
      case "5":
        return <UserList />;
      case "6":
        return <VideoList />;
      case "7":
        return <CounterLogin />;
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          </div>
        );
    }
  };

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: "Ingredient List",
    },
    {
      key: "2",
      icon: <CaretDownOutlined />,
      label: "Category List",
    },
    {
      key: "3",
      icon: <MenuOutlined />,
      label: "Menu List",
    },
    {
      key: "4",
      icon: <InsertRowLeftOutlined />,
      label: "Role List",
    },
    {
      key: "5",
      icon: <UserAddOutlined />,
      label: "User List",
    },
    {
      key: "6",
      icon: <VideoCameraAddOutlined />,
      label: "Video List",
    },
    {
      key: "7",
      icon: <ControlOutlined />,
      label: "Counter Login",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          boxShadow: "2px 0 8px 0 rgba(29,35,41,.05)",
        }}
      >
        <div
          style={{
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <h1 className={`text-xl font-bold ${collapsed ? "hidden" : "block"}`}>
            Admin Panel
          </h1>
          {collapsed && <DashboardOutlined style={{ fontSize: "24px" }} />}
        </div>
        <Menu
          theme="light"
          selectedKeys={[selectedMenu]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => setSelectedMenu(key)}
        />
      </Sider>
      <Layout
        style={{ marginLeft: collapsed ? 80 : 200, transition: "all 0.2s" }}
      >
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2>Welcome to Admin Dashboard</h2>
            <Button type="primary" danger onClick={handleLogout}>
              Logout
            </Button>
          </div>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
