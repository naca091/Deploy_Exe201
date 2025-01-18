// userMenu.js  
import React from 'react';  
import { Menu, Button } from 'antd';  
import { Link } from 'react-router-dom';  

const UserMenu = ({ user, onLogout }) => {  
  return (  
    <Menu>  
      <Menu.Item key="profile">  
        <Link to="/user/profile">View Profile</Link>  
      </Menu.Item>  
      <Menu.Item key="logout" onClick={onLogout}>  
        <Button type="link">Logout</Button>  
      </Menu.Item>  
    </Menu>  
  );  
};  

export default UserMenu;