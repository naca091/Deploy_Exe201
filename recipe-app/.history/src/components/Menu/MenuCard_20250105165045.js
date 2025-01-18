import React from 'react';
import { Card, Button } from 'antd';
import { UnlockOutlined } from '@ant-design/icons';

const MenuCard = ({ menu, onSeeMenu }) => (
  <Card
    className="hover:shadow-lg transition-shadow max-w-[280px]" // Giới hạn chiều rộng tối đa
    cover={
      <div className="relative w-full" style={{ 
        paddingTop: '100%',  // Tạo container hình vuông (1:1)
        maxHeight: '200px',  // Giới hạn chiều cao tối đa
        overflow: 'hidden'
      }}>
        <img
          alt={menu.name}
          src={`https://demcalo.onrender.com${menu.image}`}
          className="absolute top-0 left-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/api/placeholder/400/320';
          }}
        />
      </div>
    }
    styles={{
      body: {
        padding: '12px', // Giảm padding
        height: '120px'  // Giảm chiều cao của phần nội dung
      }
    }}
  >
    <div className="flex flex-col h-full">
      <h3 className="font-bold text-base mb-1 truncate">{menu.name}</h3>
      <p className="text-gray-600 mb-1 text-sm">{menu.calories} kcal</p>
      <div className="space-y-1 mt-auto">
        <Button
          type="primary"
          icon={<UnlockOutlined />}
          className="w-full bg-green-600 hover:bg-green-700 h-8 text-sm"
          size="small"
        >
          Unlock - {menu.unlockPrice} coins
        </Button>
        <Button
          type="default"
          className="w-full h-8 text-sm"
          onClick={() => onSeeMenu(menu)}
          size="small"
        >
          See Menu
        </Button>
      </div>
    </div>
  </Card>
);

export default MenuCard;