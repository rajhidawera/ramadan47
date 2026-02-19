export interface Mosque {
  id: string;
  name: string;
}

export interface Day {
  code: string;
  label: string;
}

export enum ReportStatus {
  Pending = 'قيد المراجعة',
  Approved = 'معتمد',
  Rejected = 'مرفوض',
}

export interface Record {
  id: string;
  mosqueId: string;
  date: string; // Hijri string
  dayCode: string;

  // الصلاة (Prayer)
  maleWorshippers: number;
  femaleWorshippers: number;

  // الافطار (Iftar)
  iftarMealsActual: number;

  // السقيا (Water)
  waterCartons: number;

  // الضيافة (Hospitality)
  hospitalityBeneficiaries: number;

  // التعليم وحلقات القرآن الكريم (Quran Education)
  maleStudents: number;
  maleStudentPages: number;
  femaleStudents: number;
  femaleStudentPages: number;

  // الانشطة المجتمعية (Community Activities)
  volunteers: number;
  competitions: number;
  nurseryChildren: number;
  communityProgramName: string;
  communityProgramBeneficiaries: number;
  communityProgramDescription: string;

  // الكلمات الدعوية (Dawah Talks)
  maleDawahTalks: number;
  femaleDawahTalks: number;
  dawahBeneficiaries: number;

  // الاعتكاف والسحور (Itikaf & Suhoor)
  maleItikafParticipants: number;
  maleSuhoorMeals: number;
  femaleItikafParticipants: number;
  femaleSuhoorMeals: number;

  // General
  supervisorsCount: number;
  notes: string;
  images: string[];
  status: ReportStatus;
}


export type UserRole = 'supervisor' | 'admin';