import React from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Search, Printer, Save, Edit2, Trash2, LogOut
} from 'lucide-react';
import styles from './MedicineMaster.module.css';

const MedicineMaster: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      
      {/* Header */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className={styles.recordCounter}>15464 of 15464</span>
          <h1 className={styles.pageTitle}>Medicine Master</h1>
        </div>
      </div>

      <div className={styles.mainGrid}>
        
        {/* Left Form */}
        <div className={styles.formSection}>
          <div className={styles.formRow}>
            <label className={styles.label}>Brand Name :</label>
            <input 
              type="text" 
              className={`${styles.input} ${styles.highlightInput}`} 
              defaultValue="Zzzvicryl 1 Nw2347"
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>Frequency :</label>
            <input type="text" className={styles.input} defaultValue="--" />
            
            <label className={styles.label} style={{ width: '90px' }}>Avaliability :</label>
            <input type="text" className={styles.input} defaultValue="-" style={{ maxWidth: '100px' }} />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>Remark 1 :</label>
            <input type="text" className={styles.input} defaultValue="--" />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>Remark 2 :</label>
            <input type="text" className={styles.input} />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>Total Days :</label>
            <input type="text" className={`${styles.input} ${styles.shortInput}`} defaultValue="0" />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>Notes :</label>
            <input type="text" className={styles.input} />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>For :</label>
            <select className={`${styles.input} ${styles.shortInput}`}>
              <option>Both</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}></label>
            <div className={styles.radioGroup}>
              <label className={styles.radioItem}>
                <input type="radio" name="status" defaultChecked /> Active
              </label>
              <label className={styles.radioItem}>
                <input type="radio" name="status" /> Inactive
              </label>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className={styles.rightSection}>
          <div className={styles.formRow}>
            <label className={styles.label} style={{ width: '120px' }}>Medicine Group :</label>
            <input type="text" className={styles.input} />
          </div>
          <div className={styles.formRow}>
            <label className={styles.label} style={{ width: '120px' }}>Generic Name :</label>
            <input type="text" className={styles.input} />
          </div>
          <textarea className={styles.largeDisplayBox} readOnly></textarea>
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

        <div className={styles.rightActions}>
          <button className={styles.secondaryBtn}>
            <Search size={18} /> Particular Search
          </button>
          <button className={styles.secondaryBtn}>
            <Printer size={18} /> Print
          </button>
          <button className={styles.primaryBtn}>
            <Save size={18} /> Add
          </button>
          <button className={styles.secondaryBtn}>
            <Edit2 size={18} /> Update
          </button>
          <button className={styles.dangerBtn}>
            <Trash2 size={18} /> Delete
          </button>
          <button className={styles.secondaryBtn} style={{ marginLeft: '16px' }}>
            <LogOut size={18} /> Exit
          </button>
        </div>
      </div>

    </div>
  );
};

export default MedicineMaster;
