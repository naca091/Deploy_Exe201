import React from 'react';
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