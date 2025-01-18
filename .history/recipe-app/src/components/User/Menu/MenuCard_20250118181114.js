import React from "react";
import { Card, Button } from "antd";
import { UnlockOutlined } from "@ant-design/icons";

const MenuCard = ({ menu, onSeeMenu }) => (
  <Card>
    <div>
      <img
        alt={menu.name}
        src={`https://demcalo.onrender.com${menu.image}`}
        className="absolute top-0 left-0 w-full h-full object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/api/placeholder/50/50"; // Placeholder cho kích thước 200x300
        }}
      />
    </div>

    {/* Phần nội dung */}
    <div className="flex flex-col justify-between flex-1 ml-4">
      <div>
        <h3 className="font-bold text-base mb-1 truncate">{menu.name}</h3>
        <p className="text-gray-600 text-sm">{menu.calories} kcal</p>
      </div>
      <div className="space-y-2 mt-2">
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
