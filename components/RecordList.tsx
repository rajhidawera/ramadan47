
import React, { useState, useMemo } from 'react';
import { Record, Mosque, UserRole, ReportStatus } from '../types';

interface RecordListProps {
  records: Record[];
  mosques: Mosque[];
  userRole: UserRole;
  onEdit: (record: Record) => void;
  onUpdateStatus: (id: string, newStatus: ReportStatus) => void;
}

const getStatusColor = (status: ReportStatus) => {
  switch (status) {
    case ReportStatus.Approved:
      return 'bg-green-100 text-green-800';
    case ReportStatus.Rejected:
      return 'bg-red-100 text-red-800';
    case ReportStatus.Pending:
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
};

export const RecordList: React.FC<RecordListProps> = ({ records, mosques, userRole, onEdit, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const mosqueMap = useMemo(() => 
    mosques.reduce((acc, mosque) => {
      acc[mosque.id] = mosque.name;
      return acc;
// Fix: Changed Record<string, string> to { [key: string]: string } to avoid conflict with the imported 'Record' type.
    }, {} as { [key: string]: string }), 
  [mosques]);
  
  const filteredRecords = useMemo(() => 
    records
      .filter(record => 
        mosqueMap[record.mosqueId]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.supervisorName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [records, searchTerm, mosqueMap]
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-4">سجل التقارير الميدانية</h2>
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
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRecords.map(record => (
              <tr key={record.id}>
                <td className="px-6 py-4 whitespace-nowrap">{mosqueMap[record.mosqueId] || 'غير معروف'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{record.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{record.supervisorName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {userRole === 'admin' ? (
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button onClick={() => onUpdateStatus(record.id, ReportStatus.Approved)} className="text-green-600 hover:text-green-900">اعتماد</button>
                      <button onClick={() => onUpdateStatus(record.id, ReportStatus.Rejected)} className="text-red-600 hover:text-red-900">رفض</button>
                      <button onClick={() => onEdit(record)} className="text-indigo-600 hover:text-indigo-900">تعديل</button>
                    </div>
                  ) : (
                    record.status === ReportStatus.Pending && (
                      <button onClick={() => onEdit(record)} className="text-indigo-600 hover:text-indigo-900">تعديل</button>
                    )
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
