import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Search, Save, LogOut, Edit2, Trash2, Printer, Square, CheckSquare
} from 'lucide-react';
import styles from './ReportTemplate.module.css';

const ReportTemplate: React.FC = () => {
  const [shouldPrint, setShouldPrint] = useState(true); // Checked in screenshot

  return (
    <div className={styles.pageContainer}>
      
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.badge}>17 Of 17</span>
        <h1 className={styles.pageTitle}>Report Template</h1>
      </div>

      {/* Form Container */}
      <div className={styles.formContainer}>
        
        <div className={styles.mainSection}>
          
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Group Name :</label>
            <select className={styles.select} defaultValue="Sonography">
              <option>Sonography</option>
              <option>X-Ray</option>
              <option>Pathology</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>TemplateName :</label>
            <input type="text" className={styles.input} defaultValue="COLOR DOPPLER BOTH UPPER LIMB" />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>ReportHeader :</label>
            <input type="text" className={styles.input} defaultValue="BILATERAL UPPER LIMB DOPPLER" />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Details :</label>
            <textarea 
              className={styles.textarea} 
              defaultValue={`Both subclavian, brachial and axillary artery appear normal in course and caliber on both sides. No e/o thrombosis / Atherosclerosis / Stenosis / Aneurysm. On CDI and spectral waveform, they show normal flow and velocity.\nBoth subclavian & axillary veins show normal flow pattern.\n\nBoth ulnar and radial vessels appear normal in course and caliber on both sides . No e/o thrombosis / Atherosclerosis / Stenosis / Aneurysm. On CDI and spectral waveform, they show normal flow and velocity.\nVeins show normal compressibility.\n\nSuperficial veins of both upper limbs shows normal course and flow pattern.\n\n\nCOMMENTS: Normal Bilateral Upper Limb Doppler.`}
            />
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
          <button className={styles.secondaryBtn}>
            <Printer size={16} /> Print
          </button>
          <div className={styles.checkboxItem} onClick={() => setShouldPrint(!shouldPrint)} style={{ marginLeft: '8px', marginRight: '16px' }}>
            {shouldPrint ? <CheckSquare size={18} color="#2563EB" /> : <Square size={18} color="#94A3B8" />}
          </div>
          <button className={styles.secondaryBtn}>
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

export default ReportTemplate;
