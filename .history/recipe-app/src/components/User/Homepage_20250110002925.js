import React, { useState, useEffect } from 'react';  
import { Input, Badge, Button, Card, Pagination, message, Spin } from 'antd';  
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
    const [loading, setLoading] = useState(true);  

    const menusPerPage = 20;  
    const navigate = useNavigate();  

    // Kết nối API để lấy dữ liệu khi component được mount  
    useEffect(() => {  
        const fetchData = async () => {  
            try {  
                const storedUser = JSON.parse(localStorage.getItem('user'));  
                if (!storedUser) {  
                    message.error('You need to log in first.');  
                    navigate('/login');  
                    return;  
                }  

                const [menusResponse, unlockedResponse] = await Promise.all([  
                    axios.get('http://localhost:5000/api/menus'),  
                    axios.get(`http://localhost:5000/api/usermenus/users/${storedUser.userId}`)  
                ]);  

                setMenus(menusResponse.data.data);  
                setUser(storedUser);  
                setUnlockedMenus(unlockedResponse.data.data.map(item => item.menuId));  
            } catch (error) {  
                console.error('Error fetching data:', error);  
                message.error('Failed to load data');  
            } finally {  
                setLoading(false);  
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
            const response = await axios.post('http://localhost:5000/api/usermenus', {  
                userId: user.userId,  
                menuId: menuId,  
            });  

            if (response.data.success) {  
                const updatedUser = { ...user, xu: response.data.Xu };  
                setUser(updatedUser);  
                localStorage.setItem('user', JSON.stringify(updatedUser));  
                setUnlockedMenus([...unlockedMenus, menuId]);  
            }  

            return response.data;  
        } catch (error) {  
            console.error('Error purchasing menu:', error);  
            message.error('Failed to purchase menu');  
            throw error;  
        }  
    };  

    const isMenuUnlocked = (menuId) => {  
        return unlockedMenus.includes(menuId) ||   
               menus.find(menu => menu._id === menuId)?.defaultStatus === 'unlock';  
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
                {loading ? <Spin size="large" /> : renderMenuItems()}  
            </div>  

            <div className="flex justify-center py-4">  
                <Pagination  
                    current={currentPage}  
                    total={menus.length}  
                    pageSize={menusPerPage}  
                    onChange={setCurrentPage}  
                />  
            </div>  

            <MenuDetailModal  
                menu={selectedMenu}  
                visible={modalVisible}  
                onClose={() => setModalVisible(false)}  
                userXu={user ? user.xu : 0}  
                onPurchaseMenu={purchaseMenu}  
            />  
        </div>  
    );  
};  

export default Homepage;