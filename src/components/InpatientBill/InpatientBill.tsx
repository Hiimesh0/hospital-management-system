import React, { useState } from 'react';
import { Save, Printer, Lock, Calculator, Package, RefreshCw, Trash2, XCircle } from 'lucide-react';
import styles from './InpatientBill.module.css';

const InpatientBill: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Room Charges');
  const [isLocked, setIsLocked] = useState(false);

  const tabs = [
    'Room Charges',
    'Operation Charges',
    'Additional Charges',
    'Dr. Visit/Procedure',
    'Deposit',
    'Diagnostics',
    'Discount Authority',
    'Notes'
  ];

  return (
    <div className={styles.pageContainer}>
      
      {/* Top Header Card */}
      <div className={styles.headerCard}>
        <div className={styles.topHeader}>
          <span className={styles.doctorName}>DR. DIPEN BHUVA (PATEL)</span>
          <h1 className={styles.pageTitle}>Inpatient Bill</h1>
          <span className={styles.recordCount}>74</span>
        </div>

        <div className={styles.infoGrid}>
          <div className={`${styles.fieldGroup} ${styles.col2}`}>
            <label className={styles.label}>Prefix:</label>
            <select className={styles.select} defaultValue="GEN">
              <option value="GEN">GEN</option>
            </select>
          </div>
          <div className={`${styles.fieldGroup} ${styles.col3}`}>
            <label className={styles.label}>Bill No:</label>
            <input type="text" className={styles.input} defaultValue="GEN2223/130" />
          </div>
          <div className={`${styles.fieldGroup} ${styles.col3}`}>
            <label className={styles.label}>Bill Date:</label>
            <input type="date" className={styles.input} defaultValue="2023-01-09" />
          </div>
          <div className={`${styles.fieldGroup} ${styles.col4}`}>
            <label className={styles.label}>Patient:</label>
            <div className={styles.patientNameBadge}>RANJITKUMAR MOHANLAL DARUKA</div>
          </div>
          <div className={`${styles.fieldGroup} ${styles.col2}`} style={{ position: 'absolute', top: '75px', right: '24px' }}>
             <input type="text" className={styles.input} defaultValue="I/0123/178" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        {tabs.map(tab => (
          <button 
            key={tab} 
            className={styles.tabBtn}
            style={activeTab === tab ? { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', color: '#1D4ED8' } : {}}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.mainLayout}>
        
        {/* Left Area: Details */}
        <div>
          {/* Sub Header (DOA/DOD) */}
          <div className={styles.infoGrid} style={{ marginBottom: '24px' }}>
            <div className={`${styles.fieldGroup} ${styles.col4}`}>
              <label className={styles.label}>DOA:</label>
              <input type="date" className={styles.input} defaultValue="2023-01-09" />
            </div>
            <div className={`${styles.fieldGroup} ${styles.col4}`}>
              <label className={styles.label}>DOD:</label>
              <input type="date" className={styles.input} defaultValue="2023-01-09" />
            </div>
            <div className={`${styles.fieldGroup} ${styles.col3}`}>
              <label className={styles.label}>Total Days:</label>
              <input type="text" className={styles.input} defaultValue="1" />
            </div>
            <div className={`${styles.fieldGroup} ${styles.col1}`}>
              <input type="text" className={styles.input} defaultValue="-" />
            </div>
          </div>

          <div className={styles.tablesGrid}>
            
            {/* Column 1 */}
            <div>
              <div className={styles.baseChargesGrid} style={{ gridTemplateColumns: 'auto 1fr', padding: '0', border: 'none', gap: '12px 16px', backgroundColor: 'transparent' }}>
                <div style={{gridColumn: '2', textAlign: 'center', fontSize: '12px', color: '#667085', fontWeight: 500}}>Rate</div>
                
                <label className={styles.label} style={{ textAlign: 'right', alignSelf: 'center' }}>Admission :</label>
                <input type="text" className={styles.input} defaultValue="0" style={{ textAlign: 'right' }} />
                
                <label className={styles.label} style={{ textAlign: 'right', alignSelf: 'center' }}>Registration :</label>
                <input type="text" className={styles.input} defaultValue="220" style={{ textAlign: 'right' }} />
                
                <label className={styles.label} style={{ textAlign: 'right', alignSelf: 'center' }}>Room :</label>
                <input type="text" className={styles.input} defaultValue="2460" style={{ textAlign: 'right' }} />
                
                <label className={styles.label} style={{ textAlign: 'right', alignSelf: 'center' }}>GST :</label>
                <input type="text" className={styles.input} defaultValue="0" style={{ textAlign: 'right' }} />
              </div>

              <div className={styles.tableSection} style={{ marginTop: '24px' }}>
                <div className={styles.tableHeader}>Dr Visit / Proc</div>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Head</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={2} style={{ height: '40px' }}></td>
                    </tr>
                  </tbody>
                </table>
                <div className={styles.tableFooter}>
                  <input type="text" className={`${styles.input} ${styles.totalInput}`} defaultValue="0" readOnly />
                </div>
              </div>

              <div className={styles.tableSection} style={{ marginTop: '24px' }}>
                <div className={styles.tableHeader}>Operation</div>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Head</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={2} style={{ height: '40px' }}></td>
                    </tr>
                  </tbody>
                </table>
                <div className={styles.tableFooter}>
                  <input type="text" className={`${styles.input} ${styles.totalInput}`} defaultValue="0" readOnly />
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                <div style={{ textAlign: 'center', fontSize: '12px', color: '#667085', fontWeight: 500, width: '120px' }}>Remark</div>
              </div>

              <div className={styles.tableSection}>
                <div className={styles.tableHeader}>Additional</div>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Head</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={2} style={{ height: '40px' }}></td>
                    </tr>
                  </tbody>
                </table>
                <div className={styles.tableFooter}>
                  <input type="text" className={`${styles.input} ${styles.totalInput}`} defaultValue="0" readOnly />
                </div>
              </div>

              <div className={styles.tableSection} style={{ marginTop: '24px' }}>
                <div className={styles.tableHeader}>Diagnostics</div>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Head</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1 <span style={{color: '#98A2B3'}}>▶</span> LABORATORY</td>
                      <td style={{ textAlign: 'right' }}>6140</td>
                    </tr>
                    <tr>
                      <td>2 <span style={{color: '#98A2B3'}}>▶</span> X-RAY</td>
                      <td style={{ textAlign: 'right' }}>450</td>
                    </tr>
                  </tbody>
                </table>
                <div className={styles.tableFooter}>
                  <input type="text" className={`${styles.input} ${styles.totalInput}`} defaultValue="6590" readOnly />
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <label className={styles.actionItem}>
                  <input 
                    type="checkbox" 
                    className={styles.checkbox} 
                    checked={isLocked}
                    onChange={(e) => setIsLocked(e.target.checked)}
                  />
                  <span className={styles.label}>Lock Bill</span>
                </label>
              </div>

            </div>

          </div>
        </div>

        {/* Right Area: Summary */}
        <div>
          <div className={styles.summaryPanel}>
            <div className={styles.summaryHeader}>Financial Summary</div>
            <div className={styles.summaryContent}>
              
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Total (=)</span>
                <input type="text" className={`${styles.input} ${styles.summaryValue} ${styles.summaryValueHigh}`} defaultValue="9270" readOnly />
              </div>
              
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Maintenance Charges (+)</span>
                <div className={styles.multiInputRow}>
                  <div className={styles.fieldGroup} style={{ gap: '4px' }}>
                    <input type="text" className={`${styles.input} ${styles.percentInput} ${styles.summaryValueHigh}`} defaultValue="10" />
                  </div>
                  <input type="text" className={`${styles.input} ${styles.summaryValue} ${styles.summaryValueHigh}`} defaultValue="927" />
                </div>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Bill Amount (=)</span>
                <input type="text" className={`${styles.input} ${styles.summaryValue} ${styles.summaryValueWarning}`} defaultValue="10197" readOnly />
              </div>

              <div className={styles.divider}></div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Flat Discount (-)</span>
                <input type="text" className={`${styles.input} ${styles.summaryValue}`} defaultValue="0" />
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Authority Discount (-)</span>
                <input type="text" className={`${styles.input} ${styles.summaryValue}`} defaultValue="" />
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel} style={{ fontWeight: 600, color: '#172033' }}>Net (=)</span>
                <input type="text" className={`${styles.input} ${styles.summaryValue}`} defaultValue="10197" style={{ fontWeight: 600 }} readOnly />
              </div>

              <div className={styles.divider}></div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Deposit (-)</span>
                <input type="text" className={`${styles.input} ${styles.summaryValue}`} defaultValue="5000" />
              </div>

              <div className={styles.summaryRow} style={{ marginTop: '8px' }}>
                <span className={styles.summaryLabel} style={{ fontWeight: 600, color: '#172033' }}>Final Pay/Ret (=)</span>
                <input type="text" className={`${styles.input} ${styles.summaryValue} ${styles.summaryValueSuccess}`} defaultValue="5197" readOnly />
              </div>
              
              <div className={styles.divider}></div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Approved</span>
                <input type="text" className={`${styles.input} ${styles.summaryValue}`} defaultValue="" style={{ width: '100%' }} />
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.actionGroup}>
          <button className={styles.secondaryBtn}>Inpatient Receipt</button>
          <label className={styles.actionItem}>
            <input type="checkbox" className={styles.checkbox} />
            <span className={styles.label}>L</span>
          </label>
          <label className={styles.actionItem}>
            <input type="checkbox" className={styles.checkbox} />
            <span className={styles.label}>P</span>
          </label>
          <button className={styles.secondaryBtn}><Printer size={16} /> Print</button>
          <button className={styles.secondaryBtn}><Lock size={16} /> Lock Bill</button>
          <button className={styles.secondaryBtn}><Calculator size={16} /> Cash Calculate</button>
          <button className={styles.secondaryBtn}><Package size={16} /> Package</button>
        </div>

        <div className={styles.actionGroup}>
          <button className={styles.primaryBtn} style={{ backgroundColor: '#EAB308', color: '#172033' }}>
            <Save size={18} /> Save
          </button>
          <button className={styles.secondaryBtn} disabled>
            <RefreshCw size={16} /> Update
          </button>
          <button className={styles.dangerBtn} disabled>
            <Trash2 size={16} /> Delete
          </button>
          <button className={styles.secondaryBtn}>
            <XCircle size={16} /> Cancel
          </button>
        </div>
      </div>

    </div>
  );
};

export default InpatientBill;
