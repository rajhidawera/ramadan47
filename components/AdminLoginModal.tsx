
import React, { useState } from 'react';

interface AdminLoginModalProps {
  onClose: () => void;
  onLogin: (password: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onLogin }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">دخول المسؤول</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-2">
            كلمة المرور الخاصة بالمسؤول
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            required
          />
          <div className="mt-6 flex justify-between items-center">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-primary rounded-md hover:bg-opacity-90 transition"
            >
              دخول
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
