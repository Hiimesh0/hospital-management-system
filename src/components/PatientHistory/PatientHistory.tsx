import React from 'react';
import { 
 ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
 Printer, Folder, Save, Edit2, LogOut, ArrowDown
} from 'lucide-react';
import styles from './PatientHistory.module.css';

const PatientHistory: React.FC = () => {
 return (
 <div className={styles.pageContainer}>
 
 {/* Header */}
 <div className={styles.header}>
 <h1 className={styles.pageTitle}>Patient History</h1>
 </div>

 <div className={styles.formContainer}>
 
 {/* Top Info Group */}
 <div className={styles.sectionGroup}>
 <div className={styles.row}>
 <div className={styles.fieldGroup} style={{ flex: 3 }}>
 <label className={styles.label}>Patient</label>
 <div className={styles.row} style={{ gap: '8px' }}>
 <input type="text" className={styles.input} style={{ flex: 1 }} />
 <input type="text" className={styles.input} style={{ flex: 3 }} />
 </div>
 </div>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label}>Age</label>
 <input type="number" min="0" max="150" className={styles.input} />
 </div>
 <div className={styles.fieldGroup} style={{ flex: 2 }}>
 <label className={styles.label}>Dr</label>
 <select className={styles.input}>
 <option></option>
 </select>
 </div>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label}>Date</label>
 <input type="date" className={styles.input}  max="2099-12-31" />
 </div>
 </div>

 {/* Vitals */}
 <div className={styles.vitalsRow}>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>BP</label>
 <div className={styles.bpGroup}>
 <input type="text" className={`${styles.input} ${styles.bpInput}`} />
 <span className={styles.bpSeparator}>/</span>
 <div className={styles.inputWithUnit}>
 <input type="text" className={`${styles.input} ${styles.bpInput}`} />
 <span className={styles.unitLabel}>mmHg</span>
 </div>
 </div>
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Pulse</label>
 <div className={styles.inputWithUnit}>
 <input type="text" className={styles.input} />
 <span className={styles.unitLabel}>bpm</span>
 </div>
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Temp.</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>SPO2</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Height</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Weight</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>BMI</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Allergy</label>
 <input type="text" className={styles.input} />
 </div>
 </div>
 </div>

 {/* Clinical Details */}
 <div className={styles.sectionGroup}>
 <div className={styles.row}>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label}>Complains</label>
 <textarea className={styles.input} style={{ height: '60px', padding: '8px 12px', resize: 'vertical' }} maxLength={500}></textarea>
 </div>
 </div>
 <div className={styles.row}>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label}>On Examination</label>
 <textarea className={styles.input} style={{ height: '60px', padding: '8px 12px', resize: 'vertical' }} maxLength={500}></textarea>
 </div>
 </div>
 <div className={styles.row}>
 <div className={styles.fieldGroup} style={{ flex: 3 }}>
 <label className={styles.label}>Diagnosis</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label}>Other</label>
 <input type="text" className={styles.input} />
 </div>
 </div>
 </div>

 {/* Rx Section */}
 <div className={styles.rxSection}>
 <div className={styles.rxHeader}>Rx (Prescription)</div>
 <div className={styles.rxInputRow}>
 <input type="text" className={styles.input} style={{ flex: 3 }} />
 <input type="text" className={styles.input} style={{ flex: 2 }} />
 <input type="text" className={styles.input} style={{ flex: 2 }} />
 <input type="text" className={styles.input} style={{ flex: 2 }} />
 <input type="text" className={styles.input} style={{ flex: 2 }} />
 <input type="text" className={styles.input} style={{ width: '80px' }} />
 <input type="text" className={styles.input} style={{ width: '80px' }} />
 <input type="text" className={styles.input} style={{ flex: 2 }} />
 <button className={styles.iconBtn}>
 <ArrowDown size={18} />
 </button>
 </div>
 <div className={styles.tableWrapper}>
 <table className={styles.dataTable}>
 <thead>
 <tr>
 <th>Medicine</th>
 <th>Generic</th>
 <th>Frequency</th>
 <th>Remarks1</th>
 <th>Remarks2</th>
 <th>T. Days</th>
 <th>T. Qty</th>
 <th>Notes</th>
 </tr>
 </thead>
 <tbody>
 <tr>
 <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: '#64748B', fontStyle: 'italic' }}>
 No medicines prescribed yet.
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 <div className={styles.rxFooter}>
 <button className={styles.smallBtn}>Clear</button>
 <button className={styles.smallBtn}>LP</button>
 <button className={styles.smallBtn}>SP</button>
 <div className={styles.row} style={{ marginLeft: 'auto', gap: '8px' }}>
 <input type="text" className={styles.input} style={{ width: '150px' }} />
 <button className={styles.smallBtn}>Save SP</button>
 <div className={styles.inputWithUnit} style={{ marginLeft: '16px' }}>
 <input type="text" className={styles.input} style={{ width: '80px' }} />
 <span className={styles.unitLabel}>Days</span>
 </div>
 <button className={styles.smallBtn}>Do</button>
 </div>
 </div>
 </div>

 {/* Bottom Form Fields */}
 <div className={styles.sectionGroup}>
 <div className={styles.row}>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label}>Advice (Manual)</label>
 <input type="text" className={styles.input} />
 </div>
 </div>
 <div className={styles.row}>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label}>Advice (Master)</label>
 <input type="text" className={styles.input} />
 </div>
 </div>
 <div className={styles.row}>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label}>Test Requested</label>
 <input type="text" className={styles.input} />
 </div>
 </div>
 
 {/* Next Visit Row */}
 <div className={styles.row} style={{ alignItems: 'flex-end', marginTop: '8px' }}>
 <div className={styles.fieldGroup} style={{ flex: 2 }}>
 <label className={styles.label}>Next Visit</label>
 <div className={styles.row} style={{ padding: '8px 12px', border: '1px solid #DDE3EA', borderRadius: '6px', backgroundColor: '#FFFFFF' }}>
 <div className={styles.radioGroup}>
 <label className={styles.radioItem}>
 <input type="radio" name="nextVisit" /> Day
 </label>
 <label className={styles.radioItem}>
 <input type="radio" name="nextVisit" /> Week
 </label>
 <label className={styles.radioItem}>
 <input type="radio" name="nextVisit" /> Month
 </label>
 </div>
 <span className={styles.accentText}>or</span>
 <label className={styles.checkboxItem}>
 <input type="checkbox" defaultChecked />
 </label>
 <input type="date" className={styles.input} style={{ width: '140px' }}  max="2099-12-31" />
 </div>
 </div>
 <div className={styles.fieldGroup} style={{ flex: 3 }}>
 <label className={styles.label}>Sp. Notes</label>
 <input type="text" className={styles.input} />
 </div>
 </div>
 </div>

 </div>

 {/* Bottom Action Bar */}
 <div className={styles.actionBar}>
 <div className={styles.navControls}>
 <button className={styles.navBtn}><ChevronsLeft size={20} /></button>
 <button className={styles.navBtn}><ChevronLeft size={20} /></button>
 <button className={styles.navBtn}><ChevronRight size={20} /></button>
 <button className={styles.navBtn}><ChevronsRight size={20} /></button>
 </div>

 <div className={styles.rightActions}>
 <div className={styles.stackedChecks}>
 <label className={styles.checkboxItem}>
 <input type="checkbox" /> L
 </label>
 <label className={styles.checkboxItem}>
 <input type="checkbox" /> P
 </label>
 </div>

 <button className={styles.secondaryBtn}>
 <Printer size={18} /> Print
 </button>
 <button className={styles.secondaryBtn}>
 <Folder size={18} /> Folder
 </button>
 
 <select className={styles.input} style={{ width: '150px' }}>
 <option></option>
 </select>

 <button className={styles.primaryBtn}>
 <Save size={18} /> Add
 </button>
 <button className={styles.secondaryBtn}>
 <Edit2 size={18} /> Update
 </button>
 <button className={styles.secondaryBtn} style={{ marginLeft: '16px' }}>
 <LogOut size={18} /> Exit
 </button>
 </div>
 </div>

 </div>
 );
};

export default PatientHistory;
