import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Search, Save, LogOut, Edit2, Trash2, Printer, Square, CheckSquare, Image as ImageIcon
} from 'lucide-react';
import styles from './MedicalCertificate.module.css';

const MedicalCertificate: React.FC = () => {
  const [shouldPrint, setShouldPrint] = useState(false);
  const [isCheckedH, setIsCheckedH] = useState(false);
  const [blankCheck, setBlankCheck] = useState(false);

  return (
    <div className={styles.pageContainer}>
      
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Medical Certificate</h1>
      </div>

      {/* Form Container */}
      <div className={styles.formContainer}>
        
        <div className={styles.mainSection}>
          
          {/* Top Section (Info + Photo) */}
          <div className={styles.topSection}>
            <div className={styles.infoColumn}>
              
              <div className={styles.titleRadios}>
                <label className={styles.radioItem}><input type="radio" name="title" defaultChecked /> Mr.</label>
                <label className={styles.radioItem}><input type="radio" name="title" /> Mrs.</label>
                <label className={styles.radioItem}><input type="radio" name="title" /> Miss</label>
                <label className={styles.radioItem}><input type="radio" name="title" /> Master</label>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.fieldGroupExpanded}>
                  <label className={styles.label}>No. :</label>
                  <input type="text" className={`${styles.input} ${styles.inputYellow}`} style={{ maxWidth: '150px' }} />
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.fieldGroupExpanded} style={{ flex: 2 }}>
                  <label className={styles.label}>Patient :</label>
                  <input type="text" className={styles.input} />
                </div>
                <div className={styles.fieldGroupExpanded} style={{ flex: 1.5 }}>
                  <label className={styles.label}>IndoorNo :</label>
                  <input type="text" className={styles.input} />
                </div>
                <div className={styles.fieldGroupExpanded} style={{ flex: 1 }}>
                  <label className={styles.label}>Age :</label>
                  <input type="text" className={styles.input} />
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.fieldGroupExpanded} style={{ flex: 1 }}>
                  <label className={styles.label}>Diagnosis :</label>
                  <input type="text" className={styles.input} />
                </div>
                <div className={styles.fieldGroupExpanded} style={{ flex: 1 }}>
                  <label className={styles.label}>Surgery :</label>
                  <input type="text" className={styles.input} />
                </div>
              </div>

            </div>

            {/* Photo Column */}
            <div className={styles.photoColumn}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#475467', textAlign: 'center', backgroundColor: '#FFFFFF', marginTop: '-24px', alignSelf: 'center', padding: '0 8px' }}>
                Photograph
              </div>
              <div className={styles.fieldRow} style={{ justifyContent: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Patient Code :</span>
              </div>
              <div className={styles.photoBox}>
                <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                  <ImageIcon size={32} />
                </div>
              </div>
            </div>
          </div>

          {/* Sentences Area */}
          <div className={styles.sentencesArea}>
            
            <div className={styles.sentenceRow}>
              <select className={`${styles.select} ${styles.inlineSelect}`}>
                <option></option>
                <option>I certify that I have</option>
              </select>
              <span className={styles.sentenceText}>under my treatment as an</span>
              <label className={styles.radioItem}><input type="radio" name="patientType" /> Out-Patient</label>
              <label className={styles.radioItem}><input type="radio" name="patientType" /> In-Patient</label>
              <span className={styles.sentenceText}>at this hospital</span>
            </div>

            <div className={styles.sentenceRow}>
              <input type="checkbox" className={styles.checkbox} />
              <span className={styles.sentenceText}>attended for first consultation on</span>
              <input type="date" className={`${styles.input} ${styles.inlineSelect}`} defaultValue="2002-07-24" />
            </div>

            <div className={styles.sentenceRow}>
              <input type="checkbox" className={styles.checkbox} />
              <select className={`${styles.select} ${styles.inlineSelect}`}>
                <option></option>
              </select>
              <span className={styles.sentenceText}>treated as on O.P.D. patient from</span>
              <input type="date" className={`${styles.input} ${styles.inlineSelect}`} defaultValue="2002-07-24" />
              <span className={styles.sentenceText}>to</span>
              <input type="checkbox" className={styles.checkbox} />
              <input type="date" className={`${styles.input} ${styles.inlineSelect}`} defaultValue="2019-07-24" />
            </div>

            <div className={styles.sentenceRow}>
              <input type="checkbox" className={styles.checkbox} />
              <select className={`${styles.select} ${styles.inlineSelect}`}>
                <option></option>
              </select>
              <span className={styles.sentenceText}>admitted as an indoor patient on</span>
              <input type="date" className={`${styles.input} ${styles.inlineSelect}`} defaultValue="2002-07-24" />
              <span className={styles.sentenceText}>And discharged on</span>
              <input type="checkbox" className={styles.checkbox} defaultChecked />
              <input type="date" className={`${styles.input} ${styles.inlineSelect}`} defaultValue="2002-07-24" />
            </div>

            <div className={styles.sentenceRow}>
              <input type="checkbox" className={styles.checkbox} />
              <span className={styles.sentenceText}>has been advised</span>
              <input type="text" className={`${styles.input} ${styles.inlineInput}`} />
              <select className={`${styles.select} ${styles.inlineSelect}`}>
                <option></option>
              </select>
              <span className={styles.sentenceText}>rest from</span>
              <input type="date" className={`${styles.input} ${styles.inlineSelect}`} defaultValue="2002-07-24" />
            </div>

            <div className={styles.sentenceRow}>
              <input type="checkbox" className={styles.checkbox} />
              <span className={styles.sentenceText} style={{ color: '#94A3B8' }}>However</span>
              <span className={styles.sentenceText}>is further advised to continue rest from</span>
              <input type="date" className={`${styles.input} ${styles.inlineSelect}`} defaultValue="2002-07-24" />
              <span className={styles.sentenceText}>for another</span>
              <input type="text" className={`${styles.input} ${styles.inlineInput}`} />
              <span className={styles.sentenceText}>days.</span>
            </div>

            <div className={styles.sentenceRow}>
              <input type="checkbox" className={styles.checkbox} />
              <span className={styles.sentenceText}>is fit to resume normal duties from</span>
              <input type="date" className={`${styles.input} ${styles.inlineSelect}`} defaultValue="2002-07-24" />
            </div>

          </div>

          {/* Bottom Fields */}
          <div className={styles.bottomFields}>
            
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroupExpanded}>
                <label className={styles.label}>Remark :</label>
                <input type="text" className={styles.input} />
              </div>
            </div>

            <div className={styles.signatureRow}>
              <div className={styles.signatureBlock}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#475467' }}>Patient's Signature And/Or Thumb<br/>Impression</div>
                <div className={styles.fieldGroupExpanded} style={{ marginTop: 'auto' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#475467' }}>Date:</span>
                  <input type="date" className={`${styles.input} ${styles.inlineSelect}`} defaultValue="2002-07-24" />
                </div>
              </div>
              <div className={styles.signatureBlock} style={{ flex: 1.5 }}>
                <div className={styles.fieldRow}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#475467', paddingTop: '10px' }}>Treatment<br/>Given :</label>
                  <input type="text" className={styles.input} />
                </div>
                <div className={styles.fieldGroupExpanded} style={{ marginTop: 'auto', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#475467' }}>Date:</span>
                  <input type="date" className={`${styles.input} ${styles.inlineSelect}`} defaultValue="2002-07-24" />
                </div>
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
          
          <div className={styles.checkboxItem} onClick={() => setBlankCheck(!blankCheck)}>
            {blankCheck ? <CheckSquare size={18} color="#2563EB" /> : <Square size={18} color="#94A3B8" />}
          </div>
          
          <button className={styles.secondaryBtn}>
            <Search size={16} /> Particular search
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

export default MedicalCertificate;
