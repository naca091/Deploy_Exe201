import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import MenuCard from './MenuCard.js';
import api from '../../services/api.js';

const MenuList = () => {
    const [menus, setMenus] = useState([]);

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        try {
            const response = await api.get('/menus');
            setMenus(response.data);
        } catch (error) {
            console.error('Error fetching menus:', error);
        }
    };

    const handleUnlock = async (menuId) => {
        try {
            await api.post(`/menus/${menuId}/unlock`);
            fetchMenus();
        } catch (error) {
            console.error('Error unlocking menu:', error);
        }
    };

    return (
        <Row gutter={[16, 16]}>
            {menus.map((menu) => (
                <Col key={menu._id} xs={24} sm={12} md={8} lg={6}>
                    <MenuCard menu={menu} onUnlock={handleUnlock} />
                </Col>
            ))}
        </Row>
    );
};

export default MenuList;