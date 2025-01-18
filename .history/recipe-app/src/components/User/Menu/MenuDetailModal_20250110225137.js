import React, { useState, useCallback } from 'react';
import { Modal, Button, message, Skeleton } from 'antd';
import { UnlockOutlined, LockOutlined } from '@ant-design/icons';
import authUtils from '../authUtils';
const MenuDetailModal = ({ menu, visible, onClose, userXu, onPurchaseSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [menuStatus, setMenuStatus] = useState({ 
    isUnlocked: menu?.defaultStatus === 'unlock' 
  });

  const authAxios = authUtils.createAuthAxios();

  const handlePurchase = useCallback(async () => {
    if (!menu?._id) {
      message.error('Menu không hợp lệ.');
      return;
    }

    try {
      setLoading(true);

      const response = await authAxios.post('https://demcalo.onrender.com/api/menus/purchase', {
        menuId: menu._id
      });

      if (response.data.success) {
        message.success('Menu đã được mở khóa thành công!');
        setMenuStatus({ isUnlocked: true });
        
        // Callback để cập nhật UI cha
        onPurchaseSuccess?.(response.data.remainingXu);
      }
    } catch (error) {
      console.error('Error purchasing menu:', error);
      
      const errorMsg = error.response?.data?.message || 
        'Đã xảy ra lỗi trong quá trình mua menu.';
      
      message.error(errorMsg);

      // Xử lý các trường hợp lỗi cụ thể
      if (error.response?.status === 403) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  }, [menu, authAxios, onPurchaseSuccess, onClose]);

  const renderMenuContent = useCallback(() => {
    if (!menu) return <Skeleton active />;

    return menuStatus.isUnlocked ? (
      <div className="space-y-4">
        <img
          src={menu.image}
          alt={menu.name}
          className="w-full rounded-lg"
        />
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Description</h3>
          <p className="text-gray-600">{menu.description}</p>
        </div>
      </div>
    ) : (
      <div className="relative">
        <img
          src={menu.image}
          alt={menu.name}
          className="w-full filter blur-sm rounded-lg"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-30">
          <LockOutlined className="text-2xl text-white mb-2" />
          <p className="text-white font-medium">
            Unlock this menu to view full details
          </p>
        </div>
      </div>
    );
  }, [menu, menuStatus.isUnlocked]);

  return (
    <Modal
      title={menu?.name}
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        !menuStatus.isUnlocked && (
          <Button
            key="unlock"
            type="primary"
            icon={<UnlockOutlined />}
            onClick={handlePurchase}
            loading={loading}
            disabled={userXu < (menu?.unlockPrice || 0)}
          >
            Unlock ({menu?.unlockPrice} xu)
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