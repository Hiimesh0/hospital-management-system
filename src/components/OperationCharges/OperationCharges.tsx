import React from 'react';
import { LogOut, ArrowDown, Building2 } from 'lucide-react';
import styles from './OperationCharges.module.css';

const OperationCharges: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Operation Charges</h1>
        <div className={styles.companyBadge}>
          <Building2 size={16} className={styles.companyLabel} />
          <span className={styles.companyLabel}>Company:</span>
          <span className={styles.companyValue}>AYUSHMAN BHARAT</span>
        </div>
      </div>

      <div className={styles.content}>
        
        {/* Context Bar */}
        <div className={styles.contextBar}>
          <div className={styles.tagBtn}>Operation Entry</div>
          
          <div className={styles.patientInfoBox}>
            <div className={`${styles.infoSegment} ${styles.name}`}>SAVITABEN VALLABHBHAI VAGHASIYA</div>
            <div className={`${styles.infoSegment} ${styles.amount}`}>0 Rs.</div>
            <div className={`${styles.infoSegment} ${styles.record}`}>I/0123/186</div>
          </div>
          
          <button className={styles.exitBtn}>
            <LogOut size={16} /> Exit
          </button>
        </div>

        {/* Data Entry Form */}
        <div className={styles.formSection}>
          
          {/* Row 1 */}
          <div className={styles.formRow}>
            <div className={`${styles.fieldGroup} ${styles.wDate}`}>
              <label className={styles.label}>Date</label>
              <input type="text" className={styles.input} defaultValue="09-Jan-2023" />
            </div>
            
            <div className={`${styles.fieldGroup} ${styles.wOpType}`}>
              <label className={styles.label}>Operation Type (Display in 1st pg Bill Print)</label>
              <input type="text" className={styles.input} />
            </div>

            <div className={`${styles.fieldGroup} ${styles.wChargeType}`}>
              <label className={styles.label}>Charge Type</label>
              <select className={styles.select}>
                <option value=""></option>
                <option value="Standard">Standard</option>
                <option value="Special">Special</option>
              </select>
            </div>

            <div className={`${styles.fieldGroup} ${styles.wDrName}`}>
              <label className={styles.label}>Dr. Name</label>
              <input type="text" className={styles.input} />
            </div>
          </div>

          {/* Row 2 */}
          <div className={styles.formRow}>
            <div className={`${styles.fieldGroup} ${styles.wOpGroup}`}>
              <label className={styles.label}>Operation Group Name</label>
              <input type="text" className={styles.input} />
            </div>

            <div className={`${styles.fieldGroup} ${styles.wAmount}`}>
              <label className={styles.label}>Amount</label>
              <input type="text" className={styles.input} />
            </div>

            <div className={`${styles.fieldGroup} ${styles.wNotes}`}>
              <label className={styles.label}>Notes</label>
              <input type="text" className={styles.input} />
            </div>

            <div className={`${styles.fieldGroup} ${styles.wAction}`}>
              <button className={styles.addBtn} aria-label="Add Charge">
                <ArrowDown size={20} />
              </button>
            </div>
          </div>

        </div>

        {/* Table List */}
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>OperationGroup</th>
                <th>ChargeType</th>
                <th>Dr</th>
                <th>GroupName</th>
                <th>Rate</th>
                <th>EntBy</th>
                <th>AMTTYPE</th>
                <th>Notes</th>
                <th>Company</th>
              </tr>
            </thead>
            <tbody>
              {/* No data shown in screenshot */}
              <tr>
                <td colSpan={10} className={styles.emptyState}>No operation charges entered yet.</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default OperationCharges;
