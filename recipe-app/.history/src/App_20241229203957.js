import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Index from './components/Layout/Index';

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Index />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;