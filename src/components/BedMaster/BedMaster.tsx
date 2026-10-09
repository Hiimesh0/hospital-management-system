import React from 'react';
import { 
 ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
 Search, FileText, Save, LogOut, Play
} from 'lucide-react';
import styles from './BedMaster.module.css';

const BedMaster: React.FC = () => {
 return (
 <div className={styles.pageContainer}>
 
 {/* Header */}
 <div className={styles.header}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
 <span className={styles.recordCounter}>0 of 0</span>
 <h1 className={styles.pageTitle}>Bed Master</h1>
 </div>
 </div>

 {/* Form Container */}
 <div className={styles.formContainer}>
 
 {/* Top Info Section */}
 <div className={styles.topSection}>
 <div className={styles.row}>
 <div className={styles.fieldGroup}>
 <label className={styles.label} style={{ width: '70px', textAlign: 'right' }}>Location :</label>
 <input type="text" className={`${styles.input} ${styles.highlightInput}`} style={{ width: '80px' }} />
 </div>
 
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Sr No. :</label>
 <input type="text" className={styles.input} style={{ width: '60px' }} />
 </div>

 <div className={styles.fieldGroup}>
 <label className={styles.label}>Room Type :</label>
 <input type="text" className={styles.input} style={{ width: '60px' }} />
 </div>

 <div className={styles.fieldGroup}>
 <label className={styles.label}>Bed No. :</label>
 <input type="text" className={styles.input} style={{ width: '100px' }} />
 </div>

 <div className={styles.fieldGroup}>
 <label className={styles.label}>Bed Code :</label>
 <input type="text" className={styles.input} style={{ width: '160px' }} />
 </div>

 <div className={styles.checkboxItem} style={{ marginLeft: 'auto' }}>
 <input type="checkbox" disabled /> DefaultCharge
 </div>
 </div>

 <div className={styles.row}>
 <div className={styles.fieldGroup}>
 <label className={styles.label} style={{ width: '70px', textAlign: 'right' }}>Floor :</label>
 <select className={styles.input} style={{ width: '150px' }}>
 <option></option>
 </select>
 </div>

 <div className={styles.fieldGroup} style={{ marginLeft: '40px' }}>
 <label className={styles.label}>Priority in RoomType :</label>
 <input type="text" className={styles.input} style={{ width: '120px' }} />
 </div>

 <div className={styles.fieldGroup} style={{ marginLeft: 'auto' }}>
 <label className={styles.label}>Status</label>
 <select className={styles.input} style={{ width: '120px' }}>
 <option>Active</option>
 <option>Inactive</option>
 </select>
 </div>
 </div>
 </div>

 {/* Charges Section */}
 <div className={styles.chargesSection}>
 <div className={styles.chargesInputGrid}>
 <div className={styles.chargeField}>
 <label className={styles.label}>Registration Charges</label>
 <input type="number" min="0" step="0.01" className={styles.input} />
 </div>
 <div className={styles.chargeField}>
 <label className={styles.label}>Room Charges</label>
 <input type="number" min="0" step="0.01" className={styles.input} />
 </div>
 <div className={styles.chargeField}>
 <label className={styles.label}>GST Amount</label>
 <input type="number" min="0" step="0.01" className={styles.input} />
 </div>
 <div className={styles.chargeField}>
 <label className={styles.label}>Company</label>
 <input type="text" className={styles.input} />
 </div>
 </div>

 <div className={styles.tableWrapper}>
 <table className={styles.dataTable}>
 <thead>
 <tr>
 <th></th>
 <th>RegistrationCharges</th>
 <th>BedCharges</th>
 <th>GST Amount</th>
 <th style={{ textAlign: 'left' }}>Company</th>
 </tr>
 </thead>
 <tbody>
                {/* Empty State / No Data */}
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
 <label className={styles.checkboxLabel}>
 <input type="checkbox" style={{ width: '16px', height: '16px' }} /> All
 </label>
 <button className={styles.secondaryBtn}>
 <FileText size={18} /> Report
 </button>
 <button className={styles.secondaryBtn}>
 <Search size={18} /> Particular search
 </button>
 </div>

 <div className={styles.rightActions}>
 <button className={styles.primaryBtn}>
 <Save size={18} /> Add
 </button>
 <button className={styles.secondaryBtn} style={{ marginLeft: '16px' }}>
 <LogOut size={18} /> Exit
 </button>
 </div>
 </div>

 </div>
 );
};

export default BedMaster;
