
import { Mosque, Record, MaintenanceReport, ReportStatus } from '../types';

const ADMIN_PASSWORD = 'admin123';

let mosquesData: Mosque[] = [
  { id: 'm1', name: 'مسجد الراجحي الكبير', supervisorPassword: 'pass1' },
  { id: 'm2', name: 'جامع الأميرة سارة', supervisorPassword: 'pass2' },
  { id: 'm3', name: 'مسجد الملك فهد', supervisorPassword: 'pass3' },
];

let recordsData: Record[] = [
  { id: 'r1', mosqueId: 'm1', date: '2025-03-21', supervisorName: 'أحمد عبدالله', tarawihWorshippers: 1200, qiyamWorshippers: 800, fajrWorshippers: 300, iftarMeals: 1500, quranCircles: 10, quranStudents: 150, dawahPrograms: 5, dawahBeneficiaries: 500, itikafParticipants: 50, notes: 'الأمور تسير بشكل جيد', images: [], status: ReportStatus.Approved },
  { id: 'r2', mosqueId: 'm2', date: '2025-03-21', supervisorName: 'محمد خالد', tarawihWorshippers: 800, qiyamWorshippers: 500, fajrWorshippers: 200, iftarMeals: 900, quranCircles: 8, quranStudents: 100, dawahPrograms: 3, dawahBeneficiaries: 300, itikafParticipants: 20, notes: 'نحتاج المزيد من الدعم لوجبات الإفطار', images: [], status: ReportStatus.Pending },
];

let maintenanceReportsData: MaintenanceReport[] = [
  { id: 'mr1', mosqueId: 'm1', date: '2025-03-21', supervisorName: 'علي حسن', cleaningDone: true, maintenanceDone: true, needs: 'لا يوجد', status: ReportStatus.Approved },
];

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const mosqueApi = {
  getAdminPassword: () => ADMIN_PASSWORD,
  
  getAll: async (): Promise<{ mosques: Mosque[]; records: Record[]; maintenanceReports: MaintenanceReport[] }> => {
    await simulateDelay(500);
    console.log("Mock API: Fetching all data");
    return { 
      mosques: [...mosquesData], 
      records: [...recordsData], 
      maintenanceReports: [...maintenanceReportsData] 
    };
  },
  
  saveRecord: async (recordData: Omit<Record, 'id' | 'status'>): Promise<Record> => {
    await simulateDelay(700);
    const newRecord: Record = {
      ...recordData,
      id: `r${Date.now()}`,
      status: ReportStatus.Pending
    };
    recordsData.push(newRecord);
    console.log("Mock API: Saved new record", newRecord);
    return newRecord;
  },

  updateRecord: async (updatedRecord: Record): Promise<Record> => {
    await simulateDelay(600);
    const index = recordsData.findIndex(r => r.id === updatedRecord.id);
    if(index > -1) {
      recordsData[index] = updatedRecord;
      console.log("Mock API: Updated record", updatedRecord);
      return updatedRecord;
    }
    throw new Error("Record not found");
  },

  updateRecordStatus: async (recordId: string, status: ReportStatus): Promise<Record> => {
    await simulateDelay(300);
    const record = recordsData.find(r => r.id === recordId);
    if (record) {
      record.status = status;
      console.log(`Mock API: Updated status for ${recordId} to ${status}`);
      return record;
    }
    throw new Error("Record not found");
  },
  
  saveMaintenanceReport: async (reportData: Omit<MaintenanceReport, 'id' | 'status'>): Promise<MaintenanceReport> => {
    await simulateDelay(700);
    const newReport: MaintenanceReport = {
      ...reportData,
      id: `mr${Date.now()}`,
      status: ReportStatus.Pending
    };
    maintenanceReportsData.push(newReport);
    console.log("Mock API: Saved new maintenance report", newReport);
    return newReport;
  },

  updateMaintenanceReport: async (updatedReport: MaintenanceReport): Promise<MaintenanceReport> => {
    await simulateDelay(600);
    const index = maintenanceReportsData.findIndex(r => r.id === updatedReport.id);
    if(index > -1) {
      maintenanceReportsData[index] = updatedReport;
      console.log("Mock API: Updated maintenance report", updatedReport);
      return updatedReport;
    }
    throw new Error("Maintenance report not found");
  },
};
