import React, { useMemo, useState } from 'react';
import { Record, ReportStatus } from '../types';
import { StatCard } from './StatCard';
import { ImageSlider } from './ImageSlider';
import { analyzeDataWithGemini } from '../services/geminiService';
import { Spinner } from './Spinner';

interface DashboardProps {
  setView: (view: 'recordForm' | 'recordList') => void;
  records: Record[];
}

const images = Array.from({ length: 5 }, (_, i) => `https://picsum.photos/seed/${i + 1}/800/400`);

export const Dashboard: React.FC<DashboardProps> = ({ setView, records }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approvedRecords = useMemo(() => records.filter(r => r.status === ReportStatus.Approved), [records]);

  const stats = useMemo(() => {
    // Display stats for ALL records, not just approved ones.
    return records.reduce((acc, record) => {
      acc.totalWorshippers += record.maleWorshippers + record.femaleWorshippers;
      acc.iftarMeals += record.iftarMealsActual;
      acc.quranStudents += record.maleStudents + record.femaleStudents;
      acc.dawahBeneficiaries += record.dawahBeneficiaries;
      return acc;
    }, { totalWorshippers: 0, iftarMeals: 0, quranStudents: 0, dawahBeneficiaries: 0 });
  }, [records]);

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    setAiAnalysis(null);
    try {
      // AI analysis should still use only approved records for data quality.
      const analysis = await analyzeDataWithGemini(approvedRecords);
      setAiAnalysis(analysis);
    } catch (err) {
      setError("حدث خطأ أثناء التحليل. يرجى المحاولة مرة أخرى.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="إجمالي المصلين" value={stats.totalWorshippers.toLocaleString()} />
        <StatCard title="وجبات الإفطار" value={stats.iftarMeals.toLocaleString()} />
        <StatCard title="طلاب وطالبات الحلقات" value={stats.quranStudents.toLocaleString()} />
        <StatCard title="المستفيدون من البرامج" value={stats.dawahBeneficiaries.toLocaleString()} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-4 items-center justify-center">
        <button onClick={() => setView('recordForm')} className="w-full md:w-auto px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition">إضافة تقرير ميداني جديد</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-primary mb-4">تحليل البيانات بالذكاء الاصطناعي</h2>
          <p className="text-gray-600 mb-4">احصل على ملخص تنفيذي، والمشاكل المتكررة، وتوصيات ذكية لتحسين الأداء بناءً على البيانات المعتمدة.</p>
          <button onClick={handleAiAnalysis} disabled={isAnalyzing} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:bg-gray-400">
            {isAnalyzing ? 'جاري التحليل...' : 'بدء التحليل الآن'}
          </button>
          {isAnalyzing && <div className="mt-4"><Spinner /></div>}
          {error && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}
          {aiAnalysis && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg whitespace-pre-wrap">
              <h3 className="font-bold text-lg mb-2">نتائج التحليل:</h3>
              <p className="text-gray-800">{aiAnalysis}</p>
            </div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <ImageSlider images={images} />
        </div>
      </div>
    </div>
  );
};