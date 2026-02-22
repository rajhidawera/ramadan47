import React from 'react';
import { LOGO_URL } from '../constants';

interface HeaderProps {
  setView: (view: 'dashboard' | 'recordForm' | 'recordList' | 'dailyReport' | 'volunteerForm') => void;
}

export const Header: React.FC<HeaderProps> = ({ setView }) => {
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
          <button onClick={() => setView('dailyReport')} className="text-gray-600 hover:text-primary font-semibold">التقرير اليومي</button>
          <button onClick={() => setView('volunteerForm')} className="text-gray-600 hover:text-primary font-semibold">تسجيل متطوع</button>
        </nav>
      </div>
    </header>
  );
};