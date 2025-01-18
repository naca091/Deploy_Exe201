import React, { useState } from 'react';  
import { Modal, Button, message, Skeleton } from 'antd';  
import { UnlockOutlined, LockOutlined } from '@ant-design/icons';  
import axios from 'axios';  

const MenuDetailModal = ({ menu, visible, onClose, userXu }) => {  
    const [loading, setLoading] = useState(false);  
    const [menuStatus, setMenuStatus] = useState({ isUnlocked: menu?.defaultStatus === 'unlock' });  

    // Hàm xử lý mua menu  
    const onPurchaseMenu = () => {  
        if (!menu || !menu._id) {  
            console.error('Invalid menu object:', menu);  
            message.error('Menu không hợp lệ.');  
            return;  
        }  

        const menuId = menu._id; // Tại đây, menuId sẽ hợp lệ nếu menu được cung cấp đúng cách  
        console.log('Menu ID:', menuId);  
        
        // Tiếp tục với logic purchase  
        purchaseMenuByName(menuId);  
    };  

    const purchaseMenu = async (menuName) => {  
        setLoading(true);  
        try {  
            const token = localStorage.getItem('token'); // Lấy token từ local storage  
            if (!token) {  
                message.error('Unauthorized: No token found.');  
                return;  
            }  
    
            const response = await axios.post(`https://demcalo.onrender.com/api/menus/purchase`, {  
                name: menuName,  
            }, {  
                headers: {  
                    Authorization: `Bearer ${token}` // Gửi token trong header  
                }  
            });  
    
            if (response.data.success) {  
                message.success('Purchase successful!');  
                setMenuStatus({ isUnlocked: true });  
            } else {  
                message.error(response.data.message);  
            }  
        } catch (error) {  
            console.error('Purchase error:', error);  
            message.error('Failed to purchase menu');  
        } finally {  
            setLoading(false);  
        }  
    };
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