import React, { useState } from 'react';
import { FileText, LogOut } from 'lucide-react';
import styles from './PatientPastInfo.module.css';

const PatientPastInfo: React.FC = () => {
  // We can setup local state for fields, though we are mostly just presenting the layout
  const [patientSearch, setPatientSearch] = useState('MANJULABEN MAGANBHAI GAJERA');
  const [patientId, setPatientId] = useState('600');
  const [mobile, setMobile] = useState('9909433911');

  // Hardcoded data matching the screenshot for fidelity
  const opdData = [
    {
      id: 1,
      typ: 'OPD',
      invDate: '09-Jan-2023',
      invNo: 'BCHLAB2223/367',
      particulars: 'CBC, S.CREATININE(UNITY)\n, S.ELECTROLYTE (UNITY)\n, TRANSPORTATION CHARGE(UNITY)',
      amount: '1125',
      received: '1125',
      due: '0',
      notes: ''
    }
  ];

  const ipdData = [
    {
      id: 1,
      typ: 'IPD',
      invDate: '09-Jan-2023',
      invNo: 'GEN2223/122',
      particulars: 'Indoor Bill',
      underCareDr: 'DR. TANVEER MAKSUD',
      amount: '5863',
      received: '5863',
      due: '0',
      notes: '',
      entryBy: 'Mahipal Mahida, PCName:RECEPTION3-PC, At:09-Jan-2023 11:43:32 AM.'
    },
    {
      id: 2,
      typ: 'IPD',
      invDate: '09-Jan-2023',
      invNo: 'GEN2223/126',
      particulars: 'Indoor Bill',
      underCareDr: 'DR. TANVEER MAKSUD',
      amount: '220',
      received: '220',
      due: '0',
      notes: '',
      entryBy: 'Mahipal Mahida, PCName:RECEPTION3-PC, At:09-Jan-2023 03:01:36 PM.'
    }
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Patient Past Info</h1>
      </div>

      <div className={styles.content}>
        {/* Patient Search Context */}
        <div className={styles.searchSection}>
          <div className={styles.searchGrid}>
            <div className={`${styles.fieldGroup} ${styles.large}`}>
              <label className={styles.label}>Search Patient</label>
              <span className={styles.helperText}>(By Name,Id,Mobile)</span>
              <input 
                type="text" 
                className={styles.input} 
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
              />
            </div>
            
            <div className={`${styles.fieldGroup} ${styles.medium}`}>
              <label className={styles.label}>Id</label>
              <div style={{height: "15px"}}></div> {/* spacer for helperText alignment */}
              <input 
                type="text" 
                className={styles.input} 
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.medium}`}>
              <label className={styles.label}>Mobile</label>
              <div style={{height: "15px"}}></div> {/* spacer for helperText alignment */}
              <input 
                type="text" 
                className={styles.input} 
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
          </div>
          
          <button className={styles.primaryBtn}>
            <FileText size={16} />
            Billing
          </button>
        </div>

        {/* Tables Section */}
        <div className={styles.tablesContainer}>
          
          {/* OPD Table */}
          <div className={styles.tableSection}>
            <h2 className={styles.sectionHeading}>OPD History</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Typ</th>
                    <th>Inv. Date</th>
                    <th>Inv. No</th>
                    <th>Particulars</th>
                    <th style={{textAlign: 'right'}}>Amount</th>
                    <th style={{textAlign: 'right'}}>Received</th>
                    <th style={{textAlign: 'right'}}>Due</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {opdData.map((row) => (
                    <tr key={row.id}>
                      <td>{row.typ}</td>
                      <td>{row.invDate}</td>
                      <td>{row.invNo}</td>
                      <td style={{ whiteSpace: 'pre-wrap' }}>{row.particulars}</td>
                      <td style={{textAlign: 'right'}}>{row.amount}</td>
                      <td style={{textAlign: 'right'}}>{row.received}</td>
                      <td style={{textAlign: 'right'}}>{row.due}</td>
                      <td className={styles.notesCell}>{row.notes || '-'}</td>
                    </tr>
                  ))}
                  {opdData.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: '#667085' }}>
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* IPD Table */}
          <div className={styles.tableSection}>
            <h2 className={styles.sectionHeading}>IPD History</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Typ</th>
                    <th>Inv. Date</th>
                    <th>Inv. No</th>
                    <th>Particulars</th>
                    <th>Under Care Dr</th>
                    <th style={{textAlign: 'right'}}>Amount</th>
                    <th style={{textAlign: 'right'}}>Received</th>
                    <th style={{textAlign: 'right'}}>Due</th>
                    <th>Notes</th>
                    <th>EntryBy</th>
                  </tr>
                </thead>
                <tbody>
                  {ipdData.map((row) => (
                    <tr key={row.id}>
                      <td>{row.typ}</td>
                      <td>{row.invDate}</td>
                      <td>{row.invNo}</td>
                      <td>{row.particulars}</td>
                      <td>{row.underCareDr}</td>
                      <td style={{textAlign: 'right'}}>{row.amount}</td>
                      <td style={{textAlign: 'right'}}>{row.received}</td>
                      <td style={{textAlign: 'right'}}>{row.due}</td>
                      <td className={styles.notesCell}>{row.notes || '-'}</td>
                      <td style={{ fontSize: '11px', color: '#667085' }}>{row.entryBy}</td>
                    </tr>
                  ))}
                  {ipdData.length === 0 && (
                    <tr>
                      <td colSpan={10} style={{ textAlign: 'center', padding: '24px', color: '#667085' }}>
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Summary Footer */}
        <div className={styles.summarySection}>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>OPD Amount</span>
              <div className={styles.summaryValue}>1125</div>
            </div>
            
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>OPD Received</span>
              <div className={styles.summaryValue}>1125</div>
            </div>

            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>OPD Due</span>
              <div className={styles.summaryValue}>0</div>
            </div>
          </div>

          <button className={styles.secondaryBtn}>
            <LogOut size={16} />
            Exit
          </button>
        </div>

      </div>
    </div>
  );
};

export default PatientPastInfo;
