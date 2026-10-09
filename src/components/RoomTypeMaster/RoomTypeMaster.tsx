import React, { useState } from 'react';
import { 
 ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
 Search, Save, LogOut, CheckSquare, Square, Play
} from 'lucide-react';
import styles from './RoomTypeMaster.module.css';

const MOCK_DATA = [
 { id: 1, shortName: 'MA', description: 'Ma Yojana Ward' },
 { id: 2, shortName: 'ES', description: 'Esic Ward' },
 { id: 3, shortName: 'IC', description: 'I.C.U' },
 { id: 4, shortName: 'MS', description: 'Male Surgical Ward' },
 { id: 5, shortName: 'FS', description: 'Female Surgical Ward' },
 { id: 6, shortName: 'DC', description: 'Day Care Ward' },
 { id: 7, shortName: 'SP', description: 'Special Room' },
 { id: 8, shortName: 'SS', description: 'Semi Special Room' },
 { id: 9, shortName: 'EX', description: 'Executive Suite' },
 { id: 10, shortName: 'IS', description: 'Isolation Room' },
 { id: 11, shortName: 'GW', description: 'General Ward' },
 { id: 12, shortName: 'CT', description: 'Clinical Trial Management' },
 { id: 13, shortName: 'OT', description: 'Ot' },
 { id: 14, shortName: 'DX', description: 'Deluxe' },
];

const COLORS_ROW_1 = [
 { code: '#C1F0F6', name: 'MS' },
 { code: '#FEE2CF', name: 'ES' },
 { code: '#FEF9C3', name: 'MA' },
 { code: '#FECDD3', name: 'OT' },
 { code: '#C4B5FD', name: '' },
 { code: '#FBCFE8', name: 'FS' },
 { code: '#E9D5FF', name: 'CT' },
 { code: '#67E8F9', name: 'GW' },
 { code: '#22C55E', name: '' },
 { code: '#F97316', name: '' },
 { code: '#FACC15', name: '' },
 { code: '#D1D5DB', name: '' },
 { code: '#854D0E', name: '' },
 { code: '#A7F3D0', name: '' },
 { code: '#6EE7B7', name: '' },
 { code: '#2DD4BF', name: '' },
];

const COLORS_ROW_2 = [
 { code: '#86EFAC', name: 'SP' },
 { code: '#F0ABFC', name: 'DX' },
 { code: '#D9F99D', name: 'SS' },
 { code: '#FFFFFF', name: '' }, // empty space in screenshot
 { code: '#E2E8F0', name: 'IC' },
 { code: '#FBBF24', name: 'IS' },
 { code: '#FEF08A', name: 'DC' },
 { code: '#A855F7', name: 'EX' },
 { code: '#06B6D4', name: '' },
 { code: '#F472B6', name: '' },
 { code: '#EAB308', name: '' },
 { code: '#EF4444', name: '' },
 { code: '#FFFFFF', name: '' }, // empty
 { code: '#5EEAD4', name: '' },
 { code: '#38BDF8', name: '' },
 { code: '#0EA5E9', name: '' },
];

const RoomTypeMaster: React.FC = () => {
 const [compulsory, setCompulsory] = useState(false);
 const [icu, setIcu] = useState(false);

 return (
 <div className={styles.pageContainer}>
 
 {/* Header */}
 <div className={styles.header}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
 <span className={styles.recordCounter}>14 of 14</span>
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
 style={{ backgroundColor: color.code, opacity: color.code === '#FFFFFF' ? 0 : 1 }}
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
 {compulsory ? <CheckSquare size={18} color="#2563EB" /> : <Square size={18} />}
 <span>Room Charges As Compulsory In Indoor Register For this Room Type</span>
 </div>
 <div 
 className={styles.checkboxItem} 
 onClick={() => setIcu(!icu)}
 style={{ marginLeft: '26px' }}
>
 {icu ? <CheckSquare size={18} color="#2563EB" /> : <Square size={18} />}
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
 <td style={{ color: row.id === 14 ? '#2563EB' : 'inherit' }}>
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
