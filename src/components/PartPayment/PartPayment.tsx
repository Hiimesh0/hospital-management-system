import React, { useState } from 'react';
import { ArrowDown, X, Printer, Save, FileText, ArrowLeft } from 'lucide-react';
import styles from './PartPayment.module.css';

const PartPayment: React.FC = () => {
 // We'll manage the modal state to show how it pops up
 const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(true);

 return (
 <div className={styles.pageContainer}>
 
 {/* Background Page Content */}
 <div className={styles.header}>
 <h1 className={styles.patientName}>--</h1>
 <span className={styles.hospitalName}>Bharat Cancer Hospital [OPD-BCH]</span>
 </div>

 <div className={styles.content}>
 
 {/* Service Entry Row */}
 <div className={styles.entryRow}>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Details</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Charges</label>
 <input type="number" min="0" step="0.01" className={styles.input} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Professional Fees To Dr.</label>
 <input type="text" className={styles.input} />
 </div>
 <button className={styles.iconBtn} aria-label="Add Service">
 <ArrowDown size={18} />
 </button>
 </div>

 {/* Main Grid: Services Table & Discount Section */}
 <div className={styles.mainGrid}>
 
 {/* Services Table */}
 <div className={styles.tableWrapper}>
 <table className={styles.dataTable}>
 <thead>
 <tr>
 <th>Details</th>
 <th>Professional Fees To Dr</th>
 <th style={{textAlign: 'right'}}>Charges</th>
 </tr>
 </thead>
 <tbody>
 <tr>
 <td>Follow Up Charges (BCH)</td>
 <td>Dr. NIKUNJ VITHALANI</td>
 <td style={{textAlign: 'right'}}>370</td>
 </tr>
 {/* Empty rows to match the screenshot's height if necessary, or just natural height */}
 {Array.from({ length: 4 }).map((_, i) => (
 <tr key={i}>
 <td>&nbsp;</td>
 <td>&nbsp;</td>
 <td>&nbsp;</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* Discount Section */}
 <div className={styles.discountSection}>
 <div className={styles.discountRow}>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Discount Authority By</label>
 <input type="number" min="0" step="0.01" className={styles.input} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>%</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Amount</label>
 <input type="number" min="0" step="0.01" className={styles.input} />
 </div>
 </div>

 <div className={styles.tableWrapper}>
 <table className={styles.dataTable}>
 <thead>
 <tr>
 <th style={{width: '24px'}}></th>
 <th>Autorised Person</th>
 <th>Amount</th>
 <th>Ent.Date</th>
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
 <button className={styles.secondaryBtn}>
 <FileText size={16} />
 Patient Past Info
 </button>
 
 <div className={styles.actionGroup}>
 <button 
 className={`${styles.secondaryBtn} ${isReceiptModalOpen ? styles.active : ''}`}
 onClick={() => setIsReceiptModalOpen(true)}
>
 Receipt Detail
 </button>
 <label className={styles.checkboxWrapper}>
 <input type="checkbox" /> Save
 </label>
 <label className={styles.checkboxWrapper}>
 <input type="checkbox" /> Print
 </label>
 <button className={styles.secondaryBtn}>Cancel</button>
 </div>
 </div>
 </div>

 {/* Receipt Detail Modal */}
 {isReceiptModalOpen && (
 <div className={styles.modalOverlay}>
 <div className={styles.modalContent}>
 
 <div className={styles.modalHeader}>
 <h2 className={styles.modalTitle}>Receipt Detail</h2>
 <button 
 className={styles.closeBtn} 
 onClick={() => setIsReceiptModalOpen(false)}
>
 <X size={20} />
 </button>
 </div>

 <div className={styles.modalBody}>
 
 <div className={styles.modalEntryRow}>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Operator Name</label>
 <input type="text" className={styles.input} value="" readOnly />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Date</label>
 <input type="date" className={styles.input} value="" readOnly  max="2099-12-31" />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Time</label>
 <input type="time" className={styles.input} value="" readOnly />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Due Amt</label>
 <input type="text" className={styles.input} value="" style={{textAlign: 'right'}} readOnly />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Now Paid Amt</label>
 <input type="text" className={styles.input} value="" style={{textAlign: 'right'}} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Pay Type</label>
 <select className={styles.select}>
 <option value="Cash">Cash</option>
 <option value="Debit / Credit Card">Debit / Credit Card</option>
 <option value="UPI / QR Code">UPI / QR Code</option>
 <option value="Cheque">Cheque</option>
 <option value="NEFT / RTGS">NEFT / RTGS</option>
 <option value="DD">DD</option>
 <option value="Card">Card</option>
 </select>
 </div>
 <div className={styles.fieldGroup} style={{flex: 2, minWidth: '200px'}}>
 <label className={styles.label}>Remark</label>
 <input type="text" className={styles.input} />
 </div>
 <button className={styles.iconBtn} aria-label="Add Payment">
 <ArrowDown size={18} />
 </button>
 </div>

 <div className={styles.modalActionGroup}>
 <button className={styles.secondaryBtn}>
 <Printer size={16} />
 Print Single Receipt
 </button>
 <button className={styles.secondaryBtn} onClick={() => setIsReceiptModalOpen(false)}>
 Exit
 </button>
 <label className={styles.checkboxWrapper}>
 <input type="checkbox" defaultChecked /> S
 </label>
 <label className={styles.checkboxWrapper}>
 <input type="checkbox" defaultChecked /> P
 </label>
 </div>

 <div className={styles.tableWrapper}>
 <table className={styles.dataTable}>
 <thead>
 <tr>
 <th>OptName</th>
 <th>EnDate</th>
 <th>EnTime</th>
 <th style={{textAlign: 'right'}}>NowPaid</th>
 <th>PayType</th>
 <th>Remark</th>
 <th style={{width: '100px'}}></th> {/* Blank space as in original */}
 </tr>
 </thead>
 <tbody>
 <tr>
 <td>Mahipal ...</td>
 <td>09-Jan-2023</td>
 <td>9:54AM</td>
 <td style={{textAlign: 'right'}}>370</td>
 <td>Cash</td>
 <td></td>
 <td></td>
 </tr>
 {/* Empty rows to match height */}
 {Array.from({ length: 3 }).map((_, i) => (
 <tr key={i}>
 <td>&nbsp;</td>
 <td>&nbsp;</td>
 <td>&nbsp;</td>
 <td>&nbsp;</td>
 <td>&nbsp;</td>
 <td>&nbsp;</td>
 <td>&nbsp;</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 </div>
 </div>
 </div>
 )}

 </div>
 );
};

export default PartPayment;
