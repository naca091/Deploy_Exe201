import React, { useState, useEffect } from 'react';
import { Input, Badge, Button, Carousel, Card, Menu, Pagination } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import {
  SearchOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  PlayCircleOutlined,
  HomeOutlined,
  AppstoreOutlined,
  BookOutlined,
  CalculatorOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { MenuDetailModal } from '../Menu'; // Assuming MenuDetailModal is a separate component

const { Search } = Input;

const Homepage = () => {
  // State for menus
  const [menus, setMenus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const menusPerPage = 20;

  // State for user
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch menus from API
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/menus');
        setMenus(response.data.data);
      } catch (error) {
        console.error('Error fetching menus:', error);
      }
    };
    fetchMenus();
  }, []);

  // Get user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Handle menu click (show modal with menu details)
  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    setModalVisible(true);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  // Render menu items with pagination
  const renderMenuItems = () => {
    const startIndex = (currentPage - 1) * menusPerPage;
    const endIndex = startIndex + menusPerPage;
    const pagedMenus = menus.slice(startIndex, endIndex);

    return pagedMenus.map((menu, index) => (
      <Card
        key={index}
        hoverable
        cover={<img alt={menu.name} src={menu.imageUrl} />}
        onClick={() => handleMenuClick(menu)}
      >
        <Card.Meta title={menu.name} description={menu.description} />
      </Card>
    ));
  };

  // Dropdown menu for user profile and logout
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate('/profile')}>
        View Profile
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const bannerImages = [
    '/api/placeholder/1200/400',
    '/api/placeholder/1200/400',
    '/api/placeholder/1200/400',
    '/api/placeholder/1200/400',
    '/api/placeholder/1200/400'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-green-600">FoodApp</div>
            <div className="w-1/3">
              <Search placeholder="Search for recipes..." prefix={<SearchOutlined />} className="w-full" />
            </div>
            <div className="flex items-center space-x-6">
              {user ? (
                <Dropdown overlay={userMenu} trigger={['click']}>
                  <Button type="link" icon={<UserOutlined />}>
                    {user.username}
                  </Button>
                </Dropdown>
              ) : (
                <Link to="/login">
                  <Button type="link" icon={<UserOutlined />}>
                    Login / Register
                  </Button>
                </Link>
              )}
              <Badge count={0}>
                <Button type="link" icon={<ShoppingCartOutlined />}>Cart</Button>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navbar */}
      <div className="bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-8 py-2">
            <Button type="link" className="text-white flex items-center" icon={<HomeOutlined />}>Home</Button>
            <Button type="link" className="text-white flex items-center" icon={<AppstoreOutlined />}>Products</Button>
            <Button type="link" className="text-white flex items-center" icon={<BookOutlined />}>Recipes</Button>
            <Button type="link" className="text-white flex items-center" icon={<CalculatorOutlined />}>Calories Tool</Button>
            <Button type="link" className="text-white flex items-center" icon={<PlusCircleOutlined />}>Add Coins</Button>
            <Button type="link" className="text-white flex items-center" icon={<PlayCircleOutlined />}>Watch Ads</Button>
          </div>
        </div>
      </div>

      {/* Banner Carousel */}
      <div className="container mx-auto px-4 py-6">
        <Carousel autoplay className="rounded-lg overflow-hidden">
          {bannerImages.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Banner ${index + 1}`} className="w-full h-[400px] object-cover" />
            </div>
          ))}
        </Carousel>
      </div>

      {/* Menu Grid with Pagination */}
      <div className="container mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {renderMenuItems()}
      </div>

      {/* Pagination */}
      <div className="flex justify-center py-4">
        <Pagination
          current={currentPage}
          total={menus.length}
          pageSize={menusPerPage}
          onChange={setCurrentPage}
        />
      </div>

      {/* Menu Detail Modal */}
      <MenuDetailModal
        menu={selectedMenu}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </div>
  );
};

export default Homepage;
