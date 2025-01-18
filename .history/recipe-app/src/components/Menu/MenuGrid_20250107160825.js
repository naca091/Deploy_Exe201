import React from 'react';
import {  Pagination } from 'antd';
import MenuCard from './MenuCard';

const MenuGrid = ({ menus, currentPage, menusPerPage, onPageChange, onSeeMenu }) => {
  const indexOfLastMenu = currentPage * menusPerPage;
  const indexOfFirstMenu = indexOfLastMenu - menusPerPage;
  const currentMenus = menus.slice(indexOfFirstMenu, indexOfLastMenu);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Featured Menus</h2>
      <div className="grid grid-cols-5 gap-4">
        {currentMenus.map((menu) => (
          <MenuCard key={menu._id} menu={menu} onSeeMenu={onSeeMenu} />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Pagination
          current={currentPage}
          onChange={onPageChange}
          total={menus.length}
          pageSize={menusPerPage}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default MenuGrid;