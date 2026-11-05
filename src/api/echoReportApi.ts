/**
 * Echo (Echocardiography) Report API.
 * Connects to Django backend (/api/echo-reports/) with robust localStorage
 * fallback and initial fixtures for GitHub Pages hosting.
 */

import { HOSPITAL_CONFIG } from '../config/hospitalConfig';

export interface EchoReportRecord {
  id: string;
  uhid: string;
  patientName: string;
  age: string;
  sex: string;
  reportDate: string;
  referredBy: string;
  c_o: string;

  // Measurements & anatomical observations
  mitralValve: string;
  tricuspidValve: string;
  aorta: string;
  leftVentricle: string;
  rwma: string;
  rightVentricle: string;
  ivc: string;
  aorticValve: string;
  pulmonaryValve: string;
  lvef: string;
  leftAtrium: string;
  rightAtrium: string;
  rvsp: string;
  ivs: string;
  septum: string;
  lvidd: string;
  ias: string;
  pWall: string;
  lvids: string;

  // Lower section
  pericardium: string;
  dopplerStudy: string;
  conclusion: string;
  lvCompliance: string;
  tvi: string;
  leftAorticArchPdaCoarctation: string;
  consultantDr: string;

  // Lifecycle
  status: 'Draft' | 'Finalized';
  finalizedAt?: string | null;
  finalizedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type EchoReportFormData = Omit<EchoReportRecord, 'id' | 'createdAt' | 'updatedAt' | 'finalizedAt' | 'finalizedBy'>;

export interface EchoReportListResponse {
  success: boolean;
  count: number;
  reports: EchoReportRecord[];
  error?: string;
}

export interface EchoReportSingleResponse {
  success: boolean;
  report: EchoReportRecord;
  message?: string;
  error?: string;
  details?: Record<string, string[]>;
}

export interface EchoReportDeleteResponse {
  success: boolean;
  message?: string;
  error?: string;
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

const LOCAL_STORAGE_ECHO_KEY = 'mixu_echo_reports_storage';

const INITIAL_FALLBACK_REPORTS: EchoReportRecord[] = [
  {
    id: 'ECHO-1001',
    uhid: 'UHID-1023',
    patientName: 'TestBillPatient',
    age: '33',
    sex: 'Male',
    reportDate: '2026-10-28',
    referredBy: 'DR. NIKUNJ VITHALANI',
    c_o: 'Atypical chest discomfort on exertion, palpitations',
    mitralValve: 'Normal leaflets, mild MR, no MS',
    tricuspidValve: 'Structurally normal, trivial TR',
    aorta: '28 mm (Normal)',
    leftVentricle: 'Normal cavity size, no global hypokinesia',
    rwma: 'No regional wall motion abnormality at rest',
    rightVentricle: 'Normal size and function (TAPSE 22 mm)',
    ivc: '16 mm, >50% respiratory collapsibility',
    aorticValve: 'Trileaflet, normal opening, no AS/AR',
    pulmonaryValve: 'Normal morphology and flow',
    lvef: '62%',
    leftAtrium: '32 mm (Normal)',
    rightAtrium: 'Normal size',
    rvsp: '24 mmHg',
    ivs: 'Normal thickness (9 mm)',
    septum: '9',
    lvidd: '46',
    ias: 'Intact on color Doppler, no ASD flow',
    pWall: '9',
    lvids: '29',
    pericardium: 'Normal, no pericardial effusion',
    dopplerStudy: 'Mitral E/A ratio: 1.2, Deceleration time: 180 ms. Normal diastolic filling pattern. No significant valvular gradient across aortic or pulmonic valves.',
    conclusion: 'Normal resting 2D Transthoracic Echocardiogram. Good LV systolic function (LVEF ~62%). No RWMA. Normal chamber dimensions.',
    lvCompliance: 'Normal',
    tvi: '21 cm',
    leftAorticArchPdaCoarctation: 'Left-sided arch, no PDA / coarctation',
    consultantDr: 'Dr. Nilesh Mahale',
    status: 'Finalized',
    finalizedAt: '2026-10-28T14:30:00Z',
    finalizedBy: 'Dr. Nilesh Mahale',
    createdAt: '2026-10-28T10:00:00Z',
    updatedAt: '2026-10-28T14:30:00Z'
  },
  {
    id: 'ECHO-1002',
    uhid: 'UHID-1022',
    patientName: 'TestBanner',
    age: '30',
    sex: 'Male',
    reportDate: '2026-10-29',
    referredBy: 'DR. NIKUNJ VITHALANI',
    c_o: 'Routine pre-operative cardiac fitness evaluation',
    mitralValve: 'Normal anterior and posterior leaflets',
    tricuspidValve: 'Normal tricuspid valve leaflets',
    aorta: '27 mm',
    leftVentricle: 'Normal LV dimensions',
    rwma: 'Nil',
    rightVentricle: 'Normal RV dimension and systolic function',
    ivc: 'Normal (<20 mm, collapses >50%)',
    aorticValve: 'Trileaflet, good excursion',
    pulmonaryValve: 'Normal',
    lvef: '65%',
    leftAtrium: '30 mm',
    rightAtrium: 'Normal',
    rvsp: '22 mmHg',
    ivs: '8 mm',
    septum: '8',
    lvidd: '44',
    ias: 'Intact',
    pWall: '8',
    lvids: '28',
    pericardium: 'No effusion',
    dopplerStudy: 'Normal spectral Doppler flow velocities across all four cardiac valves. E/A > 1.0.',
    conclusion: 'Normal 2D Transthoracic Echocardiography study. Normal LV systolic and diastolic function. Cleared for elective surgical procedure from cardiac standpoint.',
    lvCompliance: 'Normal',
    tvi: '22 cm',
    leftAorticArchPdaCoarctation: 'Normal left arch, no PDA',
    consultantDr: 'Dr. Nilesh Mahale',
    status: 'Draft',
    finalizedAt: null,
    finalizedBy: null,
    createdAt: '2026-10-29T11:00:00Z',
    updatedAt: '2026-10-29T11:00:00Z'
  }
];

function getFallbackReports(): EchoReportRecord[] {
  if (typeof window === 'undefined') return INITIAL_FALLBACK_REPORTS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ECHO_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Ignore storage parse errors
  }
  localStorage.setItem(LOCAL_STORAGE_ECHO_KEY, JSON.stringify(INITIAL_FALLBACK_REPORTS));
  return INITIAL_FALLBACK_REPORTS;
}

function saveFallbackReports(reports: EchoReportRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_ECHO_KEY, JSON.stringify(reports));
  } catch {
    // Ignore storage quota errors
  }
}

