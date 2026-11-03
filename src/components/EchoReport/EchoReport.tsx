import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Printer,
  Search,
  Save,
  Edit2,
  Trash2,
  LogOut,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  Unlock,
  FileText,
  Plus,
  HeartPulse,
  Sparkles
} from 'lucide-react';
import { echoReportApi, type EchoReportRecord } from '../../api/echoReportApi';
import { patientApi, type PatientRecord } from '../../api/patientApi';
import { doctorApi, type DoctorRecord } from '../../api/masterApi';
import { reportTemplateApi, type ReportTemplateRecord } from '../../api/masterApi';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';
import { HOSPITAL_CONFIG } from '../../config/hospitalConfig';
import styles from './EchoReport.module.css';

const DEFAULT_FORM: Omit<EchoReportRecord, 'id'> = {
  uhid: '',
  patientName: '',
  age: '',
  sex: '',
  reportDate: new Date().toISOString().split('T')[0],
  referredBy: '',
  c_o: '',
  mitralValve: '',
  tricuspidValve: '',
  aorta: '',
  leftVentricle: '',
  rwma: '',
  rightVentricle: '',
  ivc: '',
  aorticValve: '',
  pulmonaryValve: '',
  lvef: '',
  leftAtrium: '',
  rightAtrium: '',
  rvsp: '',
  ivs: '',
  septum: '',
  lvidd: '',
  ias: '',
  pWall: '',
  lvids: '',
  pericardium: '',
  dopplerStudy: '',
  conclusion: '',
  lvCompliance: '',
  tvi: '',
  leftAorticArchPdaCoarctation: '',
  consultantDr: '',
  status: 'Draft',
  finalizedAt: null,
  finalizedBy: null
};

