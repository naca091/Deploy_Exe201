import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Col, Row, Spin, message, Input } from 'antd';
import MenuDetailModal from './Menu/MenuDetailModal';
import { useLocation } from 'react-router-dom';

const Homepage = () => {
    const { state } = useLocation();
    const { userEmail, userxu } = state || { userEmail: '', userxu: 0 };

    const [menus, setMenus] = useState([]);
    const [filteredMenus, setFilteredMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await axios.get('https://demcalo.onrender.com/api/menus');
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

    return (
        <div className="homepage">
            <h1>Menu List</h1>
            <Input.Search
                placeholder="Search menu by name"
                onSearch={handleSearch}
                enterButton
                style={{ marginBottom: 20 }}
            />
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
                    userxu={userxu}
                />
            )}
        </div>
    );
};

export default Homepage;
