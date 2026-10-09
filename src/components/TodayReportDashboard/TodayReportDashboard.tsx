import React, { useState } from 'react';
import { 
 Folder, RefreshCw, X, Search
} from 'lucide-react';
import styles from './TodayReportDashboard.module.css';

const MOCK_DATA = [
 { id: 1, code: '122', name: 'SALMABANU MOHAMEDNAIM SHAIKH', reports: 2, created: 0, printed: 0, doc: 'Dr. HITENDRA AYRE', age: '52 Yrs.', test: 'ABG (UNITY), TRANSPORTATION CHARGE(UNITY)', labId: '345', status: 'default' },
 { id: 2, code: '122', name: 'SALMABANU MOHAMEDNAIM SHAIKH', reports: 2, created: 0, printed: 0, doc: 'Dr. HITENDRA AYRE', age: '52 Yrs.', test: 'ABG (UNITY), TRANSPORTATION CHARGE(UNITY)', labId: '346', status: 'default' },
 { id: 3, code: '122', name: 'SALMABANU MOHAMEDNAIM SHAIKH', reports: 3, created: 0, printed: 0, doc: 'Dr. HITENDRA AYRE', age: '52 Yrs.', test: 'CBC + MP(UNITY), CRP (UNITY), TRANSPORTATION ...', labId: '347', status: 'default' },
 { id: 4, code: '122', name: 'SALMABANU MOHAMEDNAIM SHAIKH', reports: 5, created: 4, printed: 3, doc: 'Dr. HITENDRA AYRE', age: '52 Yrs.', test: 'BLOOD CULLTURE &amp; SENSITIVE(2019), CBC, S.E...', labId: '348', status: 'default' },
 { id: 5, code: '5', name: 'DWARKADAS R MAHESHWARI', reports: 3, created: 3, printed: 3, doc: 'Dr. ANKIT PATEL', age: '65 Yrs.', test: 'S.ELECTROLYTE', labId: '349', status: 'green' },
 { id: 6, code: '440', name: 'RAMPRAKASH K TIWARI', reports: 2, created: 2, printed: 2, doc: 'Dr. RAHUL SHAH', age: '65 Yrs.', test: 'S.CREATININE, S.UREA', labId: '351', status: 'green' },
 { id: 7, code: '24', name: 'SHYAMBHAI BHAVRAV SOLANKI', reports: 1, created: 0, printed: 0, doc: 'Dr. JAYVIRSINH JHALA', age: '40 Yrs.', test: 'FROZEN 7', labId: '350', status: 'default' },
 { id: 8, code: '171', name: 'TEJASHKUMAR H MAHAKAL', reports: 7, created: 4, printed: 3, doc: 'Dr. RAHUL SHAH', age: '33 Yrs.', test: 'BLOOD CULLTURE &amp; SENSITIVE(2019), CBC, CU...', labId: '352', status: 'default' },
 { id: 9, code: '609', name: 'HANSABEN BHANUSHANKARBHAI JOSHI', reports: 2, created: 2, printed: 1, doc: 'Dr. ANKIT PATEL', age: '58 Yrs.', test: 'CBC, S.CREATININE', labId: '353', status: 'blue' },
 { id: 10, code: '626', name: 'PARULATA BHARATKUMAR PATEL', reports: 4, created: 3, printed: 1, doc: 'Dr. HITENDRA AYRE', age: '51 Yrs.', test: 'Cancer Screening Camp Female(Above 40)', labId: '', status: 'default' },
 { id: 11, code: '624', name: 'SHARDABEN ASHOKBHAI HADIYA', reports: 2, created: 2, printed: 1, doc: 'Dr. ANKIT PATEL', age: '46 Yrs.', test: 'Carcinoembryonic Antigen (Sr.CEA), CBC', labId: '354', status: 'blue' },
 { id: 12, code: '435', name: 'DIPAKBHAI JAVAHARLAL SONI', reports: 2, created: 2, printed: 1, doc: 'Dr. DIPALI AYRE', age: '59 Yrs.', test: 'CBC, S.CREATININE', labId: '355', status: 'blue' },
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
 <button className={`${styles.groupBtn} ${styles.active}`} style={{ backgroundColor: '#FEF08A', color: '#854D0E', borderBottom: '2px solid #EAB308' }}>
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
 style={{ backgroundColor: '#FEF08A', borderColor: '#EAB308' }} // Mimicking the yellow highlight in screenshot
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