export const EchoReport: React.FC = () => {
  const navigate = useNavigate();

  // Active report state
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<EchoReportRecord, 'id'>>(DEFAULT_FORM);
  const [reports, setReports] = useState<EchoReportRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isEditingFinalized, setIsEditingFinalized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // External reference data
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [doctors, setDoctors] = useState<DoctorRecord[]>([]);
  const [templates, setTemplates] = useState<ReportTemplateRecord[]>([]);

  // Modals state
  const [isPatientModalOpen, setIsPatientModalOpen] = useState<boolean>(false);
  const [patientSearchTerm, setPatientSearchTerm] = useState<string>('');
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [historySearchTerm, setHistorySearchTerm] = useState<string>('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>('All');
  const [historyDoctorFilter, setHistoryDoctorFilter] = useState<string>('All');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isFinalizeConfirmOpen, setIsFinalizeConfirmOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);

  // Notification helper
  const { notification, setNotification, dismissNotification } = useAutoDismissNotification<{
    type: 'success' | 'error';
    message: string;
  }>();

  const isFinalized = formData.status === 'Finalized' && !isEditingFinalized;

  // Load report data into form
  const loadReport = useCallback((rep: EchoReportRecord, index = -1) => {
    setCurrentId(rep.id);
    setFormData({
      uhid: rep.uhid || '',
      patientName: rep.patientName || '',
      age: rep.age || '',
      sex: rep.sex || '',
      reportDate: rep.reportDate || '',
      referredBy: rep.referredBy || '',
      c_o: rep.c_o || '',
      mitralValve: rep.mitralValve || '',
      tricuspidValve: rep.tricuspidValve || '',
      aorta: rep.aorta || '',
      leftVentricle: rep.leftVentricle || '',
      rwma: rep.rwma || '',
      rightVentricle: rep.rightVentricle || '',
      ivc: rep.ivc || '',
      aorticValve: rep.aorticValve || '',
      pulmonaryValve: rep.pulmonaryValve || '',
      lvef: rep.lvef || '',
      leftAtrium: rep.leftAtrium || '',
      rightAtrium: rep.rightAtrium || '',
      rvsp: rep.rvsp || '',
      ivs: rep.ivs || '',
      septum: rep.septum || '',
      lvidd: rep.lvidd || '',
      ias: rep.ias || '',
      pWall: rep.pWall || '',
      lvids: rep.lvids || '',
      pericardium: rep.pericardium || '',
      dopplerStudy: rep.dopplerStudy || '',
      conclusion: rep.conclusion || '',
      lvCompliance: rep.lvCompliance || '',
      tvi: rep.tvi || '',
      leftAorticArchPdaCoarctation: rep.leftAorticArchPdaCoarctation || '',
      consultantDr: rep.consultantDr || '',
      status: rep.status || 'Draft',
      finalizedAt: rep.finalizedAt || null,
      finalizedBy: rep.finalizedBy || null
    });
    setIsEditingFinalized(false);
    if (index >= 0) setCurrentIndex(index);
  }, []);

  // Fetch initial data (reports, patients, doctors, report templates)
  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [repRes, patRes, docRes, tplRes] = await Promise.all([
        echoReportApi.getReports(),
        patientApi.getPatients(),
        doctorApi.getDoctors(),
        reportTemplateApi.getTemplates()
      ]);

      const repList = repRes.reports || [];
      setReports(repList);
      setPatients(patRes.patients || []);
      setDoctors(docRes.doctors || []);
      setTemplates(tplRes.templates || []);

      if (repList.length > 0) {
        loadReport(repList[0], 0);
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to load initial data.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [loadReport, setNotification]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Stepper navigation controls
  const handleFirst = () => {
    if (reports.length > 0) loadReport(reports[0], 0);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const nextIdx = currentIndex - 1;
      loadReport(reports[nextIdx], nextIdx);
    }
  };

  const handleNext = () => {
    if (currentIndex < reports.length - 1) {
      const nextIdx = currentIndex + 1;
      loadReport(reports[nextIdx], nextIdx);
    }
  };

  const handleLast = () => {
    if (reports.length > 0) {
      const lastIdx = reports.length - 1;
      loadReport(reports[lastIdx], lastIdx);
    }
  };

  // Field change handler
  const handleInputChange = (field: keyof typeof DEFAULT_FORM, value: string) => {
    if (isFinalized) return;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Add / Reset form for new report
  const handleAddNew = () => {
    setCurrentId(null);
    setCurrentIndex(-1);
    setIsEditingFinalized(false);
    setFormData({
      ...DEFAULT_FORM,
      reportDate: new Date().toISOString().split('T')[0]
    });
    setNotification({
      type: 'success',
      message: 'New Echo Report form ready. Please select a patient.'
    });
  };

  // Select patient from search modal
  const handleSelectPatient = (patient: PatientRecord) => {
    const fullName = [patient.firstName, patient.middleName, patient.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();

    setFormData(prev => ({
      ...prev,
      uhid: patient.uhid,
      patientName: fullName || patient.firstName,
      age: patient.age,
      sex: patient.sex,
      referredBy: patient.referenceBy || prev.referredBy,
      consultantDr: patient.hospitalDoctor || prev.consultantDr
    }));

    setIsPatientModalOpen(false);
    setNotification({
      type: 'success',
      message: `Patient ${patient.uhid} (${fullName}) loaded.`
    });
  };

  // Save as Draft
  const handleSaveDraft = async () => {
    if (!formData.uhid) {
      setNotification({
        type: 'error',
        message: 'Patient is required. Please search and select an existing patient.'
      });
      setIsPatientModalOpen(true);
      return;
    }

    try {
      setIsSaving(true);
      if (currentId) {
        // Update existing report
        const res = await echoReportApi.updateReport(
          currentId,
          { ...formData, status: 'Draft' },
          isEditingFinalized
        );
        setNotification({
          type: 'success',
          message: res.message || `Echo report '${currentId}' saved as Draft.`
        });
        loadReport(res.report, currentIndex);
      } else {
        // Create new report
        const res = await echoReportApi.createReport({
          ...formData,
          status: 'Draft'
        });
        setNotification({
          type: 'success',
          message: res.message || `Echo report '${res.report.id}' created as Draft.`
        });
        // Reload list and set as current
        const updatedList = await echoReportApi.getReports();
        setReports(updatedList.reports);
        loadReport(res.report, 0);
      }
      setIsEditingFinalized(false);
    } catch (err) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to save Echo Report.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Finalize Report Workflow
  const handleConfirmFinalize = async () => {
    if (!currentId) {
      // Must save first if brand new
      if (!formData.uhid) {
        setNotification({
          type: 'error',
          message: 'Patient selection is required before finalizing report.'
        });
        return;
      }
      try {
        setIsSaving(true);
        const createRes = await echoReportApi.createReport({
          ...formData,
          status: 'Draft'
        });
        const finRes = await echoReportApi.finalizeReport(
          createRes.report.id,
          formData.consultantDr || 'Consultant Physician'
        );
        setNotification({
          type: 'success',
          message: `Echo report '${finRes.report.id}' finalized and locked.`
        });
        const updatedList = await echoReportApi.getReports();
        setReports(updatedList.reports);
        loadReport(finRes.report, 0);
      } catch (err) {
        setNotification({
          type: 'error',
          message: err instanceof Error ? err.message : 'Failed to finalize report.'
        });
      } finally {
        setIsSaving(false);
        setIsFinalizeConfirmOpen(false);
      }
      return;
    }

    try {
      setIsSaving(true);
      // First save any unsaved field changes
      await echoReportApi.updateReport(currentId, formData, true);
      const res = await echoReportApi.finalizeReport(
        currentId,
        formData.consultantDr || 'Consultant Physician'
      );
      setNotification({
        type: 'success',
        message: res.message || `Echo report '${currentId}' finalized and locked.`
      });
      const updatedList = await echoReportApi.getReports();
      setReports(updatedList.reports);
      loadReport(res.report, currentIndex);
    } catch (err) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to finalize report.'
      });
    } finally {
      setIsSaving(false);
      setIsFinalizeConfirmOpen(false);
    }
  };

  // Delete Report
  const handleConfirmDelete = async () => {
    if (!currentId) return;
    try {
      setIsSaving(true);
      await echoReportApi.deleteReport(currentId);
      setNotification({
        type: 'success',
        message: `Echo report '${currentId}' deleted successfully.`
      });
      const updatedList = await echoReportApi.getReports();
      setReports(updatedList.reports);
      if (updatedList.reports.length > 0) {
        loadReport(updatedList.reports[0], 0);
      } else {
        handleAddNew();
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete Echo Report.'
      });
    } finally {
      setIsSaving(false);
      setIsDeleteConfirmOpen(false);
    }
  };

  // Load template into Doppler study / Conclusion
  const handleSelectTemplate = (tpl: ReportTemplateRecord) => {
    // If it's 2D Echocardiography template or general template
    setFormData(prev => ({
      ...prev,
      dopplerStudy: prev.dopplerStudy ? `${prev.dopplerStudy}\n\n${tpl.details}` : tpl.details,
      conclusion: prev.conclusion ? prev.conclusion : `Study consistent with findings from ${tpl.templateName}.`
    }));
    setIsTemplateModalOpen(false);
    setNotification({
      type: 'success',
      message: `Template '${tpl.templateName}' loaded into Doppler Study.`
    });
  };

  // Filtered patients for patient search modal
  const filteredPatients = useMemo(() => {
    if (!patientSearchTerm.trim()) return patients.slice(0, 20);
    const q = patientSearchTerm.toLowerCase();
    return patients.filter(
      p =>
        p.uhid.toLowerCase().includes(q) ||
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.mobile.includes(q)
    );
  }, [patients, patientSearchTerm]);

  // Filtered reports for history modal ("Perticular Search")
  const filteredReports = useMemo(() => {
    let list = reports;
    if (historyStatusFilter !== 'All') {
      list = list.filter(r => r.status.toLowerCase() === historyStatusFilter.toLowerCase());
    }
    if (historyDoctorFilter !== 'All') {
      list = list.filter(r => r.consultantDr?.toLowerCase().includes(historyDoctorFilter.toLowerCase()));
    }
    if (historySearchTerm.trim()) {
      const q = historySearchTerm.toLowerCase();
      list = list.filter(
        r =>
          r.id.toLowerCase().includes(q) ||
          r.uhid.toLowerCase().includes(q) ||
          r.patientName.toLowerCase().includes(q) ||
          r.consultantDr.toLowerCase().includes(q) ||
          r.conclusion.toLowerCase().includes(q)
      );
    }
    return list;
  }, [reports, historyStatusFilter, historyDoctorFilter, historySearchTerm]);

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.pageTitle}>
            <HeartPulse size={24} color="var(--primary)" aria-hidden="true" />
            Echo Report
          </h1>
          {currentId && <span className={styles.reportIdBadge}>{currentId}</span>}
          {isLoading && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Loading...</span>}
          {formData.status === 'Finalized' ? (
            <span className={styles.statusBadgeFinalized} title="Finalized clinical document">
              <Lock size={12} /> Finalized
            </span>
          ) : (
            <span className={styles.statusBadgeDraft} title="Draft - editable">
              <Edit2 size={12} /> Draft
            </span>
          )}
        </div>

        {/* Selected Patient Quick Indicator */}
        {formData.uhid && (
          <div className={styles.patientChip}>
            <UserCheck size={16} />
            <span>
              {formData.patientName} ({formData.uhid}) • {formData.age || '--'} yrs / {formData.sex || '--'}
            </span>
            <button
              type="button"
              className={styles.templateBtn}
              onClick={() => setIsPatientModalOpen(true)}
              title="Change patient"
            >
              Change
            </button>
          </div>
        )}
      </header>

      {/* Notifications */}
      {notification && (
        <div
          className={notification.type === 'success' ? styles.alertSuccess : styles.alertError}
          role="alert"
        >
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

      {/* Locked Finalized Banner with Amendment Option */}
      {formData.status === 'Finalized' && (
        <div
          style={{
            backgroundColor: isEditingFinalized ? 'rgba(217, 119, 6, 0.1)' : 'rgba(16, 185, 129, 0.08)',
            border: isEditingFinalized ? '1px solid rgba(217, 119, 6, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isEditingFinalized ? <Unlock size={16} color="#d97706" /> : <Lock size={16} color="#059669" />}
            <span>
              {isEditingFinalized
                ? 'Amendment Mode Active: You are editing an authorized revision of this finalized report.'
                : `This report was finalized on ${formData.finalizedAt ? new Date(formData.finalizedAt).toLocaleDateString() : 'earlier'} by ${formData.finalizedBy || 'Consultant'}. Fields are locked against accidental changes.`}
            </span>
          </div>
          <button
            type="button"
            className={`${styles.btn} ${isEditingFinalized ? styles.btnSecondary : styles.btnWarning}`}
            style={{ height: '30px', fontSize: '12px', padding: '0 10px' }}
            onClick={() => setIsEditingFinalized(prev => !prev)}
          >
            {isEditingFinalized ? 'Exit Amendment' : 'Authorize Amendment / Edit'}
          </button>
        </div>
      )}

      {/* Form Container */}
      <div className={styles.formContainer}>
        {/* Patient Details Section */}
        <section className={styles.section} aria-label="Patient Identification">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>
              <UserCheck size={15} /> Patient & Study Details
            </span>
            <button
              type="button"
              className={styles.templateBtn}
              onClick={() => setIsPatientModalOpen(true)}
              disabled={isFinalized}
            >
              <Search size={13} /> Search Patient Directory
            </button>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: '1.5 1 240px' }}>
              <label className={`${styles.label} ${styles.labelRight}`}>Patient's Name :</label>
              <input
                type="text"
                className={`${styles.input} ${styles.wFull} ${isFinalized ? styles.inputLocked : ''}`}
                style={{ backgroundColor: !formData.patientName ? 'var(--warning-soft)' : undefined }}
                value={formData.patientName}
                onChange={e => handleInputChange('patientName', e.target.value)}
                placeholder="Click 'Search Patient Directory'..."
                readOnly={isFinalized}
              />
            </div>

            <div className={styles.fieldGroup} style={{ flex: '1 1 180px' }}>
              <label className={`${styles.label} ${styles.labelRight}`}>Pt.Code :</label>
              <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                <input
                  type="text"
                  className={`${styles.input} ${styles.wFull} ${isFinalized ? styles.inputLocked : ''}`}
                  value={formData.uhid}
                  onChange={e => handleInputChange('uhid', e.target.value)}
                  placeholder="UHID-XXXX"
                  readOnly={isFinalized}
                />
                <button
                  type="button"
                  className={styles.btnSecondary}
                  style={{ height: '36px', padding: '0 10px' }}
                  onClick={() => setIsPatientModalOpen(true)}
                  disabled={isFinalized}
                  title="Search patient"
                >
                  <Search size={14} />
                </button>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Age :</label>
              <input
                type="text"
                className={`${styles.input} ${styles.wSmall} ${isFinalized ? styles.inputLocked : ''}`}
                value={formData.age}
                onChange={e => handleInputChange('age', e.target.value)}
                readOnly={isFinalized}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Sex :</label>
              <select
                className={`${styles.input} ${styles.wSmall} ${isFinalized ? styles.inputLocked : ''}`}
                value={formData.sex}
                onChange={e => handleInputChange('sex', e.target.value)}
                disabled={isFinalized}
              >
                <option value=""></option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Date :</label>
              <input
                type="date"
                className={`${styles.input} ${styles.wMedium} ${isFinalized ? styles.inputLocked : ''}`}
                value={formData.reportDate}
                onChange={e => handleInputChange('reportDate', e.target.value)}
                readOnly={isFinalized}
                max="2099-12-31"
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: '1.5 1 240px' }}>
              <label className={`${styles.label} ${styles.labelRight}`}>Refered By :</label>
              <input
                type="text"
                className={`${styles.input} ${styles.wFull} ${isFinalized ? styles.inputLocked : ''}`}
                value={formData.referredBy}
                onChange={e => handleInputChange('referredBy', e.target.value)}
                placeholder="Referring Physician / Hospital"
                readOnly={isFinalized}
              />
            </div>

            <div className={styles.fieldGroup} style={{ flex: '2.5 1 300px' }}>
              <label className={`${styles.label} ${styles.labelRight}`}>C/O :</label>
              <input
                type="text"
                className={`${styles.input} ${styles.wFull} ${isFinalized ? styles.inputLocked : ''}`}
                value={formData.c_o}
                onChange={e => handleInputChange('c_o', e.target.value)}
                placeholder="Clinical symptoms / Indications (e.g. Chest pain, Dyspnea on exertion)"
                readOnly={isFinalized}
              />
            </div>
          </div>
        </section>

        {/* Measurements Section */}
        <section className={styles.section} aria-label="Echocardiographic Measurements">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>
              <HeartPulse size={15} /> Chamber Dimensions & Valve Assessment
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Standard 2D Transthoracic Measurements
            </span>
          </div>

          <div className={styles.measurementGrid}>
            {/* Column 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className={styles.measurementSubGrid}>
                <label className={`${styles.label} ${styles.labelRight}`}>Mitral Valve :</label>
                <input
                  type="text"
                  className={`${styles.input} ${isFinalized ? styles.inputLocked : ''}`}
                  value={formData.mitralValve}
                  onChange={e => handleInputChange('mitralValve', e.target.value)}
                  readOnly={isFinalized}
                />
              </div>

              <div className={styles.measurementSubGrid}>
                <label className={`${styles.label} ${styles.labelRight}`}>Tricuspid Valve :</label>
                <input
                  type="text"
                  className={`${styles.input} ${isFinalized ? styles.inputLocked : ''}`}
                  value={formData.tricuspidValve}
                  onChange={e => handleInputChange('tricuspidValve', e.target.value)}
                  readOnly={isFinalized}
                />
              </div>

              <div className={styles.measurementSubGrid}>
                <label className={`${styles.label} ${styles.labelRight}`}>Aorta :</label>
                <input
                  type="text"
                  className={`${styles.input} ${isFinalized ? styles.inputLocked : ''}`}
                  value={formData.aorta}
                  onChange={e => handleInputChange('aorta', e.target.value)}
                  readOnly={isFinalized}
                />
              </div>

              <div className={styles.measurementSubGrid}>
                <label className={`${styles.label} ${styles.labelRight}`}>Left Ventricle :</label>
                <input
                  type="text"
                  className={`${styles.input} ${isFinalized ? styles.inputLocked : ''}`}
                  value={formData.leftVentricle}
                  onChange={e => handleInputChange('leftVentricle', e.target.value)}
                  readOnly={isFinalized}
                />
              </div>

              <div className={styles.measurementSubGrid}>
                <label className={`${styles.label} ${styles.labelRight}`}>RWMA :</label>
                <input
                  type="text"
                  className={`${styles.input} ${isFinalized ? styles.inputLocked : ''}`}
                  value={formData.rwma}
                  onChange={e => handleInputChange('rwma', e.target.value)}
                  readOnly={isFinalized}
                />
              </div>

              <div className={styles.measurementSubGrid}>
                <label className={`${styles.label} ${styles.labelRight}`}>Right Ventricle :</label>
                <input
                  type="text"
                  className={`${styles.input} ${isFinalized ? styles.inputLocked : ''}`}
                  value={formData.rightVentricle}
                  onChange={e => handleInputChange('rightVentricle', e.target.value)}
                  readOnly={isFinalized}
                />
              </div>

              <div className={styles.measurementSubGrid}>
                <label className={`${styles.label} ${styles.labelRight}`}>IVC :</label>
                <input
                  type="text"
                  className={`${styles.input} ${isFinalized ? styles.inputLocked : ''}`}
                  value={formData.ivc}
                  onChange={e => handleInputChange('ivc', e.target.value)}
                  readOnly={isFinalized}
                />
              </div>
            </div>

            {/* Column 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className={styles.measurementSubGrid}>
                <label className={`${styles.label} ${styles.labelRight}`}>Aortic Valve :</label>
                <input
                  type="text"
                  className={`${styles.input} ${isFinalized ? styles.inputLocked : ''}`}
                  value={formData.aorticValve}
                  onChange={e => handleInputChange('aorticValve', e.target.value)}
                  readOnly={isFinalized}
                />
              </div>

              <div className={styles.measurementSubGrid}>
                <label className={`${styles.label} ${styles.labelRight}`}>Pulmonary Valve :</label>
                <div className={styles.complexRow}>
                  <input
                    type="text"
                    className={`${styles.input} ${styles.wFull} ${isFinalized ? styles.inputLocked : ''}`}
                    value={formData.pulmonaryValve}
                    onChange={e => handleInputChange('pulmonaryValve', e.target.value)}
                    readOnly={isFinalized}
                  />
                  <label className={styles.label} style={{ marginLeft: '8px' }}>LVEF :</label>
                  <input
                    type="text"
                    className={`${styles.input} ${styles.wMedium} ${isFinalized ? styles.inputLocked : ''}`}
                    value={formData.lvef}
                    onChange={e => handleInputChange('lvef', e.target.value)}
                    placeholder="e.g. 60%"
                    readOnly={isFinalized}
                  />
                </div>
              </div>

              <div className={styles.measurementSubGrid}>
                <label className={`${styles.label} ${styles.labelRight}`}>Left Atrium :</label>
                <input
                  type="text"
                  className={`${styles.input} ${isFinalized ? styles.inputLocked : ''}`}
                  value={formData.leftAtrium}
                  onChange={e => handleInputChange('leftAtrium', e.target.value)}
                  readOnly={isFinalized}
                />
              </div>

              <div className={styles.measurementSubGrid}>
                <label className={`${styles.label} ${styles.labelRight}`}>Right Atrium :</label>
                <input
                  type="text"
                  className={`${styles.input} ${isFinalized ? styles.inputLocked : ''}`}
                  value={formData.rightAtrium}
                  onChange={e => handleInputChange('rightAtrium', e.target.value)}
                  readOnly={isFinalized}
                />
              </div>

              <div className={styles.measurementSubGrid}>
                <label className={`${styles.label} ${styles.labelRight}`}>RVSP :</label>
                <input
                  type="text"
                  className={`${styles.input} ${isFinalized ? styles.inputLocked : ''}`}
                  value={formData.rvsp}
                  onChange={e => handleInputChange('rvsp', e.target.value)}
                  placeholder="mmHg"
                  readOnly={isFinalized}
                />
              </div>

              <div className={styles.measurementSubGrid}>
                <label className={`${styles.label} ${styles.labelRight}`}>IVS :</label>
                <div className={styles.complexRow}>
                  <input
                    type="text"
                    className={`${styles.input} ${styles.wFull} ${isFinalized ? styles.inputLocked : ''}`}
                    value={formData.ivs}
                    onChange={e => handleInputChange('ivs', e.target.value)}
                    readOnly={isFinalized}
                  />
                  <label className={styles.label} style={{ width: '50px', textAlign: 'right' }}>Septum :</label>
                  <input
                    type="text"
                    className={`${styles.input} ${styles.wSmall} ${isFinalized ? styles.inputLocked : ''}`}
                    value={formData.septum}
                    onChange={e => handleInputChange('septum', e.target.value)}
                    readOnly={isFinalized}
                  />
                  <span className={styles.unit}>mm</span>
                  <label className={styles.label} style={{ marginLeft: '6px' }}>LVIDd :</label>
                  <input
                    type="text"
                    className={`${styles.input} ${styles.wMedium} ${isFinalized ? styles.inputLocked : ''}`}
                    value={formData.lvidd}
                    onChange={e => handleInputChange('lvidd', e.target.value)}
                    readOnly={isFinalized}
                  />
                </div>
              </div>

              <div className={styles.measurementSubGrid}>
                <label className={`${styles.label} ${styles.labelRight}`}>IAS :</label>
                <div className={styles.complexRow}>
                  <input
                    type="text"
                    className={`${styles.input} ${styles.wFull} ${isFinalized ? styles.inputLocked : ''}`}
                    value={formData.ias}
                    onChange={e => handleInputChange('ias', e.target.value)}
                    readOnly={isFinalized}
                  />
                  <label className={styles.label} style={{ width: '50px', textAlign: 'right' }}>P.Wall :</label>
                  <input
                    type="text"
                    className={`${styles.input} ${styles.wSmall} ${isFinalized ? styles.inputLocked : ''}`}
                    value={formData.pWall}
                    onChange={e => handleInputChange('pWall', e.target.value)}
                    readOnly={isFinalized}
                  />
                  <span className={styles.unit}>mm</span>
                  <label className={styles.label} style={{ marginLeft: '6px' }}>LVIDs :</label>
                  <input
                    type="text"
                    className={`${styles.input} ${styles.wMedium} ${isFinalized ? styles.inputLocked : ''}`}
                    value={formData.lvids}
                    onChange={e => handleInputChange('lvids', e.target.value)}
                    readOnly={isFinalized}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Details Section */}
        <section className={styles.section} aria-label="Clinical Observations and Conclusion">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>
              <FileText size={15} /> Doppler Study & Clinical Conclusion
            </span>
            <button
              type="button"
              className={styles.templateBtn}
              onClick={() => setIsTemplateModalOpen(true)}
              disabled={isFinalized}
            >
              <Sparkles size={13} /> Load Report Template
            </button>
          </div>

          <div className={styles.splitSection}>
            {/* Left Side: Pericardium, Doppler Study, Conclusion */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className={styles.measurementSubGrid}>
                <label className={`${styles.label} ${styles.labelRight}`}>Pericardium :</label>
                <input
                  type="text"
                  className={`${styles.input} ${isFinalized ? styles.inputLocked : ''}`}
                  value={formData.pericardium}
                  onChange={e => handleInputChange('pericardium', e.target.value)}
                  placeholder="e.g. Normal, no pericardial effusion"
                  readOnly={isFinalized}
                />
              </div>

              <div className={styles.measurementSubGrid} style={{ alignItems: 'flex-start' }}>
                <label className={`${styles.label} ${styles.labelRight}`} style={{ marginTop: '8px' }}>
                  Doppler Study :
                </label>
                <textarea
                  className={`${styles.textarea} ${isFinalized ? styles.inputLocked : ''}`}
                  style={{ height: '80px' }}
                  value={formData.dopplerStudy}
                  onChange={e => handleInputChange('dopplerStudy', e.target.value)}
                  placeholder="Valvular flow velocities, gradients, diastolic filling pattern..."
                  readOnly={isFinalized}
                />
              </div>

              <div className={styles.measurementSubGrid} style={{ alignItems: 'flex-start' }}>
                <label className={`${styles.label} ${styles.labelRight}`} style={{ marginTop: '8px' }}>
                  Conclusion :
                </label>
                <textarea
                  className={`${styles.textarea} ${isFinalized ? styles.inputLocked : ''}`}
                  style={{ height: '80px' }}
                  value={formData.conclusion}
                  onChange={e => handleInputChange('conclusion', e.target.value)}
                  placeholder="Clinical impression and summary..."
                  readOnly={isFinalized}
                />
              </div>
            </div>

            {/* Right Side: Compliance, TVI, Arch, Consultant Doctor */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className={styles.measurementSubGrid} style={{ gridTemplateColumns: '170px 1fr' }}>
                <label className={`${styles.label} ${styles.labelRight}`}>LV. Compliance :</label>
                <input
                  type="text"
                  className={`${styles.input} ${isFinalized ? styles.inputLocked : ''}`}
                  value={formData.lvCompliance}
                  onChange={e => handleInputChange('lvCompliance', e.target.value)}
                  readOnly={isFinalized}
                />
              </div>

              <div className={styles.measurementSubGrid} style={{ gridTemplateColumns: '170px 1fr' }}>
                <label className={`${styles.label} ${styles.labelRight}`}>TVI :</label>
                <input
                  type="text"
                  className={`${styles.input} ${isFinalized ? styles.inputLocked : ''}`}
                  value={formData.tvi}
                  onChange={e => handleInputChange('tvi', e.target.value)}
                  placeholder="Time Velocity Integral"
                  readOnly={isFinalized}
                />
              </div>

              <div className={styles.measurementSubGrid} style={{ gridTemplateColumns: '170px 1fr' }}>
                <label className={`${styles.label} ${styles.labelRight}`}>
                  Left Aortic arch / PDA /<br />Coarctation :
                </label>
                <input
                  type="text"
                  className={`${styles.input} ${isFinalized ? styles.inputLocked : ''}`}
                  value={formData.leftAorticArchPdaCoarctation}
                  onChange={e => handleInputChange('leftAorticArchPdaCoarctation', e.target.value)}
                  readOnly={isFinalized}
                />
              </div>

              <div className={styles.measurementSubGrid} style={{ gridTemplateColumns: '170px 1fr' }}>
                <label className={`${styles.label} ${styles.labelRight}`}>Consultant Dr. :</label>
                <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                  <input
                    type="text"
                    className={`${styles.input} ${styles.wFull} ${isFinalized ? styles.inputLocked : ''}`}
                    value={formData.consultantDr}
                    onChange={e => handleInputChange('consultantDr', e.target.value)}
                    placeholder="Doctor Name"
                    readOnly={isFinalized}
                    list="echo-doctors-list"
                  />
                  <datalist id="echo-doctors-list">
                    {doctors.map(d => (
                      <option key={d.id} value={`${d.title} ${d.drName}`}>
                        {d.speciality ? `(${d.speciality})` : ''}
                      </option>
                    ))}
                  </datalist>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Action Bar matching Echo Report Screenshot */}
      <footer className={styles.actionBar}>
        {/* Navigation Stepper Controls */}
        <div className={styles.navControls}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={handleFirst}
            disabled={reports.length === 0 || currentIndex === 0}
            title="First Record"
            aria-label="First Record"
          >
            <ChevronsLeft size={18} />
          </button>
          <button
            type="button"
            className={styles.navBtn}
            onClick={handlePrevious}
            disabled={reports.length === 0 || currentIndex <= 0}
            title="Previous Record"
            aria-label="Previous Record"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className={styles.navBtn}
            onClick={handleNext}
            disabled={reports.length === 0 || currentIndex >= reports.length - 1}
            title="Next Record"
            aria-label="Next Record"
          >
            <ChevronRight size={18} />
          </button>
          <button
            type="button"
            className={styles.navBtn}
            onClick={handleLast}
            disabled={reports.length === 0 || currentIndex === reports.length - 1}
            title="Last Record"
            aria-label="Last Record"
          >
            <ChevronsRight size={18} />
          </button>
        </div>

        {/* Middle Actions: PRINT, Perticular Search, Binoculars Search */}
        <div className={styles.middleActions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => setIsPrintModalOpen(true)}
            disabled={!formData.uhid}
          >
            <Printer size={16} /> PRINT / Preview
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => setIsHistoryModalOpen(true)}
          >
            Perticular Search
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => setIsPatientModalOpen(true)}
            title="Quick Patient Search"
          >
            <Search size={16} />
          </button>
        </div>

        {/* Right Actions: Add, Update (Save Draft), Finalize, Delete, Exit */}
        <div className={styles.rightActions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={handleAddNew}
            disabled={isSaving}
          >
            <Plus size={16} /> Add (New)
          </button>

          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleSaveDraft}
            disabled={isSaving || (isFinalized && !isEditingFinalized)}
          >
            <Save size={16} /> {currentId ? 'Update (Save)' : 'Save Draft'}
          </button>

          {formData.status !== 'Finalized' && (
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSuccess}`}
              onClick={() => setIsFinalizeConfirmOpen(true)}
              disabled={isSaving || !formData.uhid}
            >
              <Lock size={15} /> Finalize
            </button>
          )}

          <button
            type="button"
            className={`${styles.btn} ${styles.btnDanger}`}
            onClick={() => setIsDeleteConfirmOpen(true)}
            disabled={isSaving || !currentId}
          >
            <Trash2 size={16} /> Delete
          </button>

          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => navigate('/patient-registration')}
            style={{ marginLeft: '4px' }}
          >
            <LogOut size={16} /> Exit
          </button>
        </div>
      </footer>

      {/* =====================================================================
          MODAL 1: Patient Search Directory
          ===================================================================== */}
      {isPatientModalOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalContent} style={{ maxWidth: '750px' }}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <UserCheck size={20} color="var(--primary)" />
                Select Existing Patient
              </h2>
              <button
                type="button"
                className={styles.navBtn}
                style={{ width: '32px', height: '32px' }}
                onClick={() => setIsPatientModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div style={{ marginBottom: '14px' }}>
                <input
                  type="text"
                  className={styles.input}
                  style={{ width: '100%', height: '40px', fontSize: '14px' }}
                  placeholder="Search patient by Name, UHID, or Mobile Number..."
                  value={patientSearchTerm}
                  onChange={e => setPatientSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>

              <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>UHID</th>
                      <th>Patient Name</th>
                      <th>Age / Sex</th>
                      <th>Mobile</th>
                      <th>Doctor</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                          No matching patients found.
                        </td>
                      </tr>
                    ) : (
                      filteredPatients.map(p => {
                        const name = [p.firstName, p.middleName, p.lastName].filter(Boolean).join(' ');
                        return (
                          <tr key={p.uhid}>
                            <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{p.uhid}</td>
                            <td style={{ fontWeight: 600 }}>{name}</td>
                            <td>{p.age} yrs / {p.sex}</td>
                            <td>{p.mobile}</td>
                            <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              {p.hospitalDoctor || p.referenceBy || '--'}
                            </td>
                            <td>
                              <button
                                type="button"
                                className={`${styles.btn} ${styles.btnPrimary}`}
                                style={{ height: '28px', fontSize: '12px', padding: '0 10px' }}
                                onClick={() => handleSelectPatient(p)}
                              >
                                Select
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => setIsPatientModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: Perticular Search / Echo Report History
          ===================================================================== */}
      {isHistoryModalOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalContent} style={{ maxWidth: '900px' }}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <Search size={20} color="var(--primary)" />
                Perticular Search — Echo Report Directory
              </h2>
              <button
                type="button"
                className={styles.navBtn}
                style={{ width: '32px', height: '32px' }}
                onClick={() => setIsHistoryModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Search & Filter Toolbar */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  className={styles.input}
                  style={{ flex: '1 1 200px' }}
                  placeholder="Search by Report ID, UHID, Patient Name, or Findings..."
                  value={historySearchTerm}
                  onChange={e => setHistorySearchTerm(e.target.value)}
                  autoFocus
                />

                <select
                  className={styles.input}
                  style={{ width: '130px' }}
                  value={historyStatusFilter}
                  onChange={e => setHistoryStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Draft">Draft Only</option>
                  <option value="Finalized">Finalized Only</option>
                </select>

                <select
                  className={styles.input}
                  style={{ width: '180px' }}
                  value={historyDoctorFilter}
                  onChange={e => setHistoryDoctorFilter(e.target.value)}
                >
                  <option value="All">All Doctors</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.drName}>
                      {d.title} {d.drName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Table */}
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Report ID</th>
                      <th>Date</th>
                      <th>Patient (UHID)</th>
                      <th>LVEF</th>
                      <th>Consultant Dr.</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                          No echo reports match your search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredReports.map((rep, idx) => (
                        <tr key={rep.id}>
                          <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{rep.id}</td>
                          <td>{rep.reportDate}</td>
                          <td>
                            <strong>{rep.patientName}</strong> <span style={{ color: 'var(--text-muted)' }}>({rep.uhid})</span>
                          </td>
                          <td style={{ fontWeight: 600 }}>{rep.lvef || '--'}</td>
                          <td style={{ fontSize: '12px' }}>{rep.consultantDr || '--'}</td>
                          <td>
                            {rep.status === 'Finalized' ? (
                              <span className={styles.statusBadgeFinalized} style={{ fontSize: '11px', padding: '2px 8px' }}>
                                <Lock size={10} /> Finalized
                              </span>
                            ) : (
                              <span className={styles.statusBadgeDraft} style={{ fontSize: '11px', padding: '2px 8px' }}>
                                Draft
                              </span>
                            )}
                          </td>
                          <td>
                            <button
                              type="button"
                              className={`${styles.btn} ${styles.btnPrimary}`}
                              style={{ height: '28px', fontSize: '12px', padding: '0 10px' }}
                              onClick={() => {
                                loadReport(rep, idx);
                                setIsHistoryModalOpen(false);
                              }}
                            >
                              Open
                            </button>
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
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => setIsHistoryModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: Report Template Selector
          ===================================================================== */}
      {isTemplateModalOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalContent} style={{ maxWidth: '700px' }}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <Sparkles size={20} color="var(--primary)" />
                Load Findings from Report Template Master
              </h2>
              <button
                type="button"
                className={styles.navBtn}
                style={{ width: '32px', height: '32px' }}
                onClick={() => setIsTemplateModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: 0 }}>
                Select a standard echocardiography or cardiology report template from the Master database to populate Doppler Study and Conclusion:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto' }}>
                {templates.map(tpl => (
                  <div
                    key={tpl.id}
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      padding: '12px 14px',
                      backgroundColor: 'var(--surface)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-main)' }}>
                        {tpl.templateName}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Group: {tpl.groupName} • Dept: {tpl.department || 'Cardiology'}
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnPrimary}`}
                      style={{ height: '30px', fontSize: '12px' }}
                      onClick={() => handleSelectTemplate(tpl)}
                    >
                      Insert Text
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => setIsTemplateModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 4: Printable A4 Report Preview
          ===================================================================== */}
      {isPrintModalOpen && (
        <div className={`${styles.modalOverlay} ${styles.printOverlayActive}`} role="dialog" aria-modal="true">
          <div className={styles.modalContent} style={{ maxWidth: '860px', maxHeight: '95vh' }}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <Printer size={18} color="var(--primary)" />
                Printable Echo Report Preview (A4 Standard)
              </h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => window.print()}
                >
                  <Printer size={15} /> Print Now
                </button>
                <button
                  type="button"
                  className={styles.navBtn}
                  style={{ width: '32px', height: '32px' }}
                  onClick={() => setIsPrintModalOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className={styles.modalBody} style={{ backgroundColor: '#f1f5f9', padding: '16px' }}>
              <div className={styles.printContainer} id="printable-echo-report">
                {/* Hospital Header */}
                <header className={styles.printHeader}>
                  <h1 className={styles.printHospitalName}>{HOSPITAL_CONFIG.name}</h1>
                  <p className={styles.printHospitalInfo}>
                    {HOSPITAL_CONFIG.address} | Phone: {HOSPITAL_CONFIG.phone} | Email: {HOSPITAL_CONFIG.email}
                  </p>
                  <div className={styles.printTitleBanner}>
                    2D TRANSTHORACIC ECHOCARDIOGRAPHY & COLOR DOPPLER REPORT
                  </div>
                </header>

                {/* Patient Information Grid */}
                <section className={styles.printPatientGrid} aria-label="Patient details">
                  <div className={styles.printPatientRow}>
                    <span className={styles.printPatientLabel}>Patient Name:</span>
                    <span className={styles.printPatientVal}>{formData.patientName || '--'}</span>
                  </div>
                  <div className={styles.printPatientRow}>
                    <span className={styles.printPatientLabel}>Report Date:</span>
                    <span className={styles.printPatientVal}>{formData.reportDate}</span>
                  </div>
                  <div className={styles.printPatientRow}>
                    <span className={styles.printPatientLabel}>UHID / Pt.Code:</span>
                    <span className={styles.printPatientVal}>{formData.uhid || '--'}</span>
                  </div>
                  <div className={styles.printPatientRow}>
                    <span className={styles.printPatientLabel}>Age / Sex:</span>
                    <span className={styles.printPatientVal}>{formData.age} Yrs / {formData.sex}</span>
                  </div>
                  <div className={styles.printPatientRow}>
                    <span className={styles.printPatientLabel}>Referred By:</span>
                    <span className={styles.printPatientVal}>{formData.referredBy || 'Self / Consultant'}</span>
                  </div>
                  <div className={styles.printPatientRow}>
                    <span className={styles.printPatientLabel}>Consultant:</span>
                    <span className={styles.printPatientVal}>{formData.consultantDr || 'Dr. Nilesh Mahale'}</span>
                  </div>
                  {formData.c_o && (
                    <div className={styles.printPatientRow} style={{ gridColumn: 'span 2' }}>
                      <span className={styles.printPatientLabel}>Clinical Indication (C/O):</span>
                      <span className={styles.printPatientVal}>{formData.c_o}</span>
                    </div>
                  )}
                </section>

                {/* Structured Measurements Table */}
                <table className={styles.printTable} aria-label="Anatomical dimensions">
                  <thead>
                    <tr>
                      <th style={{ width: '30%' }}>Cardiac Structure / Parameter</th>
                      <th style={{ width: '40%' }}>Observed Finding</th>
                      <th style={{ width: '30%' }}>Reference / Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Left Ventricular Function (LVEF)</strong></td>
                      <td><strong>{formData.lvef || '--'}</strong></td>
                      <td>Normal: 55% - 70%</td>
                    </tr>
                    <tr>
                      <td>Mitral Valve</td>
                      <td>{formData.mitralValve || 'Normal morphology'}</td>
                      <td>Leaflets, subvalvular apparatus</td>
                    </tr>
                    <tr>
                      <td>Aortic Valve & Aorta</td>
                      <td>{formData.aorticValve || 'Trileaflet'} • Aorta: {formData.aorta || 'Normal'}</td>
                      <td>No significant stenosis / regurgitation</td>
                    </tr>
                    <tr>
                      <td>Tricuspid Valve & RVSP</td>
                      <td>{formData.tricuspidValve || 'Normal'} • RVSP: {formData.rvsp || 'Normal'}</td>
                      <td>PASP estimation</td>
                    </tr>
                    <tr>
                      <td>Pulmonary Valve</td>
                      <td>{formData.pulmonaryValve || 'Normal'}</td>
                      <td>Flow velocity</td>
                    </tr>
                    <tr>
                      <td>Atrial Dimensions</td>
                      <td>LA: {formData.leftAtrium || 'Normal'} • RA: {formData.rightAtrium || 'Normal'}</td>
                      <td>Chamber cavity size</td>
                    </tr>
                    <tr>
                      <td>Right Ventricle & IVC</td>
                      <td>RV: {formData.rightVentricle || 'Normal'} • IVC: {formData.ivc || 'Normal'}</td>
                      <td>Respiratory collapsibility</td>
                    </tr>
                    <tr>
                      <td>Septum & Posterior Wall</td>
                      <td>IVS: {formData.ivs || '--'} ({formData.septum || '--'} mm) • P.Wall: {formData.pWall || '--'} mm</td>
                      <td>Wall thickness</td>
                    </tr>
                    <tr>
                      <td>LV Internal Dimensions</td>
                      <td>LVIDd: {formData.lvidd || '--'} mm • LVIDs: {formData.lvids || '--'} mm</td>
                      <td>End-diastole / End-systole</td>
                    </tr>
                    <tr>
                      <td>RWMA</td>
                      <td>{formData.rwma || 'No regional wall motion abnormality at rest'}</td>
                      <td>Segmental wall motion</td>
                    </tr>
                    <tr>
                      <td>Pericardium</td>
                      <td>{formData.pericardium || 'Normal, no effusion'}</td>
                      <td>Pericardial space</td>
                    </tr>
                  </tbody>
                </table>

                {/* Doppler Findings */}
                {formData.dopplerStudy && (
                  <div className={styles.printBox}>
                    <div className={styles.printBoxTitle}>Color Doppler Study & Hemodynamics</div>
                    <div className={styles.printBoxContent}>{formData.dopplerStudy}</div>
                  </div>
                )}

                {/* Conclusion */}
                <div className={styles.printBox} style={{ border: '2px solid #0f172a' }}>
                  <div className={styles.printBoxTitle}>Conclusion / Impression</div>
                  <div className={styles.printBoxContent} style={{ fontWeight: 600 }}>
                    {formData.conclusion || 'Normal 2D Transthoracic Echocardiogram. Preserved LV systolic function.'}
                  </div>
                </div>

                {/* Doctor Sign-off */}
                <footer className={styles.printFooterSign}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      Report Status: <strong>{formData.status.toUpperCase()}</strong>
                      {formData.finalizedAt && ` • Finalized on ${new Date(formData.finalizedAt).toLocaleString()}`}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ borderBottom: '1px solid #0f172a', width: '200px', marginBottom: '6px' }} />
                    <strong style={{ fontSize: '13px' }}>{formData.consultantDr || 'Consultant Cardiologist'}</strong>
                    <div style={{ fontSize: '11px', color: '#475569' }}>Reporting Consultant / Cardiologist</div>
                  </div>
                </footer>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => window.print()}
              >
                <Printer size={15} /> Print
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => setIsPrintModalOpen(false)}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 5: Finalize Confirmation Dialog
          ===================================================================== */}
      {isFinalizeConfirmOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalContent} style={{ maxWidth: '480px' }}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle} style={{ color: '#059669' }}>
                <Lock size={18} /> Finalize Echo Report
              </h2>
              <button
                type="button"
                className={styles.navBtn}
                style={{ width: '32px', height: '32px' }}
                onClick={() => setIsFinalizeConfirmOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p style={{ fontSize: '14px', lineHeight: 1.5, color: 'var(--text-main)', marginTop: 0 }}>
                Are you sure you want to finalize this Echo Report for <strong>{formData.patientName}</strong> ({formData.uhid})?
              </p>
              <div
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  color: '#065f46'
                }}
              >
                Once finalized, findings become authoritative clinical documentation and will be protected from accidental modification.
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => setIsFinalizeConfirmOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSuccess}`}
                onClick={handleConfirmFinalize}
                disabled={isSaving}
              >
                {isSaving ? 'Finalizing...' : 'Yes, Finalize Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 6: Delete Confirmation Dialog
          ===================================================================== */}
      {isDeleteConfirmOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalContent} style={{ maxWidth: '460px' }}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle} style={{ color: 'var(--danger)' }}>
                <Trash2 size={18} /> Delete Echo Report
              </h2>
              <button
                type="button"
                className={styles.navBtn}
                style={{ width: '32px', height: '32px' }}
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p style={{ fontSize: '14px', lineHeight: 1.5, color: 'var(--text-main)', marginTop: 0 }}>
                Are you sure you want to permanently delete Echo Report <strong>{currentId}</strong> for patient <strong>{formData.patientName}</strong>?
              </p>
              <p style={{ fontSize: '12.5px', color: 'var(--danger)', margin: 0 }}>
                This action cannot be undone.
              </p>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => setIsDeleteConfirmOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnDanger}`}
                onClick={handleConfirmDelete}
                disabled={isSaving}
              >
                {isSaving ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EchoReport;
