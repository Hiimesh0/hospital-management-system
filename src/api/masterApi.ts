/**
 * Master Data API for Doctor Master, Medicine Master, and Report Template.
 * Connects to Django backend (/api/doctors/, /api/medicines/, /api/report-templates/)
 * with robust local storage and static JSON fallback for GitHub Pages hosting.
 */

export interface DoctorRecord {
  id: string;
  drHosRef: 'Hospital Doctor' | 'Reference Doctor' | 'Both' | string;
  drType: string;
  title: 'Dr.' | 'Mr.' | 'Mrs.' | 'Ms.' | string;
  drName: string;
  degree?: string;
  speciality?: string;
  department?: string;
  drRegNo?: string;
  hospitalName?: boolean;
  birthDate?: string;
  wedding?: string;
  panNo?: string;
  adharNo?: string;
  mobileNo: string;
  phNoR?: string;
  email?: string;
  consultationFee?: number;
  followupFee?: number;
  clinicName?: string;
  address?: string;
  area?: string;
  city?: string;
  pin?: string;
  state?: string;
  country?: string;
  clinicPhNo?: string;
  status: 'active' | 'inactive';
}

export interface MedicineRecord {
  id: string;
  brandName: string;
  genericName: string;
  medicineGroup?: string;
  dosageForm?: string;
  strength?: string;
  frequency?: string;
  availability?: string;
  remark1?: string;
  remark2?: string;
  totalDays?: number;
  notes?: string;
  forPatient?: 'Both' | 'OPD' | 'IPD' | 'Male' | 'Female' | string;
  unit?: string;
  manufacturer?: string;
  batchNo?: string;
  expiryDate?: string;
  purchasePrice?: number;
  sellingPrice?: number;
  stockQty?: number;
  reorderLevel?: number;
  gst?: number;
  status: 'active' | 'inactive';
}

export interface ReportTemplateRecord {
  id: string;
  groupName: string;
  templateName: string;
  reportHeader?: string;
  department?: string;
  details: string;
  status: 'active' | 'inactive';
}

const API_BASE_URL = (() => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://127.0.0.1:8000/api';
    }
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) {
      return `http://${host}:8000/api`;
    }
  }
  return 'http://127.0.0.1:8000/api';
})();

// ============================================================================
// Doctor Master API
// ============================================================================

const LOCAL_STORAGE_DOCTORS_KEY = 'mixu_doctors_storage';

