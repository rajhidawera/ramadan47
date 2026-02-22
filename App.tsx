import React, { useState, useEffect, useCallback } from 'react';
import { WelcomePage } from './components/WelcomePage';
import { Dashboard } from './components/Dashboard';
import { RecordForm } from './components/RecordForm';
import { RecordList } from './components/RecordList';
import { DailyReport } from './components/DailyReport';
import { Toast } from './components/Toast';
import { Spinner } from './components/Spinner';
import { Header } from './components/Header';
import { VolunteerForm } from './components/VolunteerForm';
import { Mosque, Record, UserRole, ReportStatus, Day, Volunteer } from './types';
import { mosqueApi } from './services/mosqueApi';

type View = 'welcome' | 'dashboard' | 'recordForm' | 'recordList' | 'dailyReport' | 'volunteerForm';
type ToastMessage = { id: number; message: string; type: 'success' | 'error'; };

const App: React.FC = () => {
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [view, setView] = useState<View>('welcome');
  const [userRole, setUserRole] = useState<UserRole>('admin'); // Default to admin
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [days, setDays] = useState<Day[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToasts(prev => [...prev, { id: Date.now(), message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.slice(1));
    }, 5000);
  };

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { mosques, records, days, volunteers } = await mosqueApi.getAll();
      setMosques(mosques);
      setRecords(records);
      setDays(days);
      setVolunteers(volunteers);
      setIsDataLoaded(true);
      return true;
    } catch (error) {
      console.error("Failed to load data", error);
      showToast("فشل تحميل البيانات من الخادم", 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleEnterPlatform = async () => {
    const success = await loadAllData();
    if (success) {
      setView('dashboard');
    }
  };
  
  const handleFormSubmit = async (message: string) => {
    showToast(message, 'success');
    // We don't change view, but we reload data to keep state consistent
    await loadAllData();
  };
  
  const handleEditRecord = (record: Record) => {
    setEditingRecord(record);
    setView('recordForm');
  };

  const handleUpdateStatus = async (id: string, newStatus: ReportStatus) => {
    setIsLoading(true);
    try {
      await mosqueApi.updateRecordStatus(id, newStatus);
      showToast('تم تحديث حالة التقرير بنجاح', 'success');
      await loadAllData();
    } catch(e) {
      showToast('فشل تحديث حالة التقرير', 'error');
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleReturnToDashboard = () => {
    setView('dashboard');
    setEditingRecord(null);
  }

  const renderContent = () => {
    if (view === 'welcome') {
      return <WelcomePage onEnter={handleEnterPlatform} />;
    }

    if (!isDataLoaded) {
      return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }

    switch (view) {
      case 'dashboard':
        return <Dashboard setView={setView} records={records} volunteers={volunteers} />;
      case 'recordForm':
        return <RecordForm 
                  mosques={mosques} 
                  days={days}
                  records={records}
                  onSubmit={handleFormSubmit} 
                  onFinish={handleReturnToDashboard}
                  existingRecord={editingRecord} 
                  userRole={userRole} 
                />;
      case 'recordList':
        return <RecordList records={records} mosques={mosques} userRole={userRole} onEdit={handleEditRecord} onUpdateStatus={handleUpdateStatus} />;
      case 'dailyReport':
        return <DailyReport records={records} days={days} />;
      case 'volunteerForm':
        return <VolunteerForm onSubmit={handleFormSubmit} onFinish={handleReturnToDashboard} />;
      default:
        return <WelcomePage onEnter={handleEnterPlatform} />;
    }
  };

  return (
    <div className="bg-light-gray min-h-screen text-gray-800">
      {isLoading && <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"><Spinner /></div>}
      {view !== 'welcome' && <Header setView={setView} />}
      <main className="p-4 md:p-8">
        {renderContent()}
      </main>
      <div className="fixed bottom-4 left-4 z-50">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts(ts => ts.filter(t => t.id !== toast.id))} />
        ))}
      </div>
    </div>
  );
};

export default App;