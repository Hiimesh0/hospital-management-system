import React from 'react';
import { 
 ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
 Search, Save, LogOut, Edit2, Trash2, Printer
} from 'lucide-react';
import styles from './EchoReport.module.css';

const EchoReport: React.FC = () => {
 return (
 <div className={styles.pageContainer}>
 
 {/* Header */}
 <div className={styles.header}>
 <h1 className={styles.pageTitle}>Echo Report</h1>
 </div>

 {/* Form Container */}
 <div className={styles.formContainer}>
 
 {/* Patient Details Section */}
 <div className={styles.section}>
 <div className={styles.row}>
 <div className={styles.fieldGroup} style={{ flex: 1.5 }}>
 <label className={`${styles.label} ${styles.labelRight}`}>Patient's Name :</label>
 <input type="text" className={`${styles.input} ${styles.wFull}`} style={{ backgroundColor: 'var(--warning-soft)' }} />
 </div>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={`${styles.label} ${styles.labelRight}`}>Pt.Code :</label>
 <input type="text" className={`${styles.input} ${styles.wFull}`} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Age :</label>
 <input type="number" min="0" max="150" className={`${styles.input} ${styles.wSmall}`} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Sex :</label>
 <select className={`${styles.input} ${styles.wSmall}`}>
 <option></option>
 <option>Male</option>
 <option>Female</option>
 </select>
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Date :</label>
 <input type="date" className={`${styles.input} ${styles.inputReadOnly} ${styles.wMedium}`} readOnly  max="2099-12-31" />
 </div>
 </div>
 
 <div className={styles.row}>
 <div className={styles.fieldGroup} style={{ flex: 1.5 }}>
 <label className={`${styles.label} ${styles.labelRight}`}>Refered By :</label>
 <input type="text" className={`${styles.input} ${styles.wFull}`} />
 </div>
 <div className={styles.fieldGroup} style={{ flex: 2.5 }}>
 <label className={`${styles.label} ${styles.labelRight}`}>C/O :</label>
 <input type="text" className={`${styles.input} ${styles.wFull}`} />
 </div>
 </div>
 </div>

 {/* Measurements Section */}
 <div className={styles.section}>
 <div className={styles.measurementGrid}>
 
 {/* Column 1 */}
 <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
 <div className={styles.measurementSubGrid}>
 <label className={`${styles.label} ${styles.labelRight}`}>Mitral Valve :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.measurementSubGrid}>
 <label className={`${styles.label} ${styles.labelRight}`}>Tricuspid Valve :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.measurementSubGrid}>
 <label className={`${styles.label} ${styles.labelRight}`}>Aorta :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.measurementSubGrid}>
 <label className={`${styles.label} ${styles.labelRight}`}>Left Ventricle :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.measurementSubGrid}>
 <label className={`${styles.label} ${styles.labelRight}`}>RWMA :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.measurementSubGrid}>
 <label className={`${styles.label} ${styles.labelRight}`}>Right Ventricle :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.measurementSubGrid}>
 <label className={`${styles.label} ${styles.labelRight}`}>IVC :</label>
 <input type="text" className={styles.input} />
 </div>
 </div>

 {/* Column 2 */}
 <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
 <div className={styles.measurementSubGrid}>
 <label className={`${styles.label} ${styles.labelRight}`}>Aortic Valve :</label>
 <input type="text" className={styles.input} />
 </div>
 
 <div className={styles.measurementSubGrid}>
 <label className={`${styles.label} ${styles.labelRight}`}>Pulmonary Valve :</label>
 <div className={styles.complexRow}>
 <input type="text" className={`${styles.input} ${styles.wFull}`} />
 <label className={styles.label} style={{ marginLeft: '16px' }}>LVEF :</label>
 <input type="text" className={`${styles.input} ${styles.wMedium}`} />
 </div>
 </div>

 <div className={styles.measurementSubGrid}>
 <label className={`${styles.label} ${styles.labelRight}`}>Left Atrium :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.measurementSubGrid}>
 <label className={`${styles.label} ${styles.labelRight}`}>Right Atrium :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.measurementSubGrid}>
 <label className={`${styles.label} ${styles.labelRight}`}>RVSP :</label>
 <input type="text" className={styles.input} />
 </div>
 
 <div className={styles.measurementSubGrid}>
 <label className={`${styles.label} ${styles.labelRight}`}>IVS :</label>
 <div className={styles.complexRow}>
 <input type="text" className={`${styles.input} ${styles.wFull}`} />
 <label className={styles.label} style={{ width: '60px', textAlign: 'right' }}>Septum :</label>
 <input type="text" className={`${styles.input} ${styles.wSmall}`} />
 <span className={styles.unit}>mm</span>
 <label className={styles.label} style={{ marginLeft: '16px' }}>LVIDd :</label>
 <input type="text" className={`${styles.input} ${styles.wMedium}`} />
 </div>
 </div>

 <div className={styles.measurementSubGrid}>
 <label className={`${styles.label} ${styles.labelRight}`}>IAS :</label>
 <div className={styles.complexRow}>
 <input type="text" className={`${styles.input} ${styles.wFull}`} />
 <label className={styles.label} style={{ width: '60px', textAlign: 'right' }}>P.Wall :</label>
 <input type="text" className={`${styles.input} ${styles.wSmall}`} />
 <span className={styles.unit}>mm</span>
 <label className={styles.label} style={{ marginLeft: '16px' }}>LVIDs :</label>
 <input type="text" className={`${styles.input} ${styles.wMedium}`} />
 </div>
 </div>
 </div>

 </div>
 </div>

 {/* Bottom Details Section */}
 <div className={styles.section}>
 <div className={styles.splitSection}>
 
 {/* Left Side (Notes) */}
 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
 <div className={styles.measurementSubGrid}>
 <label className={`${styles.label} ${styles.labelRight}`}>Pericardium :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.measurementSubGrid} style={{ alignItems: 'flex-start' }}>
 <label className={`${styles.label} ${styles.labelRight}`} style={{ marginTop: '8px' }}>Doppler Study :</label>
 <textarea className={styles.textarea} style={{ height: '80px' }} maxLength={500}></textarea>
 </div>
 <div className={styles.measurementSubGrid} style={{ alignItems: 'flex-start' }}>
 <label className={`${styles.label} ${styles.labelRight}`} style={{ marginTop: '8px' }}>Conclusion :</label>
 <textarea className={styles.textarea} style={{ height: '80px' }} maxLength={500}></textarea>
 </div>
 </div>

 {/* Right Side (Additional Params) */}
 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
 <div className={styles.measurementSubGrid} style={{ gridTemplateColumns: '180px 1fr' }}>
 <label className={`${styles.label} ${styles.labelRight}`} style={{ width: '100%' }}>LV. Compliance :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.measurementSubGrid} style={{ gridTemplateColumns: '180px 1fr' }}>
 <label className={`${styles.label} ${styles.labelRight}`} style={{ width: '100%' }}>TVI :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.measurementSubGrid} style={{ gridTemplateColumns: '180px 1fr' }}>
 <label className={`${styles.label} ${styles.labelRight}`} style={{ width: '100%' }}>Left Aortic arch / PDA /<br/>Coarctation :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.measurementSubGrid} style={{ gridTemplateColumns: '180px 1fr' }}>
 <label className={`${styles.label} ${styles.labelRight}`} style={{ width: '100%' }}>Consultant Dr. :</label>
 <input type="text" className={styles.input} />
 </div>
 </div>

 </div>
 </div>

 </div>

 {/* Bottom Action Bar */}
 <div className={styles.actionBar}>
 <div className={styles.navControls}>
 <button className={styles.navBtn}><ChevronsLeft size={18} /></button>
 <button className={styles.navBtn}><ChevronLeft size={18} /></button>
 <button className={styles.navBtn}><ChevronRight size={18} /></button>
 <button className={styles.navBtn}><ChevronsRight size={18} /></button>
 </div>

 <div className={styles.middleActions}>
 <button className={styles.secondaryBtn}>
 <Printer size={16} /> PRINT
 </button>
 <button className={styles.secondaryBtn}>
 Perticular Search
 </button>
 <button className={styles.secondaryBtn}>
 <Search size={16} /> {/* Binoculars */}
 </button>
 </div>

 <div className={styles.rightActions}>
 <button className={styles.primaryBtn}>
 <Save size={16} /> Add
 </button>
 <button className={styles.secondaryBtn}>
 <Edit2 size={16} /> Update
 </button>
 <button className={styles.dangerBtn}>
 <Trash2 size={16} /> Delete
 </button>
 <button className={styles.secondaryBtn} style={{ marginLeft: '8px' }}>
 <LogOut size={16} /> Exit
 </button>
 </div>
 </div>

 </div>
 );
};

export default EchoReport;
