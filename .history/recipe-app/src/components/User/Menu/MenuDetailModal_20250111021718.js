import React, { useState, useCallback } from 'react';
import { Modal, Button, message, Skeleton, Typography, Divider } from 'antd';
import { UnlockOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
const { Title, Text } = Typography;

const MenuDetailModal = ({ menu, visible, onClose, userEmail, userCoins, onPurchaseSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [isBought, setIsBought] = useState(menu?.purchasedBy?.includes(userEmail));

  const handlePurchase = useCallback(async () => {
    if (userCoins < menu.unlockPrice) {
      message.error('Not enough coins to unlock this menu.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/menus/purchase', {
        menuId: menu._id,
        userEmail,
      });

      if (response.data.success) {
        setIsBought(true); // Đánh dấu đã mua
        onPurchaseSuccess(response.data.updatedMenu); // Cập nhật menu ở Homepage
      }
    } catch (error) {
      console.error('Error purchasing menu:', error);
      message.error('Failed to unlock the menu.');
    } finally {
      setLoading(false);
    }
  }, [menu, userCoins, userEmail, onPurchaseSuccess]);

  const renderMenuContent = useCallback(() => {
    if (!menu) return <Skeleton active />;

    return isBought ? (
      <div>
        <img src={menu.imageUrl} alt={menu.name} className="w-full rounded-lg object-cover h-64" />
        <div className="mt-4">
          <Title level={3}>{menu.name}</Title>
          <Divider />
          <Text type="secondary">{menu.description}</Text>
        </div>
      </div>
    ) : (
      <div className="relative">
        <img
          src={menu.imageUrl}
          alt={menu.name}
          className="w-full h-64 object-cover rounded-lg filter blur-sm"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-30">
          <LockOutlined className="text-2xl text-white mb-2" />
          <Text className="text-white font-medium">Unlock this menu to view full details</Text>
        </div>
      </div>
    );
  }, [menu, isBought]);

  return (
    <Modal
      title={menu.name}
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        !isBought && (
          <Button
            key="unlock"
            type="primary"
            icon={<UnlockOutlined />}
            onClick={handlePurchase}
            loading={loading}
          >
            Unlock ({menu.unlockPrice} xu)
          </Button>
        ),
      ]}
      width={800}
      destroyOnClose
    >
      {renderMenuContent()}
    </Modal>
  );
};

export default MenuDetailModal;
