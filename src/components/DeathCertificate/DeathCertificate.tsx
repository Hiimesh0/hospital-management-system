import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Search, Save, LogOut, Edit2, Trash2, Printer, Square, CheckSquare
} from 'lucide-react';
import styles from './DeathCertificate.module.css';

const DeathCertificate: React.FC = () => {
  const [shouldPrint, setShouldPrint] = useState(true);
  const [isCheckedH, setIsCheckedH] = useState(false);

  return (
    <div className={styles.pageContainer}>
      
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Death Certificate</h1>
      </div>

      {/* Form Container */}
      <div className={styles.formContainer}>
        
        <div className={styles.mainSection}>
          
          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Name :</label>
              <div className={styles.nameWrapper}>
                <input type="text" className={`${styles.input} ${styles.inputYellow}`} />
                <input type="text" className={`${styles.input} ${styles.smallInput}`} />
              </div>
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Age :</label>
              <input type="text" className={styles.input} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Sex :</label>
              <input type="text" className={styles.input} />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Address :</label>
              <textarea className={styles.textarea}></textarea>
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Date Of Admission :</label>
              <input type="date" className={styles.input} defaultValue="2003-07-16" />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Time :</label>
              <input type="time" className={styles.input} defaultValue="00:00" />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Date Of Death :</label>
              <input type="date" className={styles.input} defaultValue="2003-07-16" />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Time :</label>
              <input type="time" className={styles.input} defaultValue="00:00" />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup} style={{ flex: 1.5 }}>
              <label className={styles.label}>Doctor Incharge :</label>
              <input type="text" className={styles.input} />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Manner Of Death :</label>
              <select className={styles.select}>
                <option></option>
                <option>Natural</option>
                <option>Accident</option>
                <option>Suicide</option>
                <option>Homicide</option>
                <option>Pending Investigation</option>
                <option>Could not be determined</option>
              </select>
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Cause Of Death :</label>
              <textarea className={`${styles.textarea} ${styles.textareaLarge}`}></textarea>
            </div>
          </div>

          <div className={styles.fieldRow} style={{ justifyContent: 'center', marginTop: '16px' }}>
            <div className={styles.fieldGroup} style={{ flex: 'none' }}>
              <label className={styles.labelLong}>If The Deceased Was Female, Was Pregnancy The Death Associated With</label>
              <select className={styles.select} style={{ width: '120px', marginLeft: '12px' }}>
                <option></option>
                <option>Yes</option>
                <option>No</option>
                <option>Unknown</option>
              </select>
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
          
          <div className={styles.checkboxItem} onClick={() => setShouldPrint(!shouldPrint)}>
            {shouldPrint ? <CheckSquare size={18} color="#2563EB" /> : <Square size={18} color="#94A3B8" />}
            Print
          </div>
          
          <button className={styles.secondaryBtn}>
            <Search size={16} /> Particular Search
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

export default DeathCertificate;
