import React from 'react';
import styles from './PatientRegistration.module.css';

const PatientRegistration: React.FC = () => {
 return (
 <div className={styles.container}>
 <header className={styles.header}>
 <div>
 <h1 className={styles.title}>Patient Registration</h1>
 <p className={styles.subtitle}>Register and manage patient information</p>
 </div>
 <div className={styles.metaInfo}>
 <span className={styles.badge}>Record: 0 of 0</span>
 <span className={styles.badge}>Reg: --</span>
 </div>
 </header>

 {/* Primary Identity Section */}
 <section className={styles.section}>
 <h2 className={styles.sectionTitle}>Primary Identity</h2>
 <div className={styles.formGrid}>
 
 <div className={`${styles.formGroup} ${styles.colSpan2}`}>
 <label className={styles.label}>UHID</label>
 <input type="text" className={styles.input} readOnly />
 </div>
 
 <div className={`${styles.formGroup} ${styles.colSpan2}`}>
 <label className={`${styles.label} ${styles.required}`}>Category</label>
 <select className={styles.select} required>
 <option>NEW</option>
 <option>OLD</option>
 </select>
 </div>

 <div className={`${styles.formGroup} ${styles.colSpan3}`}>
 <label className={`${styles.label} ${styles.required}`}>First Name</label>
 <input type="text" className={styles.input}  required />
 </div>

 <div className={`${styles.formGroup} ${styles.colSpan2}`}>
 <label className={styles.label}>Middle Name</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={`${styles.formGroup} ${styles.colSpan3}`}>
 <label className={styles.label}>Last Name</label>
 <input type="text" className={styles.input} />
 </div>

 <div className={`${styles.formGroup} ${styles.colSpan3}`}>
 <label className={styles.label}>Birth Date</label>
 <input type="date" className={styles.input}  max="2099-12-31" />
 </div>

 <div className={`${styles.formGroup} ${styles.colSpan3}`}>
 <label className={`${styles.label} ${styles.required}`}>Age</label>
 <div className={styles.inputGroup}>
 <input type="number" className={styles.input} style={{ flex: 1 }}  required />
 <select className={styles.select} style={{ flex: 1, minWidth: '90px' }}>
 <option>Days</option>
 <option>Months</option>
 <option>Years</option>
 </select>
 </div>
 </div>

 <div className={`${styles.formGroup} ${styles.colSpan3}`}>
 <label className={styles.label}>Sex</label>
 <select className={styles.select}>
 <option>Male</option>
 <option>Female</option>
 <option>Other</option>
 </select>
 </div>

 <div className={`${styles.formGroup} ${styles.colSpan3}`}>
 <label className={styles.label}>Photograph</label>
 <div className={styles.inputGroup} style={{ alignItems: 'center' }}>
 <button type="button" className={`${styles.btn} ${styles.btnSecondary}`}>Select Picture</button>
 <label className={styles.checkboxGroup}>
 <input type="checkbox" className={styles.checkbox} />
 <span style={{ fontSize: '0.85rem' }}>Clear</span>
 </label>
 </div>
 </div>

 </div>
 </section>

 {/* Demographics & Clinical */}
 <section className={styles.section}>
 <h2 className={styles.sectionTitle}>Demographics & Clinical</h2>
 <div className={styles.formGrid}>
 
 <div className={`${styles.formGroup} ${styles.colSpan4}`}>
 <label className={`${styles.label} ${styles.required}`}>Hospital Doctor</label>
 <div className={styles.inputGroup}>
 <input type="text" className={styles.input}  required />
 <button className={`${styles.btn} ${styles.btnSecondary}`}>Change</button>
 </div>
 </div>

 <div className={`${styles.formGroup} ${styles.colSpan4}`}>
 <label className={styles.label}>Reference By</label>
 <div className={styles.inputGroup}>
 <input type="text" className={styles.input} />
 <button className={`${styles.btn} ${styles.btnSecondary}`}>Search</button>
 </div>
 </div>
 
 <div className={`${styles.formGroup} ${styles.colSpan4}`}></div>

 <div className={`${styles.formGroup} ${styles.colSpan3}`}>
 <label className={styles.label}>Language</label>
 <select className={styles.select}>
 <option>Gujarati</option>
 <option>English</option>
 <option>Hindi</option>
 </select>
 </div>

 <div className={`${styles.formGroup} ${styles.colSpan3}`}>
 <label className={styles.label}>Religion</label>
 <select className={styles.select}>
 <option>Hindu</option>
 <option>Muslim</option>
 <option>Christian</option>
 </select>
 </div>

 <div className={`${styles.formGroup} ${styles.colSpan3}`}>
 <label className={styles.label}>Marital Status</label>
 <select className={styles.select}>
 <option value="">Select...</option>
 <option>Married</option>
 <option>Single</option>
 </select>
 </div>

 <div className={`${styles.formGroup} ${styles.colSpan3}`}>
 <label className={styles.label}>Wedding Date</label>
 <input type="date" className={styles.input}  max="2099-12-31" />
 </div>

 <div className={`${styles.formGroup} ${styles.colSpan3}`}>
 <label className={styles.label}>Weight (kg)</label>
 <input type="number" className={styles.input} />
 </div>

 <div className={`${styles.formGroup} ${styles.colSpan3}`}>
 <label className={styles.label}>Height (cm)</label>
 <input type="number" className={styles.input} />
 </div>

 </div>
 </section>

 {/* Communication & Address */}
 <div className={styles.formGrid}>
 
 <div className={`${styles.colSpan6} ${styles.splitSectionLeft}`}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
 <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Communication</h2>
 <label className={styles.checkboxGroup}>
 <input type="checkbox" className={styles.checkbox} defaultChecked />
 <span style={{ fontSize: '0.85rem' }}>Auto SMS</span>
 </label>
 </div>
 <div className={styles.formGrid}>
 <div className={`${styles.formGroup} ${styles.colSpan12}`}>
 <label className={`${styles.label} ${styles.required}`}>Mobile</label>
 <input type="tel" className={styles.input}  pattern="[0-9]{10,15}" title="Please enter a valid mobile number"  required />
 </div>
 <div className={`${styles.formGroup} ${styles.colSpan12}`}>
 <label className={styles.label}>Email</label>
 <input type="email" className={styles.input}  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="Please enter a valid email address" />
 </div>
 </div>
 </div>

 <div className={`${styles.colSpan6} ${styles.splitSectionRight}`}>
 <h2 className={styles.sectionTitle}>Address Details</h2>
 <div className={styles.formGrid}>
 <div className={`${styles.formGroup} ${styles.colSpan12}`}>
 <label className={styles.label}>Street Address</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={`${styles.formGroup} ${styles.colSpan6}`}>
 <label className={styles.label}>City</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={`${styles.formGroup} ${styles.colSpan6}`}>
 <label className={styles.label}>State</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={`${styles.formGroup} ${styles.colSpan6}`}>
 <label className={styles.label}>Pin Code</label>
 <input type="text" className={styles.input} />
 </div>
 </div>
 </div>

 </div>

 <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2.5rem 0' }} />

 {/* Other Details */}
 <section className={styles.section} style={{ marginBottom: 0 }}>
 <h2 className={styles.sectionTitle}>Other Details</h2>
 <div className={styles.formGrid}>
 <div className={`${styles.formGroup} ${styles.colSpan3}`}>
 <label className={styles.label}>Estimate</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={`${styles.formGroup} ${styles.colSpan3}`}>
 <label className={styles.label}>Aadhar No</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={`${styles.formGroup} ${styles.colSpan3}`}>
 <label className={styles.label}>Pan No</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={`${styles.formGroup} ${styles.colSpan3}`}>
 <label className={styles.label}>Mediclaim</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={`${styles.formGroup} ${styles.colSpan3}`}>
 <label className={styles.label}>Membership Id</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={`${styles.formGroup} ${styles.colSpan3}`}>
 <label className={styles.label}>Employee Id</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={`${styles.formGroup} ${styles.colSpan3}`}>
 <label className={styles.label}>Occupation</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={`${styles.formGroup} ${styles.colSpan3}`}>
 <label className={styles.label}>Spouse Occupation</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={`${styles.formGroup} ${styles.colSpan4}`}>
 <label className={styles.label}>Company Name</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={`${styles.formGroup} ${styles.colSpan4}`}>
 <label className={styles.label}>Education</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={`${styles.formGroup} ${styles.colSpan4}`}>
 <label className={styles.label}>Remark</label>
 <input type="text" className={styles.input} />
 </div>
 </div>
 </section>

 {/* Action Bar */}
 <div className={styles.actions}>
 <button type="button" className={`${styles.btn} ${styles.btnSecondary}`}>Exit</button>
 <button type="button" className={`${styles.btn} ${styles.btnSecondary}`}>Search Patient</button>
 <button type="button" className={`${styles.btn} ${styles.btnSecondary}`}>Update</button>
 <button type="button" className={`${styles.btn} ${styles.btnPrimary}`}>Add Patient</button>
 </div>

 </div>
 );
};

export default PatientRegistration;

