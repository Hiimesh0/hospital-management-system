import React from 'react';
import { Save, Printer, FileText, ClipboardList, RefreshCw, XCircle, ChevronDown } from 'lucide-react';
import styles from './DischargeCard.module.css';

const ClinicalField = ({ label, minHeight = "80px" }: { label: string, minHeight?: string }) => (
 <div className={styles.clinicalField}>
 <div className={styles.clinicalFieldHeader}>
 <button className={styles.helpBtn} title="Click for help">?</button>
 <label className={styles.clinicalLabel}>{label}</label>
 </div>
 <textarea className={styles.textarea} style={{ minHeight }} maxLength={500}></textarea>
 </div>
);

const DischargeCard: React.FC = () => {
 return (
 <div className={styles.pageContainer}>
 
 {/* Top Header Card */}
 <div className={styles.headerCard}>
 <div className={styles.topHeader}>
 <div className={styles.fieldGroup}>
 <span className={styles.headerInfoText}>Entry By :</span>
 {/* Empty per screenshot */}
 </div>
 <h1 className={styles.pageTitle}>Discharge Card</h1>
 <div className={styles.fieldGroup}>
 <span className={styles.headerInfoText}>Prepared By :</span>
 <span className={styles.headerInfoText} style={{ color: 'var(--text-main)', fontWeight: 600 }}>--</span>
 </div>
 </div>

 {/* Patient Context Grid */}
 <div className={styles.infoGrid}>
 <div className={`${styles.fieldGroup} ${styles.col3}`}>
 <label className={styles.label}>IPD No :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={`${styles.fieldGroup} ${styles.col3}`}>
 <label className={styles.label}>Ward :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={`${styles.fieldGroup} ${styles.col6}`}>
 <label className={styles.label}>Patient :</label>
 <div className={styles.patientNameBadge}>--</div>
 <span className={styles.patientDemographics}>Age : 47 Yrs. Sex : Male</span>
 </div>
 </div>

 {/* Dates Grid */}
 <div className={styles.infoGrid} style={{ marginBottom: 0 }}>
 <div className={`${styles.fieldGroup} ${styles.col3}`}>
 <label className={styles.label}>D.O.A & Time :</label>
 <input type="text" className={`${styles.input} ${styles.inputReadOnly}`} readOnly />
 </div>
 <div className={`${styles.fieldGroup} ${styles.col3}`}>
 <label className={styles.checkboxGroup}><span className={styles.label}>D.O.D & Time :</span>
 <input type="checkbox" className={styles.checkbox} /></label>
 <input type="time" className={styles.input} />
 </div>
 <div className={`${styles.fieldGroup} ${styles.col2}`}>
 <label className={styles.checkboxGroup}>
 <span className={styles.label}>DOS 1 :</span>
 <input type="checkbox" className={styles.checkbox} defaultChecked />
 </label>
 <input type="date" className={styles.input}  max="2099-12-31" />
 </div>
 <div className={`${styles.fieldGroup} ${styles.col2}`}>
 <label className={styles.checkboxGroup}>
 <span className={styles.label}>DOS 2 :</span>
 <input type="checkbox" className={styles.checkbox} defaultChecked />
 </label>
 <input type="date" className={styles.input}  max="2099-12-31" />
 </div>
 <div className={`${styles.fieldGroup} ${styles.col2}`}>
 <label className={styles.checkboxGroup}>
 <span className={styles.label}>DOS 3 :</span>
 <input type="checkbox" className={styles.checkbox} defaultChecked />
 </label>
 <input type="date" className={styles.input}  max="2099-12-31" />
 </div>
 </div>
 </div>

 {/* Main Clinical Content (Two Columns) */}
 <div className={styles.clinicalGrid}>
 
 {/* Left Column */}
 <div className={styles.clinicalSection}>
 <ClinicalField label="Diagnosis" minHeight="100px" />
 <ClinicalField label="Medical Rx" minHeight="100px" />
 <ClinicalField label="Investigations" minHeight="100px" />
 <ClinicalField label="Histopathology Report" minHeight="100px" />
 <ClinicalField label="Advice On Discharge/ Urgent Care" minHeight="100px" />
 </div>

 {/* Right Column */}
 <div className={styles.clinicalSection}>
 <ClinicalField label="History and Clinical Summary" minHeight="100px" />
 <ClinicalField label="Surgery / Procedure Name" minHeight="100px" />
 <ClinicalField label="Surgical Note" minHeight="100px" />
 <ClinicalField label="Condition On Discharge" minHeight="100px" />
 <ClinicalField label="Remarks" minHeight="100px" />
 </div>

 </div>

 {/* RX Section */}
 <div className={styles.rxSection}>
 <div className={styles.rxGrid}>
 {/* Left RX Box */}
 <div style={{ display: 'flex', flexDirection: 'column' }}>
 <div className={styles.clinicalFieldHeader}>
 <button className={styles.helpBtn} title="Click for help">?</button>
 <label className={styles.clinicalLabel}>RX (Advise On Discharge)</label>
 </div>
 <textarea className={styles.textarea} style={{ flex: 1, minHeight: '160px' }} maxLength={500}></textarea>
 </div>

 {/* Right RX Controls */}
 <div className={styles.rxControls}>
 
 <div className={styles.rxControlRow}>
 <label className={styles.label} style={{ width: '120px', paddingTop: '10px' }}>Advice</label>
 <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
 <div style={{ display: 'flex', gap: '8px' }}>
 <input type="text" className={styles.input} style={{ flex: 1 }} />
 <button className={styles.iconBtn}><ChevronDown size={16} /></button>
 <select className={styles.select} style={{ width: '150px' }}>
 <option value="Gujarati">Gujarati</option>
 </select>
 </div>
 <div className={styles.clinicalFieldHeader} style={{ marginTop: '4px', marginBottom: '0' }}>
 <label className={styles.label}>Advice</label>
 </div>
 <textarea className={styles.textarea} style={{ minHeight: '60px' }} maxLength={500}></textarea>
 </div>
 </div>

 <div className={styles.rxControlRow} style={{ marginTop: '8px' }}>
 <div style={{ flex: 1 }}></div>
 <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
 <label className={styles.label}>Select Discharge Type</label>
 <input type="text" className={styles.input} />
 </div>
 </div>

 <div className={styles.rxControlRow} style={{ marginTop: '8px' }}>
 <div style={{ flex: 1 }}></div>
 <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
 <label className={styles.label} style={{ width: 'auto' }}>Follow up</label>
 <input type="text" className={styles.input} />
 </div>
 </div>

 </div>
 </div>
 </div>

 {/* Action Bar */}
 <div className={styles.actionBar}>
 <div className={styles.actionGroup}>
 <button className={styles.secondaryBtn}><Printer size={16} /> Print</button>
 <label className={styles.checkboxGroup} style={{ marginRight: '16px' }}>
 <input type="checkbox" className={styles.checkbox} />
 <span className={styles.label}>L</span>
 </label>
 <button className={styles.secondaryBtn}><FileText size={16} /> ICD</button>
 <button className={styles.secondaryBtn}><ClipboardList size={16} /> Prescription</button>
 </div>

 <div className={styles.actionGroup}>
 <button className={styles.primaryBtn} style={{ backgroundColor: 'var(--warning)', color: 'var(--text-main)' }}>
 <Save size={18} /> Save
 </button>
 <button className={styles.secondaryBtn} disabled>
 <RefreshCw size={16} /> Update
 </button>
 <button className={styles.secondaryBtn}>
 <XCircle size={16} /> Cancel
 </button>
 </div>
 </div>

 </div>
 );
};

export default DischargeCard;
