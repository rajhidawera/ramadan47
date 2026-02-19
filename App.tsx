
import React, { useState, useEffect, useCallback } from 'react';
import { WelcomePage } from './components/WelcomePage';
import { Dashboard } from './components/Dashboard';
import { RecordForm } from './components/RecordForm';
import { MaintenanceForm } from './components/MaintenanceForm';
import { RecordList } from './components/RecordList';
import { MaintenanceDashboard } from './components/MaintenanceDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Toast } from './components/Toast';
import { Spinner } from './components/Spinner';
import { Header } from './components/Header';
import { Mosque, Record, MaintenanceReport, UserRole, ReportStatus } from './types';
import { mosqueApi } from './services/mosqueApi';

type View = 'welcome' | 'dashboard' | 'recordForm' | 'maintenanceForm' | 'recordList' | 'maintenanceList';
type ToastMessage = { id: number; message: string; type: 'success' | 'error'; };

const App: React.FC = () => {
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [view, setView] = useState<View>('welcome');
  const [userRole, setUserRole] = useState<UserRole>('supervisor');
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [maintenanceReports, setMaintenanceReports] = useState<MaintenanceReport[]>([]);
  
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);
  const [editingMaintenance, setEditingMaintenance] = useState<MaintenanceReport | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToasts(prev => [...prev, { id: Date.now(), message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.slice(1));
    }, 5000);
  };

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { mosques, records, maintenanceReports } = await mosqueApi.getAll();
      setMosques(mosques);
      setRecords(records);
      setMaintenanceReports(maintenanceReports);
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
  
  const handleFormSubmit = async () => {
    showToast("تم حفظ التقرير بنجاح، جاري تحديث البيانات...", 'success');
    setView('dashboard');
    setEditingRecord(null);
    setEditingMaintenance(null);
    await loadAllData();
  };
  
  const handleEditRecord = (record: Record) => {
    setEditingRecord(record);
    setView('recordForm');
  };

  const handleEditMaintenance = (report: MaintenanceReport) => {
    setEditingMaintenance(report);
    setView('maintenanceForm');
  }

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

  const handleAdminLogin = (password: string) => {
    if (password === mosqueApi.getAdminPassword()) {
      setUserRole('admin');
      setShowAdminModal(false);
      showToast('أهلاً بك أيها المسؤول', 'success');
    } else {
      showToast('كلمة المرور غير صحيحة', 'error');
    }
  };

  const renderContent = () => {
    if (view === 'welcome') {
      return <WelcomePage onEnter={handleEnterPlatform} />;
    }

    if (!isDataLoaded) {
      return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }

    switch (view) {
      case 'dashboard':
        return <Dashboard setView={setView} records={records} maintenanceReports={maintenanceReports} />;
      case 'recordForm':
        return <RecordForm mosques={mosques} onSubmit={handleFormSubmit} existingRecord={editingRecord} userRole={userRole} />;
      case 'maintenanceForm':
        return <MaintenanceForm mosques={mosques} onSubmit={handleFormSubmit} existingReport={editingMaintenance} />;
      case 'recordList':
        return <RecordList records={records} mosques={mosques} userRole={userRole} onEdit={handleEditRecord} onUpdateStatus={handleUpdateStatus} />;
      case 'maintenanceList':
        return <MaintenanceDashboard reports={maintenanceReports} mosques={mosques} userRole={userRole} onEdit={handleEditMaintenance} onUpdateStatus={() => {}} />;
      default:
        return <WelcomePage onEnter={handleEnterPlatform} />;
    }
  };

  return (
    <div className="bg-light-gray min-h-screen text-gray-800">
      {isLoading && <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"><Spinner /></div>}
      {view !== 'welcome' && <Header setView={setView} onAdminClick={() => setShowAdminModal(true)} userRole={userRole} />}
      <main className="p-4 md:p-8">
        {renderContent()}
      </main>
      {showAdminModal && <AdminLoginModal onClose={() => setShowAdminModal(false)} onLogin={handleAdminLogin} />}
      <div className="fixed bottom-4 left-4 z-50">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts(ts => ts.filter(t => t.id !== toast.id))} />
        ))}
      </div>
    </div>
  );
};

export default App;
