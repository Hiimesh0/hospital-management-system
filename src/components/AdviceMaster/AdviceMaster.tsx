import React from 'react';
import { 
 ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
 Search, Save, Edit2, Trash2, LogOut, Play
} from 'lucide-react';
import styles from './AdviceMaster.module.css';

const AdviceMaster: React.FC = () => {
 return (
 <div className={styles.pageContainer}>
 
 {/* Header */}
 <div className={styles.header}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
 <span className={styles.recordCounter}>1 Of 1</span>
 <h1 className={styles.pageTitle}>Advice Master</h1>
 </div>
 </div>

 {/* Form Container */}
 <div className={styles.formSection}>
 <div className={styles.formRow}>
 <label className={styles.label}>Sr No. :</label>
 <input type="text" className={`${styles.input} ${styles.shortInput}`} />
 </div>
 <div className={styles.formRow}>
 <label className={styles.label}>English :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.formRow}>
 <label className={styles.label}>Gujarati :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.formRow}>
 <label className={styles.label}>Hindi :</label>
 <input type="text" className={styles.input} />
 </div>
 </div>

 {/* Table Section */}
 <div className={styles.tableSection}>
 <div className={styles.tableHeader}>
 <button className={styles.smallBtn}>Show</button>
 </div>
 
 <div className={styles.tableWrapper}>
 <table className={styles.dataTable}>
 <thead>
 <tr>
 <th style={{ width: '40px' }}></th>
 <th>No.</th>
 <th>English.</th>
 <th>Gujarati</th>
 <th>Hindi</th>
 </tr>
 </thead>
 <tbody>
 <tr>
 <td style={{ textAlign: 'center' }}><Play size={10} fill="#172033" /></td>
 <td>1</td>
 <td>One Tablet Daily</td>
 <td>LL</td>
 <td>पपप</td>
 </tr>
 </tbody>
 </table>
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

export default AdviceMaster;
