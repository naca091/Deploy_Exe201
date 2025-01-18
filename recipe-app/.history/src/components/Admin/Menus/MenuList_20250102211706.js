import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/menus');
        setMenus(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Menu List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <div key={menu._id} className="border rounded-lg shadow-sm p-4">
            <div className="mb-4">
              <img 
                src={menu.image} 
                alt={menu.name} 
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
            <h2 className="text-xl font-semibold mb-2">{menu.name}</h2>
            <p className="text-gray-600 mb-4 line-clamp-3">{menu.description}</p>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Ingredients:</h3>
              <ul className="list-disc list-inside">
                {menu.ingredients.map((ing, index) => (
                  <li key={index} className="text-gray-600">
                    {ing.ingredient.name} - {ing.weight}{ing.unit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{menu.difficulty}</span>
              <span>{menu.cookingTime.prep + menu.cookingTime.cook} mins</span>
              <span>{menu.calories} cal</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuList;