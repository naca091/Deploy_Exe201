import React, { useState, useEffect } from 'react';
import { Input, Badge, Carousel, Card, Button, Pagination, Modal, Typography } from 'antd';
import { 
  SearchOutlined, 
  UserOutlined, 
  ShoppingCartOutlined,
  UnlockOutlined,
  HomeOutlined,
  AppstoreOutlined,
  BookOutlined,
  CalculatorOutlined,
  PlusCircleOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import axios from 'axios';

const { Search } = Input;
const { Text } = Typography;

const MenuCard = ({ menu, onSeeMenu }) => (
  <Card
    className="hover:shadow-lg transition-shadow"
    cover={
      <div
        className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg"
        style={{ height: '200px' }}
      >
        <img
          alt={menu.name}
          src={`http://localhost:5000${menu.image}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/api/placeholder/400/320';
          }}
        />
      </div>
    }
    bodyStyle={{ padding: '16px', height: '140px' }}
  >
    <div className="flex flex-col h-full">
      <h3 className="font-bold text-lg mb-2 truncate">{menu.name}</h3>
      <p className="text-gray-600 mb-2">{menu.calories} kcal</p>
      <div className="space-y-2 mt-auto">
        <Button
          type="primary"
          icon={<UnlockOutlined />}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          Unlock - {menu.unlockPrice} coins
        </Button>
        <Button type="default" className="w-full" onClick={() => onSeeMenu(menu)}>
          See Menu
        </Button>
      </div>
    </div>
  </Card>
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
        <div className="text-gray-700">
          <Text strong>Description: </Text>{menu.description}
        </div>
      </div>
    </Modal>
  );
};

const Homepage = () => {
  const [menus, setMenus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate(); // Navigation hook
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-2xl font-bold text-green-600">FoodApp</div>
          <Search
            placeholder="Search for recipes..."
            prefix={<SearchOutlined />}
            className="w-1/3"
          />
          <div className="flex items-center space-x-6">
            <Button
              type="link"
              icon={<UserOutlined />}
              onClick={() => navigate('/login')}
            >
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

      {/* Banner */}
      <div className="container mx-auto px-4 py-6">
        <Carousel autoplay className="rounded-lg overflow-hidden">
          {['/api/placeholder/1200/400', '/api/placeholder/1200/400'].map((image, index) => (
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

      {/* Menus */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">Featured Menus</h2>
        <div className="grid grid-cols-5 gap-4">
          {currentMenus.map((menu) => (
            <MenuCard key={menu._id} menu={menu} onSeeMenu={handleMenuClick} />
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

      {/* Menu Modal */}
      <MenuDetailModal
        menu={selectedMenu}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </div>
  );
};

export default Homepage;
