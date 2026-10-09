import React from 'react';
import { 
 FileText, 
 CreditCard, 
 Activity, 
 PlusCircle, 
 Bed, 
 RefreshCcw, 
 Receipt, 
 History, 
 MessageSquare, 
 Stethoscope, 
 FileOutput, 
 Image as ImageIcon, 
 Pill, 
 Scissors, 
 Calculator, 
 ClipboardSignature, 
 Printer 
} from 'lucide-react';
import styles from './IndoorOption.module.css';

const ActionCard = ({ title, icon: Icon }: { title: string; icon: any }) => (
 <button className={styles.actionCard}>
 <div className={styles.iconWrapper}>
 <Icon size={18} />
 </div>
 <span className={styles.actionTitle}>{title}</span>
 </button>
);

const IndoorOption: React.FC = () => {
 return (
 <div className={styles.pageContainer}>
 
 {/* Context Header */}
 <div className={styles.patientHeader}>
 <div className={styles.patientIdentity}>
 <div className={styles.avatar}>R</div>
 <div>
 <h1 className={styles.patientName}>--</h1>
 <div className={styles.patientDetails}>
 <span>IPD: I/0123/178</span>
 <span>UHID: --</span>
 <span>Male · 45 Years</span>
 <span>Dr. Dipen Bhuva</span>
 </div>
 </div>
 </div>
 </div>

 {/* Group 1: Registration & Core Info */}
 <div className={styles.section}>
 <h2 className={styles.sectionTitle}>Registration & Information</h2>
 <div className={styles.grid}>
 <ActionCard title="Indoor Register" icon={FileText} />
 <ActionCard title="Patient Past Info" icon={History} />
 <ActionCard title="Patient Room Transfer Detail" icon={RefreshCcw} />
 <ActionCard title="Room & Room GST" icon={Bed} />
 </div>
 </div>

 {/* Group 2: Billing & Finance */}
 <div className={styles.section}>
 <h2 className={styles.sectionTitle}>Billing & Finance</h2>
 <div className={styles.grid}>
 <ActionCard title="Deposit" icon={CreditCard} />
 <ActionCard title="Inpatient Bill" icon={Receipt} />
 <ActionCard title="Inpatient Receipt" icon={Receipt} />
 <ActionCard title="Estimate Print" icon={Calculator} />
 <ActionCard title="Additional" icon={PlusCircle} />
 </div>
 </div>

 {/* Group 3: Clinical & Procedures */}
 <div className={styles.section}>
 <h2 className={styles.sectionTitle}>Clinical & Procedures</h2>
 <div className={styles.grid}>
 <ActionCard title="Dr Visit & Procedure" icon={Stethoscope} />
 <ActionCard title="Operation" icon={Scissors} />
 <ActionCard title="OT Entry" icon={Activity} />
 <ActionCard title="Investigation (To Be Ordered)" icon={FileText} />
 <ActionCard title="Diagnostics Entry Check" icon={Activity} />
 <ActionCard title="Medicine" icon={Pill} />
 </div>
 </div>

 {/* Group 4: Documents & Forms */}
 <div className={styles.section}>
 <h2 className={styles.sectionTitle}>Documents & Forms</h2>
 <div className={styles.grid}>
 <ActionCard title="Discharge Card" icon={FileOutput} />
 <ActionCard title="IPD Consent Form" icon={ClipboardSignature} />
 <ActionCard title="CashLess Forms Print" icon={Printer} />
 <ActionCard title="Endo/Lapro Image Print" icon={ImageIcon} />
 <ActionCard title="Feedback Form" icon={MessageSquare} />
 </div>
 </div>

 </div>
 );
};

export default IndoorOption;
