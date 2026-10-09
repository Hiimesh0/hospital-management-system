import React, { useState } from 'react';
import { 
 ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
 Search, Save, LogOut, Edit2, CheckSquare, Square
} from 'lucide-react';
import styles from './DoctorMaster.module.css';

const DoctorMaster: React.FC = () => {
 const [status, setStatus] = useState('active');
 const [hospitalNameChecked, setHospitalNameChecked] = useState(false);
 const [print, setPrint] = useState(false);

 return (
 <div className={styles.pageContainer}>
 
 {/* Header */}
 <div className={styles.header}>
 <div className={styles.headerLeft}>
 <span className={styles.recordCounter}>195 of 195</span>
 <span className={styles.idBadge}>Dr ID: 195</span>
 <h1 className={styles.pageTitle}>Doctor Master</h1>
 </div>
 </div>

 {/* Form Container */}
 <div className={styles.formContainer}>
 
 {/* General Information Section */}
 <div className={styles.section}>
 <h2 className={styles.sectionTitle}>General Information</h2>
 
 {/* Row 1 */}
 <div className={styles.row}>
 <div className={styles.fieldGroup} style={{ flex: 1.5 }}>
 <label className={styles.label}>Dr Hos/Ref :</label>
 <select className={styles.input} style={{ backgroundColor: '#3B82F6', color: 'white', borderColor: '#2563EB' }}>
 <option>Reference Doctor</option>
 <option>Hospital Doctor</option>
 </select>
 </div>
 <div className={styles.fieldGroup} style={{ flex: 1.5 }}>
 <label className={styles.label}>Dr Type :</label>
 <select className={styles.input}>
 <option>Reference Doctor</option>
 </select>
 </div>
 <div className={styles.fieldGroup} style={{ flex: 1, justifyContent: 'flex-end' }}>
 <div className={styles.radioGroup}>
 <label className={styles.radioLabel}>
 <input 
 type="radio" 
 name="status" 
 checked={status === 'active'} 
 onChange={() => setStatus('active')} 
 /> Active
 </label>
 <label className={styles.radioLabel}>
 <input 
 type="radio" 
 name="status" 
 checked={status === 'inactive'} 
 onChange={() => setStatus('inactive')} 
 /> Inactive
 </label>
 </div>
 </div>
 </div>

 {/* Row 2 */}
 <div className={styles.row} style={{ alignItems: 'flex-start' }}>
 <div className={styles.col} style={{ flex: 2 }}>
 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Dr.Name :</label>
 <select className={styles.input} style={{ flex: '0 0 80px' }}>
 <option>Dr.</option>
 <option>Mr.</option>
 <option>Mrs.</option>
 </select>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.helperText}>Format : first middle last - degree</div>
 </div>
 </div>
 <div className={styles.col} style={{ flex: 1.5, justifyContent: 'center', paddingTop: '10px' }}>
 <div className={styles.checkboxItem} onClick={() => setHospitalNameChecked(!hospitalNameChecked)}>
 {hospitalNameChecked ? <CheckSquare size={16} color="#2563EB" /> : <Square size={16} color="#94A3B8" />}
 <span style={{ color: hospitalNameChecked ? '#172033' : '#94A3B8' }}>Hospital Name</span>
 </div>
 </div>
 <div className={styles.col} style={{ flex: 1 }}>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Degree :</label>
 <input type="text" className={styles.input} />
 </div>
 </div>
 </div>

 {/* Row 3 */}
 <div className={styles.row}>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label}>Speciality :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup} style={{ flex: 1.5 }}>
 <label className={styles.label}>Department :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label}>Dr. Reg No :</label>
 <input type="text" className={styles.input} />
 </div>
 </div>

 {/* Row 4 */}
 <div className={styles.row}>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label}>Birth Date :</label>
 <input type="date" className={styles.input}  max="2099-12-31" />
 </div>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label}>Wedding :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label}>PanNo :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label} style={{ width: '80px' }}>Adhar No :</label>
 <input type="text" className={styles.input} />
 </div>
 </div>

 {/* Row 5 */}
 <div className={styles.row}>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label}>Mobile No. :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label}>Ph.No.(R) :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup} style={{ flex: 2 }}>
 <label className={styles.label}>E-Mail :</label>
 <input type="text" className={styles.input} />
 </div>
 </div>
 </div>

 {/* Clinic Detail Section */}
 <div className={styles.section}>
 <h2 className={styles.sectionTitle}>Clinic Detail</h2>
 
 <div className={styles.row}>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label}>Clinic Name :</label>
 <input type="text" className={styles.input} />
 </div>
 </div>
 
 <div className={styles.row}>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label}>Address :</label>
 <input type="text" className={styles.input} />
 </div>
 </div>

 <div className={styles.row}>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label}>Area :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label}>City :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label}>Pin :</label>
 <input type="text" className={styles.input} />
 </div>
 </div>

 <div className={styles.row}>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label}>State :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label}>Country :</label>
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.fieldGroup} style={{ flex: 1 }}>
 <label className={styles.label}>Clinic Ph.No. :</label>
 <input type="text" className={styles.input} />
 </div>
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
 <div className={styles.printBtn} onClick={() => setPrint(!print)}>
 {print ? <CheckSquare size={18} color="#2563EB" /> : <Square size={18} />}
 <span>Print</span>
 </div>
 <button className={styles.secondaryBtn} style={{ marginLeft: '16px' }}>
 <Search size={18} /> Particular Search
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

export default DoctorMaster;
