
import React, { useState } from 'react';
import { LOGO_URL, BANNER_URL } from '../constants';

interface WelcomePageProps {
  onEnter: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onEnter }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    onEnter();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-4xl mx-auto text-center p-8 rounded-lg shadow-2xl bg-white -mt-16">
        <div className="p-6">
          <div className="flex justify-center items-center gap-x-8 mb-8">
            <img src={LOGO_URL} alt="شعار المؤسسة" className="h-24 object-contain" />
            <img src={BANNER_URL} alt="شعار برامج رمضان" className="h-24 object-contain rounded-md" />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2">
            نظام إدارة أنشطة المساجد
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            منصة مركزية وفعالة لمتابعة وتسجيل وإدارة جميع الأنشطة الرمضانية في المساجد التابعة للمؤسسة.
          </p>
          <button
            onClick={handleClick}
            disabled={isLoading}
            className="px-10 py-4 bg-primary text-white font-bold text-lg rounded-lg shadow-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'الدخول إلى المنصة'
            )}
          </button>
        </div>
      </div>
      <footer className="absolute bottom-4 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} مؤسسة عبدالله بن عبدالعزيز الراجحي الخيرية
      </footer>
    </div>
  );
};
