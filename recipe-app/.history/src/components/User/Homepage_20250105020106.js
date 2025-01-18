import React, { useState, useEffect } from 'react';
import { Input, Badge, Carousel, Card, Button, Pagination } from 'antd';
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
  PlusCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Search } = Input;

const Homepage = () => {
  const [menus, setMenus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const menusPerPage = 20; // 4 rows x 5 columns

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

  // Calculate current menus to display
  const indexOfLastMenu = currentPage * menusPerPage;
  const indexOfFirstMenu = indexOfLastMenu - menusPerPage;
  const currentMenus = menus.slice(indexOfFirstMenu, indexOfLastMenu);

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

        {/* Pagination */}
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
    </div>
  );
};

export default Homepage;