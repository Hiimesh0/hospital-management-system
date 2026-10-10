import React, { useState } from 'react';
import { 
 ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
 Search, Save, LogOut, CheckSquare, Square, Edit2
} from 'lucide-react';
import styles from './OPDPatientCategory.module.css';

const OPDPatientCategory: React.FC = () => {
 const [print, setPrint] = useState(false);

 return (
 <div className={styles.pageContainer}>
 
 {/* Header */}
 <div className={styles.header}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
 <span className={styles.recordCounter}>0 of 0</span>
 <h1 className={styles.pageTitle}>OPD Patient Category</h1>
 </div>
 </div>

 {/* Form Container */}
 <div className={styles.formContainer}>
 
 {/* Top Info Section */}
 <div className={styles.topSection}>
 <div className={styles.row}>
 <label className={styles.label}>Category Short Name :</label>
 <input type="text" className={`${styles.input} ${styles.readOnly}`} readOnly />
 </div>

 <div className={styles.row}>
 <label className={styles.label}>Description :</label>
 <input type="text" className={styles.input} />
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
 <div className={styles.checkboxItem} onClick={() => setPrint(!print)}>
 {print ? <CheckSquare size={18} color="var(--primary)" /> : <Square size={18} />}
 <span>Print</span>
 </div>
 <button className={styles.secondaryBtn} style={{ marginLeft: '12px' }}>
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
 <button className={styles.secondaryBtn} style={{ marginLeft: '16px' }}>
 <LogOut size={18} /> Exit
 </button>
 </div>
 </div>

 </div>
 );
};

export default OPDPatientCategory;
