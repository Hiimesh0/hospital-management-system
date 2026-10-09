import React, { useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import styles from './RoomStatus.module.css';

const RoomStatus: React.FC = () => {
 const [activeTab, setActiveTab] = useState('DC');

 const tabs : any[] = [
];

 const rooms : any[] = [
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
 <input type="text" className={styles.input} />
 </div>
 <div className={styles.field}>
 <label className={styles.label}>Doctor (F7)</label>
 <input type="text" className={styles.input} />
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
