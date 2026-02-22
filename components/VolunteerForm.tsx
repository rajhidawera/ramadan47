import React, { useState } from 'react';
import { Volunteer } from '../types';
import { mosqueApi } from '../services/mosqueApi';

interface VolunteerFormProps {
  onSubmit: (message: string) => void;
  onFinish: () => void;
}

export const VolunteerForm: React.FC<VolunteerFormProps> = ({ onSubmit, onFinish }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<Volunteer, 'id'>>({
    fullName: '',
    nationality: '',
    idNumber: '',
    profession: '',
    age: 0,
    workOrStudyPlace: '',
    idExpiryStatus: 'سارية',
    requiresSponsorApproval: 'لا',
    phoneNumber: '',
    relativePhoneNumber: '',
    email: '',
    volunteerField: '',
    directSupervisor: '',
    dailyHours: 0,
    recordVolunteerHours: 'نعم',
    futureRecommendation: 'نعم',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'dailyHours' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await mosqueApi.saveVolunteer(formData);
      onSubmit('تم تسجيل المتطوع بنجاح');
      onFinish();
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء حفظ البيانات');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-primary">نموذج تسجيل متطوع جديد</h2>
        <button onClick={onFinish} className="text-gray-500 hover:text-gray-700">إلغاء</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-secondary border-r-4 border-secondary pr-2">المعلومات الشخصية</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الرباعي</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الجنسية</label>
                <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">العمر</label>
                <input type="number" name="age" value={formData.age || ''} onChange={handleChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهوية / الإقامة</label>
              <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">حالة انتهاء الهوية</label>
                <select name="idExpiryStatus" value={formData.idExpiryStatus} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary">
                  <option value="سارية">سارية</option>
                  <option value="منتهية">منتهية</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">موافقة الكفيل</label>
                <select name="requiresSponsorApproval" value={formData.requiresSponsorApproval} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary">
                  <option value="لا">لا يتطلب</option>
                  <option value="نعم">يتطلب</option>
                </select>
              </div>
            </div>
          </div>

          {/* Professional & Contact */}
          <div className="space-y-4">
            <h3 className="font-bold text-secondary border-r-4 border-secondary pr-2">المهنة والتواصل</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-7 Arabic-700 mb-1">المهنة</label>
              <input type="text" name="profession" value={formData.profession} onChange={handleChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">جهة العمل أو الدراسة</label>
              <input type="text" name="workOrStudyPlace" value={formData.workOrStudyPlace} onChange={handleChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم الجوال</label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم جوال قريب</label>
              <input type="tel" name="relativePhoneNumber" value={formData.relativePhoneNumber} onChange={handleChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary" />
            </div>
          </div>
        </div>

        {/* Volunteering Info */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-bold text-secondary border-r-4 border-secondary pr-2">معلومات التطوع</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المجال التطوعي</label>
              <input type="text" name="volunteerField" value={formData.volunteerField} onChange={handleChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المشرف المباشر</label>
              <input type="text" name="directSupervisor" value={formData.directSupervisor} onChange={handleChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">عدد الساعات اليومية المتوقعة</label>
              <input type="number" name="dailyHours" value={formData.dailyHours || ''} onChange={handleChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تسجيل الساعات</label>
                <select name="recordVolunteerHours" value={formData.recordVolunteerHours} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary">
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">توصية مستقبلية</label>
                <select name="futureRecommendation" value={formData.futureRecommendation} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary">
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات إضافية</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"></textarea>
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <button type="button" onClick={onFinish} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">إلغاء</button>
          <button type="submit" disabled={isLoading} className="px-10 py-2 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition disabled:bg-gray-400">
            {isLoading ? 'جاري الحفظ...' : 'تسجيل المتطوع'}
          </button>
        </div>
      </form>
    </div>
  );
};
