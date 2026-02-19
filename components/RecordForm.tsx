import React, { useState, useEffect, useMemo } from 'react';
import { Mosque, Record, ReportStatus, UserRole, Day } from '../types';
import { mosqueApi } from '../services/mosqueApi';
import { Spinner } from './Spinner';

interface RecordFormProps {
  mosques: Mosque[];
  days: Day[];
  records: Record[];
  onSubmit: (message: string) => void;
  onFinish: () => void;
  existingRecord?: Record | null;
  userRole: UserRole;
}

const newRecordTemplate: Omit<Record, 'id'> = {
  mosqueId: '',
  date: '',
  dayCode: '',
  maleWorshippers: 0,
  femaleWorshippers: 0,
  iftarMealsActual: 0,
  waterCartons: 0,
  hospitalityBeneficiaries: 0,
  maleStudents: 0,
  maleStudentPages: 0,
  femaleStudents: 0,
  femaleStudentPages: 0,
  volunteers: 0,
  competitions: 0,
  nurseryChildren: 0,
  communityProgramName: '',
  communityProgramBeneficiaries: 0,
  communityProgramDescription: '',
  maleDawahTalks: 0,
  femaleDawahTalks: 0,
  dawahBeneficiaries: 0,
  maleItikafParticipants: 0,
  maleSuhoorMeals: 0,
  femaleItikafParticipants: 0,
  femaleSuhoorMeals: 0,
  supervisorsCount: 0,
  notes: '',
  images: [],
  status: ReportStatus.Pending,
};

const activityFields: { [key: string]: { label: string; fields: (keyof Record)[] } } = {
  'prayer': { label: 'الصلاة', fields: ['maleWorshippers', 'femaleWorshippers'] },
  'iftar': { label: 'الإفطار', fields: ['iftarMealsActual'] },
  'suqia': { label: 'السقيا', fields: ['waterCartons'] },
  'hospitality': { label: 'الضيافة', fields: ['hospitalityBeneficiaries'] },
  'quran': { label: 'التعليم وحلقات القرآن', fields: ['maleStudents', 'maleStudentPages', 'femaleStudents', 'femaleStudentPages'] },
  'community': { label: 'الأنشطة المجتمعية', fields: ['volunteers', 'competitions', 'nurseryChildren', 'communityProgramName', 'communityProgramBeneficiaries', 'communityProgramDescription'] },
  'dawah': { label: 'الكلمات الدعوية', fields: ['maleDawahTalks', 'femaleDawahTalks', 'dawahBeneficiaries'] },
  'itikaf': { label: 'الاعتكاف والسحور', fields: ['maleItikafParticipants', 'maleSuhoorMeals', 'femaleItikafParticipants', 'femaleSuhoorMeals'] },
  'general': { label: 'بيانات عامة', fields: ['supervisorsCount'] },
};

const fieldLabels: { [key in keyof Record]?: string } = {
  maleWorshippers: 'عدد المصلين (رجال)',
  femaleWorshippers: 'عدد المصلين (نساء)',
  iftarMealsActual: 'وجبات الافطار',
  waterCartons: 'عدد كراتين الماء',
  hospitalityBeneficiaries: 'عدد مستفيدي الضيافة',
  maleStudents: 'عدد الطلاب',
  maleStudentPages: 'عدد أوجه الطلاب',
  femaleStudents: 'عدد الطالبات',
  femaleStudentPages: 'عدد أوجه الطالبات',
  volunteers: 'عدد المتطوعين',
  competitions: 'عدد المسابقات',
  nurseryChildren: 'عدد أطفال الحضانة',
  communityProgramName: 'اسم البرنامج المجتمعي',
  communityProgramBeneficiaries: 'عدد المستفيدين من البرنامج',
  communityProgramDescription: 'وصف البرنامج',
  maleDawahTalks: 'عدد الكلمات (رجال)',
  femaleDawahTalks: 'عدد الكلمات (نساء)',
  dawahBeneficiaries: 'عدد المستفيدين من الكلمات',
  maleItikafParticipants: 'عدد المعتكفين (رجال)',
  maleSuhoorMeals: 'عدد وجبات السحور (رجال)',
  femaleItikafParticipants: 'عدد المعتكفات (نساء)',
  femaleSuhoorMeals: 'عدد وجبات السحور (نساء)',
  supervisorsCount: 'عدد المشرفين',
};


