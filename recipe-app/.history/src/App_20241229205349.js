import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/shared/Layout.js';
import MenuList from './components/Menu/MenuList.js';
import Login from './components/User/Login.js';
import Profile from './components/User/Profile.js';

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
                
            </Routes>
        </Router>
    );
};

export default App;