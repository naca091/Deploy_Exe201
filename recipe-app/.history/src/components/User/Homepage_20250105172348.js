import React, { useState, useEffect } from 'react';
import { Input, Badge, Button, Avatar, Dropdown, Menu, Carousel } from 'antd';
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
import { MenuGrid, MenuDetailModal } from '../Menu';

const { Search } = Input;

const Homepage = () => {
  const [menus, setMenus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const menusPerPage = 20;
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get('https://demcalo.onrender.com/api/menus');
        setMenus(response.data.data);
      } catch (error) {
        console.error('Error fetching menus:', error);
      }
    };
    fetchMenus();
  }, []);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    setModalVisible(true);
  };

  //handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

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
              <Link to="/login">
                <Button type="link" icon={<UserOutlined />}>
                  Login / Register
                </Button>
              </Link>
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

      {/* Menu Grid */}
      <MenuGrid
        menus={menus}
        currentPage={currentPage}
        menusPerPage={menusPerPage}
        onPageChange={setCurrentPage}
        onSeeMenu={handleMenuClick}
      />

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