import React, { useState } from 'react';
import { 
 ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
 Search, Save, LogOut, Edit2, Trash2, Printer, Square, CheckSquare
} from 'lucide-react';
import styles from './ReportTemplate.module.css';

const ReportTemplate: React.FC = () => {
 const [shouldPrint, setShouldPrint] = useState(true); // Checked in screenshot

 return (
 <div className={styles.pageContainer}>
 
 {/* Header */}
 <div className={styles.header}>
 <span className={styles.badge}>0 of 0</span>
 <h1 className={styles.pageTitle}>Report Template</h1>
 </div>

 {/* Form Container */}
 <div className={styles.formContainer}>
 
 <div className={styles.mainSection}>
 
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Group Name :</label>
 <select className={styles.select}>
 <option>Sonography</option>
 <option>X-Ray</option>
 <option>Pathology</option>
 </select>
 </div>

 <div className={styles.fieldGroup}>
 <label className={styles.label}>TemplateName :</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={styles.fieldGroup}>
 <label className={styles.label}>ReportHeader :</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={styles.fieldGroup}>
 <label className={styles.label}>Details :</label>
 <textarea 
 className={styles.textarea} 
 
  maxLength={500} />
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
 <Printer size={16} /> Print
 </button>
 <div className={styles.checkboxItem} onClick={() => setShouldPrint(!shouldPrint)} style={{ marginLeft: '8px', marginRight: '16px' }}>
 {shouldPrint ? <CheckSquare size={18} color="var(--primary)" /> : <Square size={18} color="var(--text-muted)" />}
 </div>
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

export default ReportTemplate;
