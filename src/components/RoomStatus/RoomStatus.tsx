import React, { useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import styles from './RoomStatus.module.css';

const RoomStatus: React.FC = () => {
  const [activeTab, setActiveTab] = useState('DC');

  const tabs = [
    { id: 'DX', label: 'DX', total: 1, occupied: 0 },
    { id: 'MA', label: 'MA', total: 36, occupied: 35 },
    { id: 'IC', label: 'IC', total: 14, occupied: 12 },
    { id: 'DC', label: 'DC', total: 17, occupied: 7 },
    { id: 'SP', label: 'SP', total: 6, occupied: 1 },
    { id: 'SS', label: 'SS', total: 4, occupied: 0 },
    { id: 'EX', label: 'EX', total: 2, occupied: 1 },
    { id: 'GW', label: 'GW', total: 20, occupied: 20 },
    { id: 'IS', label: 'IS', total: 1, occupied: 0 },
    { id: 'OT', label: 'OT', total: 5, occupied: 1 },
  ];

  const rooms = [
    { id: 'IC-9', type: 'IC', recordId: '429', date: '06-01-23', tags: ['C', 'L'], patient: 'NARESHBHAI DHIRUBHAI JHALA', location: 'VARACHHA,,SURAT', doctor: 'DR. NIKUNJ VITHALANI', status: 'occupied' },
    { id: 'IC-10', type: 'IC', recordId: '26', date: '09-01-23', tags: ['C', 'L'], patient: 'BHUPATBHAI DHANJIBHAI PARMAR', location: 'SITANAGAR CHOKADI,SURAT', doctor: 'DR. DIPEN BHUVA (PATEL)', status: 'occupied' },
    { id: 'IC-11', type: 'IC', recordId: '475', date: '06-01-23', tags: ['C', 'L'], patient: 'PRITI MADHURAJ DHURIYA', location: 'PANDESARA,,SURAT', doctor: 'DR. HONEY PAREKH', status: 'occupied' },
    { id: 'IC-12', type: 'IC', recordId: '227', date: '06-01-23', tags: ['C', 'L'], patient: 'DINESHBHAI NAGINBHAI NAYKA', location: 'NAVI PARDI,,SURAT', doctor: 'DR. TANVEER MAKSUD', status: 'occupied' },
    
    { id: 'IC-13', type: 'IC', status: 'unoccupied' },
    { id: 'IC-14', type: 'IC', status: 'unoccupied' },
    
    { id: 'DC-1', type: 'DC', recordId: '472', date: '06-01-23', tags: ['C', 'L'], patient: 'KANTABEN MAGANBHAI SOLANKI', location: '-,BOTAD', doctor: 'DR. NIKUNJ VITHALANI', status: 'occupied' },
    { id: 'DC-2', type: 'DC', recordId: '74', date: '06-01-23', tags: ['C', 'L'], patient: 'NANIBEN B PATEL', location: 'VAPI,VALSAD', doctor: 'DR. DIPEN BHUVA (PATEL)', status: 'occupied' },
    
    { id: 'DC-3', type: 'DC', recordId: '645', date: '09-01-23', tags: ['C', 'L'], patient: 'DEVSHIBHAI RANCHHODBHAI MONPARIYA', location: 'NANA VARACHHA,,SURAT', doctor: 'DR. ANKIT PATEL', status: 'occupied' },
    { id: 'DC-4', type: 'DC', recordId: '609', date: '09-01-23', tags: ['C', 'L', 'B'], patient: 'HANSABEN BHANUSHANKARBHAI JOSHI', location: 'PUNAGAM,,SURAT', doctor: 'DR. ANKIT PATEL', status: 'occupied' },
    { id: 'DC-5', type: 'DC', recordId: '514', date: '09-01-23', tags: ['C', 'L'], patient: 'BHUPENDRABHAI NAJANBHAI BHAGARIYA', location: 'VANSDA,,NAVSARI', doctor: 'DR. RAHUL SHAH', status: 'occupied' },
    
    { id: 'DC-6', type: 'DC', status: 'unoccupied' },
    { id: 'DC-7', type: 'DC', status: 'unoccupied' },
    { id: 'DC-8', type: 'DC', status: 'unoccupied' },
    { id: 'DC-9', type: 'DC', status: 'unoccupied' },
  ];

  return (
    <div className={styles.pageContainer}>
      
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Room Status Layout</h1>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        {tabs.map(tab => (
          <div 
            key={tab.id} 
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className={styles.tabBadge}>{tab.occupied}/{tab.total}</span>
          </div>
        ))}
      </div>

      {/* Room Grid */}
      <div className={styles.roomGrid}>
        
        {rooms.map(room => {
          if (room.status === 'occupied') {
            return (
              <div key={room.id} className={styles.roomCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardDate}>
                    {room.date}
                    <div className={styles.badgeGroup}>
                      {room.tags?.map(tag => (
                        <span key={tag} className={styles.statusBadge}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <span className={styles.roomId}>{room.id}</span>
                  <span className={styles.recordId}>{room.recordId}</span>
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.patientName}>{room.patient}</h3>
                  <span className={styles.patientAddress}>{room.location}</span>
                  <span className={styles.doctorName}>{room.doctor}</span>
                </div>
              </div>
            );
          }
          
          return (
            <div key={room.id} className={styles.roomCardEmpty}>
              <span className={styles.emptyRoomId}>{room.id}</span>
              <span className={styles.emptyText}>Unoccupied</span>
            </div>
          );
        })}

        {/* Summary Stats Card occupying the 16th slot */}
        <div className={styles.summaryCard}>
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>All (F1)</span>
            <span>106</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.occupied}`}>
            <span>Occupied (F2)</span>
            <span>77</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.unoccupied}`}>
            <span>Unoccupied (F3)</span>
            <span>29</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.booked}`}>
            <span>Booked (F4)</span>
            <span>0</span>
          </div>
        </div>
      </div>

      {/* Footer / Filters */}
      <div className={styles.footerSection}>
        <div className={styles.legendBar}>
          <div className={styles.legendItem}><span className={styles.legendBadge}>CL</span> Cashless</div>
          <div className={styles.legendItem}><span className={styles.legendBadge}>ML</span> MLC</div>
          <div className={styles.legendItem}><span className={styles.legendBadge}>B</span> Bill</div>
          <div className={styles.legendItem}><span className={styles.legendBadge}>R</span> Receipt</div>
          <div className={styles.legendItem}><span className={styles.legendBadge}>@</span> Roomtype As</div>
          <div className={styles.legendItem}>Bed Caption Red = Mediclaim</div>
        </div>

        <div className={styles.searchBar}>
          
          <div className={styles.filterGroup}>
            <div className={styles.field}>
              <span className={styles.label}>Diet</span>
              <div className={styles.checkboxGroup} style={{flexDirection: 'row', gap: '12px'}}>
                <label className={styles.checkboxLabel}><input type="checkbox" /> P</label>
                <label className={styles.checkboxLabel}><input type="checkbox" /> L</label>
              </div>
            </div>
            
            <div className={styles.field}>
              <span className={styles.label}>&nbsp;</span>
              <div className={styles.checkboxGroup} style={{flexDirection: 'row', gap: '12px'}}>
                <label className={styles.checkboxLabel}><input type="checkbox" /> A</label>
                <label className={styles.checkboxLabel}><input type="checkbox" /> D</label>
                <label className={styles.checkboxLabel}><input type="checkbox" /> C</label>
              </div>
            </div>
          </div>

          <div className={styles.searchInputs}>
            <div className={styles.field}>
              <label className={styles.label}>Search By Patient (F6)</label>
              <input type="text" className={styles.input} placeholder="Enter patient name or ID..." />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Doctor (F7)</label>
              <input type="text" className={styles.input} placeholder="Filter by doctor..." />
            </div>
          </div>

          <div className={styles.actionBtns}>
            <button className={styles.secondaryBtn}>
              <RefreshCw size={16} /> F5
            </button>
            <button className={styles.dangerBtn}>
              <X size={16} /> Exit
            </button>
          </div>
          
        </div>
      </div>

    </div>
  );
};

export default RoomStatus;
