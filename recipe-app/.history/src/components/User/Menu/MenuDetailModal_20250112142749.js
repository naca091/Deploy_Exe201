// MenuDetailModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, message, Skeleton } from 'antd';
import { UnlockOutlined, LockOutlined } from '@ant-design/icons';
const auth = require('../middleware/auth');

import axios from 'axios';

const MenuDetailModal = ({ 
    menu, 
    visible, 
    onClose, 
    userXu,
    purchasedMenus,
    onPurchaseSuccess 
}) => {
    const [loading, setLoading] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);

    useEffect(() => {
        if (menu) {
            setIsUnlocked(
                menu.defaultStatus === 'unlock' || 
                purchasedMenus.includes(menu._id)
            );
        }
    }, [menu, purchasedMenus]);

    const purchaseMenu = async () => {
        if (!menu?._id) {
            message.error('Invalid menu');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://localhost:5000/api/menus/${menu._id}/purchase`,
                {},
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.data.message) {
                message.success('Menu unlocked successfully!');
                setIsUnlocked(true);
                onPurchaseSuccess(response.data.remainingXu, menu._id);
            }
        } catch (error) {
            console.error('Error purchasing menu:', error);
            message.error(error.response?.data?.message || 'Failed to unlock menu');
        } finally {
            setLoading(false);
        }
    };

    const renderMenuContent = () => {
        if (!menu) return <Skeleton active />;

        return isUnlocked ? (
            <div>
                <img 
                    src={menu.imageUrl} 
                    alt={menu.name} 
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} 
                />
                <div className="mt-4">
                    <h3>Description</h3>
                    <p>{menu.description}</p>
                </div>
            </div>
        ) : (
            <div>
                <img
                    src={menu.imageUrl}
                    alt={menu.name}
                    style={{ 
                        width: '100%', 
                        maxHeight: '400px', 
                        objectFit: 'cover',
                        filter: 'blur(5px)' 
                    }}
                />
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <LockOutlined style={{ fontSize: 24 }} />
                    <p>Unlock this menu to view full details</p>
                    <p>Price: {menu.unlockPrice} xu</p>
                </div>
            </div>
        );
    };

    return (
        <Modal
            title={menu?.name}
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Close
                </Button>,
                !isUnlocked && (
                    <Button
                        key="unlock"
                        type="primary"
                        icon={<UnlockOutlined />}
                        onClick={purchaseMenu}
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