async function getFallbackDoctorsStorage(): Promise<DoctorRecord[]> {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DOCTORS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    const baseUrl = import.meta.env.BASE_URL || '/';
    const jsonUrl = `${baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`}data/doctors.json`;
    const res = await fetch(jsonUrl);
    if (res.ok) {
      const data = await res.json();
      const list = data.doctors || [];
      if (list.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_DOCTORS_KEY, JSON.stringify(list));
        return list;
      }
    }
  } catch {
    // Ignore fallback fetch error
  }
  return [];
}

function saveFallbackDoctorsStorage(list: DoctorRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_DOCTORS_KEY, JSON.stringify(list));
  } catch {
    // LocalStorage quota fallback
  }
}

export const doctorApi = {
  async getDoctors(params?: {
    search?: string;
    speciality?: string;
    department?: string;
    active_only?: boolean;
  }): Promise<{ success: boolean; count: number; doctors: DoctorRecord[] }> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.speciality && params.speciality !== 'All') query.append('speciality', params.speciality);
    if (params?.department && params.department !== 'All') query.append('department', params.department);
    if (params?.active_only) query.append('active_only', 'true');

    try {
      const url = `${API_BASE_URL}/doctors/${query.toString() ? `?${query.toString()}` : ''}`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (res.ok) {
        const data = await res.json();
        if (data.doctors && data.doctors.length > 0) {
          saveFallbackDoctorsStorage(data.doctors);
        }
        return data;
      }
    } catch {
      // Backend unavailable, use fallback
    }

    const all = await getFallbackDoctorsStorage();
    let filtered = all;
    if (params?.active_only) {
      filtered = filtered.filter(d => d.status === 'active');
    }
    if (params?.speciality && params.speciality !== 'All') {
      filtered = filtered.filter(d => d.speciality?.toLowerCase() === params.speciality?.toLowerCase());
    }
    if (params?.department && params.department !== 'All') {
      filtered = filtered.filter(d => d.department?.toLowerCase() === params.department?.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        d =>
          d.drName.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q) ||
          d.drRegNo?.toLowerCase().includes(q) ||
          d.mobileNo.includes(q) ||
          d.speciality?.toLowerCase().includes(q)
      );
    }

    return { success: true, count: filtered.length, doctors: filtered };
  },

  async getDoctorById(id: string): Promise<{ success: boolean; doctor: DoctorRecord }> {
    try {
      const res = await fetch(`${API_BASE_URL}/doctors/${encodeURIComponent(id)}/`, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) return await res.json();
    } catch {
      // Backend unavailable
    }

    const all = await getFallbackDoctorsStorage();
    const doc = all.find(d => d.id.toLowerCase() === id.toLowerCase());
    if (doc) return { success: true, doctor: doc };
    throw new Error(`Doctor '${id}' not found.`);
  },

  async createDoctor(data: Partial<DoctorRecord>): Promise<{ success: boolean; doctor: DoctorRecord; message?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/doctors/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = await res.json();
        const all = await getFallbackDoctorsStorage();
        all.push(result.doctor);
        saveFallbackDoctorsStorage(all);
        return result;
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || Object.values(errData.details || {})[0] || 'Failed to create doctor.');
      }
    } catch (err: unknown) {
      if (err instanceof Error && !err.message.includes('fetch')) {
        throw err;
      }
    }

    // Fallback client storage
    const all = await getFallbackDoctorsStorage();
    let maxId = 100;
    all.forEach(d => {
      const num = parseInt(d.id.replace('DR-', ''), 10);
      if (!isNaN(num) && num > maxId) maxId = num;
    });
    const newDoc: DoctorRecord = {
      id: `DR-${maxId + 1}`,
      drHosRef: data.drHosRef || 'Hospital Doctor',
      drType: data.drType || 'Consultant',
      title: data.title || 'Dr.',
      drName: data.drName || '',
      degree: data.degree || '',
      speciality: data.speciality || '',
      department: data.department || '',
      drRegNo: data.drRegNo || '',
      hospitalName: data.hospitalName !== undefined ? data.hospitalName : true,
      birthDate: data.birthDate || '',
      wedding: data.wedding || '',
      panNo: data.panNo || '',
      adharNo: data.adharNo || '',
      mobileNo: data.mobileNo || '',
      phNoR: data.phNoR || '',
      email: data.email || '',
      consultationFee: data.consultationFee || 0,
      followupFee: data.followupFee || 0,
      clinicName: data.clinicName || '',
      address: data.address || '',
      area: data.area || '',
      city: data.city || 'SURAT',
      pin: data.pin || '',
      state: data.state || 'GUJARAT',
      country: data.country || 'INDIA',
      clinicPhNo: data.clinicPhNo || '',
      status: data.status || 'active',
    };
    all.push(newDoc);
    saveFallbackDoctorsStorage(all);
    return { success: true, doctor: newDoc, message: `Doctor ${newDoc.drName} created.` };
  },

  async updateDoctor(id: string, data: Partial<DoctorRecord>): Promise<{ success: boolean; doctor: DoctorRecord; message?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/doctors/${encodeURIComponent(id)}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = await res.json();
        const all = await getFallbackDoctorsStorage();
        const idx = all.findIndex(d => d.id.toLowerCase() === id.toLowerCase());
        if (idx !== -1) {
          all[idx] = result.doctor;
          saveFallbackDoctorsStorage(all);
        }
        return result;
      }
    } catch {
      // Fallback
    }

    const all = await getFallbackDoctorsStorage();
    const idx = all.findIndex(d => d.id.toLowerCase() === id.toLowerCase());
    if (idx === -1) throw new Error(`Doctor '${id}' not found.`);
    all[idx] = { ...all[idx], ...data, id: all[idx].id };
    saveFallbackDoctorsStorage(all);
    return { success: true, doctor: all[idx], message: `Doctor '${id}' updated.` };
  },

  async deleteDoctor(id: string, force = false): Promise<{ success: boolean; action: string; message: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/doctors/${encodeURIComponent(id)}/?force=${force}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const result = await res.json();
        const all = await getFallbackDoctorsStorage();
        if (result.action === 'deleted') {
          saveFallbackDoctorsStorage(all.filter(d => d.id.toLowerCase() !== id.toLowerCase()));
        } else {
          const idx = all.findIndex(d => d.id.toLowerCase() === id.toLowerCase());
          if (idx !== -1) {
            all[idx].status = 'inactive';
            saveFallbackDoctorsStorage(all);
          }
        }
        return result;
      }
    } catch {
      // Fallback
    }

    const all = await getFallbackDoctorsStorage();
    const idx = all.findIndex(d => d.id.toLowerCase() === id.toLowerCase());
    if (idx === -1) throw new Error(`Doctor '${id}' not found.`);

    if (force) {
      all.splice(idx, 1);
      saveFallbackDoctorsStorage(all);
      return { success: true, action: 'deleted', message: `Doctor '${id}' deleted.` };
    } else {
      all[idx].status = 'inactive';
      saveFallbackDoctorsStorage(all);
      return { success: true, action: 'deactivated', message: `Doctor '${id}' deactivated.` };
    }
  },
};

// ============================================================================
// Medicine Master API
// ============================================================================

const LOCAL_STORAGE_MEDICINES_KEY = 'mixu_medicines_storage';

async function getFallbackMedicinesStorage(): Promise<MedicineRecord[]> {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MEDICINES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    const baseUrl = import.meta.env.BASE_URL || '/';
    const jsonUrl = `${baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`}data/medicines.json`;
    const res = await fetch(jsonUrl);
    if (res.ok) {
      const data = await res.json();
      const list = data.medicines || [];
      if (list.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_MEDICINES_KEY, JSON.stringify(list));
        return list;
      }
    }
  } catch {
    // Ignore fallback error
  }
  return [];
}

