// Homepage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Col, Row, Spin, message, Input } from 'antd';
import MenuDetailModal from './Menu/MenuDetailModal';
import { useLocation } from 'react-router-dom';

const Homepage = () => {
    const { state } = useLocation();
    const { userEmail, userxu: initialUserXu } = state || { userEmail: '', userxu: 0 };

    const [menus, setMenus] = useState([]);
    const [filteredMenus, setFilteredMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userXu, setUserXu] = useState(initialUserXu);
    const [purchasedMenus, setPurchasedMenus] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await axios.get('http://localhost:5000/api/auth/me', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        setUserXu(response.data.user.xu);
                        setPurchasedMenus(response.data.user.purchasedMenus.map(pm => pm.menuId));
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchMenus = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/menus');
                if (response.data.success) {
                    setMenus(response.data.data);
                    setFilteredMenus(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching menus:', error);
                message.error('Failed to load menus');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
        fetchMenus();
    }, []);

    const handleSearch = (value) => {
        const searchValue = value.toLowerCase();
        const filtered = menus.filter((menu) =>
            menu.name.toLowerCase().includes(searchValue)
        );
        setFilteredMenus(filtered);
    };

    const handleMenuClick = (menu) => {
        setSelectedMenu(menu);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedMenu(null);
    };

    const handlePurchaseSuccess = (newXuBalance, menuId) => {
        setUserXu(newXuBalance);
        setPurchasedMenus([...purchasedMenus, menuId]);
    };

    return (
        <div className="homepage">
            <h1>Menu List</h1>
            <div>
                <strong>User: {userEmail}</strong>
                <strong>Balance: {userXu} xu</strong>
            </div>
            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Input.Search
                    placeholder="Search menu by name"
                    onSearch={handleSearch}
                    enterButton
                    style={{ width: '60%' }}
                />
                <div>
                    <strong>Balance: {userXu} xu</strong>
                </div>
            </div>

            {loading ? (
                <Spin size="large" />
            ) : (
                <Row gutter={[16, 16]}>
                    {filteredMenus.map((menu) => (
                        <Col span={8} key={menu._id}>
                            <Card
                                hoverable
                                cover={<img alt={menu.name} src={menu.imageUrl} />}
                                onClick={() => handleMenuClick(menu)}
                                style={{ cursor: 'pointer' }}
                            >
                                <Card.Meta
                                    title={menu.name}
                                    description={
                                        purchasedMenus.includes(menu._id) ?
                                            "Unlocked" :
                                            `Unlock Price: ${menu.unlockPrice} xu`
                                    }
                                />
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
                    userXu={userXu}
                    purchasedMenus={purchasedMenus}
                    onPurchaseSuccess={handlePurchaseSuccess}
                />
            )}
        </div>
    );
};

export default Homepage;