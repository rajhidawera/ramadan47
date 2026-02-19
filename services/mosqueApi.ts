import { Mosque, Record, ReportStatus, Day } from '../types';

const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwv98UQDs8EOoRoLPPbILI9uI_HJsdzK3iOtrQu-M_OblJpViJ_c5h4msOrxZgPAWzfLg/exec';
const ADMIN_PASSWORD = 'admin123';

// Mapper to convert API mosque data to app's Mosque type
const mapApiMosqueToAppMosque = (apiMosque: any): Mosque => ({
  id: apiMosque.mosque_code,
  name: apiMosque.المسجد,
});

// Mapper to convert API day data to app's Day type
const mapApiDayToAppDay = (apiDay: any): Day => ({
  code: apiDay.code_day,
  label: apiDay.label,
});

// Mapper to convert API report data to app's Record type
const mapApiRecordToAppRecord = (apiRecord: any): Record => {
    const statusMap: { [key: string]: ReportStatus } = {
        'معتمد': ReportStatus.Approved,
        'مرفوض': ReportStatus.Rejected,
        'قيد المراجعة': ReportStatus.Pending,
    };
    
    return {
        id: apiRecord.record_id,
        mosqueId: apiRecord.mosque_code,
        date: apiRecord.تاريخ_هجري || new Date().toISOString().split('T')[0],
        dayCode: apiRecord.code_day,
        maleWorshippers: Number(apiRecord.عدد_المصلين_رجال) || 0,
        femaleWorshippers: Number(apiRecord.عدد_المصلين_نساء) || 0,
        iftarMealsActual: Number(apiRecord.عدد_وجبات_الافطار_فعلي) || 0,
        waterCartons: Number(apiRecord.عدد_كراتين_ماء) || 0,
        hospitalityBeneficiaries: Number(apiRecord.عدد_مستفيدي_الضيافة) || 0,
        maleStudents: Number(apiRecord.عدد_طلاب_الحلقات) || 0,
        maleStudentPages: Number(apiRecord.عدد_الاوجه_طلاب) || 0,
        femaleStudents: Number(apiRecord.عدد_طالبات_الحلقات) || 0,
        femaleStudentPages: Number(apiRecord.عدد_الاوجه_طالبات) || 0,
        volunteers: Number(apiRecord.عدد_المتطوعين) || 0,
        competitions: Number(apiRecord.عدد_المسابقات) || 0,
        nurseryChildren: Number(apiRecord.عدد_اطفال_الحضانة) || 0,
        communityProgramName: apiRecord.البرنامج_المجتمعي || '',
        communityProgramBeneficiaries: Number(apiRecord.عدد_المستفيدين) || 0,
        communityProgramDescription: apiRecord.وصف_البرنامج || '',
        maleDawahTalks: Number(apiRecord.عدد_الكلمات_الرجالية) || 0,
        femaleDawahTalks: Number(apiRecord.عدد_الكلمات_النسائية) || 0,
        dawahBeneficiaries: Number(apiRecord.عدد_مستفيدي_الكلمات) || 0,
        maleItikafParticipants: Number(apiRecord.عدد_المعتكفين_رجال) || 0,
        maleSuhoorMeals: Number(apiRecord.عدد_وجبات_السحور_رجال) || 0,
        femaleItikafParticipants: Number(apiRecord.عدد_المعتكفين_نساء) || 0,
        femaleSuhoorMeals: Number(apiRecord.عدد_وجبات_السحور_نساء) || 0,
        supervisorsCount: Number(apiRecord['عدد المشرفين']) || 0,
        notes: apiRecord.ملاحظات || '',
        images: [],
        status: statusMap[apiRecord.الاعتماد] || ReportStatus.Pending,
    }
};

// Mapper to convert app's Record type to a payload for the API
const mapAppRecordToApiPayload = (recordData: Omit<Record, 'id'> | Record) => {
    const payload: any = {
        mosque_code: recordData.mosqueId,
        code_day: recordData.dayCode,
        تاريخ_هجري: recordData.date,
        عدد_المصلين_رجال: recordData.maleWorshippers,
        عدد_المصلين_نساء: recordData.femaleWorshippers,
        عدد_وجبات_الافطار_فعلي: recordData.iftarMealsActual,
        عدد_كراتين_ماء: recordData.waterCartons,
        عدد_مستفيدي_الضيافة: recordData.hospitalityBeneficiaries,
        عدد_طلاب_الحلقات: recordData.maleStudents,
        عدد_الاوجه_طلاب: recordData.maleStudentPages,
        عدد_طالبات_الحلقات: recordData.femaleStudents,
        عدد_الاوجه_طالبات: recordData.femaleStudentPages,
        عدد_المتطوعين: recordData.volunteers,
        عدد_المسابقات: recordData.competitions,
        عدد_اطفال_الحضانة: recordData.nurseryChildren,
        البرنامج_المجتمعي: recordData.communityProgramName,
        عدد_المستفيدين: recordData.communityProgramBeneficiaries,
        وصف_البرنامج: recordData.communityProgramDescription,
        عدد_الكلمات_الرجالية: recordData.maleDawahTalks,
        عدد_الكلمات_النسائية: recordData.femaleDawahTalks,
        عدد_مستفيدي_الكلمات: recordData.dawahBeneficiaries,
        عدد_المعتكفين_رجال: recordData.maleItikafParticipants,
        عدد_وجبات_السحور_رجال: recordData.maleSuhoorMeals,
        عدد_المعتكفين_نساء: recordData.femaleItikafParticipants,
        عدد_وجبات_السحور_نساء: recordData.femaleSuhoorMeals,
        'عدد المشرفين': recordData.supervisorsCount,
        ملاحظات: recordData.notes,
        الاعتماد: recordData.status,
    };

    if ('id' in recordData && recordData.id) {
        payload.record_id = recordData.id;
    }

    return payload;
};

export const mosqueApi = {
  getAdminPassword: () => ADMIN_PASSWORD,
  
  getAll: async (): Promise<{ mosques: Mosque[]; records: Record[]; days: Day[] }> => {
    try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (!data.success) throw new Error('API returned an error');

        const mosques = data.sheets.mosque.map(mapApiMosqueToAppMosque);
        const records = data.sheets.daily_mosque_report.map(mapApiRecordToAppRecord);
        const days = data.sheets.Dayd.map(mapApiDayToAppDay);

        return { mosques, records, days };
    } catch (error) {
        console.error("API Error fetching all data:", error);
        throw error;
    }
  },
  
  saveRecord: async (recordData: Omit<Record, 'id'>): Promise<Record> => {
    const payload = {
        sheet: 'daily_mosque_report',
        ...mapAppRecordToApiPayload(recordData)
    };
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message || "Failed to save record");
    
    return {
      ...recordData,
      id: result.record_id,
    } as Record;
  },

  updateRecord: async (updatedRecord: Record): Promise<Record> => {
     const payload = {
        sheet: 'daily_mosque_report',
        ...mapAppRecordToApiPayload(updatedRecord)
    };
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message || "Failed to update record");
    return updatedRecord; // Assume success if API confirms
  },

  updateRecordStatus: async (recordId: string, status: ReportStatus): Promise<Record> => {
    const payload = {
        sheet: 'daily_mosque_report',
        record_id: recordId,
        'الاعتماد': status,
    };
     const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message || "Failed to update status");
    // The app reloads all data, so we don't need a meaningful return.
    const tempRecord = {} as Record; // Placeholder
    return tempRecord;
  },
};