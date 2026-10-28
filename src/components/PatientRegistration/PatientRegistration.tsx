import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  ListPlus,
  RotateCcw,
  ArrowLeft,
  Save,
  Edit2,
  Printer,
  ScanLine,
  Barcode
} from 'lucide-react';
import { patientApi } from '../../api/patientApi';
import type { PatientRecord, PatientFormData } from '../../api/patientApi';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';
import { useFormKeyboardNavigation } from '../../hooks/useFormKeyboardNavigation';
import { openPatientStickerPdf } from '../../utils/patientStickerGenerator';
import styles from './PatientRegistration.module.css';


const defaultFormState: PatientFormData = {
  category: 'NEW',
  firstName: '',
  middleName: '',
  lastName: '',
  birthDate: '',
  age: '',
  ageUnit: 'Years',
  sex: 'Male',
  hospitalDoctor: 'Dr. NILESH MAHALE',
  referenceBy: 'DR. NIKUNJ VITHALANI',
  religion: 'Hindu',
  maritalStatus: '',
  weight: '',
  height: '',
  mobile: '',
  email: '',
  streetAddress: '',
  city: 'SURAT',
  state: 'GUJARAT',
  pinCode: '',
  autoSms: true,
  estimate: '',
  aadharNo: '',
  panNo: '',
  mediclaim: '',
  membershipId: '',
  employeeId: '',
  companyName: '',
  remark: ''
};

