import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/shared/Layout';
import MenuList from './components/Menu/MenuList';
import Login from './components/User/Login';
import Profile from './components/User/Profile';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route 
                    path="/" 
                    element={
                        <Layout>
                            <MenuList />
                        </Layout>
                    } 
                />
                <Route 
                    path="/profile" 
                    element={
                        <Layout>
                            <Profile />
                        </Layout>
                    } 
                />
            </Routes>
        </Router>
    );
};

export default App;