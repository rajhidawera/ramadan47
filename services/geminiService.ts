import { GoogleGenAI } from '@google/genai';
import { Record } from '../types';

export const analyzeDataWithGemini = async (records: Record[]): Promise<string> => {
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    console.warn("API_KEY environment variable not set. AI analysis will not work.");
    return Promise.reject("API key for Gemini is not configured.");
  }
  
  if (records.length === 0) {
    return "لا توجد بيانات معتمدة كافية للتحليل. يرجى اعتماد بعض التقارير أولاً.";
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const model = 'gemini-3-flash-preview';

  const dataSummary = records.map(r => ({
    date: r.date,
    mosqueId: r.mosqueId,
    worshippers: { male: r.maleWorshippers, female: r.femaleWorshippers },
    iftar: { actual: r.iftarMealsActual },
    waterCartons: r.waterCartons,
    hospitalityBeneficiaries: r.hospitalityBeneficiaries,
    quranEducation: { 
      maleStudents: r.maleStudents,
      malePages: r.maleStudentPages,
      femaleStudents: r.femaleStudents,
      femalePages: r.femaleStudentPages,
    },
    communityActivities: {
      volunteers: r.volunteers,
      competitions: r.competitions,
      nurseryChildren: r.nurseryChildren,
      programName: r.communityProgramName,
      programBeneficiaries: r.communityProgramBeneficiaries,
    },
    dawah: {
      maleTalks: r.maleDawahTalks,
      femaleTalks: r.femaleDawahTalks,
      beneficiaries: r.dawahBeneficiaries,
    },
    itikaf: {
      maleParticipants: r.maleItikafParticipants,
      maleSuhoor: r.maleSuhoorMeals,
      femaleParticipants: r.femaleItikafParticipants,
      femaleSuhoor: r.femaleSuhoorMeals,
    },
    notes: r.notes,
  }));

  const prompt = `
    أنت مستشار خبير في إدارة المشاريع الخيرية لدى مؤسسة عبدالله بن عبدالعزيز الراجحي الخيرية.
    مهمتك هي تحليل البيانات اليومية لأنشطة المساجد خلال شهر رمضان وتقديم تقرير موجز وذكي.

    البيانات التالية هي ملخص للتقارير الميدانية المعتمدة لهذا اليوم:
    ${JSON.stringify(dataSummary, null, 2)}

    بناءً على هذه البيانات، يرجى تقديم تحليل باللغة العربية الفصحى يتضمن النقاط التالية بوضوح:

    1.  **ملخص تنفيذي:** قدم نظرة عامة موجزة عن أداء اليوم، مع ذكر أبرز الأرقام والإنجازات في مختلف الأنشطة (الصلاة، الإفطار، الحلقات، الأنشطة المجتمعية، إلخ).
    2.  **مشاكل وتحديات متكررة:** استخرج أي مشاكل أو تحديات محتملة تظهر من خلال البيانات أو الملاحظات المرفقة (مثل "نحتاج دعم"، "انقطاع الكهرباء"، أو أرقام منخفضة بشكل غير طبيعي في مسجد معين).
    3.  **توصيات ذكية:** بناءً على التحليل، قدم توصيات قابلة للتنفيذ لتحسين الأداء في اليوم التالي. على سبيل المثال، إذا كان هناك نقص في وجبات الإفطار في مسجد معين، اقترح إعادة توجيه الموارد. إذا كان عدد المصلين كبيرًا جدًا، اقترح زيادة الاستعدادات.

    اجعل التقرير منظمًا وسهل القراءة باستخدام العناوين والنقاط.
    `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    if (response.text) {
      return response.text;
    } else {
      throw new Error("No text response from Gemini API.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("فشل الاتصال بخدمة الذكاء الاصطناعي.");
  }
};