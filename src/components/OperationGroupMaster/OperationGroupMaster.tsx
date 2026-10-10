import React from 'react';
import { 
 ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
 Search, FileText, Save, Edit2, Trash2, LogOut, ArrowDown, Play
} from 'lucide-react';
import styles from './OperationGroupMaster.module.css';

const OperationGroupMaster: React.FC = () => {
 return (
 <div className={styles.pageContainer}>
 
 {/* Header */}
 <div className={styles.header}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
 <span className={styles.recordCounter}>0 of 0</span>
 <h1 className={styles.pageTitle}>Operation Group Master</h1>
 </div>
 </div>

 {/* Form Container */}
 <div className={styles.formContainer}>
 
 {/* Top Info Section */}
 <div className={styles.topSection}>
 <div className={styles.row}>
 <div className={styles.fieldGroup}>
 <label className={styles.label} style={{ width: '120px' }}>SR NO. :</label>
 <input type="text" className={styles.input} style={{ width: '80px' }} />
 </div>
 
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Surgery Type:</label>
 <select className={styles.input} style={{ width: '150px' }}>
 <option>Other</option>
 <option>Major</option>
 <option>Minor</option>
 </select>
 </div>

 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label}>Company Name :</label>
 <input type="text" className={styles.input} style={{ width: '100%' }} />
 </div>
 </div>

 <div className={styles.row}>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label} style={{ width: '120px' }}>Operation Name :</label>
 <input type="text" className={styles.input} style={{ width: '100%' }} />
 </div>
 </div>

 <div className={styles.row}>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label} style={{ width: '120px' }}>Name :</label>
 <input type="text" className={styles.input} style={{ width: '100%' }} />
 </div>
 </div>

 <div className={styles.row}>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label} style={{ width: '120px' }}>Note :</label>
 <input type="text" className={styles.input} style={{ width: '100%' }} />
 </div>

 <div className={styles.fieldGroup}>
 <label className={styles.label}>Priority :</label>
 <input type="text" className={styles.input} style={{ width: '60px' }} />
 </div>

 <div className={styles.fieldGroup}>
 <label className={styles.label}>All Dr % :</label>
 <input type="text" className={styles.input} style={{ width: '60px' }} />
 </div>

 <div className={styles.statusGroup}>
 <label className={styles.label} style={{ marginRight: '8px' }}>Status :</label>
 <label className={styles.radioLabel}>
 <input type="radio" name="status" defaultChecked /> Active
 </label>
 <label className={styles.radioLabel} style={{ marginLeft: '12px', color: 'var(--text-muted)' }}>
 <input type="radio" name="status" disabled /> Inactive
 </label>
 </div>
 </div>
 </div>

 {/* Charges Section */}
 <div className={styles.chargesSection}>
 <div className={styles.chargesInputGrid}>
 <div className={styles.chargeField}>
 <label className={styles.label}>Room Type</label>
 <select className={styles.input}>
 <option></option>
 </select>
 </div>
 <div className={styles.chargeField}>
 <label className={styles.label}>Doctor Charges</label>
 <input type="number" min="0" step="0.01" className={styles.input} />
 </div>
 <div className={styles.chargeField}>
 <label className={styles.label}>Assit. Dr. charges</label>
 <input type="number" min="0" step="0.01" className={styles.input} />
 </div>
 <div className={styles.chargeField}>
 <label className={styles.label}>OT Charges</label>
 <input type="number" min="0" step="0.01" className={styles.input} />
 </div>
 <div className={styles.chargeField}>
 <label className={styles.label}>Anesthetist Charges</label>
 <input type="number" min="0" step="0.01" className={styles.input} />
 </div>
 <button className={styles.addChargeBtn}>
 <ArrowDown size={20} />
 </button>
 </div>

 <div className={styles.tableWrapper}>
 <table className={styles.dataTable}>
 <thead>
 <tr>
 <th></th>
 <th>Room Type</th>
 <th>Doctor Charges</th>
 <th>OT Charges</th>
 <th>Anesthetist Chrges</th>
 <th>Assistant ...</th>
 </tr>
 </thead>
 <tbody>
 {/* Empty state representing the screenshot */}
 </tbody>
 </table>
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

 <div className={styles.middleActions}>
 <button className={styles.secondaryBtn}>
 <FileText size={18} /> Report
 </button>
 <button className={styles.secondaryBtn}>
 <Search size={18} /> Search
 </button>
 </div>

 <div className={styles.rightActions}>
 <button className={styles.primaryBtn}>
 <Save size={18} /> Add
 </button>
 <button className={styles.secondaryBtn}>
 <Edit2 size={18} /> Update
 </button>
 <button className={styles.dangerBtn}>
 <Trash2 size={18} /> Delete
 </button>
 <button className={styles.secondaryBtn} style={{ marginLeft: '16px' }}>
 <LogOut size={18} /> Exit
 </button>
 </div>
 </div>

 </div>
 );
};

export default OperationGroupMaster;
