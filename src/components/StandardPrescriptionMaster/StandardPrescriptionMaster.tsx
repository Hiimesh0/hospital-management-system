import React from 'react';
import { 
 ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
 Search, ArrowDown, Save, Edit2, Trash2, LogOut
} from 'lucide-react';
import styles from './StandardPrescriptionMaster.module.css';

const StandardPrescriptionMaster: React.FC = () => {
 return (
 <div className={styles.pageContainer}>
 
 {/* Header */}
 <div className={styles.header}>
 <h1 className={styles.pageTitle}>Standard Prescription Master</h1>
 </div>

 <div className={styles.formContainer}>
 
 {/* Top Info */}
 <div className={styles.topSection}>
 <div className={styles.formRow}>
 <label className={styles.label}>Short Name :</label>
 <input type="text" className={`${styles.input} ${styles.highlightInput}`} />
 <span className={styles.hintText}>(15)</span>
 </div>
 <div className={styles.formRow}>
 <label className={styles.label}>Description :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fullWidthRow}>
 <label className={styles.label}>Diagnosis :</label>
 <input type="text" className={styles.input} />
 
 <label className={styles.label} style={{ width: '40px' }}>For :</label>
 <select className={styles.input} style={{ flex: 'none', width: '150px' }}>
 <option></option>
 </select>
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
 <input type="text" className={styles.input} style={{ width: '80px', flex: 'none' }} />
 <input type="text" className={styles.input} style={{ width: '80px', flex: 'none' }} />
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
 <th>Frequency</th>
 <th>Remarks1</th>
 <th>Remarks2</th>
 <th>T. Days</th>
 <th>T. Qty</th>
 <th>Notes</th>
 </tr>
 </thead>
 <tbody>
 {/* Empty State */}
 </tbody>
 </table>
 </div>
 
 <div className={styles.rxFooter}>
 <button className={styles.smallBtn}>Clear</button>
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
 <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
 <button className={styles.navBtn}>
 <Search size={20} />
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

export default StandardPrescriptionMaster;