function saveFallbackMedicinesStorage(list: MedicineRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_MEDICINES_KEY, JSON.stringify(list));
  } catch {
    // LocalStorage quota fallback
  }
}

export const medicineApi = {
  async getMedicines(params?: {
    search?: string;
    group?: string;
    dosage_form?: string;
    active_only?: boolean;
  }): Promise<{ success: boolean; count: number; medicines: MedicineRecord[] }> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.group && params.group !== 'All') query.append('group', params.group);
    if (params?.dosage_form && params.dosage_form !== 'All') query.append('dosage_form', params.dosage_form);
    if (params?.active_only) query.append('active_only', 'true');

    try {
      const url = `${API_BASE_URL}/medicines/${query.toString() ? `?${query.toString()}` : ''}`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (res.ok) {
        const data = await res.json();
        if (data.medicines && data.medicines.length > 0) {
          saveFallbackMedicinesStorage(data.medicines);
        }
        return data;
      }
    } catch {
      // Backend unavailable, use fallback
    }

    const all = await getFallbackMedicinesStorage();
    let filtered = all;
    if (params?.active_only) {
      filtered = filtered.filter(m => m.status === 'active');
    }
    if (params?.group && params.group !== 'All') {
      filtered = filtered.filter(m => m.medicineGroup?.toLowerCase() === params.group?.toLowerCase());
    }
    if (params?.dosage_form && params.dosage_form !== 'All') {
      filtered = filtered.filter(m => m.dosageForm?.toLowerCase() === params.dosage_form?.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        m =>
          m.brandName.toLowerCase().includes(q) ||
          m.genericName.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          m.medicineGroup?.toLowerCase().includes(q) ||
          m.batchNo?.toLowerCase().includes(q)
      );
    }

    return { success: true, count: filtered.length, medicines: filtered };
  },

  async getMedicineById(id: string): Promise<{ success: boolean; medicine: MedicineRecord }> {
    try {
      const res = await fetch(`${API_BASE_URL}/medicines/${encodeURIComponent(id)}/`, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) return await res.json();
    } catch {
      // Backend unavailable
    }

    const all = await getFallbackMedicinesStorage();
    const med = all.find(m => m.id.toLowerCase() === id.toLowerCase());
    if (med) return { success: true, medicine: med };
    throw new Error(`Medicine '${id}' not found.`);
  },

  async createMedicine(data: Partial<MedicineRecord>): Promise<{ success: boolean; medicine: MedicineRecord; message?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/medicines/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = await res.json();
        const all = await getFallbackMedicinesStorage();
        all.push(result.medicine);
        saveFallbackMedicinesStorage(all);
        return result;
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || Object.values(errData.details || {})[0] || 'Failed to create medicine.');
      }
    } catch (err: unknown) {
      if (err instanceof Error && !err.message.includes('fetch')) {
        throw err;
      }
    }

    const all = await getFallbackMedicinesStorage();
    let maxId = 1000;
    all.forEach(m => {
      const num = parseInt(m.id.replace('MED-', ''), 10);
      if (!isNaN(num) && num > maxId) maxId = num;
    });
    const newMed: MedicineRecord = {
      id: `MED-${maxId + 1}`,
      brandName: data.brandName || '',
      genericName: data.genericName || '',
      medicineGroup: data.medicineGroup || '',
      dosageForm: data.dosageForm || 'Tablet',
      strength: data.strength || '',
      frequency: data.frequency || '',
      availability: data.availability || 'In Stock',
      remark1: data.remark1 || '',
      remark2: data.remark2 || '',
      totalDays: data.totalDays || 0,
      notes: data.notes || '',
      forPatient: data.forPatient || 'Both',
      unit: data.unit || 'Strip',
      manufacturer: data.manufacturer || '',
      batchNo: data.batchNo || '',
      expiryDate: data.expiryDate || '',
      purchasePrice: data.purchasePrice || 0,
      sellingPrice: data.sellingPrice || 0,
      stockQty: data.stockQty || 0,
      reorderLevel: data.reorderLevel || 0,
      gst: data.gst || 0,
      status: data.status || 'active',
    };
    all.push(newMed);
    saveFallbackMedicinesStorage(all);
    return { success: true, medicine: newMed, message: `Medicine ${newMed.brandName} created.` };
  },

  async updateMedicine(id: string, data: Partial<MedicineRecord>): Promise<{ success: boolean; medicine: MedicineRecord; message?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/medicines/${encodeURIComponent(id)}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = await res.json();
        const all = await getFallbackMedicinesStorage();
        const idx = all.findIndex(m => m.id.toLowerCase() === id.toLowerCase());
        if (idx !== -1) {
          all[idx] = result.medicine;
          saveFallbackMedicinesStorage(all);
        }
        return result;
      }
    } catch {
      // Fallback
    }

    const all = await getFallbackMedicinesStorage();
    const idx = all.findIndex(m => m.id.toLowerCase() === id.toLowerCase());
    if (idx === -1) throw new Error(`Medicine '${id}' not found.`);
    all[idx] = { ...all[idx], ...data, id: all[idx].id };
    saveFallbackMedicinesStorage(all);
    return { success: true, medicine: all[idx], message: `Medicine '${id}' updated.` };
  },

  async deleteMedicine(id: string, force = false): Promise<{ success: boolean; action: string; message: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/medicines/${encodeURIComponent(id)}/?force=${force}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const result = await res.json();
        const all = await getFallbackMedicinesStorage();
        if (result.action === 'deleted') {
          saveFallbackMedicinesStorage(all.filter(m => m.id.toLowerCase() !== id.toLowerCase()));
        } else {
          const idx = all.findIndex(m => m.id.toLowerCase() === id.toLowerCase());
          if (idx !== -1) {
            all[idx].status = 'inactive';
            saveFallbackMedicinesStorage(all);
          }
        }
        return result;
      }
    } catch {
      // Fallback
    }

    const all = await getFallbackMedicinesStorage();
    const idx = all.findIndex(m => m.id.toLowerCase() === id.toLowerCase());
    if (idx === -1) throw new Error(`Medicine '${id}' not found.`);

    if (force) {
      all.splice(idx, 1);
      saveFallbackMedicinesStorage(all);
      return { success: true, action: 'deleted', message: `Medicine '${id}' deleted.` };
    } else {
      all[idx].status = 'inactive';
      saveFallbackMedicinesStorage(all);
      return { success: true, action: 'deactivated', message: `Medicine '${id}' deactivated.` };
    }
  },
};

