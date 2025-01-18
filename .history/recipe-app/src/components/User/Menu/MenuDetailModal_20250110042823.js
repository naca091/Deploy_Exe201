import React, { useState, useEffect } from 'react';  
import { Modal, Button, message, Skeleton } from 'antd';  
import { UnlockOutlined, LockOutlined } from '@ant-design/icons';  
import axios from 'axios';  

const MenuDetailModal = ({ menu, visible, onClose, userXu }) => {  
    const [loading, setLoading] = useState(false);  
    const [menuStatus, setMenuStatus] = useState({ isUnlocked: menu?.defaultStatus === 'unlock' });  

    const user = JSON.parse(localStorage.getItem('user'));  

    // Hàm xử lý mua menu  
    const onPurchaseMenu = () => {  
        if (!menu || !menu._id) {  
            console.error('Invalid menu object:', menu);  
            message.error('Menu không hợp lệ.');  
            return;  
        }  

        const menuId = menu._id; // Tại đây, menuId sẽ hợp lệ if menu được cung cấp đúng cách  
        console.log('Menu ID:', menuId);  
        
        // Tiếp tục với logic purchase  
        purchaseMenu(menuId);  
    };  
    
    try {  
        const response = await axios.post(`http://localhost:5000/api/menus/purchase/${menuId}`, {  
            userId: currentUser.id // currentUser là thông tin người dùng đang đăng nhập  
        });  
        console.log(response.data);  
    } catch (error) {  
        console.error('Purchase error:', error);  
    }

    const renderMenuContent = () => {  
        if (!menu) return <Skeleton active />; // Kiểm tra nếu không có menu  

        // Kiểm tra trạng thái menu  
        return menuStatus.isUnlocked ? (  
            <div>  
                <img src={menu.image} alt={menu.name} style={{ width: '100%' }} />  
                <div className="mt-4">  
                    <h3>Description</h3>  
                    <p>{menu.description}</p>  
                </div>  
            </div>  
        ) : (  
            <div>  
                <img  
                    src={menu.image}  
                    alt={menu.name}  
                    style={{ width: '100%', filter: 'blur(5px)' }}  
                />  
                <div className="text-center mt-4">  
                    <LockOutlined style={{ fontSize: 24 }} />  
                    <p>Unlock this menu to view full details</p>  
                </div>  
            </div>  
        );  
    };  

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
                        onClick={onPurchaseMenu}  // Gọi hàm đúng cách  
                        loading={loading}  
                        disabled={userXu < (menu?.unlockPrice || 0)}  
                    >  
                        Unlock ({menu?.unlockPrice} xu)  
                    </Button>  
                ),  
            ]}  
            width={800}  
        >  
            {renderMenuContent()}  
        </Modal>  
    );  
};  

export default MenuDetailModal;