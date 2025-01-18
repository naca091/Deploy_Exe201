import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, message } from 'antd';
import axios from 'axios';

const { Meta } = Card;

const MenuGrid = () => {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/menus');
      setMenus(response.data);
    } catch (error) {
      message.error('Failed to fetch menus');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        {menus.map((menu) => (
          <Col xs={24} sm={12} md={8} lg={6} xl={4.8} key={menu._id}>
            <Card
              hoverable
              cover={<img alt={menu.name} src={menu.image} style={{ height: 200, objectFit: 'cover' }} />}
              actions={[
                <Button type={menu.status === 'lock' ? 'primary' : 'default'}>
                  {menu.status === 'lock' ? 'Unlock' : 'Unlocked'}
                </Button>
              ]}
            >
              <Meta
                title={menu.name}
                description={
                  <>
                    <p>Calories: {menu.calories}</p>
                    <p>Serving Size: {menu.servingSize}</p>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default MenuGrid;