import React from 'react';
import { ArrowDown, Printer, Save, X, Eye, Eraser } from 'lucide-react';
import styles from './InvestigationOrdered.module.css';

const InvestigationOrdered: React.FC = () => {
 return (
 <div className={styles.pageContainer}>
 
 <div className={styles.modalCard}>
 
 {/* Header */}
 <div className={styles.header}>
 <h1 className={styles.pageTitle}>Investigation (To Be Ordered)</h1>
 </div>

 <div className={styles.content}>
 
 {/* Top Form */}
 <div className={styles.topForm}>
 
 <div className={styles.formRow}>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Id:</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Date:</label>
 <input type="date" className={styles.input} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Time:</label>
 <input type="time" className={styles.input} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>UHID:</label>
 <input type="text" className={styles.input} />
 </div>
 </div>

 <div className={styles.formRow2}>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Indoor No:</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Patient:</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Prepare By:</label>
 <div className={styles.textLabel}>Demo</div>
 </div>
 </div>

 </div>

 {/* Lower Section (Entry + Table & Actions) */}
 <div className={styles.lowerSection}>
 
 <div className={styles.mainArea}>
 
 <div className={styles.investigationEntry}>
 <label className={styles.label}>Investigation Name</label>
 <div className={styles.entryRow}>
 <input type="text" className={styles.input} />
 <button className={styles.addBtn} aria-label="Add Investigation">
 <ArrowDown size={20} />
 </button>
 </div>
 </div>

 <div className={styles.tableWrapper}>
 <table className={styles.dataTable}>
 <thead>
 <tr>
 <th>Investigation Name</th>
 <th>GroupName</th>
 </tr>
 </thead>
 <tbody>
 <tr>
 <td colSpan={2} className={styles.emptyState}>
 No investigations added yet.
 </td>
 </tr>
 </tbody>
 </table>
 </div>

 </div>

 <div className={styles.actionsSide}>
 
 <button className={styles.secondaryBtn}>
 <Eraser size={16} /> Clear
 </button>
 
 <button className={styles.primaryBtn}>
 <Save size={16} /> Save
 </button>
 
 <div style={{ margin: '12px 0' }}></div>
 
 <div className={styles.printWrapper}>
 <input type="checkbox" className={styles.printCheckbox} id="printCheck" />
 <button className={styles.secondaryBtn} style={{ flex: 1 }}>
 <Printer size={16} /> Print
 </button>
 </div>

 <button className={styles.secondaryBtn}>
 <Eye size={16} /> View
 </button>
 
 <div style={{ flex: 1 }}></div>

 <button className={styles.tertiaryBtn}>
 <X size={16} /> Exit
 </button>

 </div>

 </div>

 </div>

 </div>
 </div>
 );
};

export default InvestigationOrdered;
