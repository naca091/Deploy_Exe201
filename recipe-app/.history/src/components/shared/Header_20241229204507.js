import React from 'react';
import { Layout, Menu } from 'antd';
import { WalletOutlined, PlayCircleOutlined, InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header: AntHeader } = Layout;

const Header = () => {
    const navigate = useNavigate();

    return (
        <AntHeader>
            <Menu theme="dark" mode="horizontal">
                <Menu.Item key="home" onClick={() => navigate('/')}>
                    Home
                </Menu.Item>
                <Menu.Item key="coins" icon={<WalletOutlined />}>
                    Nạp xu
                </Menu.Item>
                <Menu.Item key="ads" icon={<PlayCircleOutlined />}>
                    Xem quảng cáo
                </Menu.Item>
                <Menu.Item key="about" icon={<InfoCircleOutlined />}>
                    About us
                </Menu.Item>
                <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate('/profile')}>
                    Profile
                </Menu.Item>
            </Menu>
        </AntHeader>
    );
};

export default Header;