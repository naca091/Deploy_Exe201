import React, { useState, useEffect } from 'react';
import { Input, Badge, Carousel, Card, Button, Pagination, Modal, Tag, List, Typography } from 'antd';
import { 
  SearchOutlined, 
  UserOutlined, 
  ShoppingCartOutlined,
  UnlockOutlined,
  PlayCircleOutlined,
  HomeOutlined,
  AppstoreOutlined,
  BookOutlined,
  CalculatorOutlined,
  PlusCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
  TeamOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Search } = Input;
const { Text } = Typography;

//card component for menu
const MenuCard = ({ menu, onSeeMenu }) => (
  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
    <div className="relative w-full pb-[100%]">
      <img
        alt={menu.name}
        src={menu.image || '/api/placeholder/200/200'}
        className="absolute top-0 left-0 w-full h-full object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/api/placeholder/200/200';
        }}
      />
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-2 truncate">{menu.name}</h3>
      <p className="text-gray-600 text-sm mb-3">{menu.calories} kcal</p>
      <div className="space-y-2">
        <Button 
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          onClick={() => {}}
        >
          <Unlock className="w-4 h-4 mr-2" />
          {menu.unlockPrice} coins
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onSeeMenu(menu)}
        >
          See Menu
        </Button>
      </div>
    </div>
  </div>
);
  
  const MenuDetailModal = ({ menu, visible, onClose }) => {
    if (!menu) return null;
  
    return (
      <Modal
        title={menu.name}
        open={visible}
        onCancel={onClose}
        footer={[
          <Button key="unlock" type="primary" icon={<UnlockOutlined />}>
            Unlock - {menu.unlockPrice} coins
          </Button>,
          <Button key="close" onClick={onClose}>
            Close
          </Button>
        ]}
        width={800}
      >
        <div className="space-y-6">
          {/* Ảnh với kích thước cố định */}
          <div className="w-full h-[400px] overflow-hidden rounded-lg">
            <img 
              src={`http://localhost:5000${menu.image}`}
              alt={menu.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/api/placeholder/800/400';
              }}
            />
          </div>
  
          {/* Các phần thông tin khác giữ nguyên */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <ClockCircleOutlined className="text-xl text-blue-500" />
              <div className="mt-2">
                <Text strong>Cooking Time</Text>
                <div>Prep: {menu.cookingTime?.prep} mins</div>
                <div>Cook: {menu.cookingTime?.cook} mins</div>
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <FireOutlined className="text-xl text-red-500" />
              <div className="mt-2">
                <Text strong>Calories</Text>
                <div>{menu.calories} kcal</div>
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <TeamOutlined className="text-xl text-green-500" />
              <div className="mt-2">
                <Text strong>Serving Size</Text>
                <div>{menu.servingSize} persons</div>
              </div>
            </div>
          </div>
  
          {/* Các phần còn lại giữ nguyên */}
        </div>
      </Modal>
    );
  };
const Homepage = () => {
  const [menus, setMenus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const menusPerPage = 20;

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

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    setModalVisible(true);
  };

  const indexOfLastMenu = currentPage * menusPerPage;
  const indexOfFirstMenu = indexOfLastMenu - menusPerPage;
  const currentMenus = menus.slice(indexOfFirstMenu, indexOfLastMenu);
  // Fetch menus
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

  // Banner images
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
            {/* Logo */}
            <div className="text-2xl font-bold text-green-600">
              FoodApp
            </div>

            {/* Search Bar */}
            <div className="w-1/3">
              <Search
                placeholder="Search for recipes..."
                prefix={<SearchOutlined />}
                className="w-full"
              />
            </div>

            {/* Auth & Cart */}
            <div className="flex items-center space-x-6">
              <Button type="link" icon={<UserOutlined />}>
                Login / Register
              </Button>
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
            <Button type="link" className="text-white flex items-center" icon={<HomeOutlined />}>
              Home
            </Button>
            <Button type="link" className="text-white flex items-center" icon={<AppstoreOutlined />}>
              Products
            </Button>
            <Button type="link" className="text-white flex items-center" icon={<BookOutlined />}>
              Recipes
            </Button>
            <Button type="link" className="text-white flex items-center" icon={<CalculatorOutlined />}>
              Calories Tool
            </Button>
            <Button type="link" className="text-white flex items-center" icon={<PlusCircleOutlined />}>
              Add Coins
            </Button>
            <Button type="link" className="text-white flex items-center" icon={<PlayCircleOutlined />}>
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
     <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">Featured Menus</h2>
        <div className="grid grid-cols-5 gap-4">
          {currentMenus.map((menu) => (
            <Card
              key={menu._id}
              cover={
                <img
                  alt={menu.name}
                  src={`http://localhost:5000${menu.image}`}
                  className="h-40 object-cover"
                />
              }
              className="hover:shadow-lg transition-shadow"
            >
              <div className="h-32">
                <h3 className="font-bold text-lg mb-2 truncate">{menu.name}</h3>
                <p className="text-gray-600 mb-2">{menu.calories} kcal</p>
                <div className="space-y-2">
                  <Button
                    type="primary"
                    icon={<UnlockOutlined />}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Unlock - {menu.unlockPrice} coins
                  </Button>
                  <Button
                    type="default"
                    className="w-full"
                    onClick={() => handleMenuClick(menu)}
                  >
                    See Menu
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Pagination
            current={currentPage}
            onChange={setCurrentPage}
            total={menus.length}
            pageSize={menusPerPage}
            showSizeChanger={false}
          />
        </div>
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