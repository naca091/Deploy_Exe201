import React from 'react';
import { Layout } from 'antd';
import Navbar from './Navbar';
import Banner from './Banner';
import MenuGrid from '../Menu/MenuGrid';
import App from './App';
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