const PatientRegistration: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<PatientFormData>(defaultFormState);
  const [initialEditData, setInitialEditData] = useState<PatientFormData | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [totalRecordsCount, setTotalRecordsCount] = useState<number>(0);
  const [assignedUhidPreview, setAssignedUhidPreview] = useState<string>('UHID-1001');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isPrintingSticker, setIsPrintingSticker] = useState<boolean>(false);
  const [scannedBarcode, setScannedBarcode] = useState<string>('');
  const [loadedSavedPatient, setLoadedSavedPatient] = useState<PatientRecord | null>(null);

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification<{
    type: 'success' | 'error';
    message: string;
    uhid?: string;
    persistent?: boolean;
  }>();

  // Fast keyboard navigation via Shift + Enter
  const { formRef, handleKeyDown: handleFormKeyDown } = useFormKeyboardNavigation();

  // Search Lookup Modal
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [lookupQuery, setLookupQuery] = useState<string>('');
  const [lookupPatients, setLookupPatients] = useState<PatientRecord[]>([]);

  // Load record count & initial preview UHID from backend
  const fetchBackendMeta = useCallback(async () => {
    try {
      const data = await patientApi.getPatients();
      const list = data.patients || [];
      setTotalRecordsCount(list.length);
      setLookupPatients(list);

      // Compute next available UHID
      let maxNum = 1000;
      list.forEach(p => {
        const u = p.uhid || p.id || '';
        if (u.startsWith('UHID-')) {
          const num = parseInt(u.replace('UHID-', ''), 10);
          if (!isNaN(num) && num > maxNum) maxNum = num;
        }
      });
      setAssignedUhidPreview(`UHID-${maxNum + 1}`);
    } catch {
      // Backend offline fallback handled gracefully
    }
  }, []);

  useEffect(() => {
    fetchBackendMeta();
  }, [fetchBackendMeta]);

  // Check URL query parameters for ?id=UHID-XXXX (Edit Mode)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idParam = params.get('id');

    if (idParam) {
      setIsEditMode(true);
      setEditId(idParam);
      patientApi
        .getPatientById(idParam)
        .then(res => {
          if (res.patient) {
            const p = res.patient;
            const loaded: PatientFormData = {
              category: p.category || 'NEW',
              firstName: p.firstName || '',
              middleName: p.middleName || '',
              lastName: p.lastName || '',
              birthDate: p.birthDate || '',
              age: p.age || '',
              ageUnit: p.ageUnit || 'Years',
              sex: p.sex || 'Male',
              hospitalDoctor: p.hospitalDoctor || 'Dr. NILESH MAHALE',
              referenceBy: p.referenceBy || '',
              religion: p.religion || 'Hindu',
              maritalStatus: p.maritalStatus || '',
              weight: p.weight || '',
              height: p.height || '',
              mobile: p.mobile || '',
              email: p.email || '',
              streetAddress: p.streetAddress || '',
              city: p.city || 'SURAT',
              state: p.state || 'GUJARAT',
              pinCode: p.pinCode || '',
              autoSms: p.autoSms !== undefined ? p.autoSms : true,
              estimate: p.estimate || '',
              aadharNo: p.aadharNo || '',
              panNo: p.panNo || '',
              mediclaim: p.mediclaim || '',
              membershipId: p.membershipId || '',
              employeeId: p.employeeId || '',
              companyName: p.companyName || '',
              remark: p.remark || ''
            };
            setFormData(loaded);
            setInitialEditData(loaded);
            setLoadedSavedPatient(p);
            setNotification({
              type: 'success',
              message: `Loaded patient ${p.uhid} (${p.firstName} ${p.lastName}) for editing.`
            });
          }
        })
        .catch(err => {
          setNotification({
            type: 'error',
            message: `Could not load patient '${idParam}': ${err.message}`
          });
        });
    } else {
      setIsEditMode(false);
      setEditId(null);
      setFormData(defaultFormState);
      setInitialEditData(null);
      setLoadedSavedPatient(null);
    }
  }, [location.search, setNotification]);


  // Handle Birth Date change to auto-calculate Age
  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateVal = e.target.value;
    setFormData(prev => {
      const updated = { ...prev, birthDate: dateVal };
      if (dateVal) {
        const birthYear = new Date(dateVal).getFullYear();
        const currentYear = new Date().getFullYear();
        if (birthYear && birthYear <= currentYear) {
          updated.age = String(Math.max(0, currentYear - birthYear));
          updated.ageUnit = 'Years';
        }
      }
      return updated;
    });
  };

  // Handle Age change to approximate Birth Date
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ageVal = e.target.value;
    setFormData(prev => {
      const updated = { ...prev, age: ageVal };
      const parsedAge = parseInt(ageVal, 10);
      if (!isNaN(parsedAge) && parsedAge >= 0 && parsedAge <= 125) {
        const birthYear = new Date().getFullYear() - parsedAge;
        updated.birthDate = `${birthYear}-01-01`;
      }
      return updated;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Submit Handler: Supports both Create and Update operations
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    // Validate Required Fields (Persistent validation messages remain until resolved)
    const trimmedFirstName = formData.firstName.trim();
    if (!trimmedFirstName) {
      setNotification({ type: 'error', message: 'First Name is required.', persistent: true });
      return;
    }
    if (trimmedFirstName.length < 2) {
      setNotification({ type: 'error', message: 'First Name must contain at least 2 characters.', persistent: true });
      return;
    }

    const trimmedAge = formData.age.trim();
    if (!trimmedAge) {
      setNotification({ type: 'error', message: 'Age is required.', persistent: true });
      return;
    }
    const ageNum = parseInt(trimmedAge, 10);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 130) {
      setNotification({ type: 'error', message: 'Please enter a valid age between 0 and 130.', persistent: true });
      return;
    }

    const trimmedMobile = formData.mobile.trim();
    if (!trimmedMobile) {
      setNotification({ type: 'error', message: 'Mobile Number is required.', persistent: true });
      return;
    }
    const cleanMobile = trimmedMobile.replace(/[-+\s]/g, '');
    if (!cleanMobile.match(/^[0-9]{10,15}$/)) {
      setNotification({ type: 'error', message: 'Please enter a valid 10-15 digit mobile number.', persistent: true });
      return;
    }

    if (!formData.hospitalDoctor.trim()) {
      setNotification({ type: 'error', message: 'Hospital Doctor is required.', persistent: true });
      return;
    }

    setIsSubmitting(true);
    dismissNotification();

    try {
      if (isEditMode && editId) {
        // UPDATE EXISTING PATIENT
        const res = await patientApi.updatePatient(editId, formData);
        setNotification({
          type: 'success',
          message: `Patient ${res.patient.firstName} ${res.patient.lastName} (${res.patient.uhid}) updated successfully!`,
          uhid: res.patient.uhid
        });
        setInitialEditData(formData);
        setLoadedSavedPatient(res.patient);
        fetchBackendMeta();
      } else {
        // CREATE NEW PATIENT
        const res = await patientApi.createPatient(formData);
        const newUhid = res.patient.uhid;
        setNotification({
          type: 'success',
          message: `Patient ${res.patient.firstName} ${res.patient.lastName} registered successfully with ${newUhid}!`,
          uhid: newUhid
        });
        setLoadedSavedPatient(res.patient);

        // Reset form for next patient registration
        setFormData(defaultFormState);
        fetchBackendMeta();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset or clear form
  const handleResetForm = () => {
    if (isEditMode && initialEditData) {
      setFormData(initialEditData);
      setNotification({ type: 'success', message: 'Form values restored to loaded patient record.' });
    } else {
      setFormData(defaultFormState);
      dismissNotification();
    }
  };

  // Switch back to create new patient mode
  const handleSwitchToCreateMode = () => {
    setIsEditMode(false);
    setEditId(null);
    setFormData(defaultFormState);
    setInitialEditData(null);
    setLoadedSavedPatient(null);
    navigate('/patient-registration');
  };

  // Print Patient Sticker (100mm x 50mm PDF with Code 128 barcode)
  const handlePrintSticker = async () => {
    if (isPrintingSticker) return;

    // 1. Validate that the patient record has been saved
    if (!isEditMode || !editId) {
      setNotification({
        type: 'error',
        message: 'Please register and save the patient record first before generating or printing the patient sticker.'
      });
      return;
    }

    // 2. Warn if there are unsaved edits in the form
    if (initialEditData && JSON.stringify(formData) !== JSON.stringify(initialEditData)) {
      setNotification({
        type: 'error',
        message: 'Notice: Printing sticker with the last saved record. Save changes to update the sticker details.'
      });
    }

    setIsPrintingSticker(true);
    try {
      // 3. Retrieve authoritative saved record
      let recordToPrint = loadedSavedPatient;
      if (!recordToPrint || recordToPrint.uhid !== editId) {
        const res = await patientApi.getPatientById(editId);
        recordToPrint = res.patient;
        setLoadedSavedPatient(res.patient);
      }

      if (!recordToPrint) {
        throw new Error(`Patient record '${editId}' could not be retrieved.`);
      }

      // 4. Open PDF in a new tab
      const backendUrl = patientApi.getStickerPdfUrl(editId);
      await openPatientStickerPdf(recordToPrint, backendUrl);

      setNotification({
        type: 'success',
        message: `Patient Sticker PDF for ${recordToPrint.uhid} (${recordToPrint.firstName} ${recordToPrint.lastName}) opened in a new tab. Ready for printing.`
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate sticker PDF.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsPrintingSticker(false);
    }
  };

  // Barcode Scanner / UHID Quick Lookup Handler
  const handleBarcodeScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanId = scannedBarcode.trim();
    if (!cleanId) return;

    try {
      const res = await patientApi.getPatientById(cleanId);
      if (res.patient) {
        setScannedBarcode('');
        navigate(`/patient-registration?id=${encodeURIComponent(res.patient.uhid)}`);
        setNotification({
          type: 'success',
          message: `Barcode Scanned: Successfully loaded patient ${res.patient.uhid} (${res.patient.firstName} ${res.patient.lastName}) for editing.`
        });
      }
    } catch {
      setNotification({
        type: 'error',
        message: `Patient not found: No registered record matches scanned barcode '${cleanId}'.`
      });
    }
  };


  // Filter lookup patients in search modal
  const filteredLookup = lookupPatients.filter(p => {
    const q = lookupQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.uhid.toLowerCase().includes(q) ||
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q) ||
      p.mobile.includes(q)
    );
  });

  return (
    <div className={`${styles.container} ${styles.pageContainer}`}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            {isEditMode ? `Edit Patient Record: ${editId}` : 'Patient Registration'}
          </h1>
          <p className={styles.subtitle}>
            {isEditMode
              ? 'Update existing patient details in JSON storage'
              : 'Register new patient and save securely to JSON storage'}
          </p>
        </div>
        <div className={styles.metaInfo}>
          <span className={styles.badge}>
            {isEditMode ? 'MODE: EDITING' : 'MODE: CREATE'}
          </span>
          <span className={styles.badge}>
            Total Records: {totalRecordsCount}
          </span>
          {!isEditMode && (
            <span className={styles.badge} style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Next UHID: {assignedUhidPreview}
            </span>
          )}
          <span className={styles.badge} title="Press Shift + Enter to quickly jump to the next field">
            ⌨️ Shift + Enter: Next Field
          </span>
        </div>
      </header>

      {/* Notifications Banner */}
      {notification && (
        <div className={notification.type === 'success' ? styles.alertSuccess : styles.alertError} role="alert">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{notification.message}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {notification.type === 'success' && (
              <>
                {notification.uhid && (
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnPrintSticker}`}
                    style={{ height: '28px', fontSize: '0.75rem', padding: '0 8px' }}
                    onClick={() => {
                      const u = notification.uhid;
                      if (!u) return;
                      patientApi.getPatientById(u).then(res => {
                        if (res.patient) {
                          openPatientStickerPdf(res.patient, patientApi.getStickerPdfUrl(u));
                        }
                      });
                    }}
                  >
                    <Printer size={13} style={{ marginRight: '4px' }} /> Print Sticker
                  </button>
                )}
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  style={{ height: '28px', fontSize: '0.75rem', padding: '0 8px' }}
                  onClick={() => navigate('/patient-registration-list')}
                >
                  <ListPlus size={13} style={{ marginRight: '4px' }} /> View in Patient List
                </button>
              </>
            )}
            <button
              type="button"
              onClick={dismissNotification}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Barcode Scanner / UHID Quick Lookup Toolbar */}
      <div className={styles.barcodeScanBar}>
        <div className={styles.barcodeScanGroup}>
          <ScanLine size={18} color="#0f766e" />
          <input
            type="text"
            className={styles.barcodeInput}
            placeholder="Scan Patient Barcode or Type UHID (e.g. UHID-1001) & press Enter..."
            value={scannedBarcode}
            onChange={e => setScannedBarcode(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                handleBarcodeScan();
              }
            }}
            aria-label="Scan patient barcode or lookup UHID"
          />
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary}`}
            style={{ height: '32px', fontSize: '0.8rem', padding: '0 12px' }}
            onClick={() => handleBarcodeScan()}
          >
            Lookup
          </button>
        </div>
        <div className={styles.barcodeBadge}>
          <Barcode size={15} />
          <span>USB Barcode Scanner Ready (Code 128)</span>
        </div>
      </div>

      {/* Form Element */}
      <form ref={formRef} onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} noValidate>

        {/* Section 1: Basic Information */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Basic Information</h2>
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.colSpan2}`}>
              <label className={styles.label}>Category</label>
              <select
                name="category"
                className={styles.select}
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="NEW">NEW</option>
                <option value="OLD">OLD</option>
              </select>
            </div>

            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>
                First Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="firstName"
                required
                className={styles.input}
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="e.g. Ramesh"
              />
            </div>

            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Middle Name</label>
              <input
                type="text"
                name="middleName"
                className={styles.input}
                value={formData.middleName}
                onChange={handleInputChange}
                placeholder="e.g. Kumar"
              />
            </div>

            <div className={`${styles.formGroup} ${styles.colSpan4}`}>
              <label className={styles.label}>Last Name</label>
              <input
                type="text"
                name="lastName"
                className={styles.input}
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="e.g. Patel"
              />
            </div>

            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Birth Date</label>
              <input
                type="date"
                name="birthDate"
                className={styles.input}
                value={formData.birthDate}
                onChange={handleBirthDateChange}
              />
            </div>

            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>
                Age <span className={styles.required}>*</span>
              </label>
              <div className={styles.inlineInputs}>
                <input
                  type="number"
                  name="age"
                  min="0"
                  max="130"
                  required
                  className={styles.input}
                  value={formData.age}
                  onChange={handleAgeChange}
                  placeholder="35"
                />
                <select
                  name="ageUnit"
                  className={styles.select}
                  value={formData.ageUnit}
                  onChange={handleInputChange}
                  style={{ maxWidth: '100px' }}
                >
                  <option value="Years">Years</option>
                  <option value="Months">Months</option>
                  <option value="Days">Days</option>
                </select>
              </div>
            </div>

            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>
                Sex <span className={styles.required}>*</span>
              </label>
              <select
                name="sex"
                className={styles.select}
                value={formData.sex}
                onChange={handleInputChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section 2: Demographics & Clinical (Grid Rebalanced - 12 Columns) */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Demographics & Clinical</h2>
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.colSpan6}`}>
              <label className={styles.label}>
                Hospital Doctor <span className={styles.required}>*</span>
              </label>
              <select
                name="hospitalDoctor"
                className={styles.select}
                value={formData.hospitalDoctor}
                onChange={handleInputChange}
              >
                <option value="Dr. NILESH MAHALE">Dr. NILESH MAHALE</option>
                <option value="Dr. ASHOK PATEL">Dr. ASHOK PATEL</option>
                <option value="Dr. SHARMA">Dr. SHARMA</option>
                <option value="Dr. R. K. DESAI">Dr. R. K. DESAI</option>
              </select>
            </div>
            <div className={`${styles.formGroup} ${styles.colSpan6}`}>
              <label className={styles.label}>Reference By</label>
              <select
                name="referenceBy"
                className={styles.select}
                value={formData.referenceBy}
                onChange={handleInputChange}
              >
                <option value="DR. NIKUNJ VITHALANI">DR. NIKUNJ VITHALANI</option>
                <option value="DR. ANAND SHAH">DR. ANAND SHAH</option>
                <option value="SELF">SELF</option>
              </select>
            </div>

            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Religion</label>
              <select
                name="religion"
                className={styles.select}
                value={formData.religion}
                onChange={handleInputChange}
              >
                <option value="Hindu">Hindu</option>
                <option value="Muslim">Muslim</option>
                <option value="Christian">Christian</option>
                <option value="Sikh">Sikh</option>
                <option value="Jain">Jain</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Marital Status</label>
              <select
                name="maritalStatus"
                className={styles.select}
                value={formData.maritalStatus}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Divorced">Divorced</option>
              </select>
            </div>
            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Weight (kg)</label>
              <input
                type="number"
                name="weight"
                step="0.1"
                min="0"
                max="300"
                className={styles.input}
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="e.g. 70"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Height (cm)</label>
              <input
                type="number"
                name="height"
                min="0"
                max="250"
                className={styles.input}
                value={formData.height}
                onChange={handleInputChange}
                placeholder="e.g. 175"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Contact & Address */}
        <section className={styles.section}>
          <div className={styles.formGrid}>
            {/* Communication Details */}
            <div className={`${styles.colSpan6} ${styles.splitSectionLeft}`}>
              <h2 className={styles.sectionTitle}>Communication Details</h2>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.colSpan6}`}>
                  <label className={styles.label}>
                    Mobile <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    pattern="[0-9]{10,15}"
                    className={styles.input}
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.colSpan6}`}>
                  <label className={styles.label}>Email</label>
                  <input
                    type="email"
                    name="email"
                    className={styles.input}
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="patient@example.com"
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.colSpan12}`}>
                  <div className={styles.checkboxGroup}>
                    <input
                      type="checkbox"
                      id="autoSms"
                      name="autoSms"
                      className={styles.checkbox}
                      checked={formData.autoSms}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="autoSms" className={styles.checkboxLabel}>
                      Enable Automated SMS & Notifications
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className={`${styles.colSpan6} ${styles.splitSectionRight}`}>
              <h2 className={styles.sectionTitle}>Address Details</h2>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.colSpan12}`}>
                  <label className={styles.label}>Street Address</label>
                  <input
                    type="text"
                    name="streetAddress"
                    className={styles.input}
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    placeholder="House/Flat No, Street, Landmark"
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.colSpan4}`}>
                  <label className={styles.label}>City</label>
                  <input
                    type="text"
                    name="city"
                    className={styles.input}
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.colSpan4}`}>
                  <label className={styles.label}>State</label>
                  <input
                    type="text"
                    name="state"
                    className={styles.input}
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.colSpan4}`}>
                  <label className={styles.label}>PIN Code</label>
                  <input
                    type="text"
                    name="pinCode"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    className={styles.input}
                    value={formData.pinCode}
                    onChange={handleInputChange}
                    placeholder="395001"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Other Details (Grid Rebalanced - 12 Columns) */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Other Details & Identification</h2>
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Estimate</label>
              <input
                type="text"
                name="estimate"
                className={styles.input}
                value={formData.estimate}
                onChange={handleInputChange}
              />
            </div>
            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Aadhar No</label>
              <input
                type="text"
                name="aadharNo"
                maxLength={14}
                className={styles.input}
                value={formData.aadharNo}
                onChange={handleInputChange}
                placeholder="XXXX-XXXX-XXXX"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Pan No</label>
              <input
                type="text"
                name="panNo"
                maxLength={10}
                className={styles.input}
                value={formData.panNo}
                onChange={handleInputChange}
                placeholder="ABCDE1234F"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Mediclaim</label>
              <input
                type="text"
                name="mediclaim"
                className={styles.input}
                value={formData.mediclaim}
                onChange={handleInputChange}
              />
            </div>

            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Membership ID</label>
              <input
                type="text"
                name="membershipId"
                className={styles.input}
                value={formData.membershipId}
                onChange={handleInputChange}
              />
            </div>
            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Employee ID</label>
              <input
                type="text"
                name="employeeId"
                className={styles.input}
                value={formData.employeeId}
                onChange={handleInputChange}
              />
            </div>
            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Company Name</label>
              <input
                type="text"
                name="companyName"
                className={styles.input}
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </div>
            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Remark</label>
              <input
                type="text"
                name="remark"
                className={styles.input}
                value={formData.remark}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </section>

        {/* Action Button Bar */}
        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={handleResetForm}
            disabled={isSubmitting}
            title={isEditMode ? 'Restore original loaded values' : 'Clear all input fields'}
          >
            <RotateCcw size={15} style={{ marginRight: '6px' }} />
            {isEditMode ? 'Reset Values' : 'Clear Form'}
          </button>

          {isEditMode ? (
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={handleSwitchToCreateMode}
              disabled={isSubmitting}
            >
              <ArrowLeft size={15} style={{ marginRight: '6px' }} />
              Cancel Edit
            </button>
          ) : (
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={15} style={{ marginRight: '6px' }} />
              Quick Search Patient ({lookupPatients.length})
            </button>
          )}

          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => navigate('/patient-registration-list')}
          >
            <ListPlus size={15} style={{ marginRight: '6px' }} />
            Patient Registration List
          </button>

          {/* Print Patient Sticker Button */}
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrintSticker}`}
            onClick={handlePrintSticker}
            disabled={isPrintingSticker || isSubmitting}
            title={
              isEditMode
                ? 'Generate and print 100mm x 50mm patient sticker PDF with barcode'
                : 'Save patient first to enable printing sticker'
            }
          >
            <Printer size={15} style={{ marginRight: '6px' }} />
            {isPrintingSticker ? 'Generating Sticker...' : 'Print Patient Sticker'}
          </button>

          <button
            type="submit"
            className={`${styles.btn} ${styles.btnPrimary}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>Saving to JSON...</span>
            ) : isEditMode ? (
              <>
                <Edit2 size={16} style={{ marginRight: '6px' }} />
                Update Patient Record
              </>
            ) : (
              <>
                <Save size={16} style={{ marginRight: '6px' }} />
                Register / Save Patient
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Search Patient Lookup Modal */}
      {isSearchOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsSearchOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 600 }}>
                Backend Registered Patients ({lookupPatients.length})
              </h3>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                className={styles.input}
                placeholder="Instant Search by UHID, Name, or Mobile..."
                value={lookupQuery}
                onChange={e => setLookupQuery(e.target.value)}
                autoFocus
              />
            </div>

            <div style={{ maxHeight: '360px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredLookup.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No registered patients found. Register a new patient in the form.
                </div>
              ) : (
                filteredLookup.map(p => (
                  <div
                    key={p.uhid}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg-color)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                        {p.firstName} {p.middleName} {p.lastName}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        UHID: <strong style={{ color: 'var(--primary)' }}>{p.uhid}</strong> • Mobile: {p.mobile} • Age: {p.age} {p.ageUnit} • Gender: {p.sex}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnPrintSticker}`}
                        style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                        onClick={() => openPatientStickerPdf(p, patientApi.getStickerPdfUrl(p.uhid))}
                        title="Print Patient Sticker"
                      >
                        <Printer size={13} style={{ marginRight: '4px' }} /> Sticker
                      </button>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnSecondary}`}
                        style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                        onClick={() => {
                          navigate(`/patient-registration?id=${encodeURIComponent(p.uhid)}`);
                          setIsSearchOpen(false);
                        }}
                      >
                        Load for Editing
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PatientRegistration;
