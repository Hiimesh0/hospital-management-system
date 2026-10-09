import React from 'react';
import { ChevronFirst, ChevronLeft, ChevronRight, ChevronLast, HelpCircle, Save, FileText, Plus } from 'lucide-react';
import styles from './OtEntry.module.css';

const OtEntry: React.FC = () => {
 return (
 <div className={styles.pageContainer}>
 
 <div className={styles.header}>
 <h1 className={styles.pageTitle}>Operation Theatre Entry</h1>
 </div>

 <div className={styles.content}>
 
 {/* Section 1: Patient Details */}
 <div className={styles.section}>
 <h2 className={styles.sectionHeading}>Patient Identity</h2>
 <div className={`${styles.gridRow} ${styles.patientGrid}`}>
 
 <div className={`${styles.fieldGroup} ${styles.col2}`}>
 <label className={styles.label}>UHID</label>
 <input type="text" className={styles.input} readOnly />
 </div>
 
 <div className={`${styles.fieldGroup} ${styles.col2}`}>
 <label className={styles.label}>Indoor No.</label>
 <input type="text" className={styles.input} readOnly />
 </div>

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

 <div className={`${styles.fieldGroup} ${styles.col2}`}>
 <label className={styles.label}>Age</label>
 <input type="number" min="0" max="150" className={styles.input} />
 </div>

 <div className={`${styles.fieldGroup} ${styles.col2}`}>
 <label className={styles.label}>Sex</label>
 <select className={styles.select}>
 <option value="Male">Male</option>
 <option value="Female">Female</option>
 <option value="Other">Other</option>
 </select>
 </div>

 </div>
 </div>

 {/* Section 2: Surgical Team */}
 <div className={styles.section}>
 <h2 className={styles.sectionHeading}>Surgical Team</h2>
 <div className={`${styles.gridRow} ${styles.teamGrid}`}>
 
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Incharge Doctor</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={styles.fieldGroup}>
 <label className={styles.label}>Surgeon 1 Name</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={styles.fieldGroup}>
 <label className={styles.label}>Surgeon 2 Name</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={styles.fieldGroup}>
 <label className={styles.label}>Assistant Name</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={styles.fieldGroup}>
 <label className={styles.label}>Anesthetist Name</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={styles.fieldGroup}>
 <label className={styles.label}>Anesthesia Type</label>
 <select className={styles.select}>
 <option value="-">-</option>
 <option value="GA">General (GA)</option>
 <option value="LA">Local (LA)</option>
 <option value="SA">Spinal (SA)</option>
 </select>
 </div>

 </div>
 </div>

 {/* Section 3: Operation Details */}
 <div className={styles.section}>
 <h2 className={styles.sectionHeading}>Operation Timing</h2>
 <div className={`${styles.gridRow} ${styles.timeGrid}`}>
 
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Date of Operation</label>
 <input type="date" className={styles.input} />
 </div>

 <div className={styles.fieldGroup}>
 <label className={styles.label}>From Time</label>
 <div className={styles.timeWrapper}>
 <input type="checkbox" defaultChecked />
 <input type="text" />
 </div>
 </div>

 <div className={styles.fieldGroup}>
 <label className={styles.label}>To Time</label>
 <div className={styles.timeWrapper}>
 <input type="checkbox" defaultChecked />
 <input type="text" />
 </div>
 </div>

 <div className={styles.fieldGroup}>
 <label className={styles.label}>Duration (Hr.)</label>
 <input type="text" className={styles.input} />
 </div>

 </div>
 </div>

 {/* Section 4: Clinical Notes */}
 <div className={styles.section}>
 <h2 className={styles.sectionHeading}>Clinical Notes</h2>
 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
 
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Diagnosis</label>
 <div className={styles.inputWithHelp}>
 <input type="text" className={styles.input} />
 <button className={styles.helpBtn} aria-label="Help"><HelpCircle size={16} /></button>
 </div>
 </div>

 <div className={styles.fieldGroup}>
 <label className={styles.label}>Surgery / Procedure</label>
 <div className={styles.inputWithHelp}>
 <input type="text" className={styles.input} />
 <button className={styles.helpBtn} aria-label="Help"><HelpCircle size={16} /></button>
 </div>
 </div>

 <div className={styles.fieldGroup}>
 <label className={styles.label}>Surgical Note</label>
 <div className={styles.inputWithHelp}>
 <textarea className={styles.textarea}></textarea>
 <button className={styles.helpBtn} style={{ top: '8px' }} aria-label="Help"><HelpCircle size={16} /></button>
 </div>
 </div>

 <div className={styles.fieldGroup}>
 <label className={styles.label}>Anesthesia Note</label>
 <div className={styles.inputWithHelp}>
 <textarea className={styles.textarea}></textarea>
 <button className={styles.helpBtn} style={{ top: '8px' }} aria-label="Help"><HelpCircle size={16} /></button>
 </div>
 </div>

 <div className={styles.fieldGroup}>
 <label className={styles.label}>Remark</label>
 <textarea className={styles.textarea}></textarea>
 </div>

 </div>
 </div>

 {/* Section 5: Nursing */}
 <div className={styles.section}>
 <h2 className={styles.sectionHeading}>Nursing Staff</h2>
 <div className={`${styles.gridRow} ${styles.nurseGrid}`}>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Scrub Nurse 1</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Scrub Nurse 2</label>
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
 </div>

 <div className={styles.actionGroup}>
 <button className={styles.secondaryBtn}>
 <Plus size={16} /> New OT Of This Pt.
 </button>
 <button className={styles.secondaryBtn}>
 <FileText size={16} /> Print
 </button>
 <button className={styles.tertiaryBtn}>
 Cancel
 </button>
 <button className={styles.primaryBtn}>
 <Save size={18} /> Save
 </button>
 </div>

 </div>

 </div>
 </div>
 );
};

export default OtEntry;
