import React, { useState } from 'react';
import { ArrowDown, Save, LogOut } from 'lucide-react';
import styles from './InpatientReceipt.module.css';

const InpatientReceipt: React.FC = () => {
 const [activeTab, setActiveTab] = useState('Room Charges');

 const tabs = [
 'Room Charges',
 'Operation Charges',
 'Additional Charges',
 'Dr. Visit/Procedure',
 'Deposit Entry',
 'Diagnostics',
 'Discount Authority'
 ];

 return (
 <div className={styles.pageContainer}>
 
 {/* Top Header Card */}
 <div className={styles.headerCard}>
 <div className={styles.topHeader}>
 <div className={styles.headerActions}>
 <span className={styles.recordCount}>1 of 1</span>
 <span className={styles.doctorName}>DR. SOHAM PATEL</span>
 </div>
 
 <h1 className={styles.pageTitle}>INPATIENT RECEIPT</h1>
 
 <div className={styles.headerActions}>
 <select className={styles.select}>
 <option value="GEN">GEN</option>
 </select>
 <input type="text" className={styles.input} style={{ width: '120px' }} />
 </div>
 </div>

 <div className={styles.infoGrid}>
 <div className={`${styles.fieldGroup} ${styles.col3}`}>
 <label className={styles.label}>Bill No:</label>
 <input type="text" className={`${styles.input} ${styles.inputReadOnly}`} readOnly />
 </div>
 <div className={`${styles.fieldGroup} ${styles.col3}`}>
 <label className={styles.label}>Bill Date:</label>
 <input type="date" className={`${styles.input} ${styles.inputReadOnly}`} readOnly  max="2099-12-31" />
 </div>
 <div className={`${styles.fieldGroup} ${styles.col3}`}>
 <label className={styles.label}>Rec No:</label>
 <input type="text" className={`${styles.input} ${styles.inputReadOnly}`} readOnly />
 </div>
 <div className={`${styles.fieldGroup} ${styles.col3}`}>
 <label className={styles.label}>Rec Date:</label>
 <input type="date" className={`${styles.input} ${styles.inputReadOnly}`} readOnly  max="2099-12-31" />
 </div>
 <div className={`${styles.fieldGroup} ${styles.col12}`}>
 <label className={styles.label}>Patient:</label>
 <div className={styles.patientNameBadge}>Vitthalbhai Mithabhai Kumbhani</div>
 </div>
 </div>
 </div>

 {/* Tabs */}
 <div className={styles.tabsContainer}>
 {tabs.map(tab => (
 <button 
 key={tab} 
 className={styles.tabBtn}
 style={activeTab === tab ? { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', color: '#1D4ED8' } : {}}
 onClick={() => setActiveTab(tab)}
>
 {tab}
 </button>
 ))}
 </div>

 <div className={styles.mainLayout}>
 
 {/* Left Area: Details */}
 <div>
 {/* Sub Header (DOA/DOD) */}
 <div className={styles.infoGrid} style={{ marginBottom: '24px' }}>
 <div className={`${styles.fieldGroup} ${styles.col4}`}>
 <label className={styles.label}>DOA:</label>
 <input type="date" className={styles.input}  max="2099-12-31" />
 </div>
 <div className={`${styles.fieldGroup} ${styles.col4}`}>
 <label className={styles.label}>DOD:</label>
 <input type="date" className={styles.input}  max="2099-12-31" />
 </div>
 <div className={`${styles.fieldGroup} ${styles.col2}`}>
 <label className={styles.label}>Total Days:</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={`${styles.fieldGroup} ${styles.col2}`}>
 <input type="text" className={styles.input} />
 </div>
 </div>

 <div className={styles.tablesGrid}>
 
 {/* Column 1 */}
 <div>
 <div className={styles.baseChargesGrid} style={{ gridTemplateColumns: 'auto 1fr', padding: '0', border: 'none', gap: '12px 16px', backgroundColor: 'transparent' }}>
 <div style={{gridColumn: '2', textAlign: 'center', fontSize: '12px', color: '#667085', fontWeight: 500}}>Rate</div>
 
 <label className={styles.label} style={{ textAlign: 'right', alignSelf: 'center' }}>Admission :</label>
 <input type="text" className={styles.input} style={{ textAlign: 'right' }} />
 
 <label className={styles.label} style={{ textAlign: 'right', alignSelf: 'center' }}>Registration :</label>
 <input type="text" className={styles.input} style={{ textAlign: 'right' }} />
 
 <label className={styles.label} style={{ textAlign: 'right', alignSelf: 'center' }}>Room :</label>
 <input type="text" className={styles.input} style={{ textAlign: 'right' }} />
 
 <label className={styles.label} style={{ textAlign: 'right', alignSelf: 'center' }}>GST :</label>
 <input type="text" className={styles.input} style={{ textAlign: 'right' }} />
 </div>

 <div className={styles.tableSection} style={{ marginTop: '24px' }}>
 <div className={styles.tableHeader}>Dr Visit / Proc</div>
 <table className={styles.dataTable}>
 <thead>
 <tr>
 <th>Head</th>
 <th style={{ textAlign: 'right' }}>Amount</th>
 </tr>
 </thead>
 <tbody>
 <tr>
 <td>1 <span style={{color: '#98A2B3'}}>▶</span> Visiting Charge</td>
 <td style={{ textAlign: 'right' }}>3200</td>
 </tr>
 </tbody>
 </table>
 <div className={styles.tableFooter}>
 <input type="text" className={`${styles.input} ${styles.totalInput}`} readOnly />
 </div>
 </div>

 <div className={styles.tableSection} style={{ marginTop: '24px' }}>
 <div className={styles.tableHeader}>Operation</div>
 <table className={styles.dataTable}>
 <thead>
 <tr>
 <th>Head</th>
 <th style={{ textAlign: 'right' }}>Amount</th>
 </tr>
 </thead>
 <tbody>
 <tr>
 <td>1 <span style={{color: '#98A2B3'}}>▶</span> Operation Charges</td>
 <td style={{ textAlign: 'right' }}>19290</td>
 </tr>
 </tbody>
 </table>
 <div className={styles.tableFooter}>
 <input type="text" className={`${styles.input} ${styles.totalInput}`} readOnly />
 </div>
 </div>
 </div>

 {/* Column 2 */}
 <div>
 <div className={styles.tableSection}>
 <div className={styles.tableHeader}>Additional</div>
 <table className={styles.dataTable}>
 <thead>
 <tr>
 <th>Head</th>
 <th style={{ textAlign: 'right' }}>Amount</th>
 </tr>
 </thead>
 <tbody>
 <tr>
 <td>1 <span style={{color: '#98A2B3'}}>▶</span> Additional Charge</td>
 <td style={{ textAlign: 'right' }}>7270</td>
 </tr>
 </tbody>
 </table>
 <div className={styles.tableFooter}>
 <input type="text" className={`${styles.input} ${styles.totalInput}`} readOnly />
 </div>
 </div>

 <div className={styles.tableSection} style={{ marginTop: '24px' }}>
 <div className={styles.tableHeader}>Diagnostics</div>
 <table className={styles.dataTable}>
 <thead>
 <tr>
 <th>Head</th>
 <th style={{ textAlign: 'right' }}>Amount</th>
 </tr>
 </thead>
 <tbody>
 <tr>
 <td>1 <span style={{color: '#98A2B3'}}>▶</span> LABORATORY</td>
 <td style={{ textAlign: 'right' }}>11170</td>
 </tr>
 <tr>
 <td>2 <span style={{color: '#98A2B3'}}>▶</span> X-RAY</td>
 <td style={{ textAlign: 'right' }}>450</td>
 </tr>
 </tbody>
 </table>
 <div className={styles.tableFooter}>
 <input type="text" className={`${styles.input} ${styles.totalInput}`} readOnly />
 </div>
 </div>

 {/* Payment Section underneath Column 2 */}
 <div className={styles.paymentSection}>
 <div className={styles.paymentEntryRow}>
 <select className={styles.select} style={{ flex: 1 }}>
 <option value="Cash">Cash</option>
 </select>
 <input type="text" className={styles.input} style={{ width: '100px', textAlign: 'right' }} />
 <button className={styles.secondaryBtn} style={{ padding: '0 12px' }}><ArrowDown size={16} /></button>
 </div>
 
 <div className={styles.tableSection}>
 <table className={styles.dataTable}>
 <thead>
 <tr>
 <th>Type</th>
 <th style={{ textAlign: 'right' }}>Amount</th>
 <th>Remark</th>
 <th>Taken By</th>
 </tr>
 </thead>
 <tbody>
 <tr>
 <td colSpan={4} style={{ textAlign: 'center', color: '#98A2B3', padding: '24px' }}>No payments recorded</td>
 </tr>
 </tbody>
 </table>
 </div>

 <div className={styles.paymentTotals}>
 <div className={styles.paymentTotalItem}>
 <span>Total:</span>
 <span className={styles.paymentTotalValue}>0</span>
 </div>
 <div className={styles.paymentTotalItem}>
 <span>Pending To Receive:</span>
 <span className={styles.paymentTotalValue}>0</span>
 </div>
 </div>
 </div>

 </div>

 </div>
 </div>

 {/* Right Area: Summary */}
 <div>
 <div className={styles.summaryPanel}>
 <div className={styles.summaryHeader}>Financial Summary</div>
 <div className={styles.summaryContent}>
 
 <div className={styles.summaryRow}>
 <span className={styles.summaryLabel}>Total (=)</span>
 <input type="text" className={`${styles.input} ${styles.summaryValue} ${styles.summaryValueHigh}`} readOnly />
 </div>
 
 <div className={styles.summaryRow}>
 <span className={styles.summaryLabel}>Maintenance Charges (+)</span>
 <div className={styles.multiInputRow}>
 <div className={styles.fieldGroup} style={{ gap: '4px' }}>
 <input type="text" className={`${styles.input} ${styles.percentInput}`} />
 <span style={{ fontSize: '13px', color: '#667085' }}>%</span>
 </div>
 <input type="text" className={`${styles.input} ${styles.summaryValue}`} />
 </div>
 </div>

 <div className={styles.summaryRow}>
 <span className={styles.summaryLabel}>Bill Amount (=)</span>
 <input type="text" className={`${styles.input} ${styles.summaryValue}`} readOnly />
 </div>

 <div className={styles.divider}></div>

 <div className={styles.summaryRow}>
 <span className={styles.summaryLabel}>Flat Discount (-)</span>
 <input type="text" className={`${styles.input} ${styles.summaryValue}`} />
 </div>

 <div className={styles.summaryRow}>
 <span className={styles.summaryLabel}>Authority Discount (-)</span>
 <input type="text" className={`${styles.input} ${styles.summaryValue}`} />
 </div>

 <div className={styles.summaryRow}>
 <span className={styles.summaryLabel} style={{ fontWeight: 600, color: '#172033' }}>Net (=)</span>
 <input type="text" className={`${styles.input} ${styles.summaryValue}`} style={{ fontWeight: 600 }} readOnly />
 </div>

 <div className={styles.divider}></div>

 <div className={styles.summaryRow}>
 <span className={styles.summaryLabel}>Deposit (-)</span>
 <input type="text" className={`${styles.input} ${styles.summaryValue}`} />
 </div>

 <div className={styles.summaryRow} style={{ marginTop: '8px' }}>
 <span className={styles.summaryLabel} style={{ fontWeight: 600, color: '#172033' }}>Final Pay/Ret (=)</span>
 <input type="text" className={`${styles.input} ${styles.summaryValue} ${styles.summaryValueSuccess}`} readOnly />
 </div>

 </div>
 </div>
 </div>

 </div>

 {/* Action Bar */}
 <div className={styles.actionBar}>
 <div className={styles.actionGroup}>
 <button className={styles.secondaryBtn}>Inpatient Bill</button>
 <label className={styles.actionItem}>
 <input type="checkbox" className={styles.checkbox} />
 <span className={styles.label}>L</span>
 </label>
 <button className={styles.secondaryBtn}>Receipt</button>
 <label className={styles.actionItem}>
 <input type="checkbox" className={styles.checkbox} />
 <span className={styles.label}>P</span>
 </label>
 <button className={styles.secondaryBtn}>Bill Cum Receipt</button>
 <label className={styles.actionItem}>
 <input type="checkbox" className={styles.checkbox} />
 <span className={styles.label}>L</span>
 </label>
 </div>

 <div className={styles.actionGroup}>
 <button className={styles.primaryBtn} disabled style={{ opacity: 0.5 }}>
 <Save size={18} /> Update
 </button>
 <button className={styles.secondaryBtn}>
 <LogOut size={18} /> Exit
 </button>
 </div>
 </div>

 </div>
 );
};

export default InpatientReceipt;
