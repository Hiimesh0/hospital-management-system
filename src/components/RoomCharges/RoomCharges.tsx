import React from 'react';
import { ArrowDown, LogOut, Save } from 'lucide-react';
import styles from './RoomCharges.module.css';

const RoomCharges: React.FC = () => {
 return (
 <div className={styles.pageContainer}>
 
 <div className={styles.header}>
 <h1 className={styles.pageTitle}>Room Charges Entry</h1>
 </div>

 <div className={styles.content}>
 
 {/* Context Bar */}
 <div className={styles.contextBar}>
 <div className={styles.patientName}>RANJITKUMAR MOHANLAL DARUKA</div>
 <div className={styles.recordId}>I/0123/178</div>
 
 <div className={styles.companyGroup}>
 <label className={styles.label}>Take Rate Of Company</label>
 <input type="number" min="0" step="0.01" className={styles.input} style={{maxWidth: '250px'}} />
 </div>
 
 <button className={styles.secondaryBtn}>
 <LogOut size={16} />
 Exit
 </button>
 </div>

 {/* Service Entry Row */}
 <div className={styles.entryRow}>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Date</label>
 <input type="date" className={styles.input} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Bed No</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Type</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Room Rate</label>
 <input type="number" min="0" step="0.01" className={styles.input} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>GST Amount</label>
 <input type="number" min="0" step="0.01" className={styles.input} />
 </div>
 <button className={styles.iconBtn} aria-label="Add Charge">
 <ArrowDown size={18} />
 </button>
 </div>

 {/* Data Table */}
 <div className={styles.tableWrapper}>
 <table className={styles.dataTable}>
 <thead>
 <tr>
 <th style={{width: '24px'}}></th>
 <th>Date</th>
 <th>Bed No</th>
 <th>Type</th>
 <th style={{textAlign: 'right'}}>Net Room</th>
 <th style={{textAlign: 'right'}}>GST Amount</th>
 <th style={{textAlign: 'right'}}>Net GST</th>
 <th>Company</th>
 </tr>
 </thead>
 <tbody>
 <tr>
 <td style={{textAlign: 'center', fontSize: '10px'}}>▶</td>
 <td>09-Jan-2023</td>
 <td>BCH-IC-IC-3</td>
 <td>IC</td>
 <td style={{textAlign: 'right'}}>2460</td>
 <td style={{textAlign: 'right'}}>0</td>
 <td style={{textAlign: 'right'}}>0</td>
 <td></td>
 </tr>
 {/* Empty rows to visually match the large empty space of the screenshot if desired, 
 but modern design prefers not adding empty tr rows. I'll add one empty state row if no data, 
 but since there is data, let's keep it clean. */}
 </tbody>
 </table>
 </div>

 {/* Footer Section */}
 <div className={styles.footerSection}>
 <button className={styles.primaryBtn}>
 <Save size={18} />
 Save
 </button>
 
 <div className={styles.totalsGroup}>
 <div className={styles.totalBox}>
 <div className={styles.totalValue}>2460</div>
 </div>
 <div className={styles.totalBox}>
 <div className={styles.totalValue}>0</div>
 </div>
 </div>
 </div>

 </div>
 </div>
 );
};

export default RoomCharges;
