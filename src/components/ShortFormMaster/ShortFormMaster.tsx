import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Search, Save, LogOut, Edit2, Trash2, Printer, Square, CheckSquare
} from 'lucide-react';
import styles from './ShortFormMaster.module.css';

const ShortFormMaster: React.FC = () => {
  const [shouldPrint, setShouldPrint] = useState(false);

  return (
    <div className={styles.pageContainer}>
      
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.badge}>438 Of 438</span>
        <h1 className={styles.pageTitle}>Short Form Master</h1>
      </div>

      {/* Form Container */}
      <div className={styles.formContainer}>
        
        <div className={styles.mainSection}>
          
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Shortname :</label>
            <input type="text" className={styles.input} defaultValue="fi" />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Description :</label>
            <textarea className={styles.textarea} defaultValue="Ficat and Arlat stage II"></textarea>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Other :</label>
            <input type="text" className={styles.input} />
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
          <div className={styles.checkboxItem} onClick={() => setShouldPrint(!shouldPrint)} style={{ marginRight: '8px' }}>
            {shouldPrint ? <CheckSquare size={18} color="#2563EB" /> : <Square size={18} color="#94A3B8" />}
          </div>
          <button className={styles.secondaryBtn}>
            <Printer size={16} /> Print
          </button>
          <button className={styles.secondaryBtn} style={{ marginLeft: '16px' }}>
            <Search size={16} /> {/* Binoculars */}
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

export default ShortFormMaster;
