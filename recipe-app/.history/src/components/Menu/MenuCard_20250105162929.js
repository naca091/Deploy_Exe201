import React from 'react';
import { Card, Button } from 'antd';
import { UnlockOutlined } from '@ant-design/icons';

const MenuCard = ({ menu, onSeeMenu }) => (
  <Card
    className="hover:shadow-lg transition-shadow"
    cover={
      <div className="aspect-w-16 aspect-h-9 overflow-hidden" style={{ height: '200px' }}>
        <img
          alt={menu.name}
          src={`https://demcalo.onrender.com${menu.image}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/api/placeholder/400/320';
          }}
        />
      </div>
    }
    bodyStyle={{ padding: '16px', height: '140px' }}
  >
    <div className="flex flex-col h-full">
      <h3 className="font-bold text-lg mb-2 truncate">{menu.name}</h3>
      <p className="text-gray-600 mb-2">{menu.calories} kcal</p>
      <div className="space-y-2 mt-auto">
        <Button
          type="primary"
          icon={<UnlockOutlined />}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          Unlock - {menu.unlockPrice} coins
        </Button>
        <Button
          type="default"
          className="w-full"
          onClick={() => onSeeMenu(menu)}
        >
          See Menu
        </Button>
      </div>
    </div>
  </Card>
);

export default MenuCard;