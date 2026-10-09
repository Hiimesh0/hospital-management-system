import React from 'react';
import { ChevronFirst, ChevronLeft, ChevronRight, ChevronLast, Save, Trash2, Printer, X, FileText, UserCircle } from 'lucide-react';
import styles from './IndoorRegister.module.css';

const IndoorRegister: React.FC = () => {
 return (
 <div className={styles.pageContainer}>
 
 {/* Header */}
 <div className={styles.header}>
 <div className={styles.headerLeft}>
 <span className={styles.recordCount}>204 of 204</span>
 <span className={styles.userBadge}>Demo User</span>
 </div>

 <h1 className={styles.pageTitle}>Indoor Register</h1>

 <div className={styles.headerRight}>
 <div className={styles.headerField}>
 <label className={styles.label}>Prefix:</label>
 <select className={styles.select}>
 <option value="GEN">GEN</option>
 </select>
 </div>
 <div className={styles.headerField}>
 <label className={styles.label}>IPD No:</label>
 <input type="text" className={styles.input} />
 </div>
 </div>
 </div>

 <div className={styles.content}>
 
 {/* Section 1: Admission Details */}
 <div className={styles.section}>
 <h2 className={styles.sectionTitle}>Admission Details</h2>
 <div className={`${styles.grid} ${styles.grid12}`}>
 
 <div className={`${styles.fieldGroup} ${styles.col4}`}>
 <label className={styles.label}>Bed No</label>
 <div className={styles.inputWithAction}>
 <input type="text" className={styles.input} />
 <button className={styles.inlineBtn}>Bed</button>
 <select className={styles.select} style={{ width: '80px' }}></select>
 </div>
 </div>

 <div className={`${styles.fieldGroup} ${styles.col4}`}>
 <label className={styles.label}>Room Charge As</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={`${styles.fieldGroup} ${styles.col2}`}>
 <label className={styles.label}>DOA</label>
 <input type="date" className={styles.input} />
 </div>

 <div className={`${styles.fieldGroup} ${styles.col2}`}>
 <label className={styles.label}>Time</label>
 <input type="time" className={styles.input} />
 </div>

 </div>
 </div>

 {/* Section 2: Patient Identity */}
 <div className={styles.section}>
 <h2 className={styles.sectionTitle}>Patient Identity</h2>
 <div className={`${styles.grid} ${styles.grid12}`}>
 
 <div className={`${styles.fieldGroup} ${styles.col3}`}>
 <label className={styles.label}>First Name</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={`${styles.fieldGroup} ${styles.col3}`}>
 <label className={styles.label}>Middle Name</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={`${styles.fieldGroup} ${styles.col3}`}>
 <label className={styles.label}>Last Name</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={`${styles.fieldGroup} ${styles.col1}`}>
 <label className={styles.label}>&nbsp;</label>
 <button className={styles.primaryInlineBtn} style={{width: '100%'}}>Registration</button>
 </div>

 <div className={`${styles.fieldGroup} ${styles.col2}`}>
 <label className={styles.label}>UHID</label>
 <input type="text" className={styles.input} />
 </div>

 {/* Sub-row */}
 <div className={`${styles.fieldGroup} ${styles.col2}`}>
 <label className={styles.label}>Marital Status</label>
 <select className={styles.select}></select>
 </div>
 
 <div className={`${styles.fieldGroup} ${styles.col3}`}>
 <label className={styles.label}>Birth Date</label>
 <input type="date" className={styles.input} />
 </div>

 <div className={`${styles.fieldGroup} ${styles.col3}`}>
 <label className={styles.label}>Age</label>
 <div className={styles.inputWithAction}>
 <input type="number" min="0" max="150" className={styles.input} />
 <select className={styles.select} style={{ width: '80px' }}></select>
 </div>
 </div>

 <div className={`${styles.fieldGroup} ${styles.col2}`}>
 <label className={styles.label}>Wt.</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={`${styles.fieldGroup} ${styles.col2}`}>
 <label className={styles.label}>Sex</label>
 <select className={styles.select}>
 <option value="Male">Male</option>
 <option value="Female">Female</option>
 </select>
 </div>

 </div>
 </div>

 {/* Section 3: Address & Referrals */}
 <div className={styles.section}>
 <div className={`${styles.grid} ${styles.grid12}`}>
 
 <div className={`${styles.fieldGroup} ${styles.col6}`}>
 <label className={styles.label}>Address</label>
 <textarea className={styles.textarea}></textarea>
 </div>

 <div className={`${styles.fieldGroup} ${styles.col6}`} style={{ justifyContent: 'space-between' }}>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Ref Dr</label>
 <div className={styles.inputWithAction}>
 <input type="text" className={styles.input} />
 <button className={styles.inlineBtn}>Change</button>
 </div>
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Ref To Dr</label>
 <input type="text" className={styles.input} />
 </div>
 </div>

 </div>
 </div>

 {/* Section 4: Communication No */}
 <div className={styles.section}>
 <h2 className={styles.sectionTitle}>Communication No.</h2>
 <div className={`${styles.grid} ${styles.grid12}`}>
 <div className={`${styles.fieldGroup} ${styles.col2}`}>
 <label className={styles.label}>Residence</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={`${styles.fieldGroup} ${styles.col2}`}>
 <label className={styles.label}>Office</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={`${styles.fieldGroup} ${styles.col3}`}>
 <label className={styles.label}>Mobile</label>
 <input type="tel" className={styles.input} />
 </div>
 <div className={`${styles.fieldGroup} ${styles.col2}`}>
 <label className={styles.label}>Other</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={`${styles.fieldGroup} ${styles.col3}`}>
 <label className={styles.label}>E-mail</label>
 <input type="text" className={styles.input} />
 </div>
 </div>
 </div>

 {/* Section 5: Care & Insurance */}
 <div className={styles.section}>
 <h2 className={styles.sectionTitle}>Care & Insurance</h2>
 <div className={`${styles.grid} ${styles.grid12}`}>
 
 <div className={`${styles.fieldGroup} ${styles.col6}`}>
 <label className={styles.label}>Under Care Dr</label>
 <div className={styles.inputWithAction}>
 <input type="text" className={styles.input} />
 <button className={styles.inlineBtn}>Change</button>
 </div>
 </div>

 <div className={`${styles.fieldGroup} ${styles.col6}`} style={{ justifyContent: 'flex-end', paddingBottom: '4px' }}>
 <div className={styles.inputWithAction} style={{ justifyContent: 'space-between' }}>
 <label className={`${styles.checkboxLabel} ${styles.insuranceText}`}>
 <input type="checkbox" /> CashLess Company/Patient Company/MA Yojana
 </label>
 <button className={styles.inlineBtn}>Change</button>
 </div>
 </div>

 <div className={`${styles.fieldGroup} ${styles.col3}`}>
 <label className={`${styles.label} ${styles.insuranceText}`}>MediClaim (Reimbursement)</label>
 <div style={{height: '38px'}}></div> {/* Spacer to align with inputs */}
 </div>

 <div className={`${styles.fieldGroup} ${styles.col5}`}>
 <label className={styles.label}>Company Name</label>
 <div className={styles.inputWithAction}>
 <input type="checkbox" defaultChecked />
 <input type="text" className={styles.input} />
 </div>
 </div>

 <div className={`${styles.fieldGroup} ${styles.col4}`}>
 <label className={styles.label}>Policy No</label>
 <input type="text" className={styles.input} />
 </div>

 </div>
 </div>

 {/* Section 6: MLC Details */}
 <div className={styles.section}>
 <div className={`${styles.grid} ${styles.grid12}`}>
 
 <div className={`${styles.fieldGroup} ${styles.col2}`}>
 <label className={styles.checkboxLabel}>
 <input type="checkbox" defaultChecked /> <span className={styles.insuranceText}>MLC</span>
 </label>
 <input type="date" className={styles.input} />
 </div>

 <div className={`${styles.fieldGroup} ${styles.col3}`}>
 <label className={styles.label}>Police St. Name</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={`${styles.fieldGroup} ${styles.col2}`}>
 <label className={styles.label}>Phone No</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={`${styles.fieldGroup} ${styles.col2}`}>
 <label className={styles.label}>Police Name</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={`${styles.fieldGroup} ${styles.col1}`}>
 <label className={styles.label}>Belt No</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={`${styles.fieldGroup} ${styles.col2}`}>
 <label className={styles.label}>MLC No</label>
 <input type="text" className={styles.input} />
 </div>

 </div>
 </div>

 {/* Section 7: Clinical Notes */}
 <div className={styles.section}>
 <div className={`${styles.grid} ${styles.grid12}`}>
 
 <div className={`${styles.fieldGroup} ${styles.col6}`}>
 <label className={styles.label}>Diagnosis</label>
 <input type="text" className={styles.input} />
 </div>
 
 <div className={`${styles.fieldGroup} ${styles.col6}`}>
 <label className={styles.label}>Package</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={`${styles.fieldGroup} ${styles.col3}`}>
 <label className={styles.label}>Date Of Surgery</label>
 <div className={styles.inputWithAction}>
 <input type="checkbox" />
 <input type="text" className={styles.input} />
 </div>
 </div>

 <div className={`${styles.fieldGroup} ${styles.col9}`}>
 <label className={styles.label}>Surgery/Procedure</label>
 <div className={styles.inputWithAction}>
 <input type="text" className={styles.input} />
 <button className={styles.inlineBtn}>Other</button>
 </div>
 </div>

 <div className={`${styles.fieldGroup} ${styles.col4}`}>
 <label className={styles.label}>Remarks</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={`${styles.fieldGroup} ${styles.col4}`}>
 <label className={styles.label}>Diet</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={`${styles.fieldGroup} ${styles.col4}`}>
 <label className={styles.label}>Notes</label>
 <input type="text" className={styles.input} />
 </div>

 </div>
 </div>


 {/* Action Bar */}
 <div className={styles.actionBar}>
 
 <div className={styles.navGroup}>
 <button className={styles.navBtn} aria-label="First Record"><ChevronFirst size={18} /></button>
 <button className={styles.navBtn} aria-label="Previous Record"><ChevronLeft size={18} /></button>
 <button className={styles.navBtn} aria-label="Next Record"><ChevronRight size={18} /></button>
 <button className={styles.navBtn} aria-label="Last Record"><ChevronLast size={18} /></button>
 
 <select className={styles.select} style={{ width: '64px', marginLeft: '8px' }}>
 <option value="24">24</option>
 </select>
 </div>

 <div className={styles.utilsGroup}>
 <button className={styles.secondaryBtn}>Multi Sticker</button>
 
 <div className={styles.fieldGroupHorizontal} style={{ border: '1px solid #DDE3EA', borderRadius: '6px', padding: '0 8px', height: '38px' }}>
 <button className={styles.tertiaryBtn} style={{ padding: '0' }} disabled>Print</button>
 <label className={styles.checkboxLabel} style={{ height: 'auto' }}><input type="checkbox" defaultChecked /> P</label>
 <label className={styles.checkboxLabel} style={{ height: 'auto' }}><input type="checkbox" /> L</label>
 </div>

 <button className={styles.secondaryBtn}><FileText size={16} /> Folder</button>
 <button className={styles.secondaryBtn}><UserCircle size={16} /> Gate Pass</button>
 <label className={styles.checkboxLabel} style={{ border: '1px solid #DDE3EA', borderRadius: '6px', padding: '0 12px' }}>
 <input type="checkbox" /> Sticker
 </label>
 </div>

 <div className={styles.actionGroup}>
 <button className={styles.primaryBtn}>
 <Save size={18} /> Save
 </button>
 <button className={styles.secondaryBtn} disabled>Update</button>
 <button className={styles.secondaryBtn} disabled>
 <Trash2 size={16} /> Delete
 </button>
 <button className={styles.tertiaryBtn}>Cancel</button>
 </div>

 </div>

 </div>
 </div>
 );
};

export default IndoorRegister;
