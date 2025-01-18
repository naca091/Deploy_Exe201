import React, { useState, useEffect } from 'react';  
import { Input, Badge, Button, Carousel, Card, Pagination, message } from 'antd';  
import { Link, useNavigate } from 'react-router-dom';  
import MenuDetailModal from '../User/Menu/MenuDetailModal';  
import axios from 'axios';  

const { Search } = Input;  

const Homepage = () => {  
    const [menus, setMenus] = useState([]);  
    const [currentPage, setCurrentPage] = useState(1);  
    const [selectedMenu, setSelectedMenu] = useState(null);  
    const [modalVisible, setModalVisible] = useState(false);  
    const [user, setUser] = useState(null); // Điều này được khởi tạo như null  

    const menusPerPage = 20;  
    const navigate = useNavigate();  

    useEffect(() => {  
        const fetchMenus = async () => {  
            try {  
                const response = await axios.get('http://localhost:5000/api/menus');  
                setMenus(response.data.data);  
            } catch (error) {  
                console.error('Error fetching menus:', error);  
            }  
        };  
        fetchMenus();  
    }, []);  

    useEffect(() => {  
        // Lấy thông tin người dùng từ localStorage  
        const storedUser = JSON.parse(localStorage.getItem('user'));  
        if (!storedUser) {  
            message.error('You need to log in first.');  
            navigate('/login');  
        } else {  
            setUser(storedUser); // Lưu thông tin người dùng vào state  
        }  
    }, [navigate]);  

    const handleMenuClick = (menu) => {  
        setSelectedMenu(menu);  
        setModalVisible(true);  
    };  

    const handleLogout = () => {  
        localStorage.removeItem('user');  
        setUser(null);  
        navigate('/login');  
    };  

    const purchaseMenu = async (menuId) => {  
        try {  
            const response = await axios.post('/api/userMenu/purchase', {  
                userId: user._id, // Sử dụng ID người dùng  
                menuId: menuId,  
            });  
            // Cập nhật số xu của người dùng  
            const updatedUser = { ...user, xu: user.coins - response.data.unlockPrice }; // Giảm số xu  
            setUser(updatedUser); // Cập nhật state người dùng  
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Cập nhật localStorage  
            return { success: true, userCoins: updatedUser.coins }; // Trả về thông tin xu  
        } catch (error) {  
            console.error('Error purchasing menu:', error);  
            throw error;  
        }  
    };  

    const renderMenuItems = () => {  
        const startIndex = (currentPage - 1) * menusPerPage;  
        const endIndex = startIndex + menusPerPage;  
        const pagedMenus = menus.slice(startIndex, endIndex);  

        return pagedMenus.map((menu, index) => (  
            <Card  
                key={index}  
                hoverable  
                cover={<img alt={menu.name} src={menu.imageUrl} />}  
                onClick={() => handleMenuClick(menu)}  
            >  
                <Card.Meta title={menu.name} description={menu.description} />  
            </Card>  
        ));  
    };  

    return (  
        <div className="min-h-screen bg-gray-50">  
            <div className="bg-white shadow">  
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">  
                    <div className="text-2xl font-bold text-green-600">FoodApp</div>  
                    <Search placeholder="Search for recipes..." className="w-1/3" />  
                    <div className="flex items-center space-x-6">  
                        {user ? (  
                            <div>  
                                <span>{user.fullName} (Coins: {user.coins})</span>  
                                <Button type="link" onClick={handleLogout}>Logout</Button>  
                            </div>  
                        ) : (  
                            <Link to="/login">  
                                <Button type="link">Login / Register</Button>  
                            </Link>  
                        )}  
                        <Badge count={0}>  
                            <Button type="link">Cart</Button>  
                        </Badge>  
                    </div>  
                </div>  
            </div>  

            {/* Banner Carousel and Menu Grid omitted for brevity */}  
            <div className="container mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">  
                {renderMenuItems()}  
            </div>  

            {/* Pagination */}  
            <div className="flex justify-center py-4">  
                <Pagination  
                    current={currentPage}  
                    total={menus.length}  
                    pageSize={menusPerPage}  
                    onChange={setCurrentPage}  
                />  
            </div>  

            {/* Menu Detail Modal */}  
            <MenuDetailModal  
                menu={selectedMenu}  
                visible={modalVisible}  
                onClose={() => setModalVisible(false)}  
                userCoins={user ? user.coins : 0} // Truyền số xu của người dùng  
                onPurchaseMenu={purchaseMenu} // Truyền hàm để xử lý mở khóa menu  
            />  
        </div>  
    );  
};  

export default Homepage;