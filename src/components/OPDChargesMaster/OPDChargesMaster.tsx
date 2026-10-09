import React, { useState } from 'react';
import { 
 ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
 Search, Save, LogOut, CheckSquare, Square, Edit2, Trash2, ArrowDownCircle, Info
} from 'lucide-react';
import styles from './OPDChargesMaster.module.css';

const OPDChargesMaster: React.FC = () => {
 const [concernDr, setConcernDr] = useState(false);
 const [isBio, setIsBio] = useState(false);
 const [isActive, setIsActive] = useState(true);
 const [excludeRoomRate, setExcludeRoomRate] = useState(false);
 const [outsideTest, setOutsideTest] = useState(false);
 const [listType, setListType] = useState('active');

 return (
 <div className={styles.pageContainer}>
 
 {/* Header */}
 <div className={styles.header}>
 <div className={styles.headerLeft}>
 <span className={styles.badge}>811 Of 811</span>
 <span className={styles.badge} style={{ backgroundColor: '#EFF6FF', color: '#2563EB', borderColor: '#BFDBFE' }}>
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
 
 {/* Main Section */}
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
 {concernDr ? <CheckSquare size={16} color="#2563EB" /> : <Square size={16} />}
 <span>Concern Dr Compulsary</span>
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Company :</label>
 <input type="text" className={`${styles.input} ${styles.inputLarge}`} />
 </div>
 </div>

 {/* Row 2 */}
 <div className={styles.row}>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Test :</label>
 <input type="text" className={`${styles.input} ${styles.inputLarge}`} />
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
 {isBio ? <CheckSquare size={16} color="#2563EB" /> : <Square size={16} color="#94A3B8" />}
 <span style={{ color: isBio ? '#172033' : '#94A3B8' }}>BIO</span>
 </div>
 <div className={styles.checkboxItem} onClick={() => setIsActive(!isActive)}>
 {isActive ? <CheckSquare size={16} color="#2563EB" /> : <Square size={16} />}
 <span>ACTIVE</span>
 </div>
 <div className={styles.fieldGroup} style={{ marginLeft: 'auto' }}>
 <label className={styles.label} style={{ width: '80px' }}>LIS Lab ID :</label>
 <input type="text" className={`${styles.input} ${styles.inputSmall}`} />
 </div>
 </div>

 {/* Row 3 */}
 <div className={styles.row}>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Test (Comp) :</label>
 <input type="text" className={`${styles.input} ${styles.inputLarge}`} />
 </div>
 <div className={styles.checkboxItem} onClick={() => setExcludeRoomRate(!excludeRoomRate)} style={{ marginLeft: '16px' }}>
 {excludeRoomRate ? <CheckSquare size={16} color="#2563EB" /> : <Square size={16} color="#94A3B8" />}
 <span style={{ color: excludeRoomRate ? '#172033' : '#94A3B8' }}>Exclude in Room Rate</span>
 </div>
 <div className={styles.checkboxItem} onClick={() => setOutsideTest(!outsideTest)} style={{ marginLeft: '16px' }}>
 {outsideTest ? <CheckSquare size={16} color="#2563EB" /> : <Square size={16} color="#94A3B8" />}
 <span style={{ color: outsideTest ? '#172033' : '#94A3B8' }}>Outside Test</span>
 </div>
 </div>

 {/* Row 4 */}
 <div className={styles.row}>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>LinkedTest :</label>
 <input type="text" className={`${styles.input} ${styles.inputLarge}`} />
 </div>
 <div className={styles.fieldGroup} style={{ marginLeft: 'auto' }}>
 <label className={styles.label} style={{ width: '60px' }}>Report :</label>
 <select className={`${styles.input} ${styles.inputMedium}`}>
 <option></option>
 </select>
 <select className={`${styles.input} ${styles.inputMedium}`}>
 <option>Both</option>
 </select>
 <select className={`${styles.input} ${styles.inputMedium}`}>
 <option>Report</option>
 </select>
 </div>
 </div>

 {/* Row 5 */}
 <div className={styles.row}>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Dr. Name :</label>
 <input type="text" className={`${styles.input} ${styles.inputLarge}`} />
 </div>
 <div className={styles.fieldGroup} style={{ marginLeft: '16px' }}>
 <label className={styles.label} style={{ width: '60px' }}>Range :</label>
 <input type="text" className={`${styles.input} ${styles.inputLarge}`} />
 </div>
 <div className={styles.fieldGroup} style={{ marginLeft: 'auto' }}>
 <label className={styles.label} style={{ width: '40px' }}>Unit :</label>
 <input type="text" className={`${styles.input} ${styles.inputMedium}`} />
 </div>
 </div>

 {/* Row 6 */}
 <div className={styles.row}>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Rate :</label>
 <input type="number" min="0" step="0.01" className={`${styles.input} ${styles.inputSmall} ${styles.inputYellow}`} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label} style={{ width: '110px' }}>Rate Changable :</label>
 <select className={`${styles.input} ${styles.inputSmall}`}>
 <option>Yes</option>
 <option>No</option>
 </select>
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label} style={{ width: '60px' }}>Landing :</label>
 <input type="text" className={`${styles.input} ${styles.inputSmall}`} />
 </div>
 <div className={styles.fieldGroup} style={{ marginLeft: '16px' }}>
 <label className={styles.label} style={{ width: '60px' }}>Field 1 :</label>
 <input type="text" className={`${styles.input} ${styles.inputMedium}`} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label} style={{ width: '70px' }}>Operator :</label>
 <select className={`${styles.input} ${styles.inputSmall}`}>
 <option>/</option>
 <option>*</option>
 <option>+</option>
 <option>-</option>
 </select>
 </div>
 <div className={styles.fieldGroup} style={{ marginLeft: 'auto' }}>
 <label className={styles.label} style={{ width: '60px' }}>Field 2 :</label>
 <input type="text" className={`${styles.input} ${styles.inputMedium}`} />
 </div>
 </div>

 {/* Row 7 */}
 <div className={styles.row}>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Dr OPD % :</label>
 <input type="text" className={`${styles.input} ${styles.inputSmall}`} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label} style={{ width: '80px' }}>Dr IPD % :</label>
 <input type="text" className={`${styles.input} ${styles.inputSmall}`} />
 </div>
 <div className={styles.fieldGroup} style={{ marginLeft: '16px' }}>
 <label className={styles.label} style={{ width: '140px' }}>Bio Head :</label>
 <input type="text" className={`${styles.input} ${styles.inputLarge}`} />
 </div>
 <div className={styles.fieldGroup} style={{ marginLeft: 'auto' }}>
 <label className={styles.label} style={{ width: '100px' }}>Head Priority :</label>
 <input type="text" className={`${styles.input} ${styles.inputSmall}`} />
 </div>
 </div>

 {/* Row 8 */}
 <div className={styles.row}>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Heading :</label>
 <input type="text" className={`${styles.input} ${styles.inputXLarge}`} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label} style={{ width: '70px' }}>Template :</label>
 <input type="text" className={`${styles.input} ${styles.inputLarge}`} />
 </div>
 <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
 <button className={styles.smallBtn}>N.R.</button>
 <button className={`${styles.smallBtn} ${styles.pinkBtn}`}>Profile</button>
 </div>
 </div>

 <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '8px 0' }} />

 {/* Table Data Entry & View */}
 <div className={styles.tableSection}>
 
 <div className={styles.entryRow}>
 <div className={styles.entryCol} style={{ width: '120px' }}>
 <span className={styles.entryLabel}>Para/Heading</span>
 <select className={`${styles.input} ${styles.entryInput}`}><option></option></select>
 </div>
 <div className={styles.entryCol} style={{ flex: 1 }}>
 <span className={styles.entryLabel}>Para.Name</span>
 <input type="text" className={styles.entryInput} />
 </div>
 <div className={styles.entryCol} style={{ width: '80px' }}>
 <span className={styles.entryLabel}>Unit</span>
 <input type="text" className={styles.entryInput} />
 </div>
 <div className={styles.entryCol} style={{ width: '100px' }}>
 <span className={styles.entryLabel}>Ref. Range</span>
 <input type="text" className={styles.entryInput} />
 </div>
 <div className={styles.entryCol} style={{ width: '100px' }}>
 <span className={styles.entryLabel}>To Range</span>
 <input type="text" className={styles.entryInput} />
 </div>
 <div className={styles.entryCol} style={{ width: '80px' }}>
 <span className={styles.entryLabel}>Method</span>
 <input type="text" className={styles.entryInput} />
 </div>
 <div className={styles.entryCol} style={{ width: '80px' }}>
 <span className={styles.entryLabel}>Note</span>
 <input type="text" className={styles.entryInput} />
 </div>
 <div className={styles.entryCol} style={{ width: '140px' }}>
 <span className={styles.entryLabel}>Autolist (0=Normal,1=BOLD)</span>
 <input type="text" className={styles.entryInput} />
 </div>
 <div className={styles.entryCol} style={{ width: '80px' }}>
 <span className={styles.entryLabel}>SMS Name</span>
 <input type="text" className={styles.entryInput} />
 </div>
 <div className={styles.entryCol} style={{ width: '80px' }}>
 <span className={styles.entryLabel}>Formula</span>
 <input type="text" className={styles.entryInput} />
 </div>
 <div className={styles.entryCol} style={{ width: '80px' }}>
 <span className={styles.entryLabel}>Round Off</span>
 <select className={`${styles.input} ${styles.entryInput}`}><option></option></select>
 </div>
 <div className={styles.entryCol} style={{ width: '40px' }}>
 <button className={styles.smallBtn} style={{ padding: '0', height: '14px', fontSize: '9px', lineHeight: '1' }}>Help</button>
 <button className={styles.smallBtn} style={{ padding: '0', height: '30px', marginTop: '4px' }}>
 <ArrowDownCircle size={16} />
 </button>
 </div>
 </div>

 <table className={styles.dataTable}>
 <thead>
 <tr>
 <th style={{ width: '20px' }}></th>
 <th>Para./Head</th>
 <th>Para. Name</th>
 <th>Unit</th>
 <th>Ref.Range</th>
 <th>To Range</th>
 <th>Method</th>
 <th>Note</th>
 <th>SMS</th>
 <th>Autolist</th>
 <th>Formula</th>
 <th>Round Off</th>
 </tr>
 </thead>
 <tbody>
                {/* Empty State / No Data */}
              </tbody>
 </table>
 </div>

 </div>

 {/* Form Notes */}
 <div className={styles.notesSection}>
 <label className={styles.label} style={{ width: '100px', marginTop: '8px' }}>Form Notes :</label>
 <textarea className={styles.textarea} maxLength={500}></textarea>
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
 <label className={styles.label} style={{ width: 'auto' }}>L</label>
 <input type="checkbox" style={{ margin: 0 }} />
 </div>

 <button className={styles.smallBtn} style={{ height: '36px', padding: '0 16px' }}>TP</button>

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

export default OPDChargesMaster;
