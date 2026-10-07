import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Search, Save, LogOut, CheckSquare, Square
} from 'lucide-react';
import styles from './VisitProcedureHeaderMaster.module.css';

const VisitProcedureHeaderMaster: React.FC = () => {
  const [notCalcService, setNotCalcService] = useState(false);
  const [notCalcUnderCare, setNotCalcUnderCare] = useState(false);
  const [isPackage, setIsPackage] = useState(false);
  const [notCalcInRef, setNotCalcInRef] = useState(false);

  return (
    <div className={styles.pageContainer}>
      
      {/* Header */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className={styles.recordCounter}>2 of 2</span>
          <h1 className={styles.pageTitle}>Visit Procedure Header Master</h1>
        </div>
      </div>

      {/* Form Container */}
      <div className={styles.formContainer}>
        
        {/* Top Info Section */}
        <div className={styles.topSection}>
          
          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 1, maxWidth: '400px' }}>
              <label className={styles.label}>Header For :</label>
              <select className={styles.input} style={{ backgroundColor: '#3B82F6', color: '#FFFFFF', border: 'none' }}>
                <option>Visiting Charge</option>
                <option>Other Charge</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Header Name :</label>
              <input type="text" className={styles.input} defaultValue="Visiting Charge" />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Description :</label>
              <input type="text" className={styles.input} defaultValue="-" />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ width: '380px' }}>
              <label className={styles.label}>Priority :</label>
              <input type="text" className={styles.input} defaultValue="20" />
            </div>
            
            <div className={styles.statusGroup}>
              <label className={styles.label} style={{ width: 'auto', marginRight: '8px' }}>Status :</label>
              <label className={styles.radioLabel}>
                <input type="radio" name="status" defaultChecked /> Active
              </label>
              <label className={styles.radioLabel} style={{ marginLeft: '12px', color: '#94A3B8' }}>
                <input type="radio" name="status" disabled /> Inactive
              </label>
            </div>
          </div>

          <div className={styles.checkboxGrid}>
            <div className={styles.checkboxItem} onClick={() => setNotCalcService(!notCalcService)}>
              {notCalcService ? <CheckSquare size={18} color="#2563EB" /> : <Square size={18} />}
              <span>Not Calculate Service Charge</span>
            </div>
            <div className={styles.checkboxItem} onClick={() => setNotCalcUnderCare(!notCalcUnderCare)}>
              {notCalcUnderCare ? <CheckSquare size={18} color="#2563EB" /> : <Square size={18} />}
              <span>Not Calculate In Under Care Reference Report</span>
            </div>
            
            {/* Blank space to align with grid if needed, but per screenshot Package is below Not Calculate Service Charge */}
            <div className={styles.checkboxItem} onClick={() => setIsPackage(!isPackage)} style={{ marginTop: '24px' }}>
              {isPackage ? <CheckSquare size={18} color="#2563EB" /> : <Square size={18} />}
              <span>Package</span>
            </div>
            <div /> {/* Empty cell to match layout */}

            <div className={styles.checkboxItem} onClick={() => setNotCalcInRef(!notCalcInRef)} style={{ marginTop: '12px' }}>
              {notCalcInRef ? <CheckSquare size={18} color="#2563EB" /> : <Square size={18} />}
              <span>Not Calculate In Ref Report</span>
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
          <button className={styles.secondaryBtn}>
            <Search size={18} /> Search
          </button>
        </div>

        <div className={styles.rightActions}>
          <button className={styles.primaryBtn}>
            <Save size={18} /> Add
          </button>
          <button className={styles.secondaryBtn} style={{ marginLeft: '16px' }}>
            <LogOut size={18} /> Exit
          </button>
        </div>
      </div>

    </div>
  );
};

export default VisitProcedureHeaderMaster;
