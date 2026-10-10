import React, { useState } from 'react';
import { 
 ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
 Search, Save, LogOut, CheckSquare, Square, Edit2, Trash2, ArrowDownCircle, X
} from 'lucide-react';
import styles from './OPDChargesProfile.module.css';

const OPDChargesProfile: React.FC = () => {
 const [concernDr, setConcernDr] = useState(true);
 const [isBio, setIsBio] = useState(false);
 const [isActive, setIsActive] = useState(true);
 const [listType, setListType] = useState('active');

 return (
 <div className={styles.pageContainer}>
 
 {/* Header */}
 <div className={styles.header}>
 <div className={styles.headerLeft}>
 <span className={styles.badge}>0 of 0</span>
 <span className={styles.badge} style={{ backgroundColor: 'var(--primary-soft)', color: 'var(--primary)', borderColor: '#BFDBFE' }}>
 Test ID: --
 </span>
 <h1 className={styles.pageTitle}>OPD Charges / Diagnostics Test</h1>
 </div>
 <div className={styles.headerRight}>
 <label className={styles.label} style={{ width: 'auto' }}>Test For :</label>
 <select className={`${styles.input} ${styles.inputMedium}`}>
 <option>Both</option>
 <option>Male</option>
 <option>Female</option>
 </select>
 </div>
 </div>

 {/* Form Container */}
 <div className={styles.formContainer}>
 
 <div className={styles.mainSection}>
 
 {/* Row 1 */}
 <div className={styles.row}>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Group :</label>
 <select className={`${styles.input} ${styles.inputMedium}`}>
 <option>OPD-BCH</option>
 </select>
 </div>
 <div className={styles.checkboxItem} onClick={() => setConcernDr(!concernDr)} style={{ width: '160px', marginLeft: '16px' }}>
 {concernDr ? <CheckSquare size={16} color="#94A3B8" /> : <Square size={16} color="#94A3B8" />}
 <span style={{ color: '#94A3B8' }}>Concern Dr Compulsary</span>
 </div>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label}>Company :</label>
 <input type="text" className={styles.input} style={{ flex: 1 }} />
 </div>
 </div>

 {/* Row 2 */}
 <div className={styles.row}>
 <div className={styles.fieldGroup} style={{ flex: 2 }}>
 <label className={styles.label}>Test :</label>
 <input type="text" className={styles.input} style={{ flex: 1 }} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label} style={{ width: '80px' }}>Short Name :</label>
 <input type="text" className={`${styles.input} ${styles.inputSmall}`} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label} style={{ width: '60px' }}>Priority :</label>
 <input type="text" className={`${styles.input} ${styles.inputSmall}`} />
 </div>
 <div className={styles.checkboxItem} onClick={() => setIsBio(!isBio)}>
 {isBio ? <CheckSquare size={16} color="var(--primary)" /> : <Square size={16} color="#94A3B8" />}
 <span style={{ color: isBio ? 'var(--text-main)' : '#94A3B8' }}>BIO</span>
 </div>
 <div className={styles.checkboxItem} onClick={() => setIsActive(!isActive)}>
 {isActive ? <CheckSquare size={16} color="var(--primary)" /> : <Square size={16} color="#94A3B8" />}
 <span style={{ color: isActive ? 'var(--text-main)' : '#94A3B8' }}>ACTIVE</span>
 </div>
 <div className={styles.fieldGroup} style={{ marginLeft: 'auto' }}>
 <label className={styles.label} style={{ width: '80px' }}>LIS Lab ID :</label>
 <input type="text" className={`${styles.input} ${styles.inputSmall}`} />
 </div>
 </div>

 {/* Table Section */}
 <div className={styles.tableSection}>
 
 <div className={styles.entryRow}>
 <div className={styles.entryCol} style={{ width: '150px' }}>
 <span className={styles.entryLabel}>Group Name</span>
 <select className={`${styles.input} ${styles.entryInput}`}>
 <option>OPD-BCH</option>
 </select>
 </div>
 <div className={styles.entryCol} style={{ flex: 1 }}>
 <span className={styles.entryLabel}>Test Name</span>
 <input type="text" className={styles.entryInput} />
 </div>
 <div className={styles.entryCol} style={{ width: '80px' }}>
 <span className={styles.entryLabel}>Priority</span>
 <input type="text" className={styles.entryInput} />
 </div>
 <div className={styles.entryCol} style={{ width: '100px', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '2px' }}>
 <button className={styles.iconBtn}>
 <ArrowDownCircle size={18} />
 </button>
 <button className={styles.iconBtn} style={{ marginLeft: '8px' }}>
 <X size={18} />
 </button>
 </div>
 </div>

 <table className={styles.dataTable}>
 <thead>
 <tr>
 <th style={{ width: '20px' }}></th>
 <th style={{ width: '200px' }}>Group</th>
 <th>TestName</th>
 <th style={{ width: '100px' }}>Priority</th>
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
 <div className={styles.navControls}>
 <button className={styles.navBtn}><ChevronsLeft size={18} /></button>
 <button className={styles.navBtn}><ChevronLeft size={18} /></button>
 <button className={styles.navBtn}><ChevronRight size={18} /></button>
 <button className={styles.navBtn}><ChevronsRight size={18} /></button>
 </div>

 <div className={styles.middleActions}>
 <div className={styles.radioGroup}>
 <label className={styles.radioLabel}>
 <input type="radio" name="filter" checked={listType === 'all'} onChange={() => setListType('all')} /> All
 </label>
 <label className={styles.radioLabel}>
 <input type="radio" name="filter" checked={listType === 'active'} onChange={() => setListType('active')} /> Active
 </label>
 <label className={styles.radioLabel}>
 <input type="radio" name="filter" checked={listType === 'inactive'} onChange={() => setListType('inactive')} /> InActive
 </label>
 </div>
 
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
 <label className={styles.label} style={{ width: 'auto', fontWeight: '500' }}>L</label>
 <input type="checkbox" style={{ margin: 0 }} />
 </div>

 <button className={styles.smallBtn} style={{ width: '60px' }}>TP</button>

 <button className={styles.secondaryBtn} style={{ marginLeft: '12px' }}>
 <Search size={16} /> Search
 </button>
 <button className={styles.secondaryBtn}>
 <Search size={16} /> {/* Binoculars equivalent */}
 </button>
 </div>

 <div className={styles.rightActions}>
 <button className={styles.primaryBtn}>
 <Save size={16} /> Add
 </button>
 <button className={styles.secondaryBtn}>
 <Edit2 size={16} /> Update
 </button>
 <button className={styles.dangerBtn}>
 <Trash2 size={16} /> Delete
 </button>
 <button className={styles.secondaryBtn} style={{ marginLeft: '8px' }}>
 <LogOut size={16} /> Exit
 </button>
 </div>
 </div>

 </div>
 );
};

export default OPDChargesProfile;
