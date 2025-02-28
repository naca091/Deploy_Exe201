import React, { useState, useEffect } from 'react';  
import { Modal, Button, message, Skeleton } from 'antd';  
import { UnlockOutlined, LockOutlined } from '@ant-design/icons';  
import axios from 'axios';  

const MenuDetailModal = ({ menu, visible, onClose, userXu }) => {  
    const [loading, setLoading] = useState(false);  
    const [menuStatus, setMenuStatus] = useState({ isUnlocked: menu?.defaultStatus === 'unlock' });  

    const user = JSON.parse(localStorage.getItem('user'));  

    const handleUnlock = async () => {  
        if (!menu || !user) return;  

        if (userXu < menu.unlockPrice) {  
            message.error(`Insufficient xu. Required: ${menu.unlockPrice}, Available: ${userXu}`);  
            return;  
        }  

        Modal.confirm({  
            title: 'Unlock Menu',  
            content: `Are you sure to unlock "${menu.name}" for ${menu.unlockPrice} xu?`,  
            onOk: async () => {  
                setLoading(true);  
                try {  
                    const response = await axios.post(`https://demcalo.onrender.com/api/menus/purchase/${menu._id}`);  
                    
                    if (response.data.success) {  
                        setMenuStatus({ isUnlocked: true });  
                        message.success(`Menu unlocked! Remaining xu: ${userXu - menu.unlockPrice}`);  
                    } else {  
                        message.error(response.data.message || 'Unable to unlock the menu');  
                    }  
                } catch (error) {  
                    message.error('Failed to unlock menu');  
                } finally {  
                    setLoading(false);  
                }  
            },  
        });  
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
                        onClick={handleUnlock}  
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