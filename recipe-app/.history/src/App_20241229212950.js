import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/shared/Layout.js';
import MenuList from './components/Menu/MenuList.js';
import Login from './components/User/Login.js';
import Login from './components/User/Register.js';

import Profile from './components/User/Profile.js';
import { createRoot } from 'react-dom/client';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route 
                    path="/" 
                    element={
                        <Layout>
                            <MenuList />
                        </Layout>
                    } 
                />
                
            </Routes>
        </Router>
    );
};

export default App;