import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, LogOut, Save, RefreshCw } from 'lucide-react';
import styles from './DrVisitProcedure.module.css';

const DrVisitProcedure: React.FC = () => {
 const [isFormVisible, setIsFormVisible] = useState(true);

 return (
 <div className={styles.pageContainer}>
 
 {/* Top Header */}
 <div className={styles.topHeader}>
 <h1 className={styles.pageTitle}>Dr. Visit & Procedure</h1>
 <button className={styles.closeBtn} title="Close">
 <X size={20} />
 </button>
 </div>

 {/* Context & Actions Bar */}
 <div className={styles.contextBar}>
 <div className={styles.patientContext}>
 <div className={`${styles.contextBlock} ${styles.contextBlockName}`}>--</div>
 <div className={styles.contextBlock}>
 0
 </div>
 <div className={styles.contextBlock}>
 --
 </div>
 </div>

 <div className={styles.topActionGroup}>
 <button className={styles.primaryBtn} onClick={() => setIsFormVisible(true)}>
 <Plus size={16} /> Add VISIT
 </button>
 <button className={styles.primaryBtn} onClick={() => setIsFormVisible(true)}>
 <Plus size={16} /> Add PROC
 </button>
 <button className={styles.secondaryBtn}>
 <Edit2 size={16} /> Update
 </button>
 <button className={styles.secondaryBtn} style={{ color: 'var(--danger-hover)', borderColor: 'var(--danger-soft)' }}>
 <Trash2 size={16} /> Delete
 </button>
 <button className={styles.secondaryBtn}>
 <LogOut size={16} /> Exit
 </button>
 </div>
 </div>

 {/* Inline Form Card (Replaces the modal) */}
 {isFormVisible && (
 <div className={styles.formCard}>
 <div className={styles.formCardHeader}>
 <span>New Visit / Procedure Entry</span>
 <button className={styles.closeBtn} style={{ width: '28px', height: '28px', border: 'none' }} onClick={() => setIsFormVisible(false)}>
 <X size={16} />
 </button>
 </div>
 
 <div className={styles.formGrid}>
 <div className={`${styles.fieldGroup} ${styles.col3}`}>
 <label className={styles.label}>Date</label>
 <input type="date" className={styles.input}  max="2099-12-31" />
 </div>
 <div className={`${styles.fieldGroup} ${styles.col5}`}>
 <label className={styles.label}>Head</label>
 <select className={styles.select}>
 <option value="Visiting Charge">Visiting Charge</option>
 </select>
 </div>
 
 <div className={`${styles.fieldGroup} ${styles.col12}`}>
 <label className={styles.label}>Dr.</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={`${styles.fieldGroup} ${styles.col3}`}>
 <label className={styles.label}>Room</label>
 <select className={styles.select}>
 <option value="IC">IC</option>
 </select>
 </div>
 <div className={`${styles.fieldGroup} ${styles.col5}`}>
 <label className={styles.label}>Bed No</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={`${styles.fieldGroup} ${styles.col12}`}>
 <label className={styles.label}>Head (Description)</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={`${styles.fieldGroup} ${styles.col9}`}>
 <label className={styles.label}>Name</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={`${styles.fieldGroup} ${styles.col3}`} style={{ justifyContent: 'flex-end' }}>
 <button className={styles.secondaryBtn} style={{ width: '100%', justifyContent: 'center' }}>
 <RefreshCw size={16} /> Refresh
 </button>
 </div>

 <div className={`${styles.fieldGroup} ${styles.col3}`}>
 <label className={styles.label}>Rate</label>
 <input type="number" min="0" step="0.01" className={styles.input} />
 </div>
 <div className={`${styles.fieldGroup} ${styles.col3}`}>
 <label className={styles.label}>Qty</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={`${styles.fieldGroup} ${styles.col3}`}>
 <label className={styles.label}>Amount</label>
 <input type="number" min="0" step="0.01" className={styles.input} />
 </div>

 <div className={`${styles.fieldGroup} ${styles.col12}`}>
 <label className={styles.label}>Remark</label>
 <input type="text" className={styles.input} />
 </div>
 </div>

 <div className={styles.formActions}>
 <button className={styles.secondaryBtn} onClick={() => setIsFormVisible(false)}>
 Cancel
 </button>
 <button className={styles.primaryBtn} style={{ backgroundColor: 'var(--warning)', color: 'var(--text-main)' }}>
 <Save size={16} /> Save Entry
 </button>
 </div>
 </div>
 )}

 {/* Table Area */}
 <div className={styles.tableCard}>
 <div className={styles.tableWrapper}>
 <table className={styles.dataTable}>
 <thead>
 <tr>
 <th style={{ width: '32px' }}></th>
 <th>Date</th>
 <th>Type</th>
 <th>Charges</th>
 <th>Dr</th>
 <th>Rate</th>
 <th>Qty</th>
 <th>Amount</th>
 <th>Remark</th>
 <th>Bedno</th>
 <th>Room</th>
 <th>EntBy</th>
 <th>Hname</th>
 <th>ChargeType</th>
 <th>Company</th>
 </tr>
 </thead>
 <tbody>
                {/* Empty State / No Data */}
              </tbody>
 </table>
 </div>
 </div>

 </div>
 );
};

export default DrVisitProcedure;
