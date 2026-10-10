import React, { useState } from 'react';
import { 
 Folder, RefreshCw, X, Search
} from 'lucide-react';
import styles from './TodayReportDashboard.module.css';

const MOCK_DATA : any[] = [
];

const TodayReportDashboard: React.FC = () => {
 const [filterMode, setFilterMode] = useState<'ALL' | 'INDOOR'>('ALL');

 return (
 <div className={styles.pageContainer}>
 
 {/* Top Toolbar */}
 <div className={styles.toolbar}>
 
 <div className={styles.leftControls}>
 <input type="date" className={styles.datePicker}  max="2099-12-31" />
 
 <button className={styles.actionBtn}>
 Pending
 </button>
 
 <div className={styles.buttonGroup}>
 <button className={styles.groupBtn}>
 <RefreshCw size={14} style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'text-bottom' }} /> Refresh
 </button>
 <button className={`${styles.groupBtn} ${styles.active}`} style={{ backgroundColor: '#FEF08A', color: '#854D0E', borderBottom: '2px solid var(--warning)' }}>
 ALL
 </button>
 </div>

 <div className={styles.buttonGroup}>
 <button className={styles.groupBtn}>OPD</button>
 <button className={`${styles.groupBtn} ${filterMode === 'INDOOR' ? styles.active : ''}`}>INDOOR</button>
 </div>

 <button className={styles.actionBtn}>
 <Folder size={14} /> Folder
 </button>
 </div>

 <div className={styles.titleContainer}>
 <h1 className={styles.pageTitle}>Laboratory</h1>
 </div>

 <div className={styles.rightControls}>
 <label className={styles.searchLabel}>Pt</label>
 <div className={styles.searchContainer}>
 <Search size={16} className={styles.searchIcon} />
 <input 
 type="text" 
 className={styles.searchInput} 
 style={{ backgroundColor: '#FEF08A', borderColor: 'var(--warning)' }} // Mimicking the yellow highlight in screenshot
 />
 </div>
 <button className={styles.iconBtn}>
 <X size={16} />
 </button>
 </div>

 </div>

 {/* Table Area */}
 <div className={styles.tableWrapper}>
 <div className={styles.tableContainer}>
 <table className={styles.table}>
 <thead>
 <tr>
 <th className={styles.th} style={{ width: '40px' }}></th>
 <th className={styles.th} style={{ width: '60px' }}>Code</th>
 <th className={styles.th}>Name</th>
 <th className={`${styles.th} ${styles.alignCenter}`}>Reports</th>
 <th className={`${styles.th} ${styles.alignCenter}`}>Created</th>
 <th className={`${styles.th} ${styles.alignCenter}`}>Printed</th>
 <th className={styles.th}>Treating Doctor</th>
 <th className={styles.th} style={{ width: '80px' }}>Age</th>
 <th className={styles.th}>Testname</th>
 <th className={styles.th}>Lab Id</th>
 </tr>
 </thead>
 <tbody>
 {MOCK_DATA.map((row) => {
 let colorClass = styles.textDefault;
 if (row.status === 'green') colorClass = styles.textGreen;
 if (row.status === 'blue') colorClass = styles.textBlue;

 return (
 <tr key={row.id} className={styles.tr}>
 <td className={`${styles.td} ${styles.textMuted}`}>{row.id}</td>
 <td className={`${styles.td} ${colorClass}`}>{row.code}</td>
 <td className={`${styles.td} ${colorClass}`}>{row.name}</td>
 <td className={`${styles.td} ${styles.alignCenter} ${colorClass}`}>{row.reports}</td>
 <td className={`${styles.td} ${styles.alignCenter} ${colorClass}`}>{row.created}</td>
 <td className={`${styles.td} ${styles.alignCenter} ${colorClass}`}>{row.printed}</td>
 <td className={`${styles.td} ${colorClass}`}>{row.doc}</td>
 <td className={`${styles.td} ${colorClass}`}>{row.age}</td>
 <td className={`${styles.td} ${colorClass}`}>
 <div className={styles.truncate} title={row.test}>
 {row.test}
 </div>
 </td>
 <td className={`${styles.td} ${colorClass}`}>{row.labId}</td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>

 </div>
 );
};

export default TodayReportDashboard;
