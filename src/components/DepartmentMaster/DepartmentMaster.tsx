import React, { useState } from 'react';
import { 
 ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
 Search, Save, LogOut, Edit2, Trash2
} from 'lucide-react';
import styles from './DepartmentMaster.module.css';

const DepartmentMaster: React.FC = () => {
 const [status, setStatus] = useState('active');

 return (
 <div className={styles.pageContainer}>
 
 {/* Header */}
 <div className={styles.header}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
 <span className={styles.recordCounter}>42 of 42</span>
 <h1 className={styles.pageTitle}>Department Master</h1>
 </div>
 </div>

 {/* Form Container */}
 <div className={styles.formContainer}>
 
 {/* Top Info Section */}
 <div className={styles.topSection}>
 <div className={styles.row}>
 <label className={styles.label}>Department Code :</label>
 <input type="text" className={`${styles.input} ${styles.inputSmall}`} />
 <div className={styles.radioGroup}>
 <label className={styles.radioLabel}>
 <input 
 type="radio" 
 name="status" 
 checked={status === 'active'} 
 onChange={() => setStatus('active')} 
 /> 
 Active
 </label>
 <label className={styles.radioLabel}>
 <input 
 type="radio" 
 name="status" 
 checked={status === 'inactive'} 
 onChange={() => setStatus('inactive')} 
 /> 
 Inactive
 </label>
 </div>
 </div>

 <div className={styles.row}>
 <label className={styles.label}>Department Name :</label>
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
 <button className={styles.secondaryBtn} style={{ width: '250px', justifyContent: 'center' }}>
 <Search size={18} /> Particular search
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

export default DepartmentMaster;
