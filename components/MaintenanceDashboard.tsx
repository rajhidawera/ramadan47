
import React, { useState, useMemo } from 'react';
import { MaintenanceReport, Mosque, UserRole, ReportStatus } from '../types';

interface MaintenanceDashboardProps {
  reports: MaintenanceReport[];
  mosques: Mosque[];
  userRole: UserRole;
  onEdit: (report: MaintenanceReport) => void;
  onUpdateStatus: (id: string, newStatus: ReportStatus) => void;
}

export const MaintenanceDashboard: React.FC<MaintenanceDashboardProps> = ({ reports, mosques, userRole, onEdit, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const mosqueMap = useMemo(() => 
    mosques.reduce((acc, mosque) => {
      acc[mosque.id] = mosque.name;
      return acc;
    }, {} as Record<string, string>), 
  [mosques]);

  const filteredReports = useMemo(() => 
    reports
      .filter(report => 
        mosqueMap[report.mosqueId]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.supervisorName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [reports, searchTerm, mosqueMap]
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-4">سجل تقارير الصيانة والنظافة</h2>
      <input 
        type="text"
        placeholder="ابحث باسم المسجد أو المشرف..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المسجد</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المشرف</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">النظافة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الصيانة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReports.map(report => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap">{mosqueMap[report.mosqueId] || 'غير معروف'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{report.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{report.supervisorName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{report.cleaningDone ? '✅' : '❌'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{report.maintenanceDone ? '✅' : '❌'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {(userRole === 'admin' || report.status === ReportStatus.Pending) && (
                    <button onClick={() => onEdit(report)} className="text-indigo-600 hover:text-indigo-900">
                      تعديل / عرض التفاصيل
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
