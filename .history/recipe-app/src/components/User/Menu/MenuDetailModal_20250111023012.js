import React, { useState, useCallback } from 'react';
import { Modal, Button, message, Typography, Divider } from 'antd';
import { UnlockOutlined, LockOutlined } from '@ant-design/icons';
import ax
const { Title, Text } = Typography;

const MenuDetailModal = ({ menu, visible, onClose, userEmail, userxu }) => {
    const [loading, setLoading] = useState(false);
    const [isBought, setIsBought] = useState(menu?.purchasedBy?.includes(userEmail));

    const handlePurchase = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.post(
                'https://demcalo.onrender.com/api/menus/purchase',
                { menuName: menu.name, userEmail }
            );

            if (response.data.success) {
                message.success('Menu unlocked successfully!');
                setIsBought(true);
            } else {
                message.error('Failed to unlock menu.');
            }
        } catch (error) {
            console.error('Error purchasing menu:', error);
            message.error('Failed to unlock menu.');
        } finally {
            setLoading(false);
        }
    }, [menu, userEmail]);

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
                        Unlock
                    </Button>
                ),
            ]}
            width={800}
            destroyOnClose
        >
            <div>
                {isBought ? (
                    <div>
                        <img
                            src={menu.imageUrl}
                            alt={menu.name}
                            style={{ width: '100%', borderRadius: '8px' }}
                        />
                        <Title level={3}>{menu.name}</Title>
                        <Divider />
                        <Text>{menu.description}</Text>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <LockOutlined style={{ fontSize: '48px', marginBottom: '20px' }} />
                        <Text>Unlock this menu to view full details.</Text>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default MenuDetailModal;
