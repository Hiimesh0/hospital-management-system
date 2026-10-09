import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, X, MoreVertical } from 'lucide-react';
import styles from './IndoorSummaryChart.module.css';

const MOCK_DATA : any[] = [
];

const IndoorSummaryChart: React.FC = () => {
 const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
 
 const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'All'];

 // Handle clicking outside to close dropdown
 useEffect(() => {
 const handleClickOutside = () => setOpenDropdownId(null);
 document.addEventListener('click', handleClickOutside);
 return () => document.removeEventListener('click', handleClickOutside);
 }, []);

 const toggleDropdown = (e: React.MouseEvent, id: number) => {
 e.stopPropagation();
 setOpenDropdownId(openDropdownId === id ? null : id);
 };

 const getStatusClass = (status: string) => {
 switch(status) {
 case 'green': return styles.statusGreen;
 case 'blue': return styles.statusBlue;
 case 'red': return styles.statusRed;
 default: return '';
 }
 };

 return (
 <div className={styles.pageContainer}>
 
 {/* Header */}
 <div className={styles.header}>
 <div className={styles.titleArea}>
 <h1 className={styles.pageTitle}>Indoor Summary Chart</h1>
 <span className={styles.recordCount}>Total: 0</span>
 </div>
 <div className={styles.headerActions}>
 <button className={styles.actionBtn}>
 <RefreshCw size={16} /> Refresh
 </button>
 <button className={styles.actionBtn}>
 <X size={16} /> Exit
 </button>
 </div>
 </div>

 <div className={styles.content}>
 
 {/* Filters Top Row */}
 <div className={styles.filtersRow}>
 
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Patient</label>
 <input type="text" className={`${styles.input} ${styles.wPatient}`} />
 </div>

 <div className={styles.fieldGroup}>
 <label className={styles.label}>Bill No:</label>
 <input type="text" className={`${styles.input} ${styles.wBillNo}`} />
 </div>

 <div className={styles.fieldGroup}>
 <label className={styles.label}>Prefix:</label>
 <select className={`${styles.select} ${styles.wPrefix}`}>
 <option value="All">All</option>
 <option value="GEN">GEN</option>
 </select>
 </div>

 <div className={styles.fieldGroup}>
 <label className={styles.label}>Rec No:</label>
 <input type="text" className={`${styles.input} ${styles.wRecNo}`} />
 </div>

 </div>

 {/* Timeline Row */}
 <div className={styles.timelineRow}>
 
 <div className={styles.fieldGroup}>
 <input type="date" className={`${styles.input} ${styles.wDate}`}  max="2099-12-31" />
 </div>

 <div className={styles.fieldGroup}>
 <select className={`${styles.select} ${styles.wYear}`}>
 <option value="2023">2023</option>
 <option value="2022">2022</option>
 </select>
 </div>

 <div className={styles.monthTabs}>
 {months.map(m => (
 <button 
 key={m} 
 className={`${styles.monthTab} ${m === 'Jan' ? styles.active : ''}`}
>
 {m}
 </button>
 ))}
 </div>

 </div>

 {/* Table List */}
 <div className={styles.tableWrapper}>
 <table className={styles.dataTable}>
 <thead>
 <tr>
 <th className={styles.rowNum}></th>
 <th>Indoor</th>
 <th>Patient</th>
 <th>Surgery</th>
 <th>Remark</th>
 <th>Uc Dr</th>
 <th>D.E.</th>
 <th>Bill Rec</th>
 <th>O.T.</th>
 <th>D.C.</th>
 <th>Bill No.</th>
 <th>Prefix</th>
 <th>DOD</th>
 <th>Mediclaim</th>
 <th>MLC</th>
 <th>CashLess</th>
 <th>RecNo</th>
 <th style={{ textAlign: 'center' }}>Actions</th>
 </tr>
 </thead>
 <tbody>
 {MOCK_DATA.map((row) => (
 <tr key={row.id} className={getStatusClass(row.status)}>
 <td className={styles.rowNum}>{row.id}</td>
 <td>{row.indoor}</td>
 <td>{row.patient}</td>
 <td>{row.surgery}</td>
 <td>{row.remark}</td>
 <td>{row.dr}</td>
 <td>{row.de}</td>
 <td>{row.billRec}</td>
 <td>{row.ot}</td>
 <td>{row.dc}</td>
 <td>{row.billNo}</td>
 <td>{row.prefix}</td>
 <td>{row.dod}</td>
 <td>{row.mediclaim}</td>
 <td>{row.mlc}</td>
 <td>{row.cashless}</td>
 <td>{row.recNo}</td>
 <td className={styles.actionCell}>
 <button 
 className={styles.actionMenuBtn} 
 onClick={(e) => toggleDropdown(e, row.id)}
 aria-label="Row Actions"
>
 <MoreVertical size={16} />
 </button>
 {openDropdownId === row.id && (
 <div className={styles.dropdownMenu}>
 <button className={styles.dropdownItem}>Indoor Register</button>
 <button className={styles.dropdownItem}>Deposit</button>
 <button className={styles.dropdownItem}>Operation</button>
 <button className={styles.dropdownItem}>Additional</button>
 <button className={styles.dropdownItem}>Dr Visit & Procedure</button>
 <button className={styles.dropdownItem}>Room & Room GST</button>
 <button className={styles.dropdownItem}>Patient Room Transfer Detail</button>
 <button className={styles.dropdownItem}>Inpatient Bill</button>
 <button className={styles.dropdownItem}>Inpatient Receipt</button>
 <button className={styles.dropdownItem}>Patient Past Info</button>
 <button className={styles.dropdownItem}>Feedback Form</button>
 <button className={styles.dropdownItem}>Diagnostics Entry Check</button>
 <button className={styles.dropdownItem}>Discharge Card</button>
 <button className={styles.dropdownItem}>Endo/Lapro Image Print</button>
 <button className={styles.dropdownItem}>Medicine</button>
 <button className={styles.dropdownItem}>OT Entry</button>
 <button className={styles.dropdownItem}>Estimate Print</button>
 <button className={styles.dropdownItem}>IPD Consent Form</button>
 <button className={styles.dropdownItem}>CashLess Forms Print</button>
 <button className={styles.dropdownItem}>Investigation (To Be Ordered)</button>
 </div>
 )}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* Legend / Footer */}
 <div className={styles.legendFooter}>
 <div className={styles.legendItem}>
 <div className={`${styles.legendDot} ${styles.dotGreen}`}></div>
 <span className={styles.legendTextGreen}>Bills & Receipt Generated</span>
 </div>
 <div className={styles.legendItem}>
 <div className={`${styles.legendDot} ${styles.dotBlue}`}></div>
 <span className={styles.legendTextBlue}>Discharged - Bill Not Generated</span>
 </div>
 <div className={styles.legendItem}>
 <div className={`${styles.legendDot} ${styles.dotRed}`}></div>
 <span className={styles.legendTextRed}>Bill Generated But Receipt Not Generated</span>
 </div>
 <div className={styles.legendItem}>
 <div className={`${styles.legendDot} ${styles.dotBlack}`}></div>
 <span className={styles.legendTextBlack}>Bill Not Generated</span>
 </div>
 </div>

 </div>
 </div>
 );
};

export default IndoorSummaryChart;
