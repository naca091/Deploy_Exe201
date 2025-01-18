import React from 'react';  
import { Modal, Button, message } from 'antd';  
import { UnlockOutlined } from '@ant-design/icons';  

const MenuDetailModal = ({   
  menu,   
  visible,   
  onClose,   
  userCoins,   
  onPurchaseMenu   
}) => {  
  if (!menu) return null; // Kiểm tra nếu không có menu  
  
  const isUnlocked = menu.defaultStatus === "unlock";  
  const ParentComponent = () => {
    const [userCoins, setUserCoins] = useState(0);
  const handleUnlock = () => {  
    console.log("User Coins before unlock attempt:", userCoins);  
    console.log("Menu Unlock Price:", menu.unlockPrice);  

    if (userCoins >= menu.unlockPrice) {  
      Modal.confirm({  
        title: "Are you sure to buy this menu?",  
        content: `Unlock this menu for ${menu.unlockPrice} coins?`,  
        okText: "Yes",  
        cancelText: "No",  
        onOk: async () => {  
          try {  
            const response = await onPurchaseMenu(menu.id);  
            message.success("Menu unlocked successfully!");  
            console.log("Updated user coins after purchase:", response.data.userCoins); // In ra số coins mới cập nhật  
          } catch (error) {  
            message.error("Failed to unlock the menu.");  
          }  
        },  
      });  
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
        !isUnlocked && (  
          <Button key="unlock" type="primary" icon={<UnlockOutlined />} onClick={handleUnlock}>  
            Unlock - {menu.unlockPrice} coins  
          </Button>  
        ),  
        <Button key="close" onClick={onClose}>  
          Close  
        </Button>,  
      ]}  
      width={800}  
    >  
      <div>  
        <img src={menu.imageUrl} alt={menu.name} style={{ width: '100%' }} />  
        <p>{menu.description}</p>  
      </div>  
    </Modal>  
  );  
};  

export default MenuDetailModal;