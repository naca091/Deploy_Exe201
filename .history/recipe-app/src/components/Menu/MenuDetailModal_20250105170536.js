import React from 'react';
import { Modal, Button, Typography } from 'antd';
import { ClockCircleOutlined, FireOutlined, TeamOutlined, UnlockOutlined } from '@ant-design/icons';

const { Text } = Typography;

const MenuDetailModal = ({ menu, visible, onClose }) => {
  if (!menu) return null;

  return (
    <Modal
      title={menu.name}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="unlock" type="primary" icon={<UnlockOutlined />}>
          Unlock - {menu.unlockPrice} coins
        </Button>,
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
      width={800}
    >
      <div className="space-y-6">
        <div className="w-full h-[400px] overflow-hidden rounded-lg">
          <img 
            //src={`https://demcalo.onrender.com${menu.image}`}
            alt={menu.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/api/placeholder/800/400';
            }}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <ClockCircleOutlined className="text-xl text-blue-500" />
            <div className="mt-2">
              <Text strong>Cooking Time</Text>
              <div>Prep: {menu.cookingTime?.prep} mins</div>
              <div>Cook: {menu.cookingTime?.cook} mins</div>
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <FireOutlined className="text-xl text-red-500" />
            <div className="mt-2">
              <Text strong>Calories</Text>
              <div>{menu.calories} kcal</div>
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <TeamOutlined className="text-xl text-green-500" />
            <div className="mt-2">
              <Text strong>Serving Size</Text>
              <div>{menu.servingSize} persons</div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MenuDetailModal;