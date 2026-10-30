export interface PatientRecord {
  id: string;
  uhid: string;
  category: string;
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: string;
  age: string;
  ageUnit: string;
  sex: string;
  hospitalDoctor: string;
  referenceBy: string;
  religion: string;
  maritalStatus: string;
  weight: string;
  height: string;
  mobile: string;
  email: string;
  streetAddress: string;
  city: string;
  state: string;
  pinCode: string;
  autoSms: boolean;
  estimate: string;
  aadharNo: string;
  panNo: string;
  mediclaim: string;
  membershipId: string;
  employeeId: string;
  companyName: string;
  remark: string;
  createdAt?: string;
  updatedAt?: string;
}

export type PatientFormData = Omit<PatientRecord, 'id' | 'createdAt' | 'updatedAt'>;

export interface PatientListResponse {
  success: boolean;
  count: number;
  patients: PatientRecord[];
  error?: string;
}

export interface PatientSingleResponse {
  success: boolean;
  patient: PatientRecord;
  message?: string;
  error?: string;
  details?: Record<string, string[]>;
}

export interface PatientDeleteResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface BillItem {
  srNo: number;
  details: string;
  rate: number;
  amount: number;
}

export interface PatientBillRecord {
  id: string;
  patientId: string;
  uhid: string;
  invoiceNo: string;
  billDate: string;
  patientName: string;
  age: string;
  ageUnit: string;
  sex: string;
  mobile: string;
  treatingDoctor: string;
  referenceDoctor: string;
  items: BillItem[];
  totalAmount: number;
  amountReceived: number;
  paymentType: string;
  receiptNo: string;
  dueAmount: number;
  entryBy?: string;
  pcName?: string;
  createdAt?: string;
  updatedAt?: string;
}

import { HOSPITAL_CONFIG, type HospitalConfig } from '../config/hospitalConfig';
export type { HospitalConfig };

export interface ChargeItem {
  id: string;
  name: string;
  amount: number;
  active: boolean;
}

export interface BillCreatePayload {
  items?: Array<{ details: string; rate: number; amount?: number; chargeId?: string }>;
  paymentType?: string;
  amountReceived?: number;
  entryBy?: string;
  pcName?: string;
  forceNew?: boolean;
}

const API_BASE_URL =

  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://127.0.0.1:8000/api'
    : 'http://127.0.0.1:8000/api');

const LOCAL_STORAGE_KEY = 'mixu_patients_storage';

/**
 * Helper to get fallback patients for static web deployment (e.g. GitHub Pages)
 */
