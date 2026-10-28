/**
 * Central Hospital Configuration
 * Single source of truth for hospital identity parameters across all frontend pages,
 * PDF generators, print layouts, and branding areas.
 *
 * Configured values:
 * - Hospital Name: XYZ
 * - Hospital Address: XYZ
 * - Hospital Phone: XYZ
 * - Hospital Email: XYZ
 */

export interface HospitalConfig {
  name: string;
  subTitle?: string;
  address: string;
  phone: string;
  email: string;
  managedBy?: string;
  cinNo?: string;
  logoUrl?: string;
  nabhAccredited?: boolean;
}

export const HOSPITAL_CONFIG: HospitalConfig = {
  name: 'XYZ',
  subTitle: 'XYZ',
  address: 'XYZ',
  phone: 'XYZ',
  email: 'XYZ',
  managedBy: '',
  cinNo: '',
  logoUrl: '',
  nabhAccredited: true,
};

/**
 * Helper to retrieve active hospital configuration
 */
export function getHospitalConfig(): HospitalConfig {
  return { ...HOSPITAL_CONFIG };
}

export default HOSPITAL_CONFIG;
