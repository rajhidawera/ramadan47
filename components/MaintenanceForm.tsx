
import React, { useState, useEffect } from 'react';
import { Mosque, MaintenanceReport } from '../types';
import { mosqueApi } from '../services/mosqueApi';
import { Spinner } from './Spinner';

interface MaintenanceFormProps {
  mosques: Mosque[];
  onSubmit: () => void;
  existingReport?: MaintenanceReport | null;
}

export const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ mosques, onSubmit, existingReport }) => {
  const [formData, setFormData] = useState<Omit<MaintenanceReport, 'id' | 'status'>>({
    mosqueId: '',
    date: new Date().toISOString().split('T')[0],
    supervisorName: '',
    cleaningDone: false,
    maintenanceDone: false,
    needs: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingReport) {
      setFormData({ ...existingReport });
    }
  }, [existingReport]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if(existingReport) {
        await mosqueApi.updateMaintenanceReport({...formData, id: existingReport.id, status: existingReport.status });
      } else {
        await mosqueApi.saveMaintenanceReport(formData);
      }
      onSubmit();
    } catch (err) {
      setError("حدث خطأ أثناء حفظ التقرير.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-primary mb-6">{existingReport ? 'تعديل تقرير الصيانة' : 'إضافة تقرير صيانة جديد'}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="mosqueId" className="block text-sm font-medium text-gray-700">اختر المسجد</label>
          <select id="mosqueId" name="mosqueId" value={formData.mosqueId} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
            <option value="">-- اختر --</option>
            {mosques.map(mosque => <option key={mosque.id} value={mosque.id}>{mosque.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">تاريخ التقرير</label>
          <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
        </div>
      </div>
      
      <div>
        <label htmlFor="supervisorName" className="block text-sm font-medium text-gray-700">اسم مشرف الصيانة</label>
        <input type="text" id="supervisorName" name="supervisorName" value={formData.supervisorName} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
      </div>

      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input id="cleaningDone" name="cleaningDone" type="checkbox" checked={formData.cleaningDone} onChange={handleChange} className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded" />
          </div>
          <div className="mr-3 text-sm">
            <label htmlFor="cleaningDone" className="font-medium text-gray-700">هل تمت أعمال النظافة؟</label>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input id="maintenanceDone" name="maintenanceDone" type="checkbox" checked={formData.maintenanceDone} onChange={handleChange} className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded" />
          </div>
          <div className="mr-3 text-sm">
            <label htmlFor="maintenanceDone" className="font-medium text-gray-700">هل تمت أعمال الصيانة؟</label>
          </div>
        </div>
      </div>
      
      <div>
        <label htmlFor="needs" className="block text-sm font-medium text-gray-700">الاحتياجات اللوجستية والملاحظات</label>
        <textarea id="needs" name="needs" value={formData.needs} onChange={handleChange} rows={4} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"></textarea>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      
      <div className="flex justify-center">
        <button type="submit" disabled={isLoading} className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition disabled:bg-gray-400">
          {isLoading ? <Spinner /> : (existingReport ? 'حفظ التعديلات' : 'إرسال التقرير')}
        </button>
      </div>
    </form>
  );
};
