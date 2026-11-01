import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Barcode,
  Camera,
  FileText,
  Receipt,
  Lock,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  UserPlus,
  UserCheck,
  Users
} from 'lucide-react';
import { patientApi } from '../../api/patientApi';
import type { PatientRecord, PatientFormData, PatientBillRecord, ChargeItem } from '../../api/patientApi';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';
import { useFormKeyboardNavigation } from '../../hooks/useFormKeyboardNavigation';
import { openPatientStickerPdf } from '../../utils/patientStickerGenerator';
import { openPatientBillPdf } from '../../utils/patientBillGenerator';
import { BarcodeCameraModal } from './BarcodeCameraModal';
import styles from './PatientRegistration.module.css';

interface DynamicBillRow {
  id: string;
  chargeName: string;
  amount: number | string;
  isCustom?: boolean;
}

const defaultFormState: PatientFormData = {
  category: 'NEW',
  firstName: '',
  middleName: '',
  lastName: '',
  birthDate: '',
  age: '',
  ageUnit: 'Years',
  ageMonths: '',
  ageDays: '',
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

const AVAILABLE_DOCTORS = [
  'Dr. NILESH MAHALE',
  'Dr. ASHOK PATEL',
  'Dr. SHARMA',
  'Dr. R. K. DESAI',
  'DR. NIKUNJ VITHALANI',
  'DR. ANAND SHAH',
  'Dr. DEVANG DESAI / JIGAR PATEL'
];

/**
 * Accurately calculates Years, Months, and Days from Birth Date.
 */
export const calculateAgeFromBirthDate = (birthDateStr: string) => {
  if (!birthDateStr) return { years: '', months: '', days: '' };
  const birth = new Date(birthDateStr);
  const today = new Date();
  if (isNaN(birth.getTime()) || birth > today) {
    return { years: '', months: '', days: '' };
  }
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return {
    years: String(Math.max(0, years)),
    months: String(Math.max(0, months)),
    days: String(Math.max(0, days))
  };
};

const PatientRegistration: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<PatientFormData>(defaultFormState);
  const [initialEditData, setInitialEditData] = useState<PatientFormData | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isPrintingSticker, setIsPrintingSticker] = useState<boolean>(false);
  const [scannedBarcode, setScannedBarcode] = useState<string>('');
  const [loadedSavedPatient, setLoadedSavedPatient] = useState<PatientRecord | null>(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState<boolean>(false);
  const [pendingScannedPatient, setPendingScannedPatient] = useState<PatientRecord | null>(null);
  const [showUnsavedConfirmModal, setShowUnsavedConfirmModal] = useState<boolean>(false);

  // Collapsible Registration Sections state
  const [isDemographicsOpen, setIsDemographicsOpen] = useState<boolean>(false);
  const [isAddressOpen, setIsAddressOpen] = useState<boolean>(false);
  const [isOtherOpen, setIsOtherOpen] = useState<boolean>(false);

  // Patient History List & Search state
  const [historySearchQuery, setHistorySearchQuery] = useState<string>('');
  const [historyFromDate, setHistoryFromDate] = useState<string>('');
  const [historyToDate, setHistoryToDate] = useState<string>('');
  const [historyCategory, setHistoryCategory] = useState<string>('All');
  const [historyDoctor, setHistoryDoctor] = useState<string>('All');
  const [historyCurrentPage, setHistoryCurrentPage] = useState<number>(1);
  const HISTORY_PAGE_SIZE = 10;

  // Dynamic Billing States
  const [chargeMaster, setChargeMaster] = useState<ChargeItem[]>([]);
  const [isGeneratingBill, setIsGeneratingBill] = useState<boolean>(false);
  const [isBillCardOpen, setIsBillCardOpen] = useState<boolean>(false);
  const [billPaymentType, setBillPaymentType] = useState<string>('Cash');
  const [billAmountReceived, setBillAmountReceived] = useState<number | string>(500);
  const [billDiscountType, setBillDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [billDiscountValue, setBillDiscountValue] = useState<number | string>(0);
  const [billDiscountDoctor, setBillDiscountDoctor] = useState<string>('Dr. NILESH MAHALE');
  const [billDiscountRemark, setBillDiscountRemark] = useState<string>('');
  const [discountError, setDiscountError] = useState<string>('');
  const [activeBillPatient, setActiveBillPatient] = useState<PatientRecord | null>(null);
  const [existingPatientBill, setExistingPatientBill] = useState<PatientBillRecord | null>(null);
  const [billRows, setBillRows] = useState<DynamicBillRow[]>([
    { id: 'row-1', chargeName: 'Consultation Charge', amount: 500 }
  ]);

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification<{
    type: 'success' | 'error';
    message: string;
    uhid?: string;
    persistent?: boolean;
  }>();

  // Fast keyboard navigation via Enter key
  const { formRef, handleKeyDown: handleFormKeyDown } = useFormKeyboardNavigation();

  // Search Lookup Modal (Retained for quick access)
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [lookupQuery, setLookupQuery] = useState<string>('');
  const [lookupPatients, setLookupPatients] = useState<PatientRecord[]>([]);

  // Load record count & initial preview UHID from backend
  const fetchBackendMeta = useCallback(async () => {
    try {
      const data = await patientApi.getPatients();
      const list = data.patients || [];
      setLookupPatients(list);
    } catch {
      // Backend offline fallback handled gracefully
    }
  }, []);

  useEffect(() => {
    fetchBackendMeta();
  }, [fetchBackendMeta]);

  // Load Charge Master
  useEffect(() => {
    patientApi
      .getChargeMaster()
      .then(charges => {
        if (charges && charges.length > 0) {
          setChargeMaster(charges);
        }
      })
      .catch(() => {
        // Handled gracefully via default fallback
      });
  }, []);

  // Check URL query parameters for ?id=UHID-XXXX (Edit/Locked Mode)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idParam = params.get('id');

    if (idParam) {
      setIsEditMode(true);
      setEditId(idParam);
      setIsLocked(true);
      patientApi
        .getPatientById(idParam)
        .then(res => {
          if (res.patient) {
            const p = res.patient;
            const { years, months, days } = calculateAgeFromBirthDate(p.birthDate || '');
            const loaded: PatientFormData = {
              category: p.category || 'NEW',
              firstName: p.firstName || '',
              middleName: p.middleName || '',
              lastName: p.lastName || '',
              birthDate: p.birthDate || '',
              age: p.age || years || '',
              ageUnit: p.ageUnit || 'Years',
              ageMonths: p.ageMonths || months || '',
              ageDays: p.ageDays || days || '',
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
              message: `Loaded patient ${p.uhid} (${p.firstName} ${p.lastName}). Record is locked.`
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
      setIsLocked(false);
      setEditId(null);
      setFormData(defaultFormState);
      setInitialEditData(null);
      setLoadedSavedPatient(null);
    }
  }, [location.search, setNotification]);

  // Handle Birth Date change to auto-calculate Age in Years, Months, and Days
  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateVal = e.target.value;
    const todayStr = new Date().toISOString().split('T')[0];
    if (dateVal && dateVal > todayStr) {
      setNotification({ type: 'error', message: 'Birth Date cannot be in the future.' });
      return;
    }
    const { years, months, days } = calculateAgeFromBirthDate(dateVal);
    setFormData(prev => ({
      ...prev,
      birthDate: dateVal,
      age: years,
      ageMonths: months,
      ageDays: days,
      ageUnit: 'Years'
    }));
  };

  // Handle Age Years change to approximate Birth Date consistently
  const handleYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const parsedYears = parseInt(val, 10);
    setFormData(prev => {
      const updated = { ...prev, age: val };
      if (!isNaN(parsedYears) && parsedYears >= 0 && parsedYears <= 130) {
        const currentYear = new Date().getFullYear();
        const birthYear = currentYear - parsedYears;
        const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
        const currentDay = String(new Date().getDate()).padStart(2, '0');
        updated.birthDate = `${birthYear}-${currentMonth}-${currentDay}`;
      }
      return updated;
    });
  };

  const handleMonthsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const parsed = parseInt(val, 10);
    if (val !== '' && (isNaN(parsed) || parsed < 0 || parsed > 11)) return;
    setFormData(prev => ({ ...prev, ageMonths: val }));
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const parsed = parseInt(val, 10);
    if (val !== '' && (isNaN(parsed) || parsed < 0 || parsed > 30)) return;
    setFormData(prev => ({ ...prev, ageDays: val }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Submit Handler: Supports both Create and Update operations with Record Locking
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting || isLocked) return;

    // Validate Required Fields
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
      setNotification({ type: 'error', message: 'Age in years is required.', persistent: true });
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
          message: `Patient ${res.patient.firstName} ${res.patient.lastName} (${res.patient.uhid}) updated successfully! Record locked.`,
          uhid: res.patient.uhid
        });
        setInitialEditData(formData);
        setLoadedSavedPatient(res.patient);
        setIsLocked(true);
        fetchBackendMeta();
      } else {
        // CREATE NEW PATIENT
        const res = await patientApi.createPatient(formData);
        const newUhid = res.patient.uhid;
        setNotification({
          type: 'success',
          message: `Patient ${res.patient.firstName} ${res.patient.lastName} registered successfully with ${newUhid}! Record locked.`,
          uhid: newUhid
        });
        setLoadedSavedPatient(res.patient);
        setIsEditMode(true);
        setEditId(newUhid);
        setInitialEditData(formData);
        setIsLocked(true);
        navigate(`/patient-registration?id=${encodeURIComponent(newUhid)}`, { replace: true });
        fetchBackendMeta();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Explicit unlock to edit record
  const handleUnlockForEdit = () => {
    setIsLocked(false);
    setIsEditMode(true);
    setNotification({
      type: 'success',
      message: `Record unlocked for editing (${editId || loadedSavedPatient?.uhid}). Modify fields and click 'Update Patient Record' to save.`
    });
  };

  // Cancel edit mode and revert to locked view
  const handleCancelEdit = () => {
    if (initialEditData) {
      setFormData(initialEditData);
    }
    setIsLocked(true);
    setNotification({
      type: 'success',
      message: 'Edit cancelled. Form restored to saved patient record.'
    });
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
    setIsLocked(false);
    setEditId(null);
    setFormData(defaultFormState);
    setInitialEditData(null);
    setLoadedSavedPatient(null);
    dismissNotification();
    navigate('/patient-registration');
  };

  // Print Patient Sticker (100mm x 50mm PDF with Code 128 barcode)
  const handlePrintSticker = async () => {
    if (isPrintingSticker) return;

    const targetUhid = editId || loadedSavedPatient?.uhid;
    if (!targetUhid) {
      setNotification({
        type: 'error',
        message: 'Please register and save the patient record first before generating or printing the patient sticker.'
      });
      return;
    }

    if (!isLocked && initialEditData && JSON.stringify(formData) !== JSON.stringify(initialEditData)) {
      setNotification({
        type: 'error',
        message: 'Notice: Printing sticker with the last saved record. Save changes to update sticker details.'
      });
    }

    setIsPrintingSticker(true);
    try {
      let recordToPrint = loadedSavedPatient;
      if (!recordToPrint || recordToPrint.uhid !== targetUhid) {
        const res = await patientApi.getPatientById(targetUhid);
        recordToPrint = res.patient;
        setLoadedSavedPatient(res.patient);
      }

      if (!recordToPrint) {
        throw new Error(`Patient record '${targetUhid}' could not be retrieved.`);
      }

      const backendUrl = patientApi.getStickerPdfUrl(targetUhid);
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

  // Open Dynamic Bill Card Modal
  const handleBillButtonClick = async () => {
    if (isGeneratingBill) return;

    const targetUhid = editId || loadedSavedPatient?.uhid;
    if (!targetUhid) {
      setNotification({
        type: 'error',
        message: 'Please register and save the patient record first before issuing or printing a bill.'
      });
      return;
    }

    setIsGeneratingBill(true);
    try {
      let recordToBill = loadedSavedPatient;
      if (!recordToBill || recordToBill.uhid !== targetUhid) {
        const res = await patientApi.getPatientById(targetUhid);
        recordToBill = res.patient;
        setLoadedSavedPatient(res.patient);
      }

      if (!recordToBill) {
        throw new Error(`Patient record '${targetUhid}' could not be retrieved.`);
      }

      setActiveBillPatient(recordToBill);

      // Check if bill already exists for this patient
      const existing = await patientApi.getPatientBill(targetUhid);
      setExistingPatientBill(existing);

      if (existing && existing.items && existing.items.length > 0) {
        setBillRows(
          existing.items.map((it, idx) => ({
            id: `row-${idx}-${Date.now()}`,
            chargeName: it.details,
            amount: it.rate || it.amount
          }))
        );
        setBillPaymentType(existing.paymentType || 'Cash');
        setBillDiscountType(existing.discountType || 'percentage');
        setBillDiscountValue(existing.discountValue !== undefined ? existing.discountValue : 0);
        setBillDiscountDoctor(existing.discountDoctor || recordToBill.hospitalDoctor || AVAILABLE_DOCTORS[0]);
        setBillDiscountRemark(existing.discountRemark || '');
        setBillAmountReceived(
          existing.amountReceived !== undefined
            ? existing.amountReceived
            : (existing.netPayable !== undefined ? existing.netPayable : existing.totalAmount)
        );
      } else {
        const defaultCharge = chargeMaster.find(c => c.name.toLowerCase().includes('consultation')) || chargeMaster[0] || {
          name: 'Consultation Charge',
          amount: 500
        };
        setBillRows([
          {
            id: `row-1-${Date.now()}`,
            chargeName: defaultCharge.name,
            amount: defaultCharge.amount
          }
        ]);
        setBillPaymentType('Cash');
        setBillDiscountType('percentage');
        setBillDiscountValue(0);
        setBillDiscountDoctor(recordToBill.hospitalDoctor || AVAILABLE_DOCTORS[0]);
        setBillDiscountRemark('');
        setBillAmountReceived(defaultCharge.amount);
      }

      setDiscountError('');
      setIsBillCardOpen(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve or generate bill.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsGeneratingBill(false);
    }
  };

  // Open Dynamic Bill Card directly from lookup list or notification
  const handleOpenSavedPatientBill = async (uhid: string) => {
    if (!uhid || isGeneratingBill) return;
    setIsGeneratingBill(true);
    try {
      const pRes = await patientApi.getPatientById(uhid);
      if (!pRes.patient) throw new Error(`Patient '${uhid}' not found.`);
      const p = pRes.patient;
      setActiveBillPatient(p);

      const existing = await patientApi.getPatientBill(uhid);
      setExistingPatientBill(existing);

      if (existing && existing.items && existing.items.length > 0) {
        setBillRows(
          existing.items.map((it, idx) => ({
            id: `row-${idx}-${Date.now()}`,
            chargeName: it.details,
            amount: it.rate || it.amount
          }))
        );
        setBillPaymentType(existing.paymentType || 'Cash');
        setBillDiscountType(existing.discountType || 'percentage');
        setBillDiscountValue(existing.discountValue !== undefined ? existing.discountValue : 0);
        setBillDiscountDoctor(existing.discountDoctor || p.hospitalDoctor || AVAILABLE_DOCTORS[0]);
        setBillDiscountRemark(existing.discountRemark || '');
        setBillAmountReceived(
          existing.amountReceived !== undefined
            ? existing.amountReceived
            : (existing.netPayable !== undefined ? existing.netPayable : existing.totalAmount)
        );
      } else {
        const defaultCharge = chargeMaster.find(c => c.name.toLowerCase().includes('consultation')) || chargeMaster[0] || {
          name: 'Consultation Charge',
          amount: 500
        };
        setBillRows([
          {
            id: `row-1-${Date.now()}`,
            chargeName: defaultCharge.name,
            amount: defaultCharge.amount
          }
        ]);
        setBillPaymentType('Cash');
        setBillDiscountType('percentage');
        setBillDiscountValue(0);
        setBillDiscountDoctor(p.hospitalDoctor || AVAILABLE_DOCTORS[0]);
        setBillDiscountRemark('');
        setBillAmountReceived(defaultCharge.amount);
      }

      setDiscountError('');
      setIsBillCardOpen(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to open bill card.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsGeneratingBill(false);
    }
  };

  // Dynamic Row Actions
  const handleAddChargeRow = () => {
    const nextCharge = chargeMaster.find(c => !billRows.some(r => r.chargeName === c.name)) || chargeMaster[0] || {
      name: 'Registration Charge',
      amount: 100
    };
    setBillRows(prev => [
      ...prev,
      {
        id: `row-${Date.now()}-${Math.random()}`,
        chargeName: nextCharge.name,
        amount: nextCharge.amount
      }
    ]);
  };

  const handleChargeRowChange = (rowId: string, selectedName: string) => {
    if (selectedName === '__CUSTOM__') {
      setBillRows(prev =>
        prev.map(r => (r.id === rowId ? { ...r, chargeName: 'Custom Charge', amount: 0, isCustom: true } : r))
      );
    } else {
      const found = chargeMaster.find(c => c.name === selectedName);
      const amt = found ? found.amount : 0;
      setBillRows(prev =>
        prev.map(r => (r.id === rowId ? { ...r, chargeName: selectedName, amount: amt, isCustom: false } : r))
      );
    }
  };

  const handleRowAmountChange = (rowId: string, val: string) => {
    setBillRows(prev => prev.map(r => (r.id === rowId ? { ...r, amount: val } : r)));
  };

  const handleRemoveChargeRow = (rowId: string) => {
    if (billRows.length <= 1) {
      setBillRows([{ id: `row-${Date.now()}`, chargeName: 'Consultation Charge', amount: 500 }]);
      return;
    }
    setBillRows(prev => prev.filter(r => r.id !== rowId));
  };

  const subtotalAmount = billRows.reduce((sum, r) => sum + (parseFloat(String(r.amount)) || 0), 0);
  const numericDiscountValue = Math.max(0, parseFloat(String(billDiscountValue)) || 0);
  let calculatedDiscountAmount = 0;
  if (billDiscountType === 'percentage') {
    calculatedDiscountAmount = Math.round(((subtotalAmount * numericDiscountValue) / 100) * 100) / 100;
  } else {
    calculatedDiscountAmount = Math.round(numericDiscountValue * 100) / 100;
  }
  calculatedDiscountAmount = Math.min(subtotalAmount, Math.max(0, calculatedDiscountAmount));
  const netPayable = Math.max(0, Math.round((subtotalAmount - calculatedDiscountAmount) * 100) / 100);
  const numericReceived = parseFloat(String(billAmountReceived)) || 0;
  const dueAmount = Math.max(0, Math.round((netPayable - numericReceived) * 100) / 100);

  // Print Existing Bill without re-issuing
  const handlePrintExistingBill = async () => {
    if (!existingPatientBill || !activeBillPatient) return;
    setIsGeneratingBill(true);
    try {
      const backendUrl = patientApi.getBillPdfUrl(activeBillPatient.uhid);
      await openPatientBillPdf(existingPatientBill, backendUrl);
      setIsBillCardOpen(false);
      setNotification({
        type: 'success',
        message: `Existing Bill ${existingPatientBill.invoiceNo} opened in a new browser tab.`
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to open bill.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsGeneratingBill(false);
    }
  };

  // Confirm issuing bill with dynamic rows & print A4 PDF
  const handlePrintBillCard = async () => {
    if (!activeBillPatient) return;
    if (billRows.length === 0) {
      alert('Please add at least one charge item.');
      return;
    }
    for (const r of billRows) {
      const a = parseFloat(String(r.amount));
      if (isNaN(a) || a <= 0) {
        alert(`Please enter a valid positive amount for '${r.chargeName}'.`);
        return;
      }
    }

    const subtotal = billRows.reduce((sum, r) => sum + (parseFloat(String(r.amount)) || 0), 0);
    const numDiscVal = Math.max(0, parseFloat(String(billDiscountValue)) || 0);

    // Validate discount
    if (billDiscountType === 'percentage') {
      if (numDiscVal < 0 || numDiscVal > 100) {
        setDiscountError('Discount percentage must be between 0% and 100%.');
        return;
      }
    } else {
      if (numDiscVal < 0) {
        setDiscountError('Fixed discount amount cannot be negative.');
        return;
      }
      if (numDiscVal > subtotal) {
        setDiscountError(`Fixed discount (₹${numDiscVal}) cannot exceed subtotal amount (₹${subtotal}).`);
        return;
      }
    }

    const calculatedDiscount = billDiscountType === 'percentage'
      ? Math.round(((subtotal * numDiscVal) / 100) * 100) / 100
      : Math.round(numDiscVal * 100) / 100;

    if (calculatedDiscount > 0) {
      if (!billDiscountDoctor.trim()) {
        setDiscountError('Please select the doctor who authorized this discount.');
        return;
      }
      if (!billDiscountRemark.trim()) {
        setDiscountError('Please enter a remark or reason for authorizing this discount.');
        return;
      }
    }
    setDiscountError('');

    const netPayableCalc = Math.max(0, Math.round((subtotal - calculatedDiscount) * 100) / 100);

    setIsGeneratingBill(true);
    try {
      const itemsPayload = billRows.map((r, idx) => ({
        srNo: idx + 1,
        details: r.chargeName,
        rate: parseFloat(String(r.amount)),
        amount: parseFloat(String(r.amount))
      }));
      const rec = parseFloat(String(billAmountReceived));
      const received = isNaN(rec) ? netPayableCalc : rec;

      const bill = await patientApi.createOrGetPatientBill(activeBillPatient.uhid, {
        items: itemsPayload,
        paymentType: billPaymentType,
        amountReceived: received,
        discountType: billDiscountType,
        discountValue: numDiscVal,
        discountDoctor: calculatedDiscount > 0 ? billDiscountDoctor.trim() : undefined,
        discountRemark: calculatedDiscount > 0 ? billDiscountRemark.trim() : undefined,
        updateExisting: Boolean(existingPatientBill),
        forceNew: !existingPatientBill
      });

      setIsBillCardOpen(false);
      const backendUrl = patientApi.getBillPdfUrl(activeBillPatient.uhid);
      await openPatientBillPdf(bill, backendUrl);

      setNotification({
        type: 'success',
        message: `Bill ${bill.invoiceNo} generated & printed for ${activeBillPatient.firstName} ${activeBillPatient.lastName}. Record remains locked.`,
        uhid: activeBillPatient.uhid
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate bill.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsGeneratingBill(false);
    }
  };

  // Populate form with scanned or loaded patient record safely in locked mode
  const applyScannedPatient = (patient: PatientRecord) => {
    const { years, months, days } = calculateAgeFromBirthDate(patient.birthDate || '');
    const loaded: PatientFormData = {
      category: patient.category || 'NEW',
      firstName: patient.firstName || '',
      middleName: patient.middleName || '',
      lastName: patient.lastName || '',
      birthDate: patient.birthDate || '',
      age: patient.age || years || '',
      ageUnit: patient.ageUnit || 'Years',
      ageMonths: patient.ageMonths || months || '',
      ageDays: patient.ageDays || days || '',
      sex: patient.sex || 'Male',
      hospitalDoctor: patient.hospitalDoctor || 'Dr. NILESH MAHALE',
      referenceBy: patient.referenceBy || '',
      religion: patient.religion || 'Hindu',
      maritalStatus: patient.maritalStatus || '',
      weight: patient.weight || '',
      height: patient.height || '',
      mobile: patient.mobile || '',
      email: patient.email || '',
      streetAddress: patient.streetAddress || '',
      city: patient.city || 'SURAT',
      state: patient.state || 'GUJARAT',
      pinCode: patient.pinCode || '',
      autoSms: patient.autoSms !== undefined ? patient.autoSms : true,
      estimate: patient.estimate || '',
      aadharNo: patient.aadharNo || '',
      panNo: patient.panNo || '',
      mediclaim: patient.mediclaim || '',
      membershipId: patient.membershipId || '',
      employeeId: patient.employeeId || '',
      companyName: patient.companyName || '',
      remark: patient.remark || ''
    };

    setFormData(loaded);
    setInitialEditData(loaded);
    setLoadedSavedPatient(patient);
    setIsEditMode(true);
    setEditId(patient.uhid);
    setIsLocked(true);
    navigate(`/patient-registration?id=${encodeURIComponent(patient.uhid)}`);

    setNotification({
      type: 'success',
      message: `Loaded patient ${patient.uhid} (${patient.firstName} ${patient.lastName}). Record is locked. Click 'Edit Record' to modify.`
    });
    setPendingScannedPatient(null);
    setShowUnsavedConfirmModal(false);
  };

  // Load patient from Patient History table with unsaved data check
  const handleLoadExistingPatient = (patient: PatientRecord) => {
    let hasUnsavedChanges = false;
    if (!isLocked) {
      if (isEditMode && initialEditData) {
        hasUnsavedChanges = JSON.stringify(formData) !== JSON.stringify(initialEditData);
      } else {
        hasUnsavedChanges = Boolean(
          formData.firstName.trim() ||
          formData.lastName.trim() ||
          formData.mobile.trim() ||
          formData.age.trim() ||
          formData.streetAddress.trim() ||
          formData.aadharNo.trim()
        );
      }
    }

    if (hasUnsavedChanges) {
      setPendingScannedPatient(patient);
      setShowUnsavedConfirmModal(true);
    } else {
      applyScannedPatient(patient);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Switch to new patient registration with preservation of entered search query
  const handleRegisterNewPatientFromSearch = () => {
    const searchVal = historySearchQuery.trim();
    setIsEditMode(false);
    setIsLocked(false);
    setEditId(null);
    setInitialEditData(null);
    setLoadedSavedPatient(null);
    setFormData(prev => ({
      ...defaultFormState,
      category: 'NEW',
      firstName: prev.firstName || (searchVal && !searchVal.match(/^[0-9]+$/) && !searchVal.startsWith('UHID-') ? searchVal : prev.firstName),
      mobile: prev.mobile || (searchVal && searchVal.match(/^[0-9]{10,15}$/) ? searchVal : prev.mobile)
    }));
    dismissNotification();
    navigate('/patient-registration');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Unified lookup processor with unsaved data safety
  const handleProcessBarcodeLookup = async (scannedCode: string, _source: 'Camera' | 'USB Scanner') => {
    const cleanId = scannedCode.trim();
    if (!cleanId) return;

    try {
      const res = await patientApi.getPatientById(cleanId);
      if (!res.patient) {
        setNotification({
          type: 'error',
          message: `Patient Not Found: No registered record matches barcode '${cleanId}'.`
        });
        return;
      }

      const patient = res.patient;
      let hasUnsavedChanges = false;
      if (!isLocked) {
        if (isEditMode && initialEditData) {
          hasUnsavedChanges = JSON.stringify(formData) !== JSON.stringify(initialEditData);
        } else {
          hasUnsavedChanges = Boolean(
            formData.firstName.trim() ||
            formData.lastName.trim() ||
            formData.mobile.trim() ||
            formData.age.trim() ||
            formData.streetAddress.trim() ||
            formData.aadharNo.trim()
          );
        }
      }

      if (hasUnsavedChanges) {
        setPendingScannedPatient(patient);
        setShowUnsavedConfirmModal(true);
      } else {
        applyScannedPatient(patient);
      }
    } catch {
      setNotification({
        type: 'error',
        message: `Patient Not Found: No registered record matches barcode '${cleanId}'.`
      });
    }
  };

  // Barcode Scanner / UHID Quick Lookup Handler (Keyboard/Wedge)
  const handleBarcodeScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!scannedBarcode.trim()) return;
    const code = scannedBarcode;
    setScannedBarcode('');
    await handleProcessBarcodeLookup(code, 'USB Scanner');
  };

  // Camera Barcode Scanner success callback
  const handleCameraScanSuccess = async (scannedCode: string) => {
    setIsCameraModalOpen(false);
    await handleProcessBarcodeLookup(scannedCode, 'Camera');
  };

  // Doctors list for history filter
  const historyAvailableDoctors = useMemo(() => {
    const docs = new Set<string>(AVAILABLE_DOCTORS);
    lookupPatients.forEach(p => {
      if (p.hospitalDoctor) docs.add(p.hospitalDoctor);
    });
    return Array.from(docs).sort();
  }, [lookupPatients]);

  // Real-time instant search & combined filtering for Patient History
  const filteredHistoryPatients = useMemo(() => {
    const query = (historySearchQuery || (!isLocked && !isEditMode ? formData.firstName : '')).toLowerCase().trim();

    return lookupPatients.filter(patient => {
      // 1. Instant Text Search (First Name, Full Name, UHID, Mobile Number)
      if (query) {
        const fullName = `${patient.firstName} ${patient.middleName || ''} ${patient.lastName || ''}`.toLowerCase();
        const matchesQuery =
          patient.firstName.toLowerCase().includes(query) ||
          fullName.includes(query) ||
          patient.uhid.toLowerCase().includes(query) ||
          patient.mobile.includes(query);

        if (!matchesQuery) return false;
      }

      // 2. Registration Date Range Filter
      const regDate = patient.createdAt ? patient.createdAt.substring(0, 10) : '';
      if (historyFromDate && regDate && regDate < historyFromDate) {
        return false;
      }
      if (historyToDate && regDate && regDate > historyToDate) {
        return false;
      }

      // 3. Category Filter
      if (historyCategory !== 'All' && patient.category !== historyCategory) {
        return false;
      }

      // 4. Doctor Filter
      if (historyDoctor !== 'All' && patient.hospitalDoctor !== historyDoctor) {
        return false;
      }

      return true;
    });
  }, [lookupPatients, historySearchQuery, formData.firstName, isLocked, isEditMode, historyFromDate, historyToDate, historyCategory, historyDoctor]);

  const handleResetHistoryFilters = () => {
    setHistorySearchQuery('');
    setHistoryFromDate('');
    setHistoryToDate('');
    setHistoryCategory('All');
    setHistoryDoctor('All');
    setHistoryCurrentPage(1);
  };

  const isHistoryFiltered =
    historySearchQuery.trim() !== '' ||
    historyFromDate !== '' ||
    historyToDate !== '' ||
    historyCategory !== 'All' ||
    historyDoctor !== 'All';

  // History Pagination
  const historyTotalPages = Math.max(1, Math.ceil(filteredHistoryPatients.length / HISTORY_PAGE_SIZE));
  const paginatedHistoryPatients = filteredHistoryPatients.slice(
    (historyCurrentPage - 1) * HISTORY_PAGE_SIZE,
    historyCurrentPage * HISTORY_PAGE_SIZE
  );

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
      {/* PART 7: Compact Header without bulky status banner */}
      <header className={styles.compactHeader}>
        <div className={styles.compactTitleGroup}>
          <h1 className={styles.compactTitle}>
            {isLocked
              ? `Patient: ${loadedSavedPatient?.firstName || ''} ${loadedSavedPatient?.lastName || ''} (${editId || loadedSavedPatient?.uhid})`
              : isEditMode
              ? `Edit Patient: ${editId}`
              : 'Patient Registration & History'}
          </h1>
          <span
            className={`${styles.compactStatusPill} ${
              isLocked ? styles.pillLocked : isEditMode ? styles.pillEditing : styles.pillNew
            }`}
          >
            {isLocked ? (
              <>
                <Lock size={12} /> Locked Record
              </>
            ) : isEditMode ? (
              <>
                <Edit2 size={12} /> Editing Mode
              </>
            ) : (
              <>
                <Plus size={12} /> New Registration
              </>
            )}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnScanCamera} ${styles.headerScanBtn}`}
            onClick={() => setIsCameraModalOpen(true)}
            title="Scan patient sticker barcode using device camera or webcam"
          >
            <Camera size={15} style={{ marginRight: '6px' }} />
            Scan Patient Barcode
          </button>
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
                  <>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnBill}`}
                      style={{ height: '28px', fontSize: '0.75rem', padding: '0 8px' }}
                      onClick={() => handleOpenSavedPatientBill(notification.uhid!)}
                      title="Open Dynamic Bill Card"
                      disabled={isGeneratingBill}
                    >
                      <Receipt size={13} style={{ marginRight: '4px' }} /> Bill
                    </button>
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
                  </>
                )}

                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  style={{ height: '28px', fontSize: '0.75rem', padding: '0 8px' }}
                  onClick={() => navigate('/patient-registration-list')}
                >
                  <ListPlus size={13} style={{ marginRight: '4px' }} /> Patient Registration List
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
          <div className={styles.barcodeInputWrapper}>
            <ScanLine size={18} className={styles.barcodeInputIcon} />
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
          </div>
          <div className={styles.barcodeActionButtons}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary} ${styles.barcodeLookupBtn}`}
              onClick={() => handleBarcodeScan()}
            >
              Lookup
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnScanCamera} ${styles.barcodeScanBtn}`}
              onClick={() => setIsCameraModalOpen(true)}
              title="Scan patient sticker barcode using device camera"
            >
              <Camera size={15} />
              <span>Scan Patient Barcode</span>
            </button>
          </div>
        </div>
        <div className={styles.barcodeBadge}>
          <Barcode size={15} />
          <span>USB & Camera Barcode Scanner Ready (Code 128)</span>
        </div>
      </div>

      {/* Main Registration Layout (100% Full Width) */}
      <div className={styles.formContainerWrapper}>
        <div className={styles.formMain}>
          {/* Patient Record Locked Banner */}
          {isLocked && (
            <div className={styles.lockedRecordBanner}>
              <div className={styles.lockedBannerLeft}>
                <Lock size={22} className={styles.lockedBannerIcon} />
                <div>
                  <div className={styles.lockedBannerTitle}>
                    Patient Registered — Record Locked
                  </div>
                  <div className={styles.lockedBannerSubtitle}>
                    Record is protected from accidental modifications. Click <strong>Edit Record</strong> below to modify details.
                  </div>
                </div>
              </div>
              <div className={styles.lockedBannerActions}>
                <span className={styles.badge} style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                  {loadedSavedPatient?.uhid || editId}
                </span>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnBill}`}
                  style={{ height: '30px', fontSize: '0.78rem', padding: '0 10px' }}
                  onClick={handleBillButtonClick}
                  title="Open Dynamic Bill Card"
                >
                  <Receipt size={14} style={{ marginRight: '4px' }} /> Bill
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnPrintSticker}`}
                  style={{ height: '30px', fontSize: '0.78rem', padding: '0 10px' }}
                  onClick={handlePrintSticker}
                  title="Print Patient Sticker"
                >
                  <Printer size={14} style={{ marginRight: '4px' }} /> Sticker
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnLockedEdit}`}
                  style={{ height: '30px', fontSize: '0.78rem', padding: '0 10px' }}
                  onClick={handleUnlockForEdit}
                  title="Unlock to edit patient details"
                >
                  <Edit2 size={14} style={{ marginRight: '4px' }} /> Edit Record
                </button>
              </div>
            </div>
          )}

          {/* Form Element */}
          <form ref={formRef} onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} noValidate>
            {/* PART 1 & 2: Top Section — Basic Information (Visible by Default) */}
            <section className={styles.section} aria-label="Basic Information">
              <h2 className={styles.sectionTitle}>Basic Information</h2>
              <div className={styles.formGrid}>
                {/* Category */}
                <div className={`${styles.formGroup} ${styles.colSpan2}`}>
                  <label className={styles.label}>Category</label>
                  <select
                    name="category"
                    className={styles.select}
                    value={formData.category}
                    onChange={handleInputChange}
                    disabled={isLocked || isSubmitting}
                  >
                    <option value="NEW">NEW</option>
                    <option value="OLD">OLD</option>
                  </select>
                </div>

                {/* First Name */}
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
                    disabled={isLocked || isSubmitting}
                  />
                </div>

                {/* Middle Name */}
                <div className={`${styles.formGroup} ${styles.colSpan3}`}>
                  <label className={styles.label}>Middle Name</label>
                  <input
                    type="text"
                    name="middleName"
                    className={styles.input}
                    value={formData.middleName}
                    onChange={handleInputChange}
                    placeholder="e.g. Kumar"
                    disabled={isLocked || isSubmitting}
                  />
                </div>

                {/* Last Name */}
                <div className={`${styles.formGroup} ${styles.colSpan4}`}>
                  <label className={styles.label}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className={styles.input}
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="e.g. Patel"
                    disabled={isLocked || isSubmitting}
                  />
                </div>

                {/* Birth Date */}
                <div className={`${styles.formGroup} ${styles.colSpan3}`}>
                  <label className={styles.label}>Birth Date</label>
                  <input
                    type="date"
                    name="birthDate"
                    max={new Date().toISOString().split('T')[0]}
                    className={styles.input}
                    value={formData.birthDate}
                    onChange={handleBirthDateChange}
                    disabled={isLocked || isSubmitting}
                  />
                </div>

                {/* Age (Structured: Years, Months, Days) */}
                <div className={`${styles.formGroup} ${styles.colSpan4}`}>
                  <label className={styles.label}>
                    Age (Y / M / D) <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.ageInputRow}>
                    <div className={styles.ageField}>
                      <input
                        type="number"
                        name="age"
                        min="0"
                        max="130"
                        required
                        className={styles.input}
                        value={formData.age}
                        onChange={handleYearsChange}
                        placeholder="Years"
                        disabled={isLocked || isSubmitting}
                      />
                      <span className={styles.ageUnitSuffix}>Yrs</span>
                    </div>
                    <div className={styles.ageField}>
                      <input
                        type="number"
                        name="ageMonths"
                        min="0"
                        max="11"
                        className={styles.input}
                        value={formData.ageMonths || ''}
                        onChange={handleMonthsChange}
                        placeholder="Months"
                        disabled={isLocked || isSubmitting}
                      />
                      <span className={styles.ageUnitSuffix}>Mos</span>
                    </div>
                    <div className={styles.ageField}>
                      <input
                        type="number"
                        name="ageDays"
                        min="0"
                        max="30"
                        className={styles.input}
                        value={formData.ageDays || ''}
                        onChange={handleDaysChange}
                        placeholder="Days"
                        disabled={isLocked || isSubmitting}
                      />
                      <span className={styles.ageUnitSuffix}>Days</span>
                    </div>
                  </div>
                </div>

                {/* Sex */}
                <div className={`${styles.formGroup} ${styles.colSpan2}`}>
                  <label className={styles.label}>
                    Sex <span className={styles.required}>*</span>
                  </label>
                  <select
                    name="sex"
                    className={styles.select}
                    value={formData.sex}
                    onChange={handleInputChange}
                    disabled={isLocked || isSubmitting}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Hospital Doctor */}
                <div className={`${styles.formGroup} ${styles.colSpan3}`}>
                  <label className={styles.label}>
                    Hospital Doctor <span className={styles.required}>*</span>
                  </label>
                  <select
                    name="hospitalDoctor"
                    className={styles.select}
                    value={formData.hospitalDoctor}
                    onChange={handleInputChange}
                    disabled={isLocked || isSubmitting}
                  >
                    {AVAILABLE_DOCTORS.map(doc => (
                      <option key={doc} value={doc}>{doc}</option>
                    ))}
                  </select>
                </div>

                {/* Mobile */}
                <div className={`${styles.formGroup} ${styles.colSpan3}`}>
                  <label className={styles.label}>
                    Mobile Number <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    className={styles.input}
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="e.g. 9876543210"
                    disabled={isLocked || isSubmitting}
                  />
                </div>

                {/* Email */}
                <div className={`${styles.formGroup} ${styles.colSpan3}`}>
                  <label className={styles.label}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className={styles.input}
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. patient@example.com"
                    disabled={isLocked || isSubmitting}
                  />
                </div>
              </div>
            </section>

            {/* PART 6: Collapsible Additional Registration Sections */}

            {/* Collapsible Section 1: Demographics & Clinical */}
            <div className={`${styles.collapsibleCard} ${isDemographicsOpen ? styles.collapsibleCardActive : ''}`}>
              <button
                type="button"
                className={styles.collapsibleHeaderBtn}
                onClick={() => setIsDemographicsOpen(prev => !prev)}
                aria-expanded={isDemographicsOpen}
              >
                <div className={styles.collapsibleTitle}>
                  Demographics & Clinical
                </div>
                <div className={styles.collapsibleRight}>
                  <span className={styles.collapsibleBadge}>
                    {formData.referenceBy ? `${formData.referenceBy} • ` : ''}{formData.religion || 'Demographics'}
                  </span>
                  <span className={styles.collapsibleChevron}>
                    {isDemographicsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </div>
              </button>
              {isDemographicsOpen && (
                <div className={styles.collapsibleBody}>
                  <div className={styles.formGrid}>
                    <div className={`${styles.formGroup} ${styles.colSpan6}`}>
                      <label className={styles.label}>Reference By</label>
                      <select
                        name="referenceBy"
                        className={styles.select}
                        value={formData.referenceBy}
                        onChange={handleInputChange}
                        disabled={isLocked || isSubmitting}
                      >
                        <option value="DR. NIKUNJ VITHALANI">DR. NIKUNJ VITHALANI</option>
                        <option value="DR. ANAND SHAH">DR. ANAND SHAH</option>
                        <option value="SELF">SELF</option>
                        {AVAILABLE_DOCTORS.map(doc => (
                          <option key={doc} value={doc}>{doc}</option>
                        ))}
                      </select>
                    </div>

                    <div className={`${styles.formGroup} ${styles.colSpan3}`}>
                      <label className={styles.label}>Religion</label>
                      <select
                        name="religion"
                        className={styles.select}
                        value={formData.religion}
                        onChange={handleInputChange}
                        disabled={isLocked || isSubmitting}
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
                        disabled={isLocked || isSubmitting}
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
                        disabled={isLocked || isSubmitting}
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
                        disabled={isLocked || isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Collapsible Section 2: Address Details */}
            <div className={`${styles.collapsibleCard} ${isAddressOpen ? styles.collapsibleCardActive : ''}`}>
              <button
                type="button"
                className={styles.collapsibleHeaderBtn}
                onClick={() => setIsAddressOpen(prev => !prev)}
                aria-expanded={isAddressOpen}
              >
                <div className={styles.collapsibleTitle}>
                  Address Details
                </div>
                <div className={styles.collapsibleRight}>
                  <span className={styles.collapsibleBadge}>
                    {formData.city ? `${formData.city}, ${formData.state}` : 'Address'}
                  </span>
                  <span className={styles.collapsibleChevron}>
                    {isAddressOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </div>
              </button>
              {isAddressOpen && (
                <div className={styles.collapsibleBody}>
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
                        disabled={isLocked || isSubmitting}
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
                        disabled={isLocked || isSubmitting}
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
                        disabled={isLocked || isSubmitting}
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
                        disabled={isLocked || isSubmitting}
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
                          disabled={isLocked || isSubmitting}
                        />
                        <label htmlFor="autoSms" className={styles.checkboxLabel}>
                          Enable Automated SMS & Notifications
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Collapsible Section 3: Other Details & Identification */}
            <div className={`${styles.collapsibleCard} ${isOtherOpen ? styles.collapsibleCardActive : ''}`}>
              <button
                type="button"
                className={styles.collapsibleHeaderBtn}
                onClick={() => setIsOtherOpen(prev => !prev)}
                aria-expanded={isOtherOpen}
              >
                <div className={styles.collapsibleTitle}>
                  Other Details & Identification
                </div>
                <div className={styles.collapsibleRight}>
                  <span className={styles.collapsibleBadge}>
                    {formData.aadharNo || formData.panNo || formData.mediclaim ? 'ID Info Provided' : 'Optional'}
                  </span>
                  <span className={styles.collapsibleChevron}>
                    {isOtherOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </div>
              </button>
              {isOtherOpen && (
                <div className={styles.collapsibleBody}>
                  <div className={styles.formGrid}>
                    <div className={`${styles.formGroup} ${styles.colSpan3}`}>
                      <label className={styles.label}>Estimate</label>
                      <input
                        type="text"
                        name="estimate"
                        className={styles.input}
                        value={formData.estimate}
                        onChange={handleInputChange}
                        disabled={isLocked || isSubmitting}
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
                        disabled={isLocked || isSubmitting}
                      />
                    </div>
                    <div className={`${styles.formGroup} ${styles.colSpan3}`}>
                      <label className={styles.label}>PAN No</label>
                      <input
                        type="text"
                        name="panNo"
                        maxLength={10}
                        className={styles.input}
                        value={formData.panNo}
                        onChange={handleInputChange}
                        placeholder="ABCDE1234F"
                        disabled={isLocked || isSubmitting}
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
                        disabled={isLocked || isSubmitting}
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
                        disabled={isLocked || isSubmitting}
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
                        disabled={isLocked || isSubmitting}
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
                        disabled={isLocked || isSubmitting}
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
                        disabled={isLocked || isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Authoritative Sticky Action Bar (Single Source of Actions for Desktop & Mobile) */}
            <div className={styles.actions}>
              {isLocked ? (
                <>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnBill}`}
                    onClick={handleBillButtonClick}
                    disabled={isGeneratingBill}
                    title="Open Dynamic Bill Card"
                  >
                    <Receipt size={16} style={{ marginRight: '6px' }} />
                    Bill
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnPrintSticker}`}
                    onClick={handlePrintSticker}
                    disabled={isPrintingSticker}
                    title="Print Patient Sticker"
                  >
                    <Printer size={16} style={{ marginRight: '6px' }} />
                    Sticker
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnLockedEdit}`}
                    onClick={handleUnlockForEdit}
                    title="Unlock to edit patient details"
                  >
                    <Edit2 size={16} style={{ marginRight: '6px' }} />
                    Edit Record
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnNewRegistration}`}
                    onClick={handleSwitchToCreateMode}
                    title="Start a new patient registration"
                  >
                    <Plus size={16} style={{ marginRight: '6px' }} />
                    New Registration
                  </button>
                  <a
                    href="#patient-history-section"
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    title="Scroll down to Patient History List"
                  >
                    <Users size={15} style={{ marginRight: '6px' }} />
                    Patient History ({lookupPatients.length})
                  </a>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => navigate('/patient-registration-list')}
                    title="View full patient registration list"
                  >
                    <ListPlus size={15} style={{ marginRight: '6px' }} />
                    List View
                  </button>
                </>
              ) : isEditMode ? (
                <>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={handleResetForm}
                    disabled={isSubmitting}
                    title="Reset values to loaded record"
                  >
                    <RotateCcw size={15} style={{ marginRight: '6px' }} />
                    Reset Values
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                    title="Cancel edit and lock record"
                  >
                    <ArrowLeft size={15} style={{ marginRight: '6px' }} />
                    Cancel Edit
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnBill}`}
                    onClick={handleBillButtonClick}
                    disabled={isGeneratingBill}
                    title="Open Dynamic Bill Card"
                  >
                    <Receipt size={16} style={{ marginRight: '6px' }} />
                    Bill
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnPrintSticker}`}
                    onClick={handlePrintSticker}
                    disabled={isPrintingSticker}
                    title="Print Patient Sticker"
                  >
                    <Printer size={16} style={{ marginRight: '6px' }} />
                    Sticker
                  </button>
                  <button
                    type="submit"
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    disabled={isSubmitting}
                    title="Update patient record in system"
                  >
                    {isSubmitting ? (
                      <span>Updating...</span>
                    ) : (
                      <>
                        <Save size={16} style={{ marginRight: '6px' }} />
                        Update Patient Record
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={handleResetForm}
                    disabled={isSubmitting}
                    title="Clear all fields"
                  >
                    <RotateCcw size={15} style={{ marginRight: '6px' }} />
                    Clear Form
                  </button>
                  <a
                    href="#patient-history-section"
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    title="Scroll down to search patient history"
                  >
                    <Search size={15} style={{ marginRight: '6px' }} />
                    Search History ({lookupPatients.length})
                  </a>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => navigate('/patient-registration-list')}
                    title="View patient registration list"
                  >
                    <ListPlus size={15} style={{ marginRight: '6px' }} />
                    List View
                  </button>
                  <button
                    type="submit"
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    disabled={isSubmitting}
                    title="Register and save patient to JSON"
                  >
                    {isSubmitting ? (
                      <span>Saving to JSON...</span>
                    ) : (
                      <>
                        <Save size={16} style={{ marginRight: '6px' }} />
                        Register / Save Patient
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* PART 3: Patient History List & Search Section (Bottom Section) */}
      <section id="patient-history-section" className={styles.patientHistorySection} aria-label="Patient History List">
        <div className={styles.historyHeader}>
          <div>
            <h2 className={styles.historyTitle}>
              <Users size={22} color="var(--primary)" />
              Patient History & Records
            </h2>
            <p className={styles.historySubtitle}>
              Instant search across registered patients by Name, UHID, or Mobile. Click <strong>Load Patient</strong> to view or edit full record.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={styles.badge} style={{ color: 'var(--primary)', fontWeight: 600 }}>
              {lookupPatients.length} Total Patients
            </span>
          </div>
        </div>

        {/* Instant Search & Filter Toolbar */}
        <div className={styles.historyToolbar}>
          {/* Real-time Search Box */}
          <div className={styles.historySearchBox}>
            <Search size={18} className={styles.historySearchIcon} />
            <input
              type="text"
              className={styles.historySearchInput}
              placeholder="Type Patient First Name, Full Name, UHID (e.g. UHID-1001), or Mobile Number..."
              value={historySearchQuery}
              onChange={e => {
                setHistorySearchQuery(e.target.value);
                setHistoryCurrentPage(1);
              }}
              aria-label="Search patient history"
            />
            {historySearchQuery && (
              <button
                type="button"
                className={styles.historyClearSearchBtn}
                onClick={() => {
                  setHistorySearchQuery('');
                  setHistoryCurrentPage(1);
                }}
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter Controls Row (Gender removed, Date Range added as per Part 8) */}
          <div className={styles.historyFilterRow}>
            {/* Date Range: From Date & To Date */}
            <div className={styles.historyFilterGroup}>
              <span className={styles.historyFilterLabel}>From Date:</span>
              <input
                type="date"
                className={styles.historyFilterInput}
                value={historyFromDate}
                onChange={e => {
                  setHistoryFromDate(e.target.value);
                  setHistoryCurrentPage(1);
                }}
                aria-label="Filter from registration date"
              />
            </div>

            <div className={styles.historyFilterGroup}>
              <span className={styles.historyFilterLabel}>To Date:</span>
              <input
                type="date"
                className={styles.historyFilterInput}
                value={historyToDate}
                onChange={e => {
                  setHistoryToDate(e.target.value);
                  setHistoryCurrentPage(1);
                }}
                aria-label="Filter to registration date"
              />
            </div>

            {/* Category Filter */}
            <div className={styles.historyFilterGroup}>
              <span className={styles.historyFilterLabel}>Category:</span>
              <select
                className={styles.historyFilterSelect}
                value={historyCategory}
                onChange={e => {
                  setHistoryCategory(e.target.value);
                  setHistoryCurrentPage(1);
                }}
                aria-label="Filter by patient category"
              >
                <option value="All">All Categories</option>
                <option value="NEW">NEW</option>
                <option value="OLD">OLD</option>
              </select>
            </div>

            {/* Doctor Filter */}
            <div className={styles.historyFilterGroup}>
              <span className={styles.historyFilterLabel}>Doctor:</span>
              <select
                className={styles.historyFilterSelect}
                value={historyDoctor}
                onChange={e => {
                  setHistoryDoctor(e.target.value);
                  setHistoryCurrentPage(1);
                }}
                aria-label="Filter by doctor"
              >
                <option value="All">All Doctors</option>
                {historyAvailableDoctors.map(doc => (
                  <option key={doc} value={doc}>{doc}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            {isHistoryFiltered && (
              <button
                type="button"
                className={styles.historyResetBtn}
                onClick={handleResetHistoryFilters}
                title="Clear all search filters"
              >
                <RotateCcw size={13} />
                Clear Filters
              </button>
            )}

            <div className={styles.historyResultsCount}>
              Showing <strong>{filteredHistoryPatients.length}</strong> of <strong>{lookupPatients.length}</strong> patients
            </div>
          </div>

          {/* Date Range Validation Warning */}
          {historyFromDate && historyToDate && historyFromDate > historyToDate && (
            <div style={{ color: '#dc2626', fontSize: '0.8rem', fontWeight: 600 }}>
              ⚠️ From Date cannot be later than To Date. Please adjust the registration date range.
            </div>
          )}
        </div>

        {/* Results Table or No-Match Card */}
        {filteredHistoryPatients.length === 0 ? (
          /* PART 5: No Matching Patient Found */
          <div className={styles.historyNoMatchCard}>
            <Search size={36} color="var(--text-muted)" style={{ opacity: 0.6 }} />
            <h3 className={styles.historyNoMatchTitle}>
              No existing patient found. You can register this patient as new.
            </h3>
            <p className={styles.historyNoMatchSubtitle}>
              No registered patient matches &quot;{historySearchQuery || formData.firstName}&quot;. Click below to proceed with registering this patient.
            </p>
            <button
              type="button"
              className={styles.btnRegisterNewPatient}
              onClick={handleRegisterNewPatientFromSearch}
            >
              <UserPlus size={16} />
              Register New Patient
            </button>
          </div>
        ) : (
          <>
            <div className={styles.historyTableWrapper}>
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th style={{ width: '110px' }}>UHID</th>
                    <th>Patient Name</th>
                    <th style={{ width: '130px' }}>Age / Sex</th>
                    <th style={{ width: '120px' }}>Mobile</th>
                    <th>Hospital Doctor</th>
                    <th style={{ width: '110px' }}>Reg Date</th>
                    <th style={{ textAlign: 'center', width: '170px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedHistoryPatients.map(p => (
                    <tr key={p.uhid}>
                      <td className={styles.historyUhidCell}>{p.uhid}</td>
                      <td>
                        <div className={styles.historyNameCell}>
                          <span>{p.firstName} {p.middleName ? `${p.middleName} ` : ''}{p.lastName}</span>
                          <span className={styles.historyCategoryBadge}>{p.category}</span>
                        </div>
                      </td>
                      <td>
                        {p.age} {p.ageUnit || 'Years'} • {p.sex}
                      </td>
                      <td>
                        <a
                          href={`tel:${p.mobile}`}
                          style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}
                        >
                          {p.mobile}
                        </a>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {p.hospitalDoctor}
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {p.createdAt
                          ? new Date(p.createdAt).toLocaleDateString('en-GB')
                          : 'Recently'}
                      </td>
                      <td>
                        <div className={styles.historyTableActions}>
                          <button
                            type="button"
                            className={styles.btnLoadPatient}
                            onClick={() => handleLoadExistingPatient(p)}
                            title="Load this patient into registration form"
                          >
                            <UserCheck size={14} />
                            Load Patient
                          </button>
                          <button
                            type="button"
                            className={styles.historyActionIconBtn}
                            onClick={() => openPatientStickerPdf(p, patientApi.getStickerPdfUrl(p.uhid))}
                            title="Print Patient Sticker"
                          >
                            <Printer size={14} />
                          </button>
                          <button
                            type="button"
                            className={styles.historyActionIconBtn}
                            onClick={() => handleOpenSavedPatientBill(p.uhid)}
                            title="Open Patient Bill"
                          >
                            <Receipt size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {historyTotalPages > 1 && (
              <div className={styles.paginationRow}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Showing page {historyCurrentPage} of {historyTotalPages}
                </div>
                <div className={styles.paginationControls}>
                  <button
                    type="button"
                    className={styles.paginationBtn}
                    disabled={historyCurrentPage === 1}
                    onClick={() => setHistoryCurrentPage(prev => Math.max(1, prev - 1))}
                  >
                    Previous
                  </button>
                  {Array.from({ length: historyTotalPages }, (_, i) => i + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      type="button"
                      className={styles.paginationBtn}
                      style={{
                        backgroundColor: pageNum === historyCurrentPage ? 'var(--primary)' : 'var(--surface)',
                        color: pageNum === historyCurrentPage ? '#fff' : 'var(--text-main)',
                        borderColor: pageNum === historyCurrentPage ? 'var(--primary)' : 'var(--border)'
                      }}
                      onClick={() => setHistoryCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={styles.paginationBtn}
                    disabled={historyCurrentPage === historyTotalPages}
                    onClick={() => setHistoryCurrentPage(prev => Math.min(historyTotalPages, prev + 1))}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Quick Search Patient Lookup Modal (Modal Search Fallback) */}
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
                        {p.firstName} {p.middleName ? `${p.middleName} ` : ''}{p.lastName}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        UHID: <strong style={{ color: 'var(--primary)' }}>{p.uhid}</strong> • Mobile: {p.mobile} • Age: {p.age} {p.ageUnit} • Gender: {p.sex}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnBill}`}
                        style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                        onClick={() => {
                          handleOpenSavedPatientBill(p.uhid);
                          setIsSearchOpen(false);
                        }}
                        title="View or Configure Bill"
                      >
                        <Receipt size={13} style={{ marginRight: '4px' }} /> Bill
                      </button>
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
                          handleLoadExistingPatient(p);
                          setIsSearchOpen(false);
                        }}
                      >
                        Load
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Camera Barcode Scanner Modal */}
      <BarcodeCameraModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onScanSuccess={handleCameraScanSuccess}
      />

      {/* Unsaved Changes Confirmation Dialog */}
      {showUnsavedConfirmModal && pendingScannedPatient && (
        <div className={styles.modalBackdrop} onClick={() => setShowUnsavedConfirmModal(false)}>
          <div className={styles.modalContent} style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={20} /> Unsaved Changes Detected
              </h3>
              <button
                type="button"
                onClick={() => setShowUnsavedConfirmModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.5', margin: '0 0 1.25rem 0' }}>
              The registration form currently contains unsaved information. Would you like to discard your unsaved edits and load the patient record{' '}
              <strong style={{ color: 'var(--primary)' }}>{pendingScannedPatient.uhid} ({pendingScannedPatient.firstName} {pendingScannedPatient.lastName})</strong> in locked mode?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => {
                  setShowUnsavedConfirmModal(false);
                  setPendingScannedPatient(null);
                }}
              >
                Keep Current Form / Cancel
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnPrimary}`}
                style={{ background: '#EA4335', borderColor: '#d93025' }}
                onClick={() => applyScannedPatient(pendingScannedPatient)}
              >
                Discard & Load Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Dynamic Bill Card Modal */}
      {isBillCardOpen && activeBillPatient && (
        <div className={styles.modalBackdrop} onClick={() => setIsBillCardOpen(false)}>
          <div className={styles.billCardModal} onClick={e => e.stopPropagation()}>
            <div className={styles.billCardHeader}>
              <div>
                <h3 className={styles.billCardTitle}>
                  <Receipt size={22} style={{ color: '#7c3aed' }} /> Patient Bill (Bill Cum Receipt)
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Configure hospital charges and generate A4 printable bill receipt
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBillCardOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                aria-label="Close bill card"
              >
                <X size={20} />
              </button>
            </div>

            {/* Patient Information Summary */}
            <div className={styles.billPatientCard}>
              <div><strong>Patient:</strong> {activeBillPatient.firstName} {activeBillPatient.middleName ? `${activeBillPatient.middleName} ` : ''}{activeBillPatient.lastName}</div>
              <div><strong>UHID:</strong> <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{activeBillPatient.uhid}</span></div>
              <div><strong>Treating Doctor:</strong> {activeBillPatient.hospitalDoctor || 'Dr. NILESH MAHALE'}</div>
              <div><strong>Age / Sex:</strong> {activeBillPatient.age} {activeBillPatient.ageUnit} / {activeBillPatient.sex}</div>
              <div><strong>Mobile:</strong> {activeBillPatient.mobile || '---'}</div>
              <div><strong>City:</strong> {activeBillPatient.city || 'SURAT'}</div>
            </div>

            {/* Notice if Existing Bill exists */}
            {existingPatientBill && (
              <div className={styles.existingBillNotice}>
                <div className={styles.existingBillText}>
                  <strong>Existing Bill on Record:</strong> Invoice No. <strong style={{ color: '#1e40af' }}>{existingPatientBill.invoiceNo}</strong> • Total: ₹{existingPatientBill.totalAmount} • Date: {existingPatientBill.billDate?.substring(0, 10) || 'N/A'}
                </div>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnBill}`}
                  style={{ fontSize: '0.75rem', height: '30px', padding: '0 10px', whiteSpace: 'nowrap' }}
                  onClick={handlePrintExistingBill}
                  title="Print the already saved invoice without re-calculating"
                >
                  <Printer size={14} style={{ marginRight: '4px' }} /> Print Existing Bill
                </button>
              </div>
            )}

            {/* Charge Rows Header */}
            <div className={styles.billSectionHeader}>
              <span className={styles.billSectionTitle}>Charge Details</span>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                style={{ fontSize: '0.8rem', height: '30px', padding: '0 10px' }}
                onClick={handleAddChargeRow}
              >
                <Plus size={14} style={{ marginRight: '4px' }} /> + Add More
              </button>
            </div>

            {/* Dynamic Rows Table */}
            <table className={styles.billRowsTable}>
              <thead>
                <tr>
                  <th style={{ width: '40px', textAlign: 'center' }}>#</th>
                  <th>Charge Type / Service Details</th>
                  <th style={{ width: '150px', textAlign: 'right' }}>Amount (₹)</th>
                  <th style={{ width: '50px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {billRows.map((row, idx) => (
                  <tr key={row.id}>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {idx + 1}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <select
                          className={styles.select}
                          value={row.isCustom ? '__CUSTOM__' : row.chargeName}
                          onChange={e => handleChargeRowChange(row.id, e.target.value)}
                        >
                          {chargeMaster.map(chg => (
                            <option key={chg.id} value={chg.name}>
                              {chg.name} — ₹{chg.amount}
                            </option>
                          ))}
                          <option value="__CUSTOM__">Other / Custom Charge...</option>
                        </select>
                        {row.isCustom && (
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="Specify charge description..."
                            value={row.chargeName}
                            onChange={e =>
                              setBillRows(prev =>
                                prev.map(r => (r.id === row.id ? { ...r, chargeName: e.target.value } : r))
                              )
                            }
                            style={{ fontSize: '0.85rem', marginTop: '4px' }}
                          />
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        className={styles.input}
                        style={{ textAlign: 'right', fontWeight: 600 }}
                        value={row.amount}
                        onChange={e => handleRowAmountChange(row.id, e.target.value)}
                        readOnly={!row.isCustom}
                        title={row.isCustom ? 'Enter amount' : 'Standard rate from Charge Master'}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveChargeRow(row.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '4px' }}
                        title="Remove charge item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Real-time Subtotal & Due Box */}
            <div className={styles.billTotalBox}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>
                  Subtotal ({billRows.length} item{billRows.length > 1 ? 's' : ''})
                </span>
                <span className={styles.billTotalBig}>₹{subtotalAmount.toFixed(2)}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>
                  Balance Due
                </span>
                <span
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: dueAmount > 0 ? '#dc2626' : '#059669'
                  }}
                >
                  ₹{dueAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Discount Configuration Card */}
            <div className={styles.billDiscountCard}>
              <div className={styles.billSectionHeader} style={{ marginBottom: '0.5rem' }}>
                <span className={styles.billSectionTitle} style={{ fontSize: '0.88rem' }}>
                  Discount Details (Optional)
                </span>
                {calculatedDiscountAmount > 0 && (
                  <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
                    Discount Applied: -₹{calculatedDiscountAmount.toFixed(2)}
                  </span>
                )}
              </div>

              <div className={styles.billDiscountGrid}>
                <div>
                  <label className={styles.label}>Discount Type</label>
                  <select
                    className={styles.select}
                    value={billDiscountType}
                    onChange={e => {
                      setBillDiscountType(e.target.value as 'percentage' | 'fixed');
                      setDiscountError('');
                    }}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className={styles.label}>
                    {billDiscountType === 'percentage' ? 'Discount (%)' : 'Discount Amount (₹)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={billDiscountType === 'percentage' ? 100 : subtotalAmount}
                    step={billDiscountType === 'percentage' ? '0.1' : '1'}
                    className={styles.input}
                    value={billDiscountValue}
                    onChange={e => {
                      setBillDiscountValue(e.target.value);
                      setDiscountError('');
                    }}
                    placeholder={billDiscountType === 'percentage' ? 'e.g. 10' : 'e.g. 100'}
                  />
                </div>

                <div>
                  <label className={styles.label}>Calculated Discount (₹)</label>
                  <input
                    type="text"
                    className={`${styles.input} ${styles.discountAmountDisplay}`}
                    value={`₹${calculatedDiscountAmount.toFixed(2)}`}
                    readOnly
                    tabIndex={-1}
                  />
                </div>
              </div>

              <div className={styles.billDiscountFullRow}>
                <div>
                  <label className={styles.label}>
                    Discount Authorizing Doctor {calculatedDiscountAmount > 0 && <span className={styles.required}>*</span>}
                  </label>
                  <select
                    className={styles.select}
                    value={billDiscountDoctor}
                    onChange={e => {
                      setBillDiscountDoctor(e.target.value);
                      setDiscountError('');
                    }}
                  >
                    {AVAILABLE_DOCTORS.map(doc => (
                      <option key={doc} value={doc}>
                        {doc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={styles.label}>
                    Discount Remark / Reason {calculatedDiscountAmount > 0 && <span className={styles.required}>*</span>}
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Staff relative, special concession, senior citizen"
                    value={billDiscountRemark}
                    onChange={e => {
                      setBillDiscountRemark(e.target.value);
                      setDiscountError('');
                    }}
                  />
                </div>
              </div>

              {discountError && (
                <div className={styles.discountValidationError} role="alert">
                  ⚠️ {discountError}
                </div>
              )}
            </div>

            {/* Net Payable Highlighted Box */}
            <div className={styles.netPayableBox}>
              <div>
                <span className={styles.netPayableLabel}>Net Amount Payable</span>
                <span style={{ fontSize: '0.8rem', color: '#047857', display: 'block' }}>
                  {calculatedDiscountAmount > 0
                    ? `Subtotal ₹${subtotalAmount.toFixed(2)} minus Discount ₹${calculatedDiscountAmount.toFixed(2)}`
                    : 'No discount applied'}
                </span>
              </div>
              <div className={styles.netPayableVal}>
                ₹{netPayable.toFixed(2)}
              </div>
            </div>

            {/* Payment Details */}
            <div className={styles.billPaymentGrid}>
              <div>
                <label className={styles.label}>Payment Type</label>
                <select
                  className={styles.select}
                  value={billPaymentType}
                  onChange={e => setBillPaymentType(e.target.value)}
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI / Online</option>
                  <option value="Card">Debit / Credit Card</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
              <div>
                <label className={styles.label}>Amount Received (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className={styles.input}
                  value={billAmountReceived}
                  onChange={e => setBillAmountReceived(e.target.value)}
                />
              </div>
              <div>
                <label className={styles.label}>Quick Action</label>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  style={{ width: '100%', height: '38px', fontSize: '0.82rem' }}
                  onClick={() => setBillAmountReceived(netPayable)}
                >
                  Paid in Full (₹{netPayable.toFixed(0)})
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className={styles.billModalActions}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => setIsBillCardOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnBill}`}
                onClick={handlePrintBillCard}
                disabled={isGeneratingBill}
              >
                <FileText size={16} style={{ marginRight: '6px' }} />
                {isGeneratingBill ? 'Processing Bill...' : 'Print Bill (A4 PDF)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRegistration;
