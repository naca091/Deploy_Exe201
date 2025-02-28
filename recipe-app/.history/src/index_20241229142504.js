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