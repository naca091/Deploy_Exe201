import React, { useState, useEffect } from 'react';
import { Input, Badge, Carousel, Button, Pagination, Modal, Typography } from '@/components/ui/card';
import {
  Search,
  User,
  ShoppingCart,
  Unlock,
  Play,
  Home,
  LayoutGrid,
  BookOpen,
  Calculator,
  PlusCircle,
  Clock,
  Flame,
  Users
} from 'lucide-react';


//card component for menu
const MenuCard = ({ menu, onSeeMenu }) => (
  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
    <div className="relative w-full pb-[100%]">
      <img
        alt={menu.name}
        src={menu.image || '/api/placeholder/200/200'}
        className="absolute top-0 left-0 w-full h-full object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/api/placeholder/200/200';
        }}
      />
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-2 truncate">{menu.name}</h3>
      <p className="text-gray-600 text-sm mb-3">{menu.calories} kcal</p>
      <div className="space-y-2">
        <Button 
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          onClick={() => {}}
        >
          <Unlock className="w-4 h-4 mr-2" />
          {menu.unlockPrice} coins
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onSeeMenu(menu)}
        >
          See Menu
        </Button>
      </div>
    </div>
  </div>
);
  
const MenuDetailModal = ({ menu, visible, onClose }) => {
  if (!menu) return null;

  return (
    <Modal
      open={visible}
      onClose={onClose}
      className="max-w-4xl"
    >
      <div className="p-6 space-y-6">
        <div className="flex gap-6">
          {/* Left side - Image */}
          <div className="w-1/2">
            <div className="relative pb-[100%]">
              <img
                src={menu.image || '/api/placeholder/400/400'}
                alt={menu.name}
                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/api/placeholder/400/400';
                }}
              />
            </div>
          </div>

          {/* Right side - Details */}
          <div className="w-1/2 space-y-4">
            <h2 className="text-2xl font-bold">{menu.name}</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold">Cooking Time</span>
                </div>
                <p className="mt-1 text-sm">
                  Prep: {menu.cookingTime?.prep} mins<br />
                  Cook: {menu.cookingTime?.cook} mins
                </p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-500" />
                  <span className="font-semibold">Calories</span>
                </div>
                <p className="mt-1 text-sm">{menu.calories} kcal</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">Serving Size</span>
                </div>
                <p className="mt-1 text-sm">{menu.servingSize} persons</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Unlock className="w-5 h-5 text-purple-500" />
                  <span className="font-semibold">Price</span>
                </div>
                <p className="mt-1 text-sm">{menu.unlockPrice} coins</p>
              </div>
            </div>

            {menu.ingredients && (
              <div>
                <h3 className="font-semibold mb-2">Ingredients</h3>
                <ul className="list-disc list-inside space-y-1">
                  {menu.ingredients.map((ingredient, idx) => (
                    <li key={idx} className="text-sm">{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}

            {menu.instructions && (
              <div>
                <h3 className="font-semibold mb-2">Instructions</h3>
                <ol className="list-decimal list-inside space-y-1">
                  {menu.instructions.map((step, idx) => (
                    <li key={idx} className="text-sm">{step}</li>
                  ))}
                </ol>
              </div>
            )}

            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
              onClick={() => {}}
            >
              <Unlock className="w-4 h-4 mr-2" />
              Unlock Recipe - {menu.unlockPrice} coins
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const Homepage = () => {
  const [menus, setMenus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const menusPerPage = 20;

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get('https://demcalo.onrender.com/api/menus');
        setMenus(response.data.data);
      } catch (error) {
        console.error('Error fetching menus:', error);
      }
    };
    fetchMenus();
  }, []);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    setModalVisible(true);
  };

  const indexOfLastMenu = currentPage * menusPerPage;
  const indexOfFirstMenu = indexOfLastMenu - menusPerPage;
  const currentMenus = menus.slice(indexOfFirstMenu, indexOfLastMenu);
  // Fetch menus
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get('https://demcalo.onrender.com/api/menus');
        setMenus(response.data.data);
      } catch (error) {
        console.error('Error fetching menus:', error);
      }
    };
    fetchMenus();
  }, []);

  // Banner images
  const bannerImages = [
    '/api/placeholder/1200/400',
    '/api/placeholder/1200/400',
    '/api/placeholder/1200/400',
    '/api/placeholder/1200/400',
    '/api/placeholder/1200/400'
  ];


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4">
          {/* Top Navigation */}
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold text-green-600">FoodApp</h1>
            
            <div className="w-1/3 relative">
              <Input
                type="text"
                placeholder="Search for recipes..."
                className="w-full pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            <div className="flex items-center gap-6">
              <Button variant="ghost" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Login
              </Button>
              <Button variant="ghost" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Cart
              </Button>
            </div>
          </div>

          {/* Secondary Navigation */}
          <div className="flex gap-6 py-2">
            {[
              { icon: Home, label: 'Home' },
              { icon: LayoutGrid, label: 'Products' },
              { icon: BookOpen, label: 'Recipes' },
              { icon: Calculator, label: 'Calories' },
              { icon: PlusCircle, label: 'Add Coins' },
              { icon: Play, label: 'Watch Ads' }
            ].map(({ icon: Icon, label }) => (
              <Button 
                key={label}
                variant="ghost" 
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Banner */}
      <div className="container mx-auto px-4 py-6">
        <Carousel className="rounded-lg overflow-hidden">
          {[1, 2, 3].map((i) => (
            <img
              key={i}
              src={`/api/placeholder/1200/400`}
              alt={`Banner ${i}`}
              className="w-full h-[400px] object-cover"
            />
          ))}
        </Carousel>
      </div>

      {/* Menu Grid */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">Featured Menus</h2>
        <div className="grid grid-cols-5 gap-6">
          {currentMenus.map((menu) => (
            <MenuCard
              key={menu._id}
              menu={menu}
              onSeeMenu={handleMenuClick}
            />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Pagination 
            currentPage={currentPage}
            totalPages={Math.ceil(menus.length / menusPerPage)}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Menu Detail Modal */}
      <MenuDetailModal
        menu={selectedMenu}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </div>
  );
};

export default Homepage;