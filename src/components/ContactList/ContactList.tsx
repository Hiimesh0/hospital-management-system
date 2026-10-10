import React from 'react';
import { X, Plus, Edit2, Trash2, Printer, Search } from 'lucide-react';
import styles from './ContactList.module.css';

const ContactList: React.FC = () => {
 const contacts : any[] = [
];

 return (
 <div className={styles.pageContainer}>
 
 {/* Header */}
 <div className={styles.header}>
 <h1 className={styles.pageTitle}>Contact List</h1>
 <button className={styles.closeBtn} title="Exit">
 <X size={20} />
 </button>
 </div>

 {/* Toolbar */}
 <div className={styles.toolbar}>
 <div className={styles.searchGroup}>
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Search By Name</label>
 <div style={{ position: 'relative' }}>
 <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
 <input type="text" className={styles.input} style={{ paddingLeft: '36px' }} />
 </div>
 </div>
 
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Search By Remarks</label>
 <div style={{ position: 'relative' }}>
 <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
 <input type="text" className={styles.input} style={{ paddingLeft: '36px' }} />
 </div>
 </div>
 </div>

 <div className={styles.actionGroup}>
 <button className={styles.primaryBtn}>
 <Plus size={16} /> Add
 </button>
 <button className={styles.secondaryBtn}>
 <Edit2 size={16} /> Update
 </button>
 <button className={styles.dangerBtn}>
 <Trash2 size={16} /> Delete
 </button>
 <button className={styles.secondaryBtn}>
 <Printer size={16} /> Print
 </button>
 </div>
 </div>

 {/* Table Area */}
 <div className={styles.tableCard}>
 <div className={styles.tableWrapper}>
 <table className={styles.dataTable}>
 <thead>
 <tr>
 <th className={styles.colIndex}>#</th>
 <th>Name</th>
 <th>Phone</th>
 <th>Remarks</th>
 <th>Direct</th>
 <th>Address</th>
 <th>Department</th>
 </tr>
 </thead>
 <tbody>
 {contacts.map((contact) => (
 <tr key={contact.id}>
 <td className={styles.colIndex}>{contact.id}</td>
 <td style={{ fontWeight: 500 }}>{contact.name}</td>
 <td>{contact.phone}</td>
 <td>{contact.remarks}</td>
 <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{contact.direct}</td>
 <td>{contact.address}</td>
 <td>{contact.department}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 </div>
 );
};

export default ContactList;
