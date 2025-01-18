import React, { useState, useEffect } from 'react';  
import { Input, Badge, Button, Carousel, Card, Pagination, message } from 'antd';  
import { Link, useNavigate } from 'react-router-dom';  
import MenuDetailModal from '../User/Menu/MenuDetailModal'; // Đảm bảo đường dẫn chính xác  
import axios from 'axios';  
import { User } from '../'; // Giả sử bạn có imports các mô hình cần thiết  

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
        const response = await axios.get('http://localhost:5000/api/menus');  
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

  const purchaseMenu = async (menuId) => {  
    try {  
      const response = await axios.post('/api/userMenu/purchase', {  
        userId: user.id, // ID người dùng, giả định rằng bạn có thông tin này trong object người dùng  
        menuId: menuId,  
      });  
      // Cập nhật số xu của người dùng trong state  
      const updatedUser = { ...user, xu: user.xu - response.data.unlockPrice }; // Giảm số xu  
      setUser(updatedUser); // Cập nhật state người dùng  
      return { success: true, userCoins: updatedUser.xu }; // Trả về thông tin xu  
    } catch (error) {  
      console.error('Error purchasing menu:', error);  
      throw error; // Ném lỗi để xử lý bên ngoài  
    }  
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
              <div>  
                <span>{user.username} (Xu: {user.xu})</span>  
                <Button type="link" onClick={handleLogout}>Logout</Button>  
              </div>  
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
        userCoins={user ? user.xu : 0} // Truyền số xu của người dùng vào đây  
        onPurchaseMenu={purchaseMenu} // Truyền hàm purchaseMenu để xử lý mở khóa menu  
      />  
    </div>  
  );  
};  

export default Homepage;