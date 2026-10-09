import React from 'react';
import { ArrowDown, Save, Printer, XCircle, FileText, History, ShieldAlert } from 'lucide-react';
import styles from './Billing.module.css';

const Billing: React.FC = () => {
 return (
 <div className={styles.pageContainer} style={{ paddingBottom: '100px' }}>
 
 {/* Header */}
 <div className={styles.headerCard}>
 <h1 className={styles.patientNameTitle}>--</h1>
 <div className={styles.hospitalSubtitle}>--</div>
 </div>

 {/* Entry Row */}
 <div className={styles.entryCard}>
 <div className={styles.entryRow}>
 <div className={styles.fieldGroup} style={{ flex: '3' }}>
 <label className={styles.label}>Details</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup} style={{ flex: '1' }}>
 <label className={styles.label}>Charges</label>
 <input type="number" min="0" step="0.01" className={styles.input} />
 </div>
 <div className={styles.fieldGroup} style={{ flex: '1' }}>
 <label className={styles.label}>Professional Fees To Dr.</label>
 <input type="text" className={styles.input} />
 </div>
 <button className={styles.iconBtn} style={{ marginBottom: '0' }} title="Add">
 <ArrowDown size={20} />
 </button>
 </div>
 </div>

 {/* Grids Area */}
 <div className={styles.gridsLayout}>
 
 {/* Left Table (Charges) */}
 <div className={styles.tableSection}>
 <table className={styles.dataTable}>
 <thead>
 <tr>
 <th style={{ width: '50%' }}>Details</th>
 <th style={{ width: '25%' }}>Professional Fees To Dr</th>
 <th style={{ width: '25%' }}>Charges</th>
 </tr>
 </thead>
 <tbody>
                {/* Empty State / No Data */}
              </tbody>
 </table>
 </div>

 {/* Right Table (Discount Authority) */}
 <div className={styles.tableSection}>
 <div className={styles.discountAuthTop}>
 <div className={styles.fieldGroup} style={{ flex: '2' }}>
 <label className={styles.label}>Discount Authority By</label>
 <input type="number" min="0" step="0.01" className={styles.input} />
 </div>
 <div className={styles.fieldGroup} style={{ flex: '1' }}>
 <label className={styles.label}>%</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup} style={{ flex: '1' }}>
 <label className={styles.label}>Amount</label>
 <input type="number" min="0" step="0.01" className={styles.input} />
 </div>
 </div>
 <table className={styles.dataTable}>
 <thead>
 <tr>
 <th style={{ width: '40px' }}></th>
 <th style={{ width: '50%' }}>Authorised Person</th>
 <th style={{ width: '25%' }}>Amount</th>
 <th style={{ width: '25%' }}>Ent.Date</th>
 </tr>
 </thead>
 <tbody>
                {/* Empty State / No Data */}
              </tbody>
 </table>
 </div>

 </div>

 {/* Bottom Forms Area */}
 <div className={styles.bottomFormsLayout}>
 
 {/* Column 1: Info */}
 <div className={styles.formColumn}>
 <div className={styles.checkboxGroup} style={{ marginLeft: '122px', marginBottom: '8px' }}>
 <input type="checkbox" className={styles.checkbox} disabled />
 <span className={styles.label} style={{ color: '#98A2B3' }}>Indoor Patient</span>
 </div>

 <div className={styles.formRow}>
 <label className={styles.formRowLabel}>Patient Name :</label>
 <input type="text" className={`${styles.input} ${styles.formRowInput}`} />
 </div>

 <div className={styles.formRow}>
 <label className={styles.formRowLabel}>Indoor No :</label>
 <input type="text" className={`${styles.input} ${styles.formRowInput}`} />
 </div>

 <div className={styles.formRow}>
 <label className={styles.formRowLabel}>Room Type :</label>
 <select className={`${styles.select} ${styles.formRowInput}`}>
 <option></option>
 </select>
 </div>
 </div>

 {/* Column 2: Financials */}
 <div className={styles.formColumn}>
 <div className={styles.formRow}>
 <label className={styles.formRowLabel} style={{ width: '100px' }}>Total Amt :</label>
 <input type="text" className={`${styles.input} ${styles.formRowInput} ${styles.inputReadOnly}`} readOnly />
 </div>

 <div className={styles.formRow}>
 <label className={styles.formRowLabel} style={{ width: '100px' }}>Discount :</label>
 <input type="number" min="0" step="0.01" className={`${styles.input} ${styles.formRowInput}`} />
 </div>

 <div className={styles.formRow}>
 <label className={styles.formRowLabel} style={{ width: '100px', fontWeight: 600, color: '#172033' }}>Net Amt :</label>
 <input type="text" className={`${styles.input} ${styles.formRowInput} ${styles.inputReadOnly}`} readOnly />
 </div>

 <div className={styles.formRow}>
 <label className={styles.formRowLabel} style={{ width: '100px' }}>Received Amt :</label>
 <input type="text" className={`${styles.input} ${styles.formRowInput}`} />
 </div>

 <div className={styles.formRow}>
 <label className={styles.formRowLabel} style={{ width: '100px', fontWeight: 600, color: '#DC2626' }}>Balance Amt :</label>
 <input type="number" min="0" step="0.01" className={`${styles.input} ${styles.formRowInput} ${styles.inputReadOnly}`} readOnly />
 </div>
 </div>

 {/* Column 3: References */}
 <div className={styles.formColumn}>
 <button className={styles.secondaryBtn} style={{ width: '100%', justifyContent: 'center', backgroundColor: '#FFFBEB', borderColor: '#FDE68A', color: '#D97706' }}>
 <ShieldAlert size={16} /> Delete Multiple Test By OTP Before Amount Received
 </button>

 <div className={styles.formRow}>
 <label className={styles.formRowLabel}>Indoor Ref :</label>
 <input type="text" className={`${styles.input} ${styles.formRowInput}`} />
 </div>

 <div className={styles.formRow}>
 <label className={styles.formRowLabel}>Reference Dr :</label>
 <input type="text" className={`${styles.input} ${styles.formRowInput}`} />
 <button className={styles.actionInlineBtn}>Change</button>
 </div>

 <div className={styles.formRow}>
 <label className={styles.formRowLabel}>Company Name :</label>
 <input type="text" className={`${styles.input} ${styles.formRowInput}`} />
 <button className={styles.actionInlineBtn}>Change</button>
 </div>
 </div>

 {/* Notes (Spans full width) */}
 <div className={styles.notesRow}>
 <label className={styles.notesLabel}>Notes :</label>
 <input type="text" className={`${styles.input}`} style={{ flex: 1 }} />
 </div>

 </div>

 {/* Action Bar */}
 <div className={styles.actionBar}>
 <div className={styles.actionGroup}>
 <button className={styles.secondaryBtn}><History size={16} /> Patient Past Info</button>
 <button className={styles.secondaryBtn} disabled><FileText size={16} /> Receipt Detail</button>
 </div>

 <div className={styles.actionGroup}>
 <label className={styles.actionItemGroup}>
 <input type="checkbox" className={styles.checkbox} />
 <button className={styles.primaryBtn}><Save size={18} /> Save</button>
 </label>
 
 <label className={styles.actionItemGroup}>
 <input type="checkbox" className={styles.checkbox} />
 <button className={styles.secondaryBtn}><Printer size={16} /> Print</button>
 </label>
 
 <button className={styles.secondaryBtn}><XCircle size={16} /> Cancel</button>
 </div>
 </div>

 </div>
 );
};

export default Billing;
