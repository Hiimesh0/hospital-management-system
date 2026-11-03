import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Search, Save, LogOut, Edit2, CheckSquare, Square, 
  Trash2, Printer, X, AlertCircle, CheckCircle2, UserCheck, ShieldAlert
} from 'lucide-react';
import { doctorApi, type DoctorRecord } from '../../api/masterApi';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';
import { HOSPITAL_CONFIG } from '../../config/hospitalConfig';
import styles from './DoctorMaster.module.css';

const DEFAULT_DOCTOR: DoctorRecord = {
  id: '',
  drHosRef: 'Hospital Doctor',
  drType: 'Consultant Physician',
  title: 'Dr.',
  drName: '',
  degree: '',
  speciality: '',
  department: '',
  drRegNo: '',
  hospitalName: true,
  birthDate: '',
  wedding: '',
  panNo: '',
  adharNo: '',
  mobileNo: '',
  phNoR: '',
  email: '',
  consultationFee: 500,
  followupFee: 300,
  clinicName: '',
  address: '',
  area: '',
  city: 'SURAT',
  pin: '',
  state: 'GUJARAT',
  country: 'INDIA',
  clinicPhNo: '',
  status: 'active'
};

const DoctorMaster: React.FC = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<DoctorRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [formData, setFormData] = useState<DoctorRecord>(DEFAULT_DOCTOR);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [_isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [printChecked, setPrintChecked] = useState<boolean>(false);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchSpeciality, setSearchSpeciality] = useState<string>('All');
  const [searchStatus, setSearchStatus] = useState<string>('All');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification<{
    type: 'success' | 'error';
    message: string;
  }>();

  // Load doctors from backend JSON storage
  const loadDoctors = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await doctorApi.getDoctors();
      const list = res.doctors || [];
      setDoctors(list);
      if (list.length > 0) {
        setCurrentIndex(0);
        setFormData(list[0]);
        setIsCreateMode(false);
      } else {
        setFormData(DEFAULT_DOCTOR);
        setIsCreateMode(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect to doctors storage.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsLoading(false);
    }
  }, [setNotification]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  // Sync formData when currentIndex changes (when not in create mode)
  const handleSelectIndex = (idx: number) => {
    if (idx >= 0 && idx < doctors.length) {
      setCurrentIndex(idx);
      setFormData(doctors[idx]);
      setIsCreateMode(false);
      dismissNotification();
    }
  };

  // Field change handler
  const handleInputChange = (field: keyof DoctorRecord, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validation
  const validateForm = (): string | null => {
    if (!formData.drName || formData.drName.trim().length < 2) {
      return 'Doctor Name is required and must be at least 2 characters.';
    }
    if (!formData.mobileNo || !formData.mobileNo.trim()) {
      return 'Mobile Number is required.';
    }
    const cleanMobile = formData.mobileNo.replace(/[^0-9]/g, '');
    if (cleanMobile.length < 10 || cleanMobile.length > 15) {
      return 'Please provide a valid 10-15 digit mobile number.';
    }
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        return 'Please enter a valid email address.';
      }
    }
    if (formData.consultationFee !== undefined && formData.consultationFee < 0) {
      return 'Consultation Fee cannot be negative.';
    }
    if (formData.followupFee !== undefined && formData.followupFee < 0) {
      return 'Follow-up Fee cannot be negative.';
    }
    return null;
  };

  // Add / Create Doctor
  const handleAddClick = async () => {
    if (!isCreateMode) {
      // Enter create mode
      setIsCreateMode(true);
      const nextId = `DR-${doctors.length + 101}`;
      setFormData({
        ...DEFAULT_DOCTOR,
        id: nextId
      });
      setNotification({
        type: 'success',
        message: 'New doctor form initialized. Fill details and click "Save Doctor" to record.'
      });
      return;
    }

    // Save newly created doctor
    const error = validateForm();
    if (error) {
      setNotification({ type: 'error', message: error });
      return;
    }

    setIsSaving(true);
    try {
      const res = await doctorApi.createDoctor(formData);
      setNotification({
        type: 'success',
        message: `Doctor ${res.doctor.drName} created successfully with ID ${res.doctor.id}.`
      });
      const updatedList = [...doctors, res.doctor];
      setDoctors(updatedList);
      setCurrentIndex(updatedList.length - 1);
      setFormData(res.doctor);
      setIsCreateMode(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save doctor.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  // Update existing doctor
  const handleUpdateClick = async () => {
    if (isCreateMode) {
      handleAddClick();
      return;
    }

    const error = validateForm();
    if (error) {
      setNotification({ type: 'error', message: error });
      return;
    }

    setIsSaving(true);
    try {
      const res = await doctorApi.updateDoctor(formData.id, formData);
      setNotification({
        type: 'success',
        message: `Doctor ${res.doctor.drName} (${res.doctor.id}) updated successfully.`
      });
      const updatedList = [...doctors];
      updatedList[currentIndex] = res.doctor;
      setDoctors(updatedList);
      setFormData(res.doctor);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update doctor.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete or Deactivate
  const handleConfirmDelete = async (force: boolean) => {
    if (!formData.id) return;
    setIsSaving(true);
    try {
      const res = await doctorApi.deleteDoctor(formData.id, force);
      setNotification({
        type: 'success',
        message: res.message
      });
      setIsDeleteModalOpen(false);

      if (res.action === 'deleted') {
        const updatedList = doctors.filter(d => d.id !== formData.id);
        setDoctors(updatedList);
        if (updatedList.length > 0) {
          const nextIdx = Math.min(currentIndex, updatedList.length - 1);
          setCurrentIndex(nextIdx);
          setFormData(updatedList[nextIdx]);
        } else {
          setFormData(DEFAULT_DOCTOR);
          setIsCreateMode(true);
        }
      } else {
        // Deactivated
        const updatedList = [...doctors];
        updatedList[currentIndex] = { ...updatedList[currentIndex], status: 'inactive' };
        setDoctors(updatedList);
        setFormData(prev => ({ ...prev, status: 'inactive' }));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  // Extract unique specialities for search dropdown
  const availableSpecialities = useMemo(() => {
    const set = new Set<string>();
    doctors.forEach(d => {
      if (d.speciality) set.add(d.speciality);
    });
    return Array.from(set).sort();
  }, [doctors]);

  // Filtered doctors for Search Modal
  const filteredDoctors = useMemo(() => {
    return doctors.filter(d => {
      if (searchStatus !== 'All' && d.status !== searchStatus) return false;
      if (searchSpeciality !== 'All' && d.speciality !== searchSpeciality) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const fullName = `${d.title} ${d.drName}`.toLowerCase();
        const matches =
          fullName.includes(q) ||
          d.id.toLowerCase().includes(q) ||
          (d.drRegNo && d.drRegNo.toLowerCase().includes(q)) ||
          d.mobileNo.includes(q) ||
          (d.speciality && d.speciality.toLowerCase().includes(q)) ||
          (d.department && d.department.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [doctors, searchQuery, searchSpeciality, searchStatus]);

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.recordCounter}>
            {isCreateMode
              ? `New Record (Total: ${doctors.length})`
              : `${doctors.length > 0 ? currentIndex + 1 : 0} of ${doctors.length}`}
          </span>
          <span className={styles.idBadge}>
            Dr ID: {isCreateMode ? `${formData.id || 'Pending'}` : formData.id || '--'}
          </span>
          <h1 className={styles.pageTitle}>Doctor Master</h1>
        </div>

        {formData.status === 'inactive' && !isCreateMode && (
          <span className={styles.badgeInactive}>Record Deactivated / Inactive</span>
        )}
      </div>

      {/* Notifications */}
      {notification && (
        <div className={notification.type === 'success' ? styles.alertSuccess : styles.alertError} role="alert">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={dismissNotification}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Form Container */}
      <div className={styles.formContainer}>
        {/* General Information Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>General Information</h2>

          {/* Row 1: Dr Hos/Ref, Dr Type, Status */}
          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 1.5 }}>
              <label className={styles.label}>Dr Hos/Ref :</label>
              <select
                className={styles.input}
                style={{ backgroundColor: 'var(--primary)', color: 'white', borderColor: 'var(--primary)', fontWeight: 600 }}
                value={formData.drHosRef}
                onChange={e => handleInputChange('drHosRef', e.target.value)}
              >
                <option value="Hospital Doctor">Hospital Doctor</option>
                <option value="Reference Doctor">Reference Doctor</option>
                <option value="Both">Both</option>
              </select>
            </div>

            <div className={styles.fieldGroup} style={{ flex: 1.5 }}>
              <label className={styles.label}>Dr Type :</label>
              <select
                className={styles.input}
                value={formData.drType}
                onChange={e => handleInputChange('drType', e.target.value)}
              >
                <option value="Consultant Physician">Consultant Physician</option>
                <option value="Consultant Surgeon">Consultant Surgeon</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Radiologist">Radiologist</option>
                <option value="Reference Doctor">Reference Doctor</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="General Practitioner">General Practitioner</option>
                <option value="Resident Doctor">Resident Doctor</option>
                <option value="Visiting Doctor">Visiting Doctor</option>
              </select>
            </div>

            <div className={styles.fieldGroup} style={{ flex: 1, justifyContent: 'flex-end' }}>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="status"
                    checked={formData.status === 'active'}
                    onChange={() => handleInputChange('status', 'active')}
                  />{' '}
                  Active
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="status"
                    checked={formData.status === 'inactive'}
                    onChange={() => handleInputChange('status', 'inactive')}
                  />{' '}
                  Inactive
                </label>
              </div>
            </div>
          </div>

          {/* Row 2: Dr. Name (Prefix + text), Hospital Name checkbox, Degree */}
          <div className={styles.row} style={{ alignItems: 'flex-start' }}>
            <div className={styles.col} style={{ flex: 2 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Dr.Name :</label>
                  <select
                    className={styles.input}
                    style={{ flex: '0 0 80px' }}
                    value={formData.title}
                    onChange={e => handleInputChange('title', e.target.value)}
                  >
                    <option value="Dr.">Dr.</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                  </select>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="First Middle Last"
                    value={formData.drName}
                    onChange={e => handleInputChange('drName', e.target.value)}
                  />
                </div>
                <div className={styles.helperText}>Format : first middle last - degree</div>
              </div>
            </div>

            <div className={styles.col} style={{ flex: 1.2, justifyContent: 'center', paddingTop: '10px' }}>
              <div
                className={styles.checkboxItem}
                onClick={() => handleInputChange('hospitalName', !formData.hospitalName)}
              >
                {formData.hospitalName ? (
                  <CheckSquare size={16} color="var(--primary)" />
                ) : (
                  <Square size={16} color="var(--text-muted)" />
                )}
                <span style={{ color: formData.hospitalName ? 'var(--text-main)' : 'var(--text-muted)' }}>
                  Hospital Name
                </span>
              </div>
            </div>

            <div className={styles.col} style={{ flex: 1.5 }}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Degree :</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. MBBS, MD, MS"
                  value={formData.degree || ''}
                  onChange={e => handleInputChange('degree', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Row 3: Speciality, Department, Dr. Reg No */}
          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 1.2 }}>
              <label className={styles.label}>Speciality :</label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Cardiology, Surgery"
                value={formData.speciality || ''}
                onChange={e => handleInputChange('speciality', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1.2 }}>
              <label className={styles.label}>Department :</label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Medicine, OPD, Surgery"
                value={formData.department || ''}
                onChange={e => handleInputChange('department', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Dr. Reg No :</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Medical Council Reg"
                value={formData.drRegNo || ''}
                onChange={e => handleInputChange('drRegNo', e.target.value)}
              />
            </div>
          </div>

          {/* Row 4: Birth Date, Wedding, PanNo, Adhar No */}
          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Birth Date :</label>
              <input
                type="date"
                className={styles.input}
                max="2099-12-31"
                value={formData.birthDate || ''}
                onChange={e => handleInputChange('birthDate', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Wedding :</label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. 24-Dec"
                value={formData.wedding || ''}
                onChange={e => handleInputChange('wedding', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>PanNo :</label>
              <input
                type="text"
                className={styles.input}
                placeholder="PAN Number"
                value={formData.panNo || ''}
                onChange={e => handleInputChange('panNo', e.target.value.toUpperCase())}
              />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label} style={{ width: '80px' }}>Adhar No :</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Aadhaar Card No"
                value={formData.adharNo || ''}
                onChange={e => handleInputChange('adharNo', e.target.value)}
              />
            </div>
          </div>

          {/* Row 5: Mobile No, Ph.No.(R), E-Mail */}
          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Mobile No. :</label>
              <input
                type="tel"
                className={styles.input}
                placeholder="10-digit mobile"
                value={formData.mobileNo}
                onChange={e => handleInputChange('mobileNo', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Ph.No.(R) :</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Residence Phone"
                value={formData.phNoR || ''}
                onChange={e => handleInputChange('phNoR', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1.5 }}>
              <label className={styles.label}>E-Mail :</label>
              <input
                type="email"
                className={styles.input}
                placeholder="doctor@hospital.com"
                value={formData.email || ''}
                onChange={e => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>

          {/* Row 6: Consultation Fee & Follow-up Fee */}
          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Consultation Fee :</label>
              <input
                type="number"
                min="0"
                className={styles.input}
                placeholder="₹ 500"
                value={formData.consultationFee ?? ''}
                onChange={e => handleInputChange('consultationFee', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Follow-up Fee :</label>
              <input
                type="number"
                min="0"
                className={styles.input}
                placeholder="₹ 300"
                value={formData.followupFee ?? ''}
                onChange={e => handleInputChange('followupFee', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div style={{ flex: 1.5 }} />
          </div>
        </div>

        {/* Clinic Detail Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Clinic Detail</h2>

          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Clinic Name :</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Clinic / Hospital Branch Name"
                value={formData.clinicName || ''}
                onChange={e => handleInputChange('clinicName', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Address :</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Street Address, Building, Landmark"
                value={formData.address || ''}
                onChange={e => handleInputChange('address', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Area :</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Area / Locality"
                value={formData.area || ''}
                onChange={e => handleInputChange('area', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>City :</label>
              <input
                type="text"
                className={styles.input}
                value={formData.city || 'SURAT'}
                onChange={e => handleInputChange('city', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Pin :</label>
              <input
                type="text"
                className={styles.input}
                placeholder="PIN Code"
                value={formData.pin || ''}
                onChange={e => handleInputChange('pin', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>State :</label>
              <input
                type="text"
                className={styles.input}
                value={formData.state || 'GUJARAT'}
                onChange={e => handleInputChange('state', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Country :</label>
              <input
                type="text"
                className={styles.input}
                value={formData.country || 'INDIA'}
                onChange={e => handleInputChange('country', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Clinic Ph.No. :</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Clinic Phone / Landline"
                value={formData.clinicPhNo || ''}
                onChange={e => handleInputChange('clinicPhNo', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.navControls}>
          <button
            type="button"
            className={styles.navBtn}
            title="First Record"
            disabled={currentIndex === 0 || isCreateMode}
            onClick={() => handleSelectIndex(0)}
          >
            <ChevronsLeft size={20} />
          </button>
          <button
            type="button"
            className={styles.navBtn}
            title="Previous Record"
            disabled={currentIndex === 0 || isCreateMode}
            onClick={() => handleSelectIndex(currentIndex - 1)}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            className={styles.navBtn}
            title="Next Record"
            disabled={currentIndex >= doctors.length - 1 || isCreateMode}
            onClick={() => handleSelectIndex(currentIndex + 1)}
          >
            <ChevronRight size={20} />
          </button>
          <button
            type="button"
            className={styles.navBtn}
            title="Last Record"
            disabled={currentIndex >= doctors.length - 1 || isCreateMode}
            onClick={() => handleSelectIndex(doctors.length - 1)}
          >
            <ChevronsRight size={20} />
          </button>
        </div>

        <div className={styles.middleActions}>
          <div
            className={styles.printBtn}
            onClick={() => {
              setPrintChecked(!printChecked);
              setIsPrintModalOpen(true);
            }}
          >
            {printChecked ? <CheckSquare size={18} color="var(--primary)" /> : <Square size={18} />}
            <span>Print Profile</span>
          </div>

          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => setIsSearchOpen(true)}
            style={{ marginLeft: '16px' }}
          >
            <Search size={18} /> Particular Search
          </button>
        </div>

        <div className={styles.rightActions}>
          <button
            type="button"
            className={styles.primaryBtn}
            disabled={isSaving}
            onClick={handleAddClick}
          >
            <Save size={18} /> {isCreateMode ? 'Save Doctor' : 'Add New'}
          </button>

          {!isCreateMode && (
            <button
              type="button"
              className={styles.secondaryBtn}
              disabled={isSaving}
              onClick={handleUpdateClick}
            >
              <Edit2 size={18} /> Update
            </button>
          )}

          {!isCreateMode && (
            <button
              type="button"
              className={styles.dangerBtn}
              disabled={isSaving}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 size={18} /> Delete / Deactivate
            </button>
          )}

          <button
            type="button"
            className={styles.secondaryBtn}
            style={{ marginLeft: '16px' }}
            onClick={() => navigate('/')}
          >
            <LogOut size={18} /> Exit
          </button>
        </div>
      </div>

      {/* Particular Search Modal */}
      {isSearchOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsSearchOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <Search size={18} color="var(--primary)" /> Particular Search — Doctor Directory
              </h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsSearchOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.searchToolbar}>
                <div className={styles.searchBox}>
                  <Search size={16} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder="Instant search by Doctor Name, ID, Reg No, Mobile, or Speciality..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className={styles.filterRow}>
                  <select
                    className={styles.filterSelect}
                    value={searchSpeciality}
                    onChange={e => setSearchSpeciality(e.target.value)}
                  >
                    <option value="All">All Specialities</option>
                    {availableSpecialities.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  <select
                    className={styles.filterSelect}
                    value={searchStatus}
                    onChange={e => setSearchStatus(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>

                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                    Showing {filteredDoctors.length} of {doctors.length} doctors
                  </span>
                </div>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.modalTable}>
                  <thead>
                    <tr>
                      <th>Doctor ID</th>
                      <th>Doctor Name</th>
                      <th>Speciality</th>
                      <th>Department</th>
                      <th>Mobile</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDoctors.length === 0 ? (
                      <tr>
                        <td colSpan={6} className={styles.emptyState}>
                          No doctors found matching the search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredDoctors.map(doc => (
                        <tr
                          key={doc.id}
                          className={`${styles.tableRow} ${doc.id === formData.id ? styles.tableRowSelected : ''}`}
                          onClick={() => {
                            const idx = doctors.findIndex(d => d.id === doc.id);
                            if (idx !== -1) handleSelectIndex(idx);
                            setIsSearchOpen(false);
                          }}
                        >
                          <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{doc.id}</td>
                          <td>
                            <strong>{doc.title} {doc.drName}</strong>
                            {doc.degree && <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '6px' }}>({doc.degree})</span>}
                          </td>
                          <td>{doc.speciality || '-'}</td>
                          <td>{doc.department || '-'}</td>
                          <td>{doc.mobileNo}</td>
                          <td>
                            {doc.status === 'active' ? (
                              <span className={styles.badgeActive}>Active</span>
                            ) : (
                              <span className={styles.badgeInactive}>Inactive</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setIsSearchOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete / Deactivate Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsDeleteModalOpen(false)}>
          <div className={styles.modalContent} style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle} style={{ color: 'var(--danger)' }}>
                <ShieldAlert size={20} /> Delete or Deactivate Doctor
              </h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5 }}>
                You are about to remove <strong>{formData.title} {formData.drName} ({formData.id})</strong>.
              </p>
              <div style={{ backgroundColor: 'var(--warning-soft)', padding: '12px', borderRadius: '6px', fontSize: '13px', color: 'var(--text-main)' }}>
                <strong>Healthcare Best Practice:</strong> We recommend <em>Deactivating</em> the doctor instead of permanent deletion. This preserves historical patient registrations, prescriptions, and billing receipts while preventing future selections.
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                onClick={() => handleConfirmDelete(false)}
              >
                Deactivate (Safe)
              </button>
              <button
                type="button"
                className={styles.dangerBtn}
                onClick={() => handleConfirmDelete(true)}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Profile Preview Modal */}
      {isPrintModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsPrintModalOpen(false)}>
          <div className={styles.modalContent} style={{ maxWidth: '650px' }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <Printer size={18} /> Doctor Profile Preview — {HOSPITAL_CONFIG.name}
              </h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsPrintModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody} id="doctor-print-area">
              <div style={{ border: '2px solid var(--border)', padding: '24px', borderRadius: '8px', background: 'var(--surface)' }}>
                <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px' }}>
                  <h2 style={{ margin: 0, color: 'var(--primary)', fontSize: '20px' }}>{HOSPITAL_CONFIG.name}</h2>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '12px' }}>{HOSPITAL_CONFIG.address}</p>
                  <p style={{ margin: '2px 0 0 0', color: 'var(--text-muted)', fontSize: '12px' }}>Phone: {HOSPITAL_CONFIG.phone} | Email: {HOSPITAL_CONFIG.email}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                  <div><strong>Doctor ID:</strong> {formData.id}</div>
                  <div><strong>Doctor Type:</strong> {formData.drType}</div>
                  <div><strong>Full Name:</strong> {formData.title} {formData.drName}</div>
                  <div><strong>Degree:</strong> {formData.degree || '-'}</div>
                  <div><strong>Speciality:</strong> {formData.speciality || '-'}</div>
                  <div><strong>Department:</strong> {formData.department || '-'}</div>
                  <div><strong>Medical Reg No:</strong> {formData.drRegNo || '-'}</div>
                  <div><strong>Status:</strong> {formData.status.toUpperCase()}</div>
                  <div><strong>Mobile:</strong> {formData.mobileNo}</div>
                  <div><strong>Email:</strong> {formData.email || '-'}</div>
                  <div><strong>Consultation Fee:</strong> ₹ {formData.consultationFee || 0}</div>
                  <div><strong>Follow-up Fee:</strong> ₹ {formData.followupFee || 0}</div>
                  <div style={{ gridColumn: 'span 2' }}><strong>Clinic / Branch:</strong> {formData.clinicName || '-'}</div>
                  <div style={{ gridColumn: 'span 2' }}><strong>Clinic Address:</strong> {formData.address || '-'}, {formData.city} - {formData.pin}</div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setIsPrintModalOpen(false)}
              >
                Close
              </button>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => window.print()}
              >
                <Printer size={16} /> Print Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorMaster;
