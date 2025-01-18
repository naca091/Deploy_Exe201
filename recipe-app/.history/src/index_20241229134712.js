import React from 'react';
import { Layout } from 'antd';
import Navbar from './Navbar';
import Banner from './Banner';
import MenuGrid from '../Menu/MenuGrid';

const { Header, Content } = Layout;

const Index = () => {
  return (
    <Layout>
      <Header>
        <Navbar />
      </Header>
      <Content>
        <Banner />
        <MenuGrid />
      </Content>
    </Layout>
  );
};

// Navbar.js
import { Menu, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Menu mode="horizontal" theme="dark">
        <Menu.Item key="coins">
          <Button type="primary">Nạp xu</Button>
        </Menu.Item>
        <Menu.Item key="ads">
          <Button>Xem quảng cáo</Button>
        </Menu.Item>
        <Menu.Item key="about">
          <Button>About us</Button>
        </Menu.Item>
      </Menu>
    </div>
  );
};

// Banner.js
import React from 'react';
import { Carousel } from 'antd';

const Banner = () => {
  return (
    <Carousel autoplay>
      <div>
        <img 
          src="/api/placeholder/1200/300" 
          alt="Banner 1"
          style={{ width: '100%', height: '300px', objectFit: 'cover' }}
        />
      </div>
      {/* Add more banner images as needed */}
    </Carousel>
  );
};

// MenuGrid.js
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