export const echoReportApi = {
  /**
   * List echo reports with optional filtering by query, uhid, status, date range, or doctor.
   */
  async getReports(params?: {
    search?: string;
    uhid?: string;
    status?: string;
    from_date?: string;
    to_date?: string;
    doctor?: string;
  }): Promise<EchoReportListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.uhid) queryParams.append('uhid', params.uhid);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.from_date) queryParams.append('from_date', params.from_date);
    if (params?.to_date) queryParams.append('to_date', params.to_date);
    if (params?.doctor) queryParams.append('doctor', params.doctor);

    const url = `${API_BASE_URL}/echo-reports/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.reports)) {
          saveFallbackReports(data.reports);
          return data;
        }
      }
    } catch {
      // Fall through to localStorage
    }

    let reports = getFallbackReports();
    if (params?.uhid) {
      const uNorm = params.uhid.trim().toUpperCase();
      reports = reports.filter(r => r.uhid?.trim().toUpperCase() === uNorm);
    }
    if (params?.status && params.status !== 'All') {
      const sNorm = params.status.trim().toLowerCase();
      reports = reports.filter(r => r.status?.trim().toLowerCase() === sNorm);
    }
    if (params?.doctor && params.doctor !== 'All') {
      const dNorm = params.doctor.trim().toLowerCase();
      reports = reports.filter(r =>
        r.consultantDr?.toLowerCase().includes(dNorm) ||
        r.referredBy?.toLowerCase().includes(dNorm)
      );
    }
    if (params?.from_date) {
      reports = reports.filter(r => r.reportDate >= params.from_date!);
    }
    if (params?.to_date) {
      reports = reports.filter(r => r.reportDate <= params.to_date!);
    }
    if (params?.search) {
      const q = params.search.trim().toLowerCase();
      reports = reports.filter(r =>
        r.patientName?.toLowerCase().includes(q) ||
        r.uhid?.toLowerCase().includes(q) ||
        r.id?.toLowerCase().includes(q) ||
        r.consultantDr?.toLowerCase().includes(q) ||
        r.referredBy?.toLowerCase().includes(q) ||
        r.conclusion?.toLowerCase().includes(q)
      );
    }

    return {
      success: true,
      count: reports.length,
      reports
    };
  },

  /**
   * Get single echo report by ID.
   */
  async getReportById(reportId: string): Promise<EchoReportSingleResponse> {
    const url = `${API_BASE_URL}/echo-reports/${encodeURIComponent(reportId)}/`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.report) {
          return data;
        }
      }
    } catch {
      // Fallback
    }

    const reports = getFallbackReports();
    const found = reports.find(r => r.id.toUpperCase() === reportId.toUpperCase());
    if (found) {
      return { success: true, report: found };
    }
    throw new Error(`Echo report '${reportId}' not found.`);
  },

  /**
   * Create a new Echo Report linked to an existing patient.
   */
  async createReport(data: Partial<EchoReportRecord>): Promise<EchoReportSingleResponse> {
    const url = `${API_BASE_URL}/echo-reports/`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const resData = await res.json();
      if (res.ok && resData.success) {
        const stored = getFallbackReports();
        stored.unshift(resData.report);
        saveFallbackReports(stored);
        return resData;
      } else {
        throw new Error(resData.error || 'Failed to create Echo Report.');
      }
    } catch (err) {
      if (err instanceof Error && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
        throw err;
      }
    }

    // LocalStorage fallback creation
    const reports = getFallbackReports();
    let maxNum = 1000;
    reports.forEach(r => {
      const num = parseInt(r.id.replace('ECHO-', ''), 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    });

    const newId = `ECHO-${maxNum + 1}`;
    const nowIso = new Date().toISOString();
    const newReport: EchoReportRecord = {
      id: newId,
      uhid: data.uhid || '',
      patientName: data.patientName || '',
      age: data.age || '',
      sex: data.sex || '',
      reportDate: data.reportDate || nowIso.split('T')[0],
      referredBy: data.referredBy || '',
      c_o: data.c_o || '',
      mitralValve: data.mitralValve || '',
      tricuspidValve: data.tricuspidValve || '',
      aorta: data.aorta || '',
      leftVentricle: data.leftVentricle || '',
      rwma: data.rwma || '',
      rightVentricle: data.rightVentricle || '',
      ivc: data.ivc || '',
      aorticValve: data.aorticValve || '',
      pulmonaryValve: data.pulmonaryValve || '',
      lvef: data.lvef || '',
      leftAtrium: data.leftAtrium || '',
      rightAtrium: data.rightAtrium || '',
      rvsp: data.rvsp || '',
      ivs: data.ivs || '',
      septum: data.septum || '',
      lvidd: data.lvidd || '',
      ias: data.ias || '',
      pWall: data.pWall || '',
      lvids: data.lvids || '',
      pericardium: data.pericardium || '',
      dopplerStudy: data.dopplerStudy || '',
      conclusion: data.conclusion || '',
      lvCompliance: data.lvCompliance || '',
      tvi: data.tvi || '',
      leftAorticArchPdaCoarctation: data.leftAorticArchPdaCoarctation || '',
      consultantDr: data.consultantDr || '',
      status: data.status || 'Draft',
      finalizedAt: data.status === 'Finalized' ? nowIso : null,
      finalizedBy: data.status === 'Finalized' ? (data.consultantDr || 'Dr.') : null,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    reports.unshift(newReport);
    saveFallbackReports(reports);
    return {
      success: true,
      report: newReport,
      message: `Echo report '${newId}' created successfully.`
    };
  },

  /**
   * Update an existing Echo Report.
   */
  async updateReport(
    reportId: string,
    data: Partial<EchoReportRecord>,
    allowFinalizedEdit = false
  ): Promise<EchoReportSingleResponse> {
    const url = `${API_BASE_URL}/echo-reports/${encodeURIComponent(reportId)}/`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, allow_finalized_edit: allowFinalizedEdit }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const resData = await res.json();
      if (res.ok && resData.success) {
        const stored = getFallbackReports();
        const idx = stored.findIndex(r => r.id.toUpperCase() === reportId.toUpperCase());
        if (idx !== -1) {
          stored[idx] = resData.report;
          saveFallbackReports(stored);
        }
        return resData;
      } else {
        throw new Error(resData.error || 'Failed to update Echo Report.');
      }
    } catch (err) {
      if (err instanceof Error && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
        throw err;
      }
    }

    // LocalStorage fallback update
    const reports = getFallbackReports();
    const idx = reports.findIndex(r => r.id.toUpperCase() === reportId.toUpperCase());
    if (idx === -1) {
      throw new Error(`Echo report '${reportId}' not found.`);
    }

    const current = reports[idx];
    if (current.status === 'Finalized' && !allowFinalizedEdit) {
      throw new Error(`Echo report '${reportId}' is finalized and locked from modification.`);
    }

    const updated: EchoReportRecord = {
      ...current,
      ...data,
      id: current.id,
      uhid: current.uhid,
      updatedAt: new Date().toISOString()
    };

    reports[idx] = updated;
    saveFallbackReports(reports);
    return {
      success: true,
      report: updated,
      message: `Echo report '${reportId}' updated successfully.`
    };
  },

  /**
   * Finalize and lock Echo Report.
   */
  async finalizeReport(reportId: string, finalizedBy?: string): Promise<EchoReportSingleResponse> {
    const url = `${API_BASE_URL}/echo-reports/${encodeURIComponent(reportId)}/finalize/`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ finalizedBy }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const resData = await res.json();
      if (res.ok && resData.success) {
        const stored = getFallbackReports();
        const idx = stored.findIndex(r => r.id.toUpperCase() === reportId.toUpperCase());
        if (idx !== -1) {
          stored[idx] = resData.report;
          saveFallbackReports(stored);
        }
        return resData;
      } else {
        throw new Error(resData.error || 'Failed to finalize Echo Report.');
      }
    } catch (err) {
      if (err instanceof Error && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
        throw err;
      }
    }

    // LocalStorage fallback
    const reports = getFallbackReports();
    const idx = reports.findIndex(r => r.id.toUpperCase() === reportId.toUpperCase());
    if (idx === -1) throw new Error(`Echo report '${reportId}' not found.`);

    const nowIso = new Date().toISOString();
    reports[idx].status = 'Finalized';
    reports[idx].finalizedAt = nowIso;
    reports[idx].finalizedBy = finalizedBy || reports[idx].consultantDr || 'Consultant Physician';
    reports[idx].updatedAt = nowIso;

    saveFallbackReports(reports);
    return {
      success: true,
      report: reports[idx],
      message: `Echo report '${reportId}' has been finalized and locked.`
    };
  },

  /**
   * Delete an Echo Report by ID.
   */
  async deleteReport(reportId: string): Promise<EchoReportDeleteResponse> {
    const url = `${API_BASE_URL}/echo-reports/${encodeURIComponent(reportId)}/`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(url, { method: 'DELETE', signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const resData = await res.json();
        const stored = getFallbackReports().filter(r => r.id.toUpperCase() !== reportId.toUpperCase());
        saveFallbackReports(stored);
        return resData;
      }
    } catch {
      // Fallback
    }

    const reports = getFallbackReports().filter(r => r.id.toUpperCase() !== reportId.toUpperCase());
    saveFallbackReports(reports);
    return {
      success: true,
      message: `Echo report '${reportId}' deleted successfully.`
    };
  }
};

