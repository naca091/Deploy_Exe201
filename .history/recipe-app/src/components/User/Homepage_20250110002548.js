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
    const [user, setUser] = useState(null);
    const [unlockedMenus, setUnlockedMenus] = useState([]);

    const menusPerPage = 20;
    const navigate = useNavigate();

    //fetch data from server and localStorage in one useEffect
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [menusResponse, storedUser] = await Promise.all([
                    axios.get('http://localhost:5000/api/menus'),
                    JSON.parse(localStorage.getItem('user'))
                ]);
    
                if (!storedUser) {
                    message.error('You need to log in first.');
                    navigate('/login');
                    return;
                }
    
                setMenus(menusResponse.data.data);
                setUser(storedUser); // Tương đương với hàm setUser trong useEffect cũ
                
                // Thêm phần fetch unlocked menus
                const unlockedResponse = await axios.get(
                    `http://localhost:5000/api/usermenus/users/${storedUser.userId}`
                );
                setUnlockedMenus(unlockedResponse.data.data.map(item => item.menuId));
            } catch (error) {
                console.error('Error fetching data:', error);
                message.error('Failed to load data');
            }
        };
    
        fetchData();
    }, [navigate]);

    useEffect(() => {  
        const storedUser = JSON.parse(localStorage.getItem('user'));  
        const userId = storedUser ? storedUser._id : null; // Get _id instead of userId  
    
        console.log("Current User ID:", userId); // Debugging line  
    
        if (userId) {  
            axios.get(`http://localhost:5000/api/usermenus/users/${userId}`)  
                .then(response => {  
                    // Handle successful response  
                })  
                .catch(error => {  
                    console.error('Error fetching data:', error);  
                });  
        } else {  
            console.error('User ID is undefined');  
        }  
    }, []);

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
            const response = await axios.post('http://localhost:5000/api/usermenus', {
                userId: user.userId,
                menuId: menuId,
            });
            
            if (response.data.success) {
                // Update user's xu
                const updatedUser = { ...user, xu: response.data.Xu };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                // Update unlocked menus list
                setUnlockedMenus([...unlockedMenus, menuId]);
            }
            
            return response.data;
        } catch (error) {
            console.error('Error purchasing menu:', error);
            throw error;
        }
    };

    const isMenuUnlocked = (menuId) => {
        return unlockedMenus.some(menu => menu._id === menuId) || 
               menus.find(menu => menu._id === menuId)?.defaultStatus === 'unlock';
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
                extra={
                    isMenuUnlocked(menu._id) ? 
                    <Badge status="success" text="Unlocked" /> : 
                    <Badge status="default" text="Locked" />
                }
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
                                <span>{user.fullName} (Xu: {user.xu})</span>  
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
                userXu={user ? user.xu : 0} // Truyền số xu của người dùng  
                onPurchaseMenu={purchaseMenu} // Truyền hàm để xử lý mở khóa menu  
            />  
        </div>  
    );  
};  

export default Homepage;