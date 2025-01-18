import React, { useState, useEffect } from 'react';  
import { Modal, Button, message, Skeleton } from 'antd';  
import { UnlockOutlined, LockOutlined } from '@ant-design/icons';  
import axios from 'axios';  

const MenuDetailModal = ({ menu, visible, onClose, userXu }) => {  
    const [loading, setLoading] = useState(false);  
    const [menuStatus, setMenuStatus] = useState({ isUnlocked: menu?.defaultStatus === 'unlock' });  

    const user = JSON.parse(localStorage.getItem('user'));  

    const onPurchaseMenu = (menu) => {  
        const menuIdz = menu._id; // Sử dụng _id của MongoDB  
        if (!menuIdz) {  
            console.error('Menu ID is undefined.');   
            message.error('Menu ID không hợp lệ.');  
            return;  
        }  
        
        purchaseMenu(menuIdz); // Gọi hàm với menuId hợp lệ  
    };
    
    const purchaseMenu = async (menuIdz) => {  
        setLoading(true);  
        try {  
            const user = JSON.parse(localStorage.getItem('user'));  
            if (!user || !user._id) {  
                message.error('Unauthorized: No user data found.');  
                return;  
            }  
    
            const response = await axios.post(`http://localhost:5000/api/menus/purchase/${menuIdz}`, {}, {  
                headers: {  
                    'Authorization': user._id   
                }  
            });  
    
            if (response.data.success) {  
                message.success('Purchase successful!');  
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
                        onClick={onPurchaseMenu}  
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