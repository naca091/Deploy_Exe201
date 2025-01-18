import React, { useState, useEffect } from 'react';
import { Input, Badge, Carousel, Button, Modal } from 'antd';
import { Link } from 'react-router-dom';
import {
  SearchOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  HomeOutlined,
  AppstoreOutlined,
  BookOutlined,
  CalculatorOutlined,
  PlusCircleOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Search } = Input;

const Homepage = () => {
  const [menus, setMenus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const menusPerPage = 20;

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

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    setModalVisible(true);
  };

  const bannerImages = [
    '/api/placeholder/1200/400',
    '/api/placeholder/1200/400',
    '/api/placeholder/1200/400'
  ];

  const currentMenus = menus.slice(
    (currentPage - 1) * menusPerPage,
    currentPage * menusPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-green-600">FoodApp</div>
            <div className="w-1/3">
              <Search
                placeholder="Search for recipes..."
                prefix={<SearchOutlined />}
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/login">
                <Button type="link" icon={<UserOutlined />}>
                  Login / Register
                </Button>
              </Link>
              <Badge count={0}>
                <Button type="link" icon={<ShoppingCartOutlined />}>
                  Cart
                </Button>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navbar */}
      <div className="bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-8 py-2">
            <Button
              type="link"
              className="text-white flex items-center"
              icon={<HomeOutlined />}
            >
              Home
            </Button>
            <Button
              type="link"
              className="text-white flex items-center"
              icon={<AppstoreOutlined />}
            >
              Products
            </Button>
            <Button
              type="link"
              className="text-white flex items-center"
              icon={<BookOutlined />}
            >
              Recipes
            </Button>
            <Button
              type="link"
              className="text-white flex items-center"
              icon={<CalculatorOutlined />}
            >
              Calories Tool
            </Button>
            <Button
              type="link"
              className="text-white flex items-center"
              icon={<PlusCircleOutlined />}
            >
              Add Coins
            </Button>
            <Button
              type="link"
              className="text-white flex items-center"
              icon={<PlayCircleOutlined />}
            >
              Watch Ads
            </Button>
          </div>
        </div>
      </div>

      {/* Banner Carousel */}
      <div className="container mx-auto px-4 py-6">
        <Carousel autoplay className="rounded-lg overflow-hidden">
          {bannerImages.map((image, index) => (
            <div key={index}>
              <img
                src={image}
                alt={`Banner ${index + 1}`}
                className="w-full h-[400px] object-cover"
              />
            </div>
          ))}
        </Carousel>
      </div>

      {/* Menu Grid */}
      <div className="container mx-auto px-4 py-6 grid grid-cols-4 gap-6">
        {currentMenus.map((menu) => (
          <div
            key={menu.id}
            className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
          >
            <img
              src={`https://demcalo.onrender.com${menu.image}`}
              alt={menu.name}
              className="w-full h-[200px] object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/api/placeholder/200/200';
              }}
            />
            <div className="p-4">
              <h3 className="font-bold text-base mb-2 truncate">{menu.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{menu.calories} kcal</p>
              <Button
                type="primary"
                block
                onClick={() => handleMenuClick(menu)}
              >
                See Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Menu Detail Modal */}
      <Modal
        title={selectedMenu?.name}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selectedMenu && (
          <div>
            <img
              src={`https://demcalo.onrender.com${selectedMenu.image}`}
              alt={selectedMenu.name}
              className="w-full h-[300px] object-cover rounded-lg mb-4"
            />
            <p className="text-lg">{selectedMenu.description}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Homepage;
