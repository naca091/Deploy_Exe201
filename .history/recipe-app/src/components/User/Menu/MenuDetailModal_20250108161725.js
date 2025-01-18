// MenuDetailModal.js  
import React from 'react';  
import { Modal, Button, message } from 'antd';  
import { UnlockOutlined } from '@ant-design/icons';  

const MenuDetailModal = ({ menu, visible, onClose, userCoins, onPurchaseMenu }) => {  
  if (!menu) return null;  

  const handleUnlock = async () => {  
    if (userCoins >= menu.unlockPrice) {  
      try {  
        await onPurchaseMenu(menu.id);  
        message.success('Menu unlocked successfully!');  
        onClose();  
      } catch (error) {  
        message.error('Failed to unlock the menu.');  
      }  
    } else {  
      message.warning("You don't have enough coins to unlock this menu.");  
    }  
  };  

  return (  
    <Modal  
      title={menu.name}  
      visible={visible}  
      onCancel={onClose}  
      footer={[  
        <Button key="unlock" type="primary" icon={<UnlockOutlined />} onClick={handleUnlock}>  
          Unlock - {menu.unlockPrice} coins  
        </Button>,  
        <Button key="close" onClick={onClose}>  
          Close  
        </Button>,  
      ]}  
    >  
      <div>  
        <img src={menu.imageUrl} alt={menu.name} style={{ width: '100%' }} />  
        <p>{menu.description}</p>  
      </div>  
    </Modal>  
  );  
};  

export default MenuDetailModal;