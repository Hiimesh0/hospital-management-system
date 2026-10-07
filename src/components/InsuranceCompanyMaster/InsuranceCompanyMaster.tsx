import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Search, Save, LogOut, CheckSquare, Square
} from 'lucide-react';
import styles from './InsuranceCompanyMaster.module.css';

const InsuranceCompanyMaster: React.FC = () => {
  const [status, setStatus] = useState('active');
  const [defaultHospital, setDefaultHospital] = useState(false);
  const [noIpdCharges, setNoIpdCharges] = useState(false);
  const [print, setPrint] = useState(false);

  return (
    <div className={styles.pageContainer}>
      
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.recordCounter}>37 of 37</span>
          <h1 className={styles.pageTitle}>Patient / Insurance Company</h1>
        </div>
      </div>

      {/* Form Container */}
      <div className={styles.formContainer}>
        
        <div className={styles.section}>
          
          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 1.5 }}>
              <label className={styles.label}>Type :</label>
              <select className={styles.input} defaultValue="Credit" style={{ backgroundColor: '#3B82F6', color: 'white', borderColor: '#2563EB' }}>
                <option>Credit</option>
                <option>Cash</option>
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

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Company Name :</label>
              <input type="text" className={styles.input} defaultValue="C.M.FUND" />
            </div>
          </div>

          <div className={styles.row} style={{ alignItems: 'center' }}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Company Short Name :</label>
              <input type="text" className={styles.input} defaultValue="CMF" />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <div className={styles.checkboxItem} style={{ color: '#94A3B8', cursor: 'not-allowed' }}>
                <Square size={16} color="#CBD5E1" />
                <span>Default Hospital Name</span>
              </div>
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label} style={{ width: '80px' }}>TPA Name :</label>
              <input type="text" className={styles.input} />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Address :</label>
              <textarea className={styles.textarea}></textarea>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>City :</label>
              <input type="text" className={styles.input} />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1.5 }}>
              <label className={styles.label}>Ph :</label>
              <input type="text" className={styles.input} />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ paddingLeft: '152px' }}>
              <div className={styles.checkboxItem} onClick={() => setNoIpdCharges(!noIpdCharges)}>
                {noIpdCharges ? <CheckSquare size={16} color="#2563EB" /> : <Square size={16} color="#94A3B8" />}
                <span style={{ color: noIpdCharges ? '#172033' : '#94A3B8' }}>Do not calculate IPD Service Charges</span>
              </div>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroupVertical}>
              <label className={styles.label} style={{ width: 'auto', textAlign: 'left', marginLeft: '152px' }}>Cashless Form Download Link :</label>
              <input type="text" className={styles.input} style={{ marginLeft: '152px' }} />
            </div>
          </div>

        </div>

        {/* Rate Section */}
        <div className={styles.rateSection}>
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Take Rate Of Company :</label>
              <input type="text" className={styles.input} />
            </div>
          </div>
          <div className={styles.noteText}>
            Note : If Take Rate Of Company Not Selected Then Default Rate Will Be Consider<br/>
            For Own Rate Select Own Company Name
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
          <button className={styles.secondaryBtn} style={{ marginLeft: '16px', width: '200px', justifyContent: 'center' }}>
            <Search size={18} /> Particular search
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

export default InsuranceCompanyMaster;
