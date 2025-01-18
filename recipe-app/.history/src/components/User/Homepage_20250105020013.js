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
        {/* Hình ảnh */}
        <img 
          src={`http://localhost:5000${menu.image}`} 
          alt={menu.name} 
          className="w-full h-64 object-cover rounded-lg"
        />

        {/* Thông tin cơ bản */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <ClockCircleOutlined className="text-xl text-blue-500" />
            <div className="mt-2">
              <Text strong>Cooking Time</Text>
              <div>Prep: {menu.cookingTime?.prep} mins</div>
              <div>Cook: {menu.cookingTime?.cook} mins</div>
            </div>
          </div>
          <div className="text-center">
            <FireOutlined className="text-xl text-red-500" />
            <div className="mt-2">
              <Text strong>Calories</Text>
              <div>{menu.calories} kcal</div>
            </div>
          </div>
          <div className="text-center">
            <TeamOutlined className="text-xl text-green-500" />
            <div className="mt-2">
              <Text strong>Serving Size</Text>
              <div>{menu.servingSize} persons</div>
            </div>
          </div>
        </div>

        {/* Mô tả */}
        <div>
          <Text strong>Description</Text>
          <p className="mt-2">{menu.description}</p>
        </div>

        {/* Thông tin dinh dưỡng */}
        <div>
          <Text strong>Nutritional Information</Text>
          <div className="grid grid-cols-4 gap-4 mt-2">
            <div>Protein: {menu.nutritionalInfo?.protein}g</div>
            <div>Carbs: {menu.nutritionalInfo?.carbs}g</div>
            <div>Fat: {menu.nutritionalInfo?.fat}g</div>
            <div>Fiber: {menu.nutritionalInfo?.fiber}g</div>
          </div>
        </div>

        {/* Nguyên liệu */}
        <div>
          <Text strong>Ingredients</Text>
          <List
            className="mt-2"
            dataSource={menu.ingredients}
            renderItem={item => (
              <List.Item>
                {item.ingredient?.name}: {item.weight} {item.unit}
              </List.Item>
            )}
          />
        </div>

        {/* Tags */}
        <div>
          <Text strong>Tags</Text>
          <div className="mt-2">
            {menu.tags?.map(tag => (
              <Tag key={tag} className="mr-2">{tag}</Tag>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <Text strong>Difficulty</Text>
          <Tag 
            color={
              menu.difficulty === 'easy' ? 'green' : 
              menu.difficulty === 'medium' ? 'orange' : 
              'red'
            }
            className="ml-2"
          >
            {menu.difficulty}
          </Tag>
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

  // ... phần code navbar và banner giữ nguyên ...

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Các phần navbar và banner giữ nguyên */}
      
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