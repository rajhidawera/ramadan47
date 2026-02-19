
import React, { useState, useEffect } from 'react';
import { Mosque, Record, ReportStatus, UserRole } from '../types';
import { mosqueApi } from '../services/mosqueApi';
import { Spinner } from './Spinner';

interface RecordFormProps {
  mosques: Mosque[];
  onSubmit: () => void;
  existingRecord?: Record | null;
  userRole: UserRole;
}

export const RecordForm: React.FC<RecordFormProps> = ({ mosques, onSubmit, existingRecord, userRole }) => {
  const [formData, setFormData] = useState<Omit<Record, 'id' | 'status'>>({
    mosqueId: '',
    date: new Date().toISOString().split('T')[0],
    supervisorName: '',
    tarawihWorshippers: 0,
    qiyamWorshippers: 0,
    fajrWorshippers: 0,
    iftarMeals: 0,
    quranCircles: 0,
    quranStudents: 0,
    dawahPrograms: 0,
    dawahBeneficiaries: 0,
    itikafParticipants: 0,
    notes: '',
    images: [],
  });
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingRecord) {
      setFormData({ ...existingRecord });
    }
  }, [existingRecord]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setFormData(prev => ({ ...prev, [name]: isNumber ? parseInt(value) || 0 : value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (userRole === 'supervisor') {
      const selectedMosque = mosques.find(m => m.id === formData.mosqueId);
      if (selectedMosque?.supervisorPassword !== password) {
        setError("كلمة مرور المسجد غير صحيحة.");
        setIsLoading(false);
        return;
      }
    }

    try {
      if (existingRecord) {
        await mosqueApi.updateRecord({ ...formData, id: existingRecord.id, status: existingRecord.status });
      } else {
        await mosqueApi.saveRecord(formData);
      }
      onSubmit();
    } catch (err) {
      setError("حدث خطأ أثناء حفظ التقرير.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = [
    { name: 'tarawihWorshippers', label: 'عدد المصلين (التراويح)' },
    { name: 'qiyamWorshippers', label: 'عدد المصلين (القيام)' },
    { name: 'fajrWorshippers', label: 'عدد المصلين (الفجر)' },
    { name: 'iftarMeals', label: 'عدد وجبات الإفطار' },
    { name: 'quranCircles', label: 'عدد الحلقات القرآنية' },
    { name: 'quranStudents', label: 'عدد طلاب الحلقات' },
    { name: 'dawahPrograms', label: 'عدد البرامج الدعوية' },
    { name: 'dawahBeneficiaries', label: 'عدد المستفيدين من البرامج' },
    { name: 'itikafParticipants', label: 'عدد المعتكفين' },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-primary mb-6">{existingRecord ? 'تعديل التقرير الميداني' : 'إضافة تقرير ميداني جديد'}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <div>
          <label htmlFor="supervisorName" className="block text-sm font-medium text-gray-700">اسم المشرف</label>
          <input type="text" id="supervisorName" name="supervisorName" value={formData.supervisorName} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
        </div>
      </div>
      
      <hr />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {formFields.map(field => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.label}</label>
            <input type="number" id={field.name} name={field.name} value={(formData as any)[field.name]} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
          </div>
        ))}
      </div>
      
      <hr />

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">ملاحظات إضافية</label>
        <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={4} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"></textarea>
      </div>

      {userRole === 'supervisor' && !existingRecord && (
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">كلمة مرور المسجد</label>
          <input type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
        </div>
      )}

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      
      <div className="flex justify-center">
        <button type="submit" disabled={isLoading} className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition disabled:bg-gray-400">
          {isLoading ? <Spinner /> : (existingRecord ? 'حفظ التعديلات' : 'إرسال التقرير')}
        </button>
      </div>
    </form>
  );
};
