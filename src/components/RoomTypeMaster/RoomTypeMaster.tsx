import React, { useState } from 'react';
import { 
 ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
 Search, Save, LogOut, CheckSquare, Square, Play
} from 'lucide-react';
import styles from './RoomTypeMaster.module.css';

const MOCK_DATA : any[] = [
];

const COLORS_ROW_1 = [
 { code: 'var(--primary-soft)', name: 'MS' },
 { code: 'var(--warning-soft)', name: 'ES' },
 { code: 'var(--warning-soft)', name: 'MA' },
 { code: 'var(--danger-soft)', name: 'OT' },
 { code: 'var(--danger-soft)', name: '' },
 { code: 'var(--danger-soft)', name: 'FS' },
 { code: 'var(--danger-soft)', name: 'CT' },
 { code: 'var(--primary-soft)', name: 'GW' },
 { code: 'var(--success)', name: '' },
 { code: 'var(--warning)', name: '' },
 { code: 'var(--warning)', name: '' },
 { code: 'var(--border)', name: '' },
 { code: 'var(--warning-hover)', name: '' },
 { code: 'var(--success-soft)', name: '' },
 { code: 'var(--success-soft)', name: '' },
 { code: 'var(--success-soft)', name: '' },
];

const COLORS_ROW_2 = [
 { code: 'var(--success-soft)', name: 'SP' },
 { code: 'var(--danger-soft)', name: 'DX' },
 { code: 'var(--success-soft)', name: 'SS' },
 { code: 'var(--surface)', name: '' }, // empty space in screenshot
 { code: 'var(--border)', name: 'IC' },
 { code: 'var(--warning)', name: 'IS' },
 { code: 'var(--warning-soft)', name: 'DC' },
 { code: 'var(--danger-soft)', name: 'EX' },
 { code: 'var(--primary)', name: '' },
 { code: 'var(--danger-soft)', name: '' },
 { code: 'var(--warning)', name: '' },
 { code: 'var(--danger)', name: '' },
 { code: 'var(--surface)', name: '' }, // empty
 { code: 'var(--success-soft)', name: '' },
 { code: 'var(--primary-soft)', name: '' },
 { code: 'var(--primary)', name: '' },
];

const RoomTypeMaster: React.FC = () => {
 const [compulsory, setCompulsory] = useState(false);
 const [icu, setIcu] = useState(false);

 return (
 <div className={styles.pageContainer}>
 
 {/* Header */}
 <div className={styles.header}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
 <span className={styles.recordCounter}>0 of 0</span>
 <h1 className={styles.pageTitle}>Room Type Master</h1>
 </div>
 </div>

 {/* Form Container */}
 <div className={styles.formContainer}>
 
 {/* Top Info Section */}
 <div className={styles.topSection}>
 <div className={styles.formGrid}>
 <div className={styles.leftForm}>
 <div className={styles.row}>
 <div className={styles.fieldGroup}>
 <label className={styles.label} style={{ width: '90px' }}>ShortName :</label>
 <input type="text" className={styles.input} style={{ width: '100px' }} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Priority :</label>
 <input type="text" className={styles.input} style={{ width: '100px' }} />
 </div>
 </div>

 <div className={styles.fieldGroup}>
 <label className={styles.label} style={{ width: '90px' }}>Description :</label>
 <input type="text" className={styles.input} style={{ width: '400px' }} />
 </div>

 <div className={styles.row} style={{ marginTop: '8px' }}>
 <label className={styles.label} style={{ width: '90px' }}>Display Color :</label>
 <div className={styles.colorPaletteSection} style={{ flex: 1 }}>
 <div className={styles.colorGrid}>
 {COLORS_ROW_1.map((color, i) => (
 <div 
 key={`r1-${i}`} 
 className={styles.colorBox} 
 style={{ backgroundColor: color.code }}
>
 {color.name}
 </div>
 ))}
 {COLORS_ROW_2.map((color, i) => (
 <div 
 key={`r2-${i}`} 
 className={`${styles.colorBox} ${color.name === 'DX' ? styles.selected : ''}`} 
 style={{ backgroundColor: color.code, opacity: color.code === 'var(--surface)' ? 0 : 1 }}
>
 {color.name}
 </div>
 ))}
 </div>
 </div>
 <button className={styles.smallBtn} style={{ alignSelf: 'flex-end', marginBottom: '16px' }}>
 Show
 </button>
 </div>
 </div>

 <div className={styles.rightForm}>
 <div 
 className={styles.checkboxItem} 
 onClick={() => setCompulsory(!compulsory)}
>
 {compulsory ? <CheckSquare size={18} color="var(--primary)" /> : <Square size={18} />}
 <span>Room Charges As Compulsory In Indoor Register For this Room Type</span>
 </div>
 <div 
 className={styles.checkboxItem} 
 onClick={() => setIcu(!icu)}
 style={{ marginLeft: '26px' }}
>
 {icu ? <CheckSquare size={18} color="var(--primary)" /> : <Square size={18} />}
 <span>ICU</span>
 </div>
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
 <th>ShortName</th>
 <th>Description</th>
 </tr>
 </thead>
 <tbody>
 {MOCK_DATA.map((row) => (
 <tr key={row.id} className={row.id === 14 ? styles.selectedRow : ''}>
 <td style={{ color: row.id === 14 ? 'var(--primary)' : 'inherit' }}>
 {row.id === 14 ? <Play size={12} fill="currentColor" /> : row.id}
 </td>
 <td>{row.shortName}</td>
 <td>{row.description}</td>
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
 <button className={styles.navBtn}>
 <Search size={18} />
 </button>
 </div>

 <div className={styles.rightActions}>
 <button className={styles.primaryBtn}>
 <Save size={18} /> Add
 </button>
 <button className={styles.secondaryBtn}>
 <LogOut size={18} /> Exit
 </button>
 </div>
 </div>

 </div>
 );
};

export default RoomTypeMaster;
