import React from 'react';
import { Layout as AntLayout } from 'antd';
import Header from './Header.js';

const { Content } = AntLayout;

const Layout = ({ children }) => {
    return (
        <AntLayout>
            <Header />
            <Content className="site-layout-content">
                {children}
            </Content>
        </AntLayout>
    );
};

export default Layout;
