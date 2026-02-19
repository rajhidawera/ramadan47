import React, { useState, useMemo } from 'react';
import { Record, Day, ReportStatus } from '../types';

// A small component for a single statistic item
const ReportStatItem: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex justify-between items-baseline py-3 border-b border-gray-200 last:border-b-0">
    <p className="text-gray-600">{label}</p>
    <p className="text-xl font-bold text-primary">{value.toLocaleString()}</p>
  </div>
);

// A component for a category card
const ReportCategoryCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-bold text-secondary mb-4 border-b pb-2">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

export const DailyReport: React.FC<{ records: Record[]; days: Day[] }> = ({ records, days }) => {
  const [selectedDayCode, setSelectedDayCode] = useState('');

  const reportData = useMemo(() => {
    if (!selectedDayCode) return null;

    const recordsForDay = records.filter(
      r => r.dayCode === selectedDayCode
    );

    if (recordsForDay.length === 0) {
      return { isEmpty: true, count: 0 };
    }

    const initialStats = {
      maleWorshippers: 0, femaleWorshippers: 0,
      iftarMealsActual: 0, waterCartons: 0, hospitalityBeneficiaries: 0,
      maleStudents: 0, maleStudentPages: 0, femaleStudents: 0, femaleStudentPages: 0,
      volunteers: 0, competitions: 0, nurseryChildren: 0, communityProgramBeneficiaries: 0,
      maleDawahTalks: 0, femaleDawahTalks: 0, dawahBeneficiaries: 0,
      maleItikafParticipants: 0, maleSuhoorMeals: 0, femaleItikafParticipants: 0, femaleSuhoorMeals: 0,
      supervisorsCount: 0,
    };
    
    type StatKeys = keyof typeof initialStats;

    const aggregated = recordsForDay.reduce((acc, r) => {
      (Object.keys(initialStats) as StatKeys[]).forEach(key => {
        if (typeof r[key] === 'number') {
          acc[key] += r[key];
        }
      });
      return acc;
    }, initialStats);

    return { ...aggregated, isEmpty: false, count: recordsForDay.length };

  }, [selectedDayCode, records]);


  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-primary mb-6">التقرير اليومي المجمع</h2>
      
      <div className="mb-8 max-w-md mx-auto">
        <label htmlFor="day-selector" className="block text-sm font-medium text-gray-700 mb-1">اختر اليوم لعرض التقرير:</label>
        <select
          id="day-selector"
          value={selectedDayCode}
          onChange={e => setSelectedDayCode(e.target.value)}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-lg"
        >
          <option value="">-- يرجى اختيار اليوم --</option>
          {days.map(day => <option key={day.code} value={day.code}>{day.label}</option>)}
        </select>
      </div>

      <div className="border-t pt-8">
        {!selectedDayCode && (
          <p className="text-center text-gray-500 text-lg">الرجاء اختيار يوم لعرض التقرير.</p>
        )}
        {reportData && selectedDayCode && reportData.isEmpty && (
           <p className="text-center text-gray-500 text-lg">لا توجد تقارير لهذا اليوم.</p>
        )}
        {reportData && !reportData.isEmpty && (
          <>
            <p className="text-center text-gray-600 mb-6">
              يعرض هذا التقرير البيانات المجمعة من <strong>{reportData.count}</strong> تقارير لليوم المحدد.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-light-gray p-6 rounded-lg">
              
              <ReportCategoryCard title="الصلاة">
                 <ReportStatItem label="المصلين (رجال)" value={reportData.maleWorshippers} />
                 <ReportStatItem label="المصلين (نساء)" value={reportData.femaleWorshippers} />
                 <ReportStatItem label="الإجمالي" value={reportData.maleWorshippers + reportData.femaleWorshippers} />
              </ReportCategoryCard>

              <ReportCategoryCard title="الإفطار والضيافة">
                 <ReportStatItem label="وجبات الإفطار" value={reportData.iftarMealsActual} />
                 <ReportStatItem label="كراتين الماء" value={reportData.waterCartons} />
                 <ReportStatItem label="مستفيدي الضيافة" value={reportData.hospitalityBeneficiaries} />
              </ReportCategoryCard>
              
              <ReportCategoryCard title="التعليم وحلقات القرآن">
                 <ReportStatItem label="الطلاب" value={reportData.maleStudents} />
                 <ReportStatItem label="أوجه الطلاب" value={reportData.maleStudentPages} />
                 <ReportStatItem label="الطالبات" value={reportData.femaleStudents} />
                 <ReportStatItem label="أوجه الطالبات" value={reportData.femaleStudentPages} />
              </ReportCategoryCard>

              <ReportCategoryCard title="الأنشطة المجتمعية">
                 <ReportStatItem label="المتطوعون" value={reportData.volunteers} />
                 <ReportStatItem label="المسابقات" value={reportData.competitions} />
                 <ReportStatItem label="أطفال الحضانة" value={reportData.nurseryChildren} />
                 <ReportStatItem label="مستفيدي البرامج" value={reportData.communityProgramBeneficiaries} />
              </ReportCategoryCard>

              <ReportCategoryCard title="الكلمات الدعوية">
                 <ReportStatItem label="الكلمات (رجال)" value={reportData.maleDawahTalks} />
                 <ReportStatItem label="الكلمات (نساء)" value={reportData.femaleDawahTalks} />
                 <ReportStatItem label="إجمالي المستفيدين" value={reportData.dawahBeneficiaries} />
              </ReportCategoryCard>

              <ReportCategoryCard title="الاعتكاف والسحور">
                 <ReportStatItem label="المعتكفين" value={reportData.maleItikafParticipants} />
                 <ReportStatItem label="وجبات السحور (رجال)" value={reportData.maleSuhoorMeals} />
                 <ReportStatItem label="المعتكفات" value={reportData.femaleItikafParticipants} />
                 <ReportStatItem label="وجبات السحور (نساء)" value={reportData.femaleSuhoorMeals} />
              </ReportCategoryCard>

            </div>
          </>
        )}
      </div>
    </div>
  );
};