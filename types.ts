
export interface Mosque {
  id: string;
  name: string;
  supervisorPassword?: string;
}

export enum ReportStatus {
  Pending = 'قيد المراجعة',
  Approved = 'معتمد',
  Rejected = 'مرفوض',
}

export interface Record {
  id: string;
  mosqueId: string;
  date: string; // YYYY-MM-DD
  supervisorName: string;
  tarawihWorshippers: number;
  qiyamWorshippers: number;
  fajrWorshippers: number;
  iftarMeals: number;
  quranCircles: number;
  quranStudents: number;
  dawahPrograms: number;
  dawahBeneficiaries: number;
  itikafParticipants: number;
  notes: string;
  images: string[]; // URLs or base64 strings
  status: ReportStatus;
}

export interface MaintenanceReport {
  id: string;
  mosqueId: string;
  date: string;
  supervisorName: string;
  cleaningDone: boolean;
  maintenanceDone: boolean;
  needs: string;
  status: ReportStatus; // Assuming maintenance also has a status
}

export type UserRole = 'supervisor' | 'admin';
