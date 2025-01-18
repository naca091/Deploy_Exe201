import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Col, Row, Spin, message } from 'antd';
import MenuDetailModal from './Menu/MenuDetailModal'; // Đảm bảo đường dẫn đúng đến component MenuDetailModal

const Homepage = ({ userEmail, userCoins }) => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [coins, setCoins] = useState(userCoins); // Số xu người dùng hiện tại

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get('https://demcalo.onrender.com/api/menus'); // Đường dẫn API để lấy danh sách menu
        if (response.data.success) {
          setMenus(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching menus:', error);
        message.error('Failed to load menus');
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedMenu(null);
  };

  const handlePurchaseSuccess = (updatedMenu) => {
    setCoins((prevCoins) => prevCoins - updatedMenu.unlockPrice); // Trừ xu
    setMenus((prevMenus) =>
      prevMenus.map((menu) =>
        menu._id === updatedMenu._id ? { ...menu, purchasedBy: updatedMenu.purchasedBy } : menu
      )
    );
    message.success('Menu unlocked successfully!');
  };

  return (
    <div className="homepage">
      <h1>Menu List</h1>
      <p>Your coins: {coins}</p>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[16, 16]}>
          {menus.map((menu) => (
            <Col span={8} key={menu._id}>
              <Card
                hoverable
                cover={<img alt={menu.name} src={menu.imageUrl} />}
                onClick={() => handleMenuClick(menu)}
                style={{ cursor: 'pointer' }}
              >
                <Card.Meta title={menu.name} />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {selectedMenu && (
        <MenuDetailModal
          menu={selectedMenu}
          visible={isModalVisible}
          onClose={handleCloseModal}
          userEmail={userEmail}
          userCoins={coins}
          onPurchaseSuccess={handlePurchaseSuccess}
        />
      )}
    </div>
  );
};

export default Homepage;
