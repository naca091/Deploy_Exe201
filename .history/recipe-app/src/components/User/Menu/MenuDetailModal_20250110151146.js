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
        purchaseMenu(menuId);  
    };  

    const purchaseMenu = async (menuId) => {  
        const token = localStorage.getItem('token'); // Lấy token  
        const data = { menuId }; // Tạo đối tượng data với menuId. Thêm các thông tin khác nếu cần.  
        
        try {  
            setLoading(true); // Đặt trạng thái loading khi bắt đầu yêu cầu  
            const response = await axios.post('http://localhost:5000/api/menus/purchase', data, {  
                headers: {  
                    'Authorization': `Bearer ${token}`  
                }  
            });  
    
            if (response.data.success) {  
                // Xử lý thành công  
                message.success('Menu đã được mở khóa thành công!');  
                setMenuStatus({ isUnlocked: true }); // Cập nhật trạng thái menu  
            } else {  
                // Nếu không thành công, hiển thị thông báo  
                message.error(response.data.message || 'Không thể mở khóa menu.');  
            }  
        } catch (error) {  
            console.error('Error purchasing menu:', error);  
            message.error('Đã xảy ra lỗi trong quá trình mua menu.');  
        } finally {  
            setLoading(false); // Kết thúc quá trình loading  
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