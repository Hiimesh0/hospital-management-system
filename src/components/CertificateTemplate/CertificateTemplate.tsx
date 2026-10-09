import React, { useState } from 'react';
import { 
 ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
 Save, LogOut, Edit2, Trash2, Printer, Square, CheckSquare, FileText
} from 'lucide-react';
import styles from './CertificateTemplate.module.css';

const CertificateTemplate: React.FC = () => {
 const [isCheckedH, setIsCheckedH] = useState(false);
 const [blankCheck, setBlankCheck] = useState(true);

 return (
 <div className={styles.pageContainer}>
 
 {/* Form Container */}
 <div className={styles.formContainer}>
 
 <div className={styles.mainSection}>
 
 {/* Patient Context Bar */}
 <div className={styles.patientContextBar}>
 <div className={styles.fieldGroup}>
 <input type="text" className={`${styles.input} ${styles.inlineInput}`} />
 </div>
 <div className={styles.fieldGroupFlex}>
 <label className={styles.label}>Name :</label>
 <input type="text" className={`${styles.input} ${styles.inputYellow}`} style={{ flex: 1 }} />
 </div>
 
 <div className={styles.pageTitle}>Certificate Template</div>

 <div className={styles.fieldGroup}>
 <label className={styles.label}>Age :</label>
 <input type="number" min="0" max="150" className={`${styles.input} ${styles.inlineInput}`} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Sex :</label>
 <input type="text" className={`${styles.input} ${styles.inlineInput}`} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Date :</label>
 <input type="date" className={styles.input} />
 </div>
 </div>

 {/* Editor Area */}
 <div className={styles.editorArea}>
 <div className={styles.editorRow}>
 <label className={styles.editorLabel}>Report Header :</label>
 <input type="text" className={styles.input} style={{ flex: 1 }} />
 </div>
 <div className={styles.editorRow} style={{ flex: 1, display: 'flex' }}>
 <label className={styles.editorLabel}>Details :</label>
 <textarea className={styles.textarea}></textarea>
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
 I. T.
 </button>
 <button className={styles.secondaryBtn}>
 N. T.
 </button>
 <button className={styles.secondaryBtn}>
 Single
 </button>
 <button className={styles.secondaryBtn}>
 <Printer size={16} /> Print
 </button>
 
 <div className={styles.checkboxItem} onClick={() => setIsCheckedH(!isCheckedH)}>
 {isCheckedH ? <CheckSquare size={18} color="#2563EB" /> : <Square size={18} color="#94A3B8" />}
 H
 </div>
 <div className={styles.checkboxItem} onClick={() => setBlankCheck(!blankCheck)} style={{ marginLeft: '12px' }}>
 {blankCheck ? <CheckSquare size={18} color="#2563EB" /> : <Square size={18} color="#94A3B8" />}
 </div>
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

export default CertificateTemplate;
