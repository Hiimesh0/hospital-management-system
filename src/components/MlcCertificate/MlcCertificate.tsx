import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Search, Save, LogOut, Edit2, Trash2, Square, CheckSquare
} from 'lucide-react';
import styles from './MlcCertificate.module.css';

const MlcCertificate: React.FC = () => {
  const [isCheckedH, setIsCheckedH] = useState(false);
  const [isCheckedP, setIsCheckedP] = useState(false);

  return (
    <div className={styles.pageContainer}>
      
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>MEDICO LEGAL CERTIFICATE</h1>
      </div>

      {/* Form Container */}
      <div className={styles.formContainer}>
        
        <div className={styles.mainSection}>
          
          {/* Top Section */}
          <div className={styles.formSection}>
            <div className={styles.row}>
              <div className={`${styles.fieldGroup} ${styles.flex2}`}>
                <label className={styles.label}>CONSULTANT DOCTOR :</label>
                <input type="text" className={styles.input} />
              </div>
              <div className={`${styles.fieldGroup} ${styles.flex1}`}>
                <label className={styles.label} style={{ width: '80px' }}>MLC No. :</label>
                <input type="text" className={styles.input} />
              </div>
              <div className={`${styles.fieldGroup} ${styles.flex1}`}>
                <label className={styles.label} style={{ width: '100px' }}>Certificate No :</label>
                <input type="text" className={styles.input} />
              </div>
            </div>

            <div className={styles.row}>
              <div className={`${styles.fieldGroup} ${styles.flex1}`}>
                <div className={styles.radioGroup} style={{ marginLeft: '152px' }}>
                  <label className={styles.radioItem}><input type="radio" name="patientType" defaultChecked /> Indoor</label>
                  <label className={styles.radioItem}><input type="radio" name="patientType" /> OPD</label>
                </div>
              </div>
              <div className={`${styles.fieldGroup} ${styles.flex1}`}>
                <label className={styles.label} style={{ width: '80px' }}>IPDNo. :</label>
                <input type="text" className={styles.input} />
              </div>
              <div className={`${styles.fieldGroup} ${styles.flex1}`}>
                <label className={styles.label} style={{ width: '80px' }}>Patient ID :</label>
                <input type="text" className={styles.input} />
              </div>
              <div className={`${styles.fieldGroup} ${styles.flex1}`}>
                <label className={styles.label} style={{ width: '60px' }}>Date :</label>
                <input type="date" className={styles.input} defaultValue="2002-09-09" />
              </div>
            </div>

            <div className={styles.row}>
              <div className={`${styles.fieldGroup} ${styles.flex2}`}>
                <label className={styles.label}>Name :</label>
                <input type="text" className={styles.input} />
              </div>
              <div className={`${styles.fieldGroup} ${styles.flex1}`}>
                <label className={styles.label} style={{ width: '80px' }}>Age :</label>
                <input type="text" className={styles.input} />
              </div>
              <div className={`${styles.fieldGroup} ${styles.flex1}`}>
                <label className={styles.label} style={{ width: '60px' }}>Sex :</label>
                <select className={styles.select}>
                  <option></option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Address :</label>
                <textarea className={styles.textarea}></textarea>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>DOA :</label>
                <input type="date" className={styles.input} defaultValue="2002-06-22" />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ width: '60px' }}>TOA :</label>
                <input type="time" className={styles.input} defaultValue="00:00" />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ width: '60px' }}>DOD :</label>
                <input type="date" className={styles.input} defaultValue="2002-06-22" />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ width: '60px' }}>TOD :</label>
                <input type="time" className={styles.input} defaultValue="00:00" />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ width: '60px' }}>GCS :</label>
                <input type="text" className={styles.input} />
              </div>
            </div>
          </div>

          <div className={styles.sectionDivider}></div>

          {/* Bottom Section */}
          <div className={styles.formSection}>
            <div className={styles.sectionTitle}>Accident / Assault Details :</div>
            
            <div className={styles.row}>
              <div className={`${styles.fieldGroup} ${styles.flex1}`}>
                <label className={styles.label}>Date :</label>
                <input type="date" className={styles.input} defaultValue="2003-03-06" />
              </div>
              <div className={`${styles.fieldGroup} ${styles.flex1}`}>
                <label className={styles.label}>Time :</label>
                <input type="time" className={styles.input} defaultValue="00:00" />
              </div>
              <div className={`${styles.fieldGroup} ${styles.flex2}`}>
                <label className={styles.label}>Place :</label>
                <input type="text" className={styles.input} />
              </div>
            </div>

            <div className={styles.row}>
              <div className={`${styles.fieldGroup} ${styles.flex1}`}>
                <label className={styles.label}>Examination Date :</label>
                <input type="date" className={styles.input} defaultValue="2003-03-06" />
              </div>
              <div className={`${styles.fieldGroup} ${styles.flex1}`}>
                <label className={styles.label}>Examination Time :</label>
                <input type="time" className={styles.input} defaultValue="00:00" />
              </div>
              <div className={`${styles.fieldGroup} ${styles.flex2}`}>
                <label className={styles.label}>Identification Marks :</label>
                <input type="text" className={styles.input} />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.colFlex}>
                <div className={styles.row}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Type Of Injury :</label>
                    <input type="text" className={styles.input} />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Cause Of Injury :</label>
                    <input type="text" className={styles.input} />
                  </div>
                </div>
                <div className={styles.row} style={{ flex: 1 }}>
                  <div className={styles.fieldGroup} style={{ alignItems: 'flex-start' }}>
                    <label className={styles.label}>HISTORY :</label>
                    <textarea className={`${styles.textarea} ${styles.textareaLarge}`} style={{ height: '100%' }}></textarea>
                  </div>
                </div>
              </div>
              
              <div className={styles.colFlex}>
                <div className={styles.row}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Age Of Injury :</label>
                    <input type="text" className={styles.input} />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Diagnosis :</label>
                    <input type="text" className={styles.input} />
                  </div>
                </div>
                <div className={styles.row} style={{ flex: 1 }}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Out Come :</label>
                    <input type="text" className={styles.input} />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Investigation :</label>
                <textarea className={styles.textarea}></textarea>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Treatment Given :</label>
                <textarea className={styles.textarea}></textarea>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>FINDINGS :</label>
                <textarea className={styles.textarea}></textarea>
              </div>
            </div>

            <div className={styles.sectionDivider}></div>

            {/* Police Details */}
            <div className={styles.row}>
              <div className={`${styles.fieldGroup} ${styles.flex1}`}>
                <label className={styles.labelVertical}>CERTIFICATE RECEIVER</label>
                <input type="text" className={styles.input} />
              </div>
              <div className={`${styles.fieldGroup} ${styles.flex1}`}>
                <label className={styles.labelVertical}>POLICE STATION :</label>
                <input type="text" className={styles.input} />
              </div>
            </div>

            <div className={styles.row}>
              <div className={`${styles.fieldGroup} ${styles.flex2}`}>
                <label className={styles.labelVertical}>POLICE MAN NAME :</label>
                <input type="text" className={styles.input} />
              </div>
              <div className={`${styles.fieldGroup} ${styles.flex1}`}>
                <label className={styles.labelVertical}>B. NO</label>
                <input type="text" className={styles.input} />
              </div>
              <div className={`${styles.fieldGroup} ${styles.flex1}`}>
                <label className={styles.labelVertical}>DATE :</label>
                <input type="date" className={styles.input} defaultValue="2002-06-22" />
              </div>
              <div className={`${styles.fieldGroup} ${styles.flex1}`}>
                <label className={styles.labelVertical}>TIME :</label>
                <input type="time" className={styles.input} defaultValue="00:00" />
              </div>
            </div>

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
          <div className={styles.checkboxItem} onClick={() => setIsCheckedH(!isCheckedH)}>
            {isCheckedH ? <CheckSquare size={18} color="#2563EB" /> : <Square size={18} color="#94A3B8" />}
            H
          </div>
          
          <button className={styles.secondaryBtn}>
            Print
          </button>
          
          <div className={styles.checkboxItem} onClick={() => setIsCheckedP(!isCheckedP)}>
            {isCheckedP ? <CheckSquare size={18} color="#2563EB" /> : <Square size={18} color="#94A3B8" />}
            P
          </div>
          
          <button className={styles.secondaryBtn}>
            <Search size={16} /> Search
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

export default MlcCertificate;
