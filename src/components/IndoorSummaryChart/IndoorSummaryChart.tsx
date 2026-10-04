import React from 'react';
import { RefreshCw, X } from 'lucide-react';
import styles from './IndoorSummaryChart.module.css';

const MOCK_DATA = [
  { id: 178, indoor: 'I/0123/178', patient: 'RANJITKUMAR MOHANLAL D...', surgery: '-', remark: '-', dr: 'DR. DIPEN BHUVA (...', de: 'D.E.', billRec: '', ot: '', dc: '', billNo: '', prefix: 'GEN', dod: '', mediclaim: '', mlc: '', cashless: '', recNo: '', status: 'black' },
  { id: 179, indoor: 'I/0123/179', patient: 'LAKHABHAI DHANJIBHAI DABHI', surgery: '-', remark: '-', dr: 'DR. ANKIT PATEL', de: '', billRec: '', ot: '', dc: '', billNo: '', prefix: 'GEN', dod: '', mediclaim: '', mlc: '', cashless: 'CashLess', recNo: '', status: 'black' },
  { id: 180, indoor: 'I/0123/180', patient: 'PRABHABEN V BHOJANI', surgery: '-', remark: '-', dr: 'DR. ANKIT PATEL', de: '', billRec: '', ot: '', dc: '', billNo: '', prefix: 'GEN', dod: '', mediclaim: '', mlc: '', cashless: 'CashLess', recNo: '', status: 'black' },
  { id: 191, indoor: 'I/0123/191', patient: 'MANJULABEN MAGANBHAI G...', surgery: '-', remark: '-', dr: 'DR. TANVEER MAK...', de: '', billRec: 'Bill R...', ot: '', dc: 'D.C.', billNo: 'GEN222...', prefix: 'GEN', dod: '09-Jan-2023', mediclaim: '', mlc: '', cashless: '', recNo: '', status: 'green' },
  { id: 192, indoor: 'I/0123/192', patient: 'KINNABEN DEVENDRA SITAPA...', surgery: '-', remark: '-', dr: 'DR. ANKIT PATEL', de: '', billRec: '', ot: '', dc: '', billNo: '', prefix: 'GEN', dod: '', mediclaim: '', mlc: '', cashless: 'CashLess', recNo: '', status: 'black' },
  { id: 195, indoor: 'I/0123/195', patient: 'NITINBHAI MANSUKHBHAI PO...', surgery: '-', remark: '-', dr: 'DR. AKASH VAGHANI', de: 'D.E.', billRec: 'Bill R...', ot: '', dc: '', billNo: 'GEN222...', prefix: 'GEN', dod: '09-Jan-2023', mediclaim: '', mlc: '', cashless: '', recNo: '', status: 'green' },
];

const IndoorSummaryChart: React.FC = () => {
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'All'];

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'green': return styles.statusGreen;
      case 'blue': return styles.statusBlue;
      case 'red': return styles.statusRed;
      default: return '';
    }
  };

  return (
    <div className={styles.pageContainer}>
      
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.pageTitle}>Indoor Summary Chart</h1>
          <span className={styles.recordCount}>Total: 204</span>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.actionBtn}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className={styles.actionBtn}>
            <X size={16} /> Exit
          </button>
        </div>
      </div>

      <div className={styles.content}>
        
        {/* Filters Top Row */}
        <div className={styles.filtersRow}>
          
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Patient</label>
            <input type="text" className={`${styles.input} ${styles.wPatient}`} />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Bill No:</label>
            <input type="text" className={`${styles.input} ${styles.wBillNo}`} />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Prefix:</label>
            <select className={`${styles.select} ${styles.wPrefix}`}>
              <option value="All">All</option>
              <option value="GEN">GEN</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Rec No:</label>
            <input type="text" className={`${styles.input} ${styles.wRecNo}`} />
          </div>

        </div>

        {/* Timeline Row */}
        <div className={styles.timelineRow}>
          
          <div className={styles.fieldGroup}>
            <input type="date" className={`${styles.input} ${styles.wDate}`} defaultValue="2023-01-09" />
          </div>

          <div className={styles.fieldGroup}>
            <select className={`${styles.select} ${styles.wYear}`}>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>

          <div className={styles.monthTabs}>
            {months.map(m => (
              <button 
                key={m} 
                className={`${styles.monthTab} ${m === 'Jan' ? styles.active : ''}`}
              >
                {m}
              </button>
            ))}
          </div>

        </div>

        {/* Table List */}
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th className={styles.rowNum}></th>
                <th>Indoor</th>
                <th>Patient</th>
                <th>Surgery</th>
                <th>Remark</th>
                <th>Uc Dr</th>
                <th>D.E.</th>
                <th>Bill Rec</th>
                <th>O.T.</th>
                <th>D.C.</th>
                <th>Bill No.</th>
                <th>Prefix</th>
                <th>DOD</th>
                <th>Mediclaim</th>
                <th>MLC</th>
                <th>CashLess</th>
                <th>RecNo</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_DATA.map((row) => (
                <tr key={row.id} className={getStatusClass(row.status)}>
                  <td className={styles.rowNum}>{row.id}</td>
                  <td>{row.indoor}</td>
                  <td>{row.patient}</td>
                  <td>{row.surgery}</td>
                  <td>{row.remark}</td>
                  <td>{row.dr}</td>
                  <td>{row.de}</td>
                  <td>{row.billRec}</td>
                  <td>{row.ot}</td>
                  <td>{row.dc}</td>
                  <td>{row.billNo}</td>
                  <td>{row.prefix}</td>
                  <td>{row.dod}</td>
                  <td>{row.mediclaim}</td>
                  <td>{row.mlc}</td>
                  <td>{row.cashless}</td>
                  <td>{row.recNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend / Footer */}
        <div className={styles.legendFooter}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.dotGreen}`}></div>
            <span className={styles.legendTextGreen}>Bills & Receipt Generated</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.dotBlue}`}></div>
            <span className={styles.legendTextBlue}>Discharged - Bill Not Generated</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.dotRed}`}></div>
            <span className={styles.legendTextRed}>Bill Generated But Receipt Not Generated</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.dotBlack}`}></div>
            <span className={styles.legendTextBlack}>Bill Not Generated</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default IndoorSummaryChart;
