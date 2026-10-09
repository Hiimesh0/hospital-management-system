import React from 'react';
import { X, Plus, Edit2, Trash2, Printer, Search } from 'lucide-react';
import styles from './ContactList.module.css';

const ContactList: React.FC = () => {
 const contacts = [
 { id: 1, name: 'Darshan - SSD', phone: '9723200078', remarks: 'Sunil Medico Software Person', direct: '', address: '', department: '' },
 { id: 2, name: 'Jayesh - SSD', phone: '9714108007', remarks: 'Sunil Medico Software', direct: '*8233', address: '', department: '' },
 { id: 3, name: 'Maganbhai', phone: '', remarks: '', direct: '*8103', address: '', department: '' },
 { id: 4, name: 'Mahipal Mahida', phone: '9574077710', remarks: 'Billing Assistant', direct: '*8287', address: '', department: '' },
 { id: 5, name: 'Mitesh Jadav', phone: '9537198172', remarks: 'Billing Assistant', direct: '*8174', address: '', department: '' },
 { id: 6, name: 'Mr. Vinay Patel', phone: '9624491510', remarks: 'Assi Admin Manager', direct: '', address: '', department: '' },
 { id: 7, name: 'Nitin Padvi', phone: '9726858948', remarks: 'Billing Assistant', direct: '..........0', address: '', department: '' },
 { id: 8, name: 'SSd', phone: '8306560717', remarks: '', direct: '*8135', address: '', department: '' },
 { id: 9, name: 'Sunil Medico Softwares', phone: '912555/02613252322', remarks: 'Meena Madam', direct: '', address: '', department: '' },
 { id: 10, name: 'Sunilbhai', phone: '9374706801', remarks: '', direct: '', address: '', department: '' },
 { id: 11, name: 'Suresh - SSD', phone: '8460510348', remarks: 'Sunil Medico Software', direct: '', address: '', department: '' },
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
 <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: '#98A2B3' }} />
 <input type="text" className={styles.input} style={{ paddingLeft: '36px' }} />
 </div>
 </div>
 
 <div className={styles.fieldGroup}>
 <label className={styles.label}>Search By Remarks</label>
 <div style={{ position: 'relative' }}>
 <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: '#98A2B3' }} />
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
 <td style={{ fontFamily: 'monospace', color: '#475467' }}>{contact.direct}</td>
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