async function getFallbackStorage(): Promise<PatientRecord[]> {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    // Try fetching bundled static patients.json
    const baseUrl = import.meta.env.BASE_URL || '/';
    const jsonUrl = `${baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`}data/patients.json`;
    const res = await fetch(jsonUrl);
    if (res.ok) {
      const data = await res.json();
      const list = data.patients || [];
      if (list.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
        return list;
      }
    }
  } catch {
    // Ignore fallback fetch error
  }
  return [];
}

function saveFallbackStorage(list: PatientRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // LocalStorage quota fallback
  }
}

export const patientApi = {
  /**
   * Fetch all patients with optional search and filters
   */
  async getPatients(params?: {
    search?: string;
    gender?: string;
    category?: string;
    doctor?: string;
    city?: string;
  }): Promise<PatientListResponse> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.gender && params.gender !== 'All') query.append('gender', params.gender);
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.doctor && params.doctor !== 'All') query.append('doctor', params.doctor);
    if (params?.city && params.city !== 'All') query.append('city', params.city);

    try {
      const url = `${API_BASE_URL}/patients/${query.toString() ? `?${query.toString()}` : ''}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        // Also keep local storage cache in sync
        if (data.patients && data.patients.length > 0) {
          saveFallbackStorage(data.patients);
        }
        return data;
      }
    } catch {
      // Backend not running (e.g. static GitHub Pages host) -> Fallback to client-side storage
    }

    // Fallback implementation for GitHub Pages static hosting
    const all = await getFallbackStorage();
    let filtered = all;

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.uhid.toLowerCase().includes(q) ||
        `${p.firstName} ${p.middleName} ${p.lastName}`.toLowerCase().includes(q) ||
        p.mobile.includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.hospitalDoctor.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
      );
    }
    if (params?.gender && params.gender !== 'All') {
      filtered = filtered.filter(p => p.sex === params.gender);
    }
    if (params?.category && params.category !== 'All') {
      filtered = filtered.filter(p => p.category === params.category);
    }
    if (params?.doctor && params.doctor !== 'All') {
      filtered = filtered.filter(p => p.hospitalDoctor === params.doctor);
    }
    if (params?.city && params.city !== 'All') {
      filtered = filtered.filter(p => p.city === params.city);
    }

    return {
      success: true,
      count: filtered.length,
      patients: filtered,
    };
  },

  /**
   * Get single patient by ID or UHID
   */
  async getPatientById(id: string): Promise<PatientSingleResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/patients/${encodeURIComponent(id)}/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (res.ok) {
        return res.json();
      }
    } catch {
      // Backend not running -> Fallback
    }

    const all = await getFallbackStorage();
    const found = all.find(p => p.uhid === id || p.id === id);
    if (!found) {
      throw new Error(`Patient '${id}' not found.`);
    }
    return {
      success: true,
      patient: found,
    };
  },

  /**
   * Create a new patient record
   */
  async createPatient(data: Partial<PatientFormData>): Promise<PatientSingleResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/patients/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const resData = await res.json().catch(() => ({}));
      if (res.ok) {
        return resData;
      }
    } catch {
      // Backend not running -> Fallback
    }

    const all = await getFallbackStorage();
    let maxNum = 1000;
    all.forEach(p => {
      const u = p.uhid || p.id || '';
      if (u.startsWith('UHID-')) {
        const num = parseInt(u.replace('UHID-', ''), 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    });

    const newUhid = `UHID-${maxNum + 1}`;
    const nowIso = new Date().toISOString();
    const newPatient: PatientRecord = {
      id: newUhid,
      uhid: newUhid,
      category: data.category || 'NEW',
      firstName: (data.firstName || '').trim(),
      middleName: (data.middleName || '').trim(),
      lastName: (data.lastName || '').trim(),
      birthDate: data.birthDate || '',
      age: String(data.age || '').trim(),
      ageUnit: data.ageUnit || 'Years',
      sex: data.sex || 'Male',
      hospitalDoctor: (data.hospitalDoctor || '').trim(),
      referenceBy: (data.referenceBy || '').trim(),
      religion: data.religion || 'Hindu',
      maritalStatus: data.maritalStatus || '',
      weight: String(data.weight || '').trim(),
      height: String(data.height || '').trim(),
      mobile: String(data.mobile || '').trim(),
      email: (data.email || '').trim(),
      streetAddress: (data.streetAddress || '').trim(),
      city: (data.city || 'SURAT').trim(),
      state: (data.state || 'GUJARAT').trim(),
      pinCode: String(data.pinCode || '').trim(),
      autoSms: data.autoSms !== undefined ? data.autoSms : true,
      estimate: String(data.estimate || '').trim(),
      aadharNo: String(data.aadharNo || '').trim(),
      panNo: String(data.panNo || '').trim(),
      mediclaim: String(data.mediclaim || '').trim(),
      membershipId: String(data.membershipId || '').trim(),
      employeeId: String(data.employeeId || '').trim(),
      companyName: String(data.companyName || '').trim(),
      remark: String(data.remark || '').trim(),
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    all.unshift(newPatient);
    saveFallbackStorage(all);

    return {
      success: true,
      message: `Patient ${newPatient.firstName} registered successfully with ${newPatient.uhid}!`,
      patient: newPatient,
    };
  },

  /**
   * Update an existing patient record
   */
  async updatePatient(id: string, data: Partial<PatientRecord>): Promise<PatientSingleResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/patients/${encodeURIComponent(id)}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const resData = await res.json().catch(() => ({}));
      if (res.ok) {
        return resData;
      }
    } catch {
      // Backend not running -> Fallback
    }

    const all = await getFallbackStorage();
    const idx = all.findIndex(p => p.uhid === id || p.id === id);
    if (idx === -1) {
      throw new Error(`Patient '${id}' not found.`);
    }

    const existing = all[idx];
    const updated: PatientRecord = {
      ...existing,
      ...data,
      id: existing.id,
      uhid: existing.uhid,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };

    all[idx] = updated;
    saveFallbackStorage(all);

    return {
      success: true,
      message: `Patient ${updated.uhid} updated successfully.`,
      patient: updated,
    };
  },

  /**
   * Delete a patient record
   */
  async deletePatient(id: string): Promise<PatientDeleteResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/patients/${encodeURIComponent(id)}/`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (res.ok) {
        return res.json();
      }
    } catch {
      // Backend not running -> Fallback
    }

    const all = await getFallbackStorage();
    const filtered = all.filter(p => p.uhid !== id && p.id !== id);
    saveFallbackStorage(filtered);

    return {
      success: true,
      message: `Patient '${id}' deleted successfully.`,
    };
  },

  /**
   * Get direct PDF URL for patient sticker
   */
  getStickerPdfUrl(patientId: string): string {
    return `${API_BASE_URL}/patients/${encodeURIComponent(patientId)}/sticker.pdf`;
  },

  /**
   * Get direct PDF URL for patient bill
   */
  getBillPdfUrl(patientId: string): string {
    return `${API_BASE_URL}/patients/${encodeURIComponent(patientId)}/bill.pdf`;
  },

  /**
   * Fetch centralized hospital configuration
   */
  async getHospitalConfig(): Promise<HospitalConfig> {
    try {
      const res = await fetch(`${API_BASE_URL}/hospital/config/`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.config) {
          return data.config;
        }
      }
    } catch {
      // Offline fallback
    }
    return HOSPITAL_CONFIG;
  },

  /**
   * Fetch active hospital charges from Charge Master API (with offline fallbacks)
   */
  async getChargeMaster(): Promise<ChargeItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/charges/`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.charges)) {
          return data.charges;
        }
      }
    } catch {
      // Backend not running -> try static file
    }

    try {
      const baseUrl = import.meta.env.BASE_URL || '/';
      const staticUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}data/charge_master.json`;
      const res = await fetch(staticUrl);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.charges)) {
          return data.charges.filter((c: ChargeItem) => c.active);
        }
      }
    } catch {
      // Fallback below
    }

    return [
      { id: 'CHG-001', name: 'Consultation Charge', amount: 500, active: true },
      { id: 'CHG-002', name: 'Registration Charge', amount: 100, active: true },
      { id: 'CHG-003', name: 'Follow-up Charge', amount: 300, active: true },
      { id: 'CHG-004', name: 'Emergency / Casualty Charge', amount: 750, active: true },
      { id: 'CHG-005', name: 'ECG / Diagnostic Procedure', amount: 350, active: true },
      { id: 'CHG-006', name: 'Dressing / Nursing Charge', amount: 200, active: true },
      { id: 'CHG-007', name: 'Injection / Administration Charge', amount: 150, active: true },
      { id: 'CHG-008', name: 'Minor Surgical Procedure', amount: 1200, active: true },
    ];
  },

  /**
   * Fetch latest issued bill for a patient (or null if none issued yet)
   */
  async getPatientBill(patientId: string): Promise<PatientBillRecord | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/patients/${encodeURIComponent(patientId)}/bill/`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.bill) {
          return data.bill;
        }
      }
    } catch {
      // Backend not running -> Fallback to client storage
    }

    // Client fallback
    const allBills = getFallbackBillsStorage();
    const cleanId = patientId.trim().toLowerCase();
    const match = allBills
      .slice()
      .reverse()
      .find(b => (b.uhid || '').toLowerCase() === cleanId || (b.patientId || '').toLowerCase() === cleanId);
    return match || null;
  },

  /**
   * Create or retrieve existing bill for a patient.
   * If a bill already exists, it is returned without generating duplicate invoice numbers.
   */
  async createOrGetPatientBill(
    patientId: string,
    payload?: BillCreatePayload
  ): Promise<PatientBillRecord> {
    try {
      const res = await fetch(`${API_BASE_URL}/patients/${encodeURIComponent(patientId)}/bill/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload || {}),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.bill) {
          return data.bill;
        }
      }
    } catch {
      // Backend not running -> Fallback to client storage
    }

    // Client fallback creation / retrieval
    const allBills = getFallbackBillsStorage();
    const cleanId = patientId.trim().toLowerCase();

    if (!payload?.forceNew) {
      const existing = allBills
        .slice()
        .reverse()
        .find(b => (b.uhid || '').toLowerCase() === cleanId || (b.patientId || '').toLowerCase() === cleanId);
      if (existing) {
        return existing;
      }
    }

    // Fetch patient record for snapshot
    const patientRes = await this.getPatientById(patientId);
    const patient = patientRes.patient;
    if (!patient) {
      throw new Error(`Patient '${patientId}' not found for bill generation.`);
    }

    // Compute sequence
    let maxSeq = 6145;
    for (const b of allBills) {
      const inv = b.invoiceNo || '';
      if (inv.includes('/')) {
        const numPart = parseInt(inv.split('/')[1], 10);
        if (!isNaN(numPart) && numPart > maxSeq) {
          maxSeq = numPart;
        }
      }
    }
    const nextSeq = maxSeq + 1;
    const invoiceNo = `OPD2627/${nextSeq}`;
    const nowIso = new Date().toISOString();

    const rawItems = payload?.items && payload.items.length > 0 ? payload.items : [
      { details: 'OPD Consultation / Registration Charge', rate: 500, amount: 500 }
    ];

    const items: BillItem[] = rawItems.map((it, idx) => {
      const rate = typeof it.rate === 'number' ? it.rate : parseFloat(String(it.rate || 0)) || 0;
      return {
        srNo: idx + 1,
        details: it.details || `Service #${idx + 1}`,
        rate: Math.round(rate * 100) / 100,
        amount: Math.round(rate * 100) / 100,
      };
    });

    const totalAmount = Math.round(items.reduce((acc, it) => acc + it.amount, 0) * 100) / 100;
    const received = payload?.amountReceived !== undefined ? Math.round(Number(payload.amountReceived) * 100) / 100 : totalAmount;
    const dueAmount = Math.max(0, Math.round((totalAmount - received) * 100) / 100);

    const fullNameParts = [patient.firstName, patient.middleName, patient.lastName].filter(Boolean);
    const patientName = fullNameParts.join(' ').toUpperCase() || 'UNKNOWN PATIENT';

    const newBill: PatientBillRecord = {
      id: `BILL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      patientId: patient.uhid || patient.id,
      uhid: patient.uhid || patient.id,
      invoiceNo,
      billDate: nowIso,
      patientName,
      age: patient.age || '',
      ageUnit: patient.ageUnit || 'Yrs.',
      sex: patient.sex || 'N/A',
      mobile: patient.mobile || '',
      treatingDoctor: (patient.hospitalDoctor || 'Dr. NILESH MAHALE').toUpperCase(),
      referenceDoctor: (patient.referenceBy || '---').toUpperCase() || '---',
      items,
      totalAmount,
      amountReceived: received,
      paymentType: payload?.paymentType || 'Cash',
      receiptNo: invoiceNo,
      dueAmount,
      entryBy: payload?.entryBy || 'Jenil Bundela',
      pcName: payload?.pcName || 'RECEPTION1',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    allBills.push(newBill);
    saveFallbackBillsStorage(allBills);
    return newBill;
  },
};

// Fallback bill storage helpers
const LOCAL_STORAGE_BILLS_KEY = 'mixu_bills_storage';

function getFallbackBillsStorage(): PatientBillRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BILLS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore error
  }
  return [];
}

function saveFallbackBillsStorage(bills: PatientBillRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_BILLS_KEY, JSON.stringify(bills));
  } catch {
    // Ignore error
  }
}


