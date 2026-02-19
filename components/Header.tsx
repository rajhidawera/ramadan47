
import React from 'react';
import { LOGO_URL } from '../constants';
import { UserRole } from '../types';

interface HeaderProps {
  setView: (view: 'dashboard' | 'recordForm' | 'maintenanceForm' | 'recordList' | 'maintenanceList') => void;
  onAdminClick: () => void;
  userRole: UserRole;
}

export const Header: React.FC<HeaderProps> = ({ setView, onAdminClick, userRole }) => {
  return (
    <header className="bg-white shadow-md p-4 mb-8 rounded-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4 space-x-reverse">
          <img src={LOGO_URL} alt="الشعار" className="h-12 cursor-pointer" onClick={() => setView('dashboard')} />
          <h1 className="text-xl font-bold text-primary hidden md:block">
            نظام إدارة أنشطة المساجد
          </h1>
        </div>
        <nav className="flex items-center space-x-2 md:space-x-4 space-x-reverse">
          <button onClick={() => setView('dashboard')} className="text-gray-600 hover:text-primary font-semibold">لوحة التحكم</button>
          <button onClick={() => setView('recordList')} className="text-gray-600 hover:text-primary font-semibold">التقارير الميدانية</button>
          <button onClick={() => setView('maintenanceList')} className="text-gray-600 hover:text-primary font-semibold">تقارير الصيانة</button>
          <button
            onClick={onAdminClick}
            className={`px-4 py-2 rounded-md font-bold transition-colors ${userRole === 'admin' ? 'bg-green-600 text-white' : 'bg-secondary text-white'}`}
          >
            {userRole === 'admin' ? 'وضع المسؤول' : 'دخول المسؤول'}
          </button>
        </nav>
      </div>
    </header>
  );
};
