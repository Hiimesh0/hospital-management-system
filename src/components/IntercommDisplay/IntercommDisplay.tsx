import React from 'react';
import { Save, Edit2, Trash2, LogOut, Printer } from 'lucide-react';
import styles from './IntercommDisplay.module.css';

const IntercommDisplay: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Intercomm Display</h1>
      </div>

      {/* Top Section */}
      <div className={styles.topSection}>
        
        {/* Form Inputs */}
        <div className={styles.formArea}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Location</label>
            <input type="text" className={styles.input} />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Intercomm No.</label>
            <input type="text" className={styles.input} />
          </div>
        </div>

        {/* Actions Area */}
        <div className={styles.actionsArea}>
          <div className={styles.buttonRow}>
            <button className={styles.primaryBtn}>
              <Save size={16} /> Save
            </button>
            <button className={styles.secondaryBtn}>
              <Edit2 size={16} /> Update
            </button>
            <button className={styles.dangerBtn}>
              <Trash2 size={16} /> Delete
            </button>
          </div>
          
          <div className={styles.buttonRow}>
            <button className={styles.secondaryBtn}>
              <LogOut size={16} /> Exit
            </button>
            <button className={styles.secondaryBtn}>
              <Printer size={16} /> Print
            </button>
            <div className={styles.checkboxGroup}>
              <input type="checkbox" id="noWise" className={styles.checkbox} />
              <label htmlFor="noWise" className={styles.checkboxLabel}>No. Wise</label>
            </div>
          </div>
        </div>

      </div>

      {/* Table Area */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Location</th>
                <th>Intercomm No</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={2} className={styles.emptyState}>No intercom records found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default IntercommDisplay;
