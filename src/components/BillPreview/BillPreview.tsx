import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft, Download, FileText, AlertCircle } from 'lucide-react';
import { patientApi, type PatientBillRecord, type PatientRecord } from '../../api/patientApi';
import { openPatientBillPdf, formatBillDate } from '../../utils/patientBillGenerator';
import tulipLogo from '../../assets/unicare_tulip.png';
import nabhSeal from '../../assets/nabh_seal.png';
import styles from './BillPreview.module.css';


export const BillPreview: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bill, setBill] = useState<PatientBillRecord | null>(null);
  const [patient, setPatient] = useState<PatientRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idParam = params.get('id') || params.get('uhid');

    if (!idParam) {
      setError('No patient specified. Please provide a valid patient UHID to preview bill.');
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch patient
        const pRes = await patientApi.getPatientById(idParam);
        if (!pRes.patient) {
          throw new Error(`Patient '${idParam}' could not be found.`);
        }
        setPatient(pRes.patient);

        // Fetch or create bill
        let b = await patientApi.getPatientBill(idParam);
        if (!b) {
          b = await patientApi.createOrGetPatientBill(idParam);
        }
        setBill(b);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bill information.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [location.search]);

  const handlePrint = () => {
    window.print();
  };

  const handleOpenPdfTab = async () => {
    if (!bill) return;
    const backendUrl = patientApi.getBillPdfUrl(bill.uhid);
    await openPatientBillPdf(bill, backendUrl);
  };

  const handleBack = () => {
    if (patient) {
      navigate(`/patient-registration?id=${encodeURIComponent(patient.uhid)}`);
    } else {
      navigate('/patient-registration');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.previewContainer}>
        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>
            Loading Bill & Receipt Preview...
          </div>
          <div style={{ fontSize: '0.85rem' }}>Please wait while billing records are retrieved.</div>
        </div>
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className={styles.previewContainer}>
        <div className={styles.topBar}>
          <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => navigate('/patient-registration')}>
            <ArrowLeft size={15} /> Back to Patient Registration
          </button>
        </div>
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '24px', background: '#fee2e2', borderRadius: '8px', color: '#991b1b', border: '1px solid #f87171' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '1rem', marginBottom: '8px' }}>
            <AlertCircle size={20} /> Bill Could Not Be Loaded
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>{error || 'Unable to retrieve bill for this patient.'}</p>
        </div>
      </div>
    );
  }

  const ageStr = bill.age ? `${bill.age} ${bill.ageUnit || 'Yrs.'}` : 'N/A';
  const receivedStr = Number(bill.amountReceived || 0).toFixed(2);
  const totalStr = Number(bill.totalAmount || 0).toFixed(2);
  const dueStr = Number(bill.dueAmount || 0).toFixed(2);
  const entryDate = formatBillDate(bill.billDate || bill.createdAt, true);

  return (
    <div className={styles.previewContainer}>
      {/* Top Action Bar (Hidden in Print) */}
      <div className={styles.topBar}>
        <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={handleBack}>
          <ArrowLeft size={15} /> Back to Registration
        </button>

        <h2 className={styles.barTitle}>
          Bill Cum Receipt • <span style={{ color: '#0d9488' }}>{bill.invoiceNo}</span>
        </h2>

        <div className={styles.barActions}>
          <button type="button" className={`${styles.btn} ${styles.btnPrint}`} onClick={handlePrint}>
            <Printer size={15} /> Print Bill
          </button>
          <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleOpenPdfTab}>
            <Download size={15} /> Open PDF in Tab
          </button>
        </div>
      </div>

      {/* Bill Paper Container */}
      <div className={styles.billPaper}>
        <div className={styles.billOuterBox}>
          {/* 1. Hospital Header */}
          <header className={styles.billHeader}>
            <div className={styles.headerLogoLeft}>
              <img src={tulipLogo} alt="UNICARE Emblem" className={styles.tulipImg} />
            </div>
            <div className={styles.headerCenterText}>
              <h1 className={styles.hospitalName}>UNICARE</h1>
              <div className={styles.hospitalSubtitle}>HEART INSTITUTE & RESEARCH CENTER</div>
              <div className={styles.hospitalManaged}>(Managed By : South Gujarat Cardiac Care Pvt. Ltd.)</div>
              <div className={styles.hospitalCin}>CIN No. - U85110GJ2013PTC073815</div>
              <div className={styles.hospitalAddress}>
                Acme Plaza, B-Wing, Near Sosyo Circle, Behind New Civil Hospital, Canal Road, Surat-395002
              </div>
              <div className={styles.hospitalContact}>
                Ph: 0261-2639700/9800 | E-mail: unicareheartinstitute@gmail.com
              </div>
            </div>
            <div className={styles.headerLogoRight}>
              <img src={nabhSeal} alt="NABH Accreditation" className={styles.nabhImg} />
            </div>
          </header>


          {/* 2. Bill Title Band */}
          <div className={styles.billTitleBand}>BILL CUM RECEIPT</div>

          {/* 3. Patient & Invoice Information Grid */}
          <div className={styles.patientGrid}>
            <div className={styles.patientColLeft}>
              <div className={styles.gridRow}>
                <span className={styles.gridLabel}>Name</span>
                <span className={styles.gridColon}>:</span>
                <span className={`${styles.gridVal} ${styles.gridValBold}`}>{bill.patientName}</span>
              </div>
              <div className={styles.gridRow}>
                <span className={styles.gridLabel}>Age / Sex</span>
                <span className={styles.gridColon}>:</span>
                <span className={styles.gridVal}>
                  {ageStr} / {bill.sex}{' '}
                  <span style={{ marginLeft: '24px', fontWeight: 700 }}>Mobile :</span> {bill.mobile || 'N/A'}
                </span>
              </div>
              <div className={styles.gridRow}>
                <span className={styles.gridLabel}>Treating Dr</span>
                <span className={styles.gridColon}>:</span>
                <span className={styles.gridVal}>{bill.treatingDoctor}</span>
              </div>
              <div className={styles.gridRow}>
                <span className={styles.gridLabel}>Reference Dr</span>
                <span className={styles.gridColon}>:</span>
                <span className={styles.gridVal}>{bill.referenceDoctor}</span>
              </div>
            </div>

            <div className={styles.patientColRight}>
              <div className={styles.gridRow}>
                <span className={styles.gridLabel}>UHID</span>
                <span className={styles.gridColon}>:</span>
                <span className={`${styles.gridVal} ${styles.gridValBold}`}>{bill.uhid}</span>
              </div>
              <div className={styles.gridRow}>
                <span className={styles.gridLabel}>Invoice No.</span>
                <span className={styles.gridColon}>:</span>
                <span className={`${styles.gridVal} ${styles.gridValBold}`}>{bill.invoiceNo}</span>
              </div>
              <div className={styles.gridRow}>
                <span className={styles.gridLabel}>Date</span>
                <span className={styles.gridColon}>:</span>
                <span className={styles.gridVal}>{formatBillDate(bill.billDate || bill.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* 4. Bill Items Table */}
          <table className={styles.itemsTable}>
            <thead>
              <tr>
                <th style={{ width: '10%', textAlign: 'center' }}>Sr. No.</th>
                <th style={{ width: '70%' }}>Details</th>
                <th style={{ width: '20%', textAlign: 'right' }}>Rate</th>
              </tr>
            </thead>
            <tbody>
              {bill.items.map((item, index) => (
                <tr key={index} className={index === bill.items.length - 1 ? styles.tableBottomBorder : undefined}>
                  <td style={{ textAlign: 'center' }}>{item.srNo}</td>
                  <td>{item.details}</td>
                  <td style={{ textAlign: 'right' }}>{Number(item.rate).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 5. Payment Details & Totals */}
          <div className={styles.paymentSection}>
            <div className={styles.paymentReceiptBox}>
              <table className={styles.receiptTable}>
                <thead>
                  <tr>
                    <th>Rec.Date</th>
                    <th>Receipt No</th>
                    <th style={{ textAlign: 'right' }}>Amt.</th>
                    <th style={{ textAlign: 'center' }}>Payment Type</th>
                    <th>User</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{formatBillDate(bill.billDate || bill.createdAt)}</td>
                    <td>{bill.receiptNo || bill.invoiceNo}</td>
                    <td style={{ textAlign: 'right' }}>{receivedStr}</td>
                    <td style={{ textAlign: 'center' }}>{bill.paymentType || 'Cash'}</td>
                    <td className={styles.entryInfo}>
                      EntryBy:{bill.entryBy || 'Jenil Bundela'},<br />
                      PCName:{bill.pcName || 'RECEPTION1'},<br />
                      At:{entryDate}.
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ textAlign: 'right', paddingRight: '120px', borderTop: '1px solid #cbd5e1', paddingTop: '2px', fontWeight: 700 }}>
                {receivedStr}
              </div>
            </div>

            <div className={styles.totalsBox}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total</span>
                <span>:</span>
                <span className={styles.totalValue}>{totalStr}</span>
              </div>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Received</span>
                <span>:</span>
                <span className={styles.totalValue}>{receivedStr}</span>
              </div>
              <div className={`${styles.totalRow} ${styles.dueRow}`}>
                <span className={styles.totalLabel}>Due</span>
                <span>:</span>
                <span className={styles.totalValue}>{dueStr}</span>
              </div>
            </div>
          </div>

          {/* 6. Footer Notes & Signatory */}
          <footer className={styles.billFooter}>
            <div>
              <div>Subject to SURAT Jurisdiction</div>
              <div>Payment by cheque Subject To Realization</div>
              <div style={{ marginTop: '2px', color: '#64748b' }}>
                EntryBy:{bill.entryBy || 'Jenil Bundela'}, PCName:{bill.pcName || 'RECEPTION1'}, At:{entryDate}.
              </div>
            </div>
            <div className={styles.signatory}>
              Authorized Signatory
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default BillPreview;
