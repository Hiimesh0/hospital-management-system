import React from 'react';
import { 
 ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
 Search, Save, LogOut, FileText, Edit2, Play
} from 'lucide-react';
import styles from './VisitingTypeMaster.module.css';

const MOCK_DATA = [
 { id: 1, roomType: 'MA', description: 'Ma Yojana Ward', rate: '250' },
 { id: 2, roomType: 'ES', description: 'Esic Ward', rate: '250' },
 { id: 3, roomType: 'GW', description: 'General Ward', rate: '0' },
 { id: 4, roomType: 'CT', description: 'Clinical Trial Management', rate: '250' },
 { id: 5, roomType: 'IC', description: 'I.C.U', rate: '0' },
 { id: 6, roomType: 'MS', description: 'Male Surgical Ward', rate: '0' },
 { id: 7, roomType: 'FS', description: 'Female Surgical Ward', rate: '0' },
 { id: 8, roomType: 'DC', description: 'Day Care Ward', rate: '0' },
 { id: 9, roomType: 'SP', description: 'Special Room', rate: '0' },
 { id: 10, roomType: 'SS', description: 'Semi Special Room', rate: '0' },
 { id: 11, roomType: 'EX', description: 'Executive Suite', rate: '0' },
 { id: 12, roomType: 'IS', description: 'Isolation Room', rate: '0' },
];

const VisitingTypeMaster: React.FC = () => {
 return (
 <div className={styles.pageContainer}>
 
 {/* Header */}
 <div className={styles.header}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
 <span className={styles.recordCounter}>33 of 33</span>
 <h1 className={styles.pageTitle}>Visiting Type</h1>
 </div>
 </div>

 {/* Form Container */}
 <div className={styles.formContainer}>
 
 {/* Top Info Section */}
 <div className={styles.topSection}>
 <div className={styles.row}>
 <div className={styles.fieldGroup} style={{ flex: 1, maxWidth: '600px' }}>
 <label className={styles.label}>Head :</label>
 <input type="text" className={`${styles.input} ${styles.readOnly}`} readOnly />
 </div>
 <div className={styles.fieldGroup} style={{ flex: 1, maxWidth: '500px' }}>
 <label className={styles.label}>Patient Company:</label>
 <input type="text" className={styles.input} />
 </div>
 </div>

 <div className={styles.row}>
 <div className={styles.fieldGroup} style={{ flex: 1, maxWidth: '600px' }}>
 <label className={styles.label}>Name :</label>
 <input type="text" className={styles.input} />
 </div>
 </div>

 <div className={styles.row}>
 <div className={styles.fieldGroup} style={{ flex: 1, maxWidth: '800px' }}>
 <label className={styles.label}>Service Name :</label>
 <input type="text" className={styles.input} />
 </div>
 </div>

 <div className={styles.row}>
 <div className={styles.fieldGroup} style={{ width: '380px' }}>
 <label className={styles.label}>Visiting Type :</label>
 <select className={styles.input}>
 <option>Visiting Charge</option>
 <option>Other Charge</option>
 </select>
 </div>
 
 <div className={styles.statusGroup}>
 <label className={styles.label} style={{ width: 'auto', marginRight: '8px' }}>Status :</label>
 <label className={styles.radioLabel}>
 <input type="radio" name="status" defaultChecked /> Active
 </label>
 <label className={styles.radioLabel} style={{ marginLeft: '12px', color: '#94A3B8' }}>
 <input type="radio" name="status" disabled /> Inactive
 </label>
 </div>

 <div className={styles.fieldGroup} style={{ marginLeft: 'auto' }}>
 <label className={styles.label} style={{ width: 'auto' }}>Priority In Head :</label>
 <input type="text" className={styles.input} style={{ width: '80px' }} />
 </div>
 </div>

 <div className={styles.row}>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>All Dr % :</label>
 <input type="text" className={styles.input} style={{ width: '80px' }} />
 </div>
 </div>
 </div>

 {/* Table Section */}
 <div className={styles.tableSection}>
 <div className={styles.tableWrapper}>
 <table className={styles.dataTable}>
 <thead>
 <tr>
 <th></th>
 <th>Room Type</th>
 <th>Description</th>
 <th>Rate</th>
 </tr>
 </thead>
 <tbody>
 {MOCK_DATA.map((row) => (
 <tr key={row.id} className={row.id === 1 ? styles.selectedRow : ''}>
 <td>
 {row.id === 1 ? <Play size={12} fill="#2563EB" color="#2563EB" /> : row.id}
 </td>
 <td>{row.roomType}</td>
 <td>{row.description}</td>
 <td>{row.rate}</td>
 </tr>
 ))}
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
 <button className={styles.secondaryBtn}>
 <FileText size={18} /> Report
 </button>
 <button className={styles.secondaryBtn}>
 <Search size={18} /> Search
 </button>
 </div>

 <div className={styles.rightActions}>
 <button className={styles.primaryBtn}>
 <Save size={18} /> Add
 </button>
 <button className={styles.secondaryBtn}>
 <Edit2 size={18} /> Update
 </button>
 <button className={styles.secondaryBtn} style={{ marginLeft: '16px' }}>
 <LogOut size={18} /> Exit
 </button>
 </div>
 </div>

 </div>
 );
};

export default VisitingTypeMaster;
