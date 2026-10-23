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

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://127.0.0.1:8000/api'
    : 'http://127.0.0.1:8000/api');

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

    const url = `${API_BASE_URL}/patients/${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to fetch patients (HTTP ${res.status})`);
    }

    return res.json();
  },

  /**
   * Get single patient by ID or UHID
   */
  async getPatientById(id: string): Promise<PatientSingleResponse> {
    const res = await fetch(`${API_BASE_URL}/patients/${encodeURIComponent(id)}/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Patient not found (HTTP ${res.status})`);
    }

    return res.json();
  },

  /**
   * Create a new patient record
   */
  async createPatient(data: Partial<PatientFormData>): Promise<PatientSingleResponse> {
    const res = await fetch(`${API_BASE_URL}/patients/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const resData = await res.json().catch(() => ({}));

    if (!res.ok) {
      let msg = resData.error || 'Failed to register patient.';
      if (resData.details) {
        const fieldErrors = Object.entries(resData.details)
          .map(([f, errs]) => `${f}: ${(errs as string[]).join(', ')}`)
          .join('; ');
        msg = `${msg}: ${fieldErrors}`;
      }
      throw new Error(msg);
    }

    return resData;
  },

  /**
   * Update an existing patient record
   */
  async updatePatient(id: string, data: Partial<PatientRecord>): Promise<PatientSingleResponse> {
    const res = await fetch(`${API_BASE_URL}/patients/${encodeURIComponent(id)}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const resData = await res.json().catch(() => ({}));

    if (!res.ok) {
      let msg = resData.error || 'Failed to update patient.';
      if (resData.details) {
        const fieldErrors = Object.entries(resData.details)
          .map(([f, errs]) => `${f}: ${(errs as string[]).join(', ')}`)
          .join('; ');
        msg = `${msg}: ${fieldErrors}`;
      }
      throw new Error(msg);
    }

    return resData;
  },

  /**
   * Delete a patient record
   */
  async deletePatient(id: string): Promise<PatientDeleteResponse> {
    const res = await fetch(`${API_BASE_URL}/patients/${encodeURIComponent(id)}/`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });

    const resData = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(resData.error || `Failed to delete patient (HTTP ${res.status})`);
    }

    return resData;
  },
};
