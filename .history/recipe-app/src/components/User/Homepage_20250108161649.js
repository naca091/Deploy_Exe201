// Homepage.js  
import React, { useState, useEffect } from 'react';  
import { Input, Badge, Button, Carousel, Card, Pagination } from 'antd';  
import { Link, useNavigate } from 'react-router-dom';  
import UserMenu from './userMenu'; // Giả sử bạn đã tạo file này  
import MenuDetailModal from '../Menu/MenuDetailModal'; // Đảm bảo đường dẫn chính xác  
import axios from 'axios';  

const { Search } = Input;  

const Homepage = () => {  
  const [menus, setMenus] = useState([]);  
  const [currentPage, setCurrentPage] = useState(1);  
  const [selectedMenu, setSelectedMenu] = useState(null);  
  const [modalVisible, setModalVisible] = useState(false);  
  const [user, setUser] = useState(null);  
  const menusPerPage = 20;  
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

  const handleLogout = () => {  
    localStorage.removeItem('user');  
    setUser(null);  
    navigate('/login');  
  };  

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

  return (  
    <div className="min-h-screen bg-gray-50">  
      <div className="bg-white shadow">  
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">  
          <div className="text-2xl font-bold text-green-600">FoodApp</div>  
          <Search placeholder="Search for recipes..." className="w-1/3" />  
          <div className="flex items-center space-x-6">  
            {user ? (  
              <UserMenu user={user} onLogout={handleLogout} />  
            ) : (  
              <Link to="/login">  
                <Button type="link">Login / Register</Button>  
              </Link>  
            )}  
            <Badge count={0}>  
              <Button type="link">Cart</Button>  
            </Badge>  
          </div>  
        </div>  
      </div>  

      {/* Banner Carousel and Menu Grid omitted for brevity */}  

      {/* Menu Detail Modal */}  
      <MenuDetailModal  
        menu={selectedMenu}  
        visible={modalVisible}  
        onClose={() => setModalVisible(false)}  
        userCoins={user ? user.xu : 0} // Truyền số xu của người dùng vào đây  
        onPurchaseMenu={async (menuId) => {  
          // Implement logic to unlock menu and update coins  
          console.log(`Unlocking menu with ID: ${menuId}`);  
        }}  
      />  
    </div>  
  );  
};  

export default Homepage;