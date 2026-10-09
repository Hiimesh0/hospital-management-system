import React, { useState } from 'react';
import { LogOut, ArrowDown, Building2, X, Save } from 'lucide-react';
import styles from './OperationCharges.module.css';

const OperationCharges: React.FC = () => {
 const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);

 return (
 <div className={styles.pageContainer}>
 
 {/* Header */}
 <div className={styles.header}>
 <h1 className={styles.pageTitle}>Operation Charges</h1>
 <div className={styles.companyBadge}>
 <Building2 size={16} className={styles.companyLabel} />
 <span className={styles.companyLabel}>Company:</span>
 <span className={styles.companyValue}>AYUSHMAN BHARAT</span>
 </div>
 </div>

 <div className={styles.content}>
 
 {/* Context Bar */}
 <div className={styles.contextBar}>
 <div style={{ display: 'flex', gap: '8px' }}>
 <div className={styles.tagBtn}>Operation Entry</div>
 <button className={styles.secondaryBtn} onClick={() => setIsPackageModalOpen(true)}>
 By Package
 </button>
 </div>
 
 <div className={styles.patientInfoBox}>
 <div className={`${styles.infoSegment} ${styles.name}`}>--</div>
 <div className={`${styles.infoSegment} ${styles.amount}`}>0 Rs.</div>
 <div className={`${styles.infoSegment} ${styles.record}`}>--</div>
 </div>
 
 <button className={styles.exitBtn}>
 <LogOut size={16} /> Exit
 </button>
 </div>

 {/* Data Entry Form */}
 <div className={styles.formSection}>
 
 {/* Row 1 */}
 <div className={styles.formRow}>
 <div className={`${styles.fieldGroup} ${styles.wDate}`}>
 <label className={styles.label}>Date</label>
 <input type="date" className={styles.input}  max="2099-12-31" />
 </div>
 
 <div className={`${styles.fieldGroup} ${styles.wOpType}`}>
 <label className={styles.label}>Operation Type (Display in 1st pg Bill Print)</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={`${styles.fieldGroup} ${styles.wChargeType}`}>
 <label className={styles.label}>Charge Type</label>
 <select className={styles.select}>
 <option value=""></option>
 <option value="Standard">Standard</option>
 <option value="Special">Special</option>
 </select>
 </div>

 <div className={`${styles.fieldGroup} ${styles.wDrName}`}>
 <label className={styles.label}>Dr. Name</label>
 <input type="text" className={styles.input} />
 </div>
 </div>

 {/* Row 2 */}
 <div className={styles.formRow}>
 <div className={`${styles.fieldGroup} ${styles.wOpGroup}`}>
 <label className={styles.label}>Operation Group Name</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={`${styles.fieldGroup} ${styles.wAmount}`}>
 <label className={styles.label}>Amount</label>
 <input type="number" className={styles.input} />
 </div>

 <div className={`${styles.fieldGroup} ${styles.wNotes}`}>
 <label className={styles.label}>Notes</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={`${styles.fieldGroup} ${styles.wAction}`}>
 <button className={styles.addBtn} aria-label="Add Charge">
 <ArrowDown size={20} />
 </button>
 </div>
 </div>

 </div>

 {/* Table List */}
 <div className={styles.tableWrapper}>
 <table className={styles.dataTable}>
 <thead>
 <tr>
 <th>Date</th>
 <th>OperationGroup</th>
 <th>ChargeType</th>
 <th>Dr</th>
 <th>GroupName</th>
 <th>Rate</th>
 <th>EntBy</th>
 <th>AMTTYPE</th>
 <th>Notes</th>
 <th>Company</th>
 </tr>
 </thead>
 <tbody>
                {/* Empty State / No Data */}
              </tbody>
 </table>
 </div>

 </div>

 {/* Package Modal */}
 {isPackageModalOpen && (
 <div className={styles.modalOverlay}>
 <div className={styles.modalContent} style={{ width: '900px' }}>
 <div className={styles.modalHeader}>
 <h2 className={styles.modalTitle}>Operation Entry By Package</h2>
 <button className={styles.closeBtn} onClick={() => setIsPackageModalOpen(false)}>
 <X size={20} />
 </button>
 </div>
 
 <div className={styles.modalBody}>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '16px', marginBottom: '16px' }}>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Date</label>
 <input type="date" className={styles.input}  max="2099-12-31" />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Room Type</label>
 <select className={styles.select}>
 <option value="MA">MA</option>
 </select>
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Operation Group Name</label>
 <input type="text" className={styles.input} />
 </div>
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '16px', alignItems: 'end', marginBottom: '24px' }}>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Doctor Name</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Anesthetist Name</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Operation Type</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Notes</label>
 <input type="text" className={styles.input} />
 </div>
 <button className={styles.primaryBtn} style={{ height: '38px' }}>OK</button>
 </div>

 <div className={styles.tableWrapper} style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '24px' }}>
 <table className={styles.dataTable}>
 <thead>
 <tr>
 <th>Charge Type</th>
 <th>Doctor Name</th>
 <th>Date</th>
 <th>Group Name</th>
 <th>Amount</th>
 <th>Operation Detail</th>
 <th>Notes</th>
 </tr>
 </thead>
 <tbody>
                {/* Empty State / No Data */}
              </tbody>
 </table>
 </div>
 
 <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
 <button className={styles.primaryBtn}>
 <Save size={16} /> SAVE
 </button>
 <button className={styles.secondaryBtn} onClick={() => setIsPackageModalOpen(false)}>
 <LogOut size={16} /> EXIT
 </button>
 </div>

 </div>
 </div>
 </div>
 )}

 </div>
 );
};

export default OperationCharges;
