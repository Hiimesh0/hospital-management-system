import React from 'react';
import { X, Printer, Plus } from 'lucide-react';
import styles from './DepositEntry.module.css';

const DepositEntry: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      
      {/* Top Header */}
      <div className={styles.topHeader}>
        <h1 className={styles.pageTitle}>Indoor Deposit Entry</h1>
        <button className={styles.closeBtn} title="Close">
          <X size={20} />
        </button>
      </div>

      {/* Main Form Card */}
      <div className={styles.formCard}>
        
        {/* Patient Context Bar */}
        <div className={styles.contextBar}>
          <div className={`${styles.contextBlock} ${styles.contextBlockName}`}>
            RANJITKUMAR MOHANLAL DARUKA
          </div>
          <div className={styles.contextBlock}>
            I/0123/178
          </div>
          <div className={styles.contextBlock}>
            5000 Rs.
          </div>
          <div className={styles.contextBlock}>
            Cash : 5000 Rs.
          </div>
        </div>

        {/* Data Entry Form Row */}
        <div className={styles.entryForm}>
          
          <div className={styles.fieldGroup} style={{ flex: '0 0 160px' }}>
            <label className={styles.label}>Type</label>
            <select className={styles.select} defaultValue="IPD Deposit">
              <option value="IPD Deposit">IPD Deposit</option>
            </select>
          </div>

          <div className={styles.fieldGroup} style={{ flex: '0 0 160px' }}>
            <label className={styles.label}>Date</label>
            <input type="date" className={styles.input} defaultValue="2023-01-09" />
          </div>

          <div className={styles.fieldGroup} style={{ flex: '0 0 120px' }}>
            <label className={styles.label}>Mode</label>
            <select className={styles.select} defaultValue="Cash">
              <option value="Cash">Cash</option>
            </select>
          </div>

          <div className={styles.fieldGroup} style={{ flex: '0 0 120px' }}>
            <label className={styles.label}>Prefix</label>
            <select className={styles.select} defaultValue="GEN">
              <option value="GEN">GEN</option>
            </select>
          </div>

          <div className={styles.fieldGroup} style={{ flex: '0 0 140px' }}>
            <label className={styles.label}>Amount</label>
            <input type="text" className={styles.input} />
          </div>

          <div className={styles.fieldGroup} style={{ flex: '1' }}>
            <label className={styles.label}>Remarks</label>
            <input type="text" className={styles.input} />
          </div>

          <div className={styles.fieldGroup}>
            <div style={{ height: '17px' }}></div> {/* Spacer for label alignment */}
            <div className={styles.checkboxGroup}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input type="checkbox" className={styles.checkbox} />
                <span className={styles.label}>L</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', marginLeft: '8px' }}>
                <input type="checkbox" className={styles.checkbox} />
                <span className={styles.label}>P</span>
              </label>
            </div>
          </div>

          <div className={styles.actionGroup}>
            <button className={styles.primaryBtn} style={{ backgroundColor: '#EAB308', color: '#172033' }}>
              <Plus size={16} /> Add
            </button>
            <button className={styles.secondaryBtn}>
              <Printer size={16} /> Print
            </button>
          </div>

        </div>

      </div>

      {/* Ledger Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th style={{ width: '120px' }}>Rec. No</th>
                <th style={{ width: '120px' }}>Date</th>
                <th style={{ width: '150px' }}>Amount</th>
                <th style={{ width: '150px' }}>Taken By</th>
                <th style={{ width: '100px' }}>Pay By</th>
                <th style={{ width: '150px' }}>Remarks</th>
                <th style={{ width: '120px' }}>DepositType</th>
                <th style={{ width: '180px' }}>DepositRemark1Caption</th>
                <th style={{ width: '250px' }}>Patient</th>
                <th style={{ width: '100px' }}>Patient Code</th>
                <th style={{ width: '80px' }}>Prefix</th>
                <th style={{ width: '100px' }}>AddDe...</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#98A2B3', fontSize: '10px' }}>▶</span> GEN222...
                </td>
                <td>09-Jan-2023</td>
                <td style={{ fontWeight: 500 }}>5000</td>
                <td>Mahipal Mahida</td>
                <td>Cash</td>
                <td></td>
                <td>IPD Deposit</td>
                <td>Remark</td>
                <td>RANJITKUMAR MOHANLAL DARUKA 75</td>
                <td></td>
                <td>GEN</td>
                <td>$#@:E</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DepositEntry;
