import React, { useState, useEffect } from 'react';  
import { Input, Badge, Button, Card, Pagination, message } from 'antd';  
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

    // Fetch data from server and localStorage  
    useEffect(() => {  
        const fetchData = async () => {  
            try {  
                const storedUser = JSON.parse(localStorage.getItem('user'));  
                if (!storedUser) {  
                    message.error('You need to log in first.');  
                    navigate('/login');  
                    return;  
                }  
                setUser(storedUser);  

                const menusResponse = await axios.get('http://localhost:5000/api/menus');  
                setMenus(menusResponse.data.data);  

                // Fetch unlocked menus directly from the user data  
                const unlockedMenuIds = storedUser.unlockedMenus || []; // Assuming unlockedMenus are stored in user data  
                setUnlockedMenus(unlockedMenuIds);  

                // Fetch updated user info to get xu  
                const userResponse = await axios.get(`http://localhost:5000/api/users/${storedUser.userId}`);  
                setUser(userResponse.data);  
                localStorage.setItem('user', JSON.stringify(userResponse.data)); // Update localStorage with new user data  
            } catch (error) {  
                console.error('Error fetching data:', error);  
                message.error('Failed to load data');  
            }  
        };  

        fetchData();  
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
            const response = await axios.post('http://localhost:5000/api/menus/purchase', {  
                userId: user._id, // Use user._id instead of user.userId  
                menuId: menuId,  
            });  

            if (response.data.success) {  
                // Update user's xu and unlocked menus  
                const updatedUser = { ...user, xu: response.data.Xu, unlockedMenus: [...unlockedMenus, menuId] };  
                setUser(updatedUser);  
                localStorage.setItem('user', JSON.stringify(updatedUser));  
                setUnlockedMenus([...unlockedMenus, menuId]);  
                message.success('Menu unlocked successfully!');  
            } else {  
                message.error(response.data.message || 'Unable to unlock the menu');  
            }  
        } catch (error) {  
            console.error('Error purchasing menu:', error);  
            message.error('Failed to purchase menu');  
        }  
    };  

    const isMenuUnlocked = (menuId) => {  
        return unlockedMenus.includes(menuId) || menus.find(menu => menu._id === menuId)?.defaultStatus === 'unlock';  
    };  

    const renderMenuItems = () => {  
        const startIndex = (currentPage - 1) * menusPerPage;  
        const endIndex = startIndex + menusPerPage;  
        const pagedMenus = menus.slice(startIndex, endIndex);  

        return pagedMenus.map((menu) => (  
            <Card  
                key={menu._id}  
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
                userXu={user ? user.xu : 0} // Pass user's xu to the modal  
                onPurchaseMenu={purchaseMenu} // Pass function to handle menu purchase  
            />  
        </div>  
    );  
};  

export default Homepage;