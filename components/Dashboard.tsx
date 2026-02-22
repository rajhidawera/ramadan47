import React, { useMemo, useState } from 'react';
import { Record, ReportStatus, Volunteer } from '../types';
import { StatCard } from './StatCard';
import { ImageSlider } from './ImageSlider';
import { analyzeDataWithGemini } from '../services/geminiService';
import { Spinner } from './Spinner';

interface DashboardProps {
  setView: (view: 'recordForm' | 'recordList' | 'volunteerForm') => void;
  records: Record[];
  volunteers: Volunteer[];
}

const images = Array.from({ length: 5 }, (_, i) => `https://picsum.photos/seed/${i + 1}/800/400`);

export const Dashboard: React.FC<DashboardProps> = ({ setView, records, volunteers }) => {
  const approvedRecords = useMemo(() => records.filter(r => r.status === ReportStatus.Approved), [records]);

  const stats = useMemo(() => {
    // Display stats for ALL records, not just approved ones.
    const recordStats = records.reduce((acc, record) => {
      acc.totalWorshippers += record.maleWorshippers + record.femaleWorshippers;
      acc.iftarMeals += record.iftarMealsActual;
      acc.quranStudents += record.maleStudents + record.femaleStudents;
      acc.dawahBeneficiaries += record.dawahBeneficiaries;
      return acc;
    }, { totalWorshippers: 0, iftarMeals: 0, quranStudents: 0, dawahBeneficiaries: 0 });

    const ageGroups = volunteers.reduce((acc, vol) => {
      if (vol.age < 20) acc.under20++;
      else if (vol.age < 30) acc.from20to30++;
      else if (vol.age < 40) acc.from30to40++;
      else acc.over40++;
      return acc;
    }, { under20: 0, from20to30: 0, from30to40: 0, over40: 0 });

    return { ...recordStats, ageGroups, totalVolunteers: volunteers.length };
  }, [records, volunteers]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="إجمالي المصلين" value={stats.totalWorshippers.toLocaleString()} />
        <StatCard title="وجبات الإفطار" value={stats.iftarMeals.toLocaleString()} />
        <StatCard title="طلاب وطالبات الحلقات" value={stats.quranStudents.toLocaleString()} />
        <StatCard title="المستفيدون من البرامج" value={stats.dawahBeneficiaries.toLocaleString()} />
        <StatCard title="إجمالي المتطوعين" value={stats.totalVolunteers.toLocaleString()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-primary mb-4">توزيع أعمار المتطوعين</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">أقل من 20 سنة</span>
              <span className="font-bold text-secondary">{stats.ageGroups.under20}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-secondary h-2 rounded-full" style={{ width: `${(stats.ageGroups.under20 / (stats.totalVolunteers || 1)) * 100}%` }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">20 - 30 سنة</span>
              <span className="font-bold text-secondary">{stats.ageGroups.from20to30}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-secondary h-2 rounded-full" style={{ width: `${(stats.ageGroups.from20to30 / (stats.totalVolunteers || 1)) * 100}%` }}></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">30 - 40 سنة</span>
              <span className="font-bold text-secondary">{stats.ageGroups.from30to40}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-secondary h-2 rounded-full" style={{ width: `${(stats.ageGroups.from30to40 / (stats.totalVolunteers || 1)) * 100}%` }}></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">أكبر من 40 سنة</span>
              <span className="font-bold text-secondary">{stats.ageGroups.over40}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-secondary h-2 rounded-full" style={{ width: `${(stats.ageGroups.over40 / (stats.totalVolunteers || 1)) * 100}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4 items-center justify-center">
          <button onClick={() => setView('recordForm')} className="w-full px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition">إضافة تقرير ميداني جديد</button>
          <button onClick={() => setView('volunteerForm')} className="w-full px-6 py-3 bg-secondary text-white font-bold rounded-lg hover:bg-opacity-90 transition">تسجيل متطوع جديد</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <ImageSlider images={images} />
      </div>
    </div>
  );
};