// ============================================================================
// Report Template API
// ============================================================================

const LOCAL_STORAGE_TEMPLATES_KEY = 'mixu_templates_storage';

async function getFallbackTemplatesStorage(): Promise<ReportTemplateRecord[]> {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TEMPLATES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    const baseUrl = import.meta.env.BASE_URL || '/';
    const jsonUrl = `${baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`}data/report_templates.json`;
    const res = await fetch(jsonUrl);
    if (res.ok) {
      const data = await res.json();
      const list = data.templates || [];
      if (list.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_TEMPLATES_KEY, JSON.stringify(list));
        return list;
      }
    }
  } catch {
    // Ignore fallback error
  }
  return [];
}

function saveFallbackTemplatesStorage(list: ReportTemplateRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_TEMPLATES_KEY, JSON.stringify(list));
  } catch {
    // LocalStorage quota fallback
  }
}

export const reportTemplateApi = {
  async getReportTemplates(params?: {
    search?: string;
    group?: string;
    department?: string;
    active_only?: boolean;
  }): Promise<{ success: boolean; count: number; templates: ReportTemplateRecord[] }> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.group && params.group !== 'All') query.append('group', params.group);
    if (params?.department && params.department !== 'All') query.append('department', params.department);
    if (params?.active_only) query.append('active_only', 'true');

    try {
      const url = `${API_BASE_URL}/report-templates/${query.toString() ? `?${query.toString()}` : ''}`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (res.ok) {
        const data = await res.json();
        if (data.templates && data.templates.length > 0) {
          saveFallbackTemplatesStorage(data.templates);
        }
        return data;
      }
    } catch {
      // Backend unavailable, use fallback
    }

    const all = await getFallbackTemplatesStorage();
    let filtered = all;
    if (params?.active_only) {
      filtered = filtered.filter(t => t.status === 'active');
    }
    if (params?.group && params.group !== 'All') {
      filtered = filtered.filter(t => t.groupName.toLowerCase() === params.group?.toLowerCase());
    }
    if (params?.department && params.department !== 'All') {
      filtered = filtered.filter(t => t.department?.toLowerCase() === params.department?.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        t =>
          t.templateName.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.groupName.toLowerCase().includes(q) ||
          t.reportHeader?.toLowerCase().includes(q) ||
          t.details.toLowerCase().includes(q)
      );
    }

    return { success: true, count: filtered.length, templates: filtered };
  },

  async getReportTemplateById(id: string): Promise<{ success: boolean; template: ReportTemplateRecord }> {
    try {
      const res = await fetch(`${API_BASE_URL}/report-templates/${encodeURIComponent(id)}/`, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) return await res.json();
    } catch {
      // Backend unavailable
    }

    const all = await getFallbackTemplatesStorage();
    const tpl = all.find(t => t.id.toLowerCase() === id.toLowerCase());
    if (tpl) return { success: true, template: tpl };
    throw new Error(`Report template '${id}' not found.`);
  },

  async createReportTemplate(data: Partial<ReportTemplateRecord>): Promise<{ success: boolean; template: ReportTemplateRecord; message?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/report-templates/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = await res.json();
        const all = await getFallbackTemplatesStorage();
        all.push(result.template);
        saveFallbackTemplatesStorage(all);
        return result;
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || Object.values(errData.details || {})[0] || 'Failed to create template.');
      }
    } catch (err: unknown) {
      if (err instanceof Error && !err.message.includes('fetch')) {
        throw err;
      }
    }

    const all = await getFallbackTemplatesStorage();
    let maxId = 0;
    all.forEach(t => {
      const num = parseInt(t.id.replace('TPL-', ''), 10);
      if (!isNaN(num) && num > maxId) maxId = num;
    });
    const newTpl: ReportTemplateRecord = {
      id: `TPL-${String(maxId + 1).padStart(3, '0')}`,
      groupName: data.groupName || 'Sonography',
      templateName: data.templateName || '',
      reportHeader: data.reportHeader || '',
      department: data.department || 'Radiology',
      details: data.details || '',
      status: data.status || 'active',
    };
    all.push(newTpl);
    saveFallbackTemplatesStorage(all);
    return { success: true, template: newTpl, message: `Template '${newTpl.templateName}' created.` };
  },

  async updateReportTemplate(id: string, data: Partial<ReportTemplateRecord>): Promise<{ success: boolean; template: ReportTemplateRecord; message?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/report-templates/${encodeURIComponent(id)}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = await res.json();
        const all = await getFallbackTemplatesStorage();
        const idx = all.findIndex(t => t.id.toLowerCase() === id.toLowerCase());
        if (idx !== -1) {
          all[idx] = result.template;
          saveFallbackTemplatesStorage(all);
        }
        return result;
      }
    } catch {
      // Fallback
    }

    const all = await getFallbackTemplatesStorage();
    const idx = all.findIndex(t => t.id.toLowerCase() === id.toLowerCase());
    if (idx === -1) throw new Error(`Template '${id}' not found.`);
    all[idx] = { ...all[idx], ...data, id: all[idx].id };
    saveFallbackTemplatesStorage(all);
    return { success: true, template: all[idx], message: `Template '${id}' updated.` };
  },

  async deleteReportTemplate(id: string, force = false): Promise<{ success: boolean; action: string; message: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/report-templates/${encodeURIComponent(id)}/?force=${force}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const result = await res.json();
        const all = await getFallbackTemplatesStorage();
        if (result.action === 'deleted') {
          saveFallbackTemplatesStorage(all.filter(t => t.id.toLowerCase() !== id.toLowerCase()));
        } else {
          const idx = all.findIndex(t => t.id.toLowerCase() === id.toLowerCase());
          if (idx !== -1) {
            all[idx].status = 'inactive';
            saveFallbackTemplatesStorage(all);
          }
        }
        return result;
      }
    } catch {
      // Fallback
    }

    const all = await getFallbackTemplatesStorage();
    const idx = all.findIndex(t => t.id.toLowerCase() === id.toLowerCase());
    if (idx === -1) throw new Error(`Template '${id}' not found.`);

    if (force) {
      all.splice(idx, 1);
      saveFallbackTemplatesStorage(all);
      return { success: true, action: 'deleted', message: `Template '${id}' deleted.` };
    } else {
      all[idx].status = 'inactive';
      saveFallbackTemplatesStorage(all);
      return { success: true, action: 'deactivated', message: `Template '${id}' deactivated.` };
    }
  },
};
