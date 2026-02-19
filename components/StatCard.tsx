
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-transform duration-300">
      <h3 className="text-lg font-semibold text-gray-500">{title}</h3>
      <p className="text-4xl font-extrabold text-primary mt-2">{value}</p>
    </div>
  );
};
