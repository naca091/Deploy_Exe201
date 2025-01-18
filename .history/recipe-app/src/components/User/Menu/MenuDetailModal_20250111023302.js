import React, { useState, useCallback } from 'react';  
import { Modal, Button, message, Skeleton, Typography, Divider } from 'antd';  
import { UnlockOutlined, LockOutlined } from '@ant-design/icons';  
import authUtils from '../authUtils';
const { Title, Text } = Typography;  

const MenuDetailModal = ({ menu, visible, onClose, user, onPurchaseSuccess }) => {  
  const [loading, setLoading] = useState(false);  
  const [isBought, setIsBought] = useState(menu?.purchasedBy?.includes(user?._id));  

  const authAxios = authUtils.createAuthAxios();  

  const handlePurchase = useCallback(async () => {  
    try {  
      setLoading(true);  
      const response = await authAxios.post('http://localhost:5000//api/menus/purchase', {  
        menuId: menu._id,  
      });  
      // Xử lý response  
    } catch (error) {  
      console.error('Error purchasing menu:', error);  
      const errorMsg =  
        error.response?.data?.message || 'An error occurred while purchasing the menu.';  
      message.error(errorMsg);  

      if (error.response?.status === 403) {  
        onClose();  
      }  
    } finally {  
      setLoading(false);  
    }  
  }, [menu, authAxios, onPurchaseSuccess, onClose]);  
  const renderMenuContent = useCallback(() => {  
    if (!menu) return <Skeleton active />;  

    return isBought ? (  
      <div className="space-y-4">  
        <img src={menu.image} alt={menu.name} className="w-full rounded-lg object-cover h-64" />  
        <div className="mt-4">  
          <Title level={3}>{menu.name}</Title>  
          <Divider />  
          <Text type="secondary">{menu.description}</Text>  
          <Divider />  
          <div className="grid grid-cols-2 gap-4">  
            {/* Các thông tin chi tiết về menu */}  
          </div>  
        </div>  
      </div>  
    ) : (  
      <div className="relative">  
        <img  
          src={menu.image}  
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
      title={null}  
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
            disabled={user?.xu < (menu?.unlockPrice || 0)}  
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