export const RecordForm: React.FC<RecordFormProps> = ({ mosques, days, records, onSubmit, onFinish, existingRecord, userRole }) => {
  const [step, setStep] = useState(1);
  const [selectedDayCode, setSelectedDayCode] = useState('');
  const [selectedMosqueId, setSelectedMosqueId] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  
  const [currentRecord, setCurrentRecord] = useState<Record | Omit<Record, 'id'>>(newRecordTemplate);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Effect to load existing record when day and mosque are selected
  useEffect(() => {
    if (selectedDayCode && selectedMosqueId) {
      const foundRecord = records.find(r => r.dayCode === selectedDayCode && r.mosqueId === selectedMosqueId);
      if (foundRecord) {
        setCurrentRecord(foundRecord);
      } else {
        const selectedDay = days.find(d => d.code === selectedDayCode);
        setCurrentRecord({
          ...newRecordTemplate,
          dayCode: selectedDayCode,
          date: selectedDay?.label || '',
          mosqueId: selectedMosqueId,
        });
      }
      setStep(3); // Move to activity selection
    }
  }, [selectedDayCode, selectedMosqueId, records, days]);
  
  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDayCode(e.target.value);
    setStep(2);
  };

  const handleMosqueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMosqueId(e.target.value);
  };
  
  const handleActivitySelect = (activityKey: string) => {
    setSelectedActivity(activityKey);
    setStep(4);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setCurrentRecord(prev => ({ ...prev, [name]: isNumber ? parseInt(value) || 0 : value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if ('id' in currentRecord) {
        await mosqueApi.updateRecord(currentRecord as Record);
      } else {
        await mosqueApi.saveRecord(currentRecord as Omit<Record, 'id'>);
      }
      onSubmit(`تم حفظ بيانات "${activityFields[selectedActivity!].label}" بنجاح.`);
      setSelectedActivity(null);
      setStep(3); // Go back to activity selection
    } catch (err) {
      setError("حدث خطأ أثناء حفظ التقرير.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <label htmlFor="dayCode" className="block text-sm font-medium text-gray-700">1. حدد اليوم</label>
            <select id="dayCode" name="dayCode" value={selectedDayCode} onChange={handleDayChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
              <option value="">-- اختر اليوم --</option>
              {days.map(day => <option key={day.code} value={day.code}>{day.label}</option>)}
            </select>
          </div>
        );
      case 2:
         return (
          <div>
            <label htmlFor="mosqueId" className="block text-sm font-medium text-gray-700">2. حدد الموقع</label>
            <select id="mosqueId" name="mosqueId" value={selectedMosqueId} onChange={handleMosqueChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
              <option value="">-- اختر المسجد --</option>
              {mosques.map(mosque => <option key={mosque.id} value={mosque.id}>{mosque.name}</option>)}
            </select>
          </div>
        );
       case 3:
        return (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">3. اختر النشاط لإدخال بياناته</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(activityFields).map(([key, {label}]) => (
                      <button type="button" key={key} onClick={() => handleActivitySelect(key)} className="p-4 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition text-center">
                          {label}
                      </button>
                  ))}
              </div>
            </div>
        )
      case 4:
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">4. تعبئة بيانات نشاط: {activityFields[selectedActivity!].label}</h3>
            {activityFields[selectedActivity!]?.fields.map(fieldName => {
                const fieldType = typeof newRecordTemplate[fieldName] === 'string' ? 'text' : 'number';
                const isTextarea = fieldName.toString().includes('Description');

                if (isTextarea) {
                  return (
                    <div key={fieldName}>
                        <label htmlFor={fieldName as string} className="block text-sm font-medium text-gray-700">{fieldLabels[fieldName]}</label>
                        <textarea id={fieldName as string} name={fieldName as string} value={(currentRecord as any)[fieldName]} onChange={handleChange} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"></textarea>
                    </div>
                  )
                }

                return (
                  <div key={fieldName}>
                      <label htmlFor={fieldName as string} className="block text-sm font-medium text-gray-700">{fieldLabels[fieldName]}</label>
                      <input type={fieldType} id={fieldName as string} name={fieldName as string} value={(currentRecord as any)[fieldName]} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                  </div>
                )
            })}
             <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">ملاحظات (اختياري)</label>
              <textarea id="notes" name="notes" value={currentRecord.notes} onChange={handleChange} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"></textarea>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div className="flex items-center justify-between pt-4">
                <button type="button" onClick={() => { setSelectedActivity(null); setStep(3); }} className="px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition">
                    الرجوع للأنشطة
                </button>
                <button type="submit" disabled={isLoading} className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition disabled:bg-gray-400">
                    {isLoading ? <Spinner /> : 'حفظ بيانات النشاط'}
                </button>
            </div>
          </form>
        )
      default: return null;
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-primary mb-6">إدخال التقرير الميداني</h2>
      
      <div className="space-y-6">
        {step > 1 && (
            <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
              <p><strong>اليوم:</strong> {days.find(d => d.code === selectedDayCode)?.label}</p>
              {step > 2 && <p><strong>المسجد:</strong> {mosques.find(m => m.id === selectedMosqueId)?.name}</p>}
            </div>
        )}
        {renderStep()}
      </div>

       <div className="mt-8 border-t pt-4 flex justify-center">
            <button onClick={onFinish} className="px-8 py-2 bg-secondary text-white font-bold rounded-lg hover:bg-opacity-90 transition">
                الانتهاء والعودة للوحة التحكم
            </button>
       </div>
    </div>
  );
};