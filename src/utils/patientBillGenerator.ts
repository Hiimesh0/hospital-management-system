/**
 * Patient Bill & Receipt Generator (Client-Side & Utilities)
 * Generates an A4 portrait printable 'BILL CUM RECEIPT' matching Bill.jpeg visual reference.
 * Provides fallback generation via jsPDF for static deployments.
 */

import { jsPDF } from 'jspdf';
import type { PatientBillRecord } from '../api/patientApi';
import { HOSPITAL_CONFIG } from '../config/hospitalConfig';

export const BILL_CONFIG = {
  widthMm: 210, // A4 Portrait width
  heightMm: 297, // A4 Portrait height
  marginLeftMm: 10,
  marginTopMm: 10,
  marginRightMm: 10,
  boxWidthMm: 190,
  boxHeightMm: 152,
};

/**
 * Format date string into DD-Mon-YYYY (e.g. 28-Oct-2026) or with time
 */
export function formatBillDate(dateStr?: string, includeTime: boolean = false): string {
  if (!dateStr) {
    const d = new Date();
    return formatNativeDate(d, includeTime);
  }

  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return dateStr;
    }
    return formatNativeDate(d, includeTime);
  } catch {
    return dateStr;
  }
}

function formatNativeDate(d: Date, includeTime: boolean): string {
  const day = String(d.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const datePart = `${day}-${month}-${year}`;

  if (!includeTime) return datePart;

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  const hoursStr = String(hours).padStart(2, '0');
  return `${datePart} ${hoursStr}:${minutes}:${seconds} ${ampm}`;
}

/**
 * Generate an A4 Portrait PDF Blob matching Bill.jpeg using jsPDF
 */
export function generatePatientBillPdfBlob(bill: PatientBillRecord): Blob {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const boxX = BILL_CONFIG.marginLeftMm;
  const boxY = BILL_CONFIG.marginTopMm;
  const boxW = BILL_CONFIG.boxWidthMm;
  const boxH = BILL_CONFIG.boxHeightMm;

  // Outer Border Box
  doc.setDrawColor(50, 50, 50);
  doc.setLineWidth(0.35);
  doc.rect(boxX, boxY, boxW, boxH);

  // 1. Hospital Header
  let currY = boxY + 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(25, 25, 25);
  doc.text(HOSPITAL_CONFIG.name || 'XYZ', boxX + boxW / 2, currY, { align: 'center' });

  if (HOSPITAL_CONFIG.subTitle) {
    currY += 4.5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(40, 40, 40);
    doc.text(HOSPITAL_CONFIG.subTitle, boxX + boxW / 2, currY, { align: 'center' });
  }

  if (HOSPITAL_CONFIG.managedBy) {
    currY += 3.8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(60, 60, 60);
    doc.text(HOSPITAL_CONFIG.managedBy, boxX + boxW / 2, currY, { align: 'center' });
  }

  if (HOSPITAL_CONFIG.cinNo) {
    currY += 3.5;
    doc.setFontSize(7.0);
    doc.text(`CIN No. - ${HOSPITAL_CONFIG.cinNo}`, boxX + boxW / 2, currY, { align: 'center' });
  }

  currY += 4.0;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(50, 50, 50);
  doc.text(
    HOSPITAL_CONFIG.address || 'XYZ',
    boxX + boxW / 2,
    currY,
    { align: 'center' }
  );

  currY += 3.2;
  doc.text(
    `Ph: ${HOSPITAL_CONFIG.phone || 'XYZ'}  |  E-mail: ${HOSPITAL_CONFIG.email || 'XYZ'}`,
    boxX + boxW / 2,
    currY,
    { align: 'center' }
  );

  // Header Divider
  currY += 4.2;
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.3);
  doc.line(boxX, currY, boxX + boxW, currY);

  // 2. Title Band: BILL CUM RECEIPT
  const titleH = 6.2;
  doc.setFillColor(225, 228, 232);
  doc.rect(boxX, currY, boxW, titleH, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(20, 20, 20);
  doc.text('BILL CUM RECEIPT', boxX + boxW / 2, currY + 4.5, { align: 'center' });

  currY += titleH;
  doc.line(boxX, currY, boxX + boxW, currY);

  // 3. Patient & Invoice Details Grid
  const col1LabelX = boxX + 3.0;
  const col1ValX = boxX + 27.0;
  const col2LabelX = boxX + 138.0;
  const col2ValX = boxX + 160.0;

  const patientName = (bill.patientName || 'UNKNOWN PATIENT').toUpperCase();
  const age = (bill.age || '').trim();
  const ageUnit = (bill.ageUnit || 'Yrs.').trim();
  const ageStr = age ? `${age} ${ageUnit}` : 'N/A';
  const sex = (bill.sex || 'N/A').trim();
  const mobile = (bill.mobile || '').trim() || 'N/A';
  const doctor = (bill.treatingDoctor || 'Dr. NILESH MAHALE').toUpperCase();
  const refDr = (bill.referenceDoctor || '---').toUpperCase() || '---';

  const uhid = bill.uhid || bill.patientId || '';
  const invoiceNo = bill.invoiceNo || '';
  const billDate = formatBillDate(bill.billDate || bill.createdAt);

  let rowY = currY + 4.0;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.0);
  doc.setTextColor(30, 30, 30);

  // Row 1: Name & UHID
  doc.text('Name', col1LabelX, rowY);
  doc.text(':', col1ValX - 3.0, rowY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.text(patientName.substring(0, 52), col1ValX, rowY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.0);
  doc.text('UHID', col2LabelX, rowY);
  doc.text(':', col2ValX - 3.0, rowY);
  doc.text(uhid, col2ValX, rowY);

  // Row 2: Age / Sex, Mobile, & Invoice No.
  rowY += 4.5;
  doc.text('Age / Sex', col1LabelX, rowY);
  doc.text(':', col1ValX - 3.0, rowY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${ageStr} / ${sex}`, col1ValX, rowY);

  doc.setFont('helvetica', 'bold');
  doc.text('Mobile :', col1ValX + 34.0, rowY);
  doc.setFont('helvetica', 'normal');
  doc.text(mobile, col1ValX + 48.0, rowY);

  doc.setFont('helvetica', 'bold');
  doc.text('Invoice No.', col2LabelX, rowY);
  doc.text(':', col2ValX - 3.0, rowY);
  doc.text(invoiceNo, col2ValX, rowY);

  // Row 3: Treating Dr & Date
  rowY += 4.5;
  doc.text('Treating Dr', col1LabelX, rowY);
  doc.text(':', col1ValX - 3.0, rowY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.text(doctor.substring(0, 52), col1ValX, rowY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.0);
  doc.text('Date', col2LabelX, rowY);
  doc.text(':', col2ValX - 3.0, rowY);
  doc.setFont('helvetica', 'normal');
  doc.text(billDate, col2ValX, rowY);

  // Row 4: Reference Dr
  rowY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.text('Reference Dr', col1LabelX, rowY);
  doc.text(':', col1ValX - 3.0, rowY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.text(refDr.substring(0, 52), col1ValX, rowY);

  currY = rowY + 5.5;
  doc.line(boxX, currY, boxX + boxW, currY);

  // 4. Bill Items Table
  let tableY = currY;
  const wSr = 18.0;
  const wDet = 132.0;
  const wRate = 40.0;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.text('Sr. No.', boxX + wSr / 2, tableY + 4.0, { align: 'center' });
  doc.text(' Details', boxX + wSr, tableY + 4.0);
  doc.text('Rate   ', boxX + boxW - 3.0, tableY + 4.0, { align: 'right' });

  tableY += 5.5;
  doc.line(boxX, tableY, boxX + boxW, tableY);

  // Items
  const items = bill.items && bill.items.length > 0 ? bill.items : [
    { srNo: 1, details: 'OPD Consultation / Registration Charge', rate: 500, amount: 500 }
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.0);
  for (const it of items) {
    const rateVal = Number(it.rate || it.amount || 0);
    const rateStr = Number.isInteger(rateVal) ? rateVal.toFixed(0) : rateVal.toFixed(2);
    doc.text(String(it.srNo || 1), boxX + wSr / 2, tableY + 4.0, { align: 'center' });
    doc.text(` ${it.details}`, boxX + wSr, tableY + 4.0);
    doc.text(`${rateStr}   `, boxX + boxW - 3.0, tableY + 4.0, { align: 'right' });
    tableY += 5.2;
  }

  tableY = Math.max(tableY, currY + 16.0);
  doc.line(boxX, tableY, boxX + boxW, tableY);

  // 5. Payment & Totals Section
  const totalsStartY = tableY + 1.5;
  const recBoxX = boxX + 3.0;
  const recBoxY = totalsStartY;
  const recBoxW = 126.0;
  const recBoxH = 24.5;

  doc.rect(recBoxX, recBoxY, recBoxW, recBoxH);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.text(' Rec.Date', recBoxX + 1.0, recBoxY + 3.5);
  doc.text('Receipt No', recBoxX + 19.0, recBoxY + 3.5);
  doc.text('Amt.', recBoxX + 43.0, recBoxY + 3.5, { align: 'right' });
  doc.text('Payment Type', recBoxX + 56.0, recBoxY + 3.5, { align: 'center' });
  doc.text('User', recBoxX + 78.0, recBoxY + 3.5);

  const recDateShort = formatBillDate(bill.billDate || bill.createdAt);
  const receivedVal = Number(bill.amountReceived || 0);
  const receivedStr = Number.isInteger(receivedVal) ? receivedVal.toFixed(0) : receivedVal.toFixed(2);
  const paymentType = bill.paymentType || 'Cash';
  const entryBy = bill.entryBy || 'Jenil Bundela';
  const pcName = bill.pcName || 'RECEPTION1';
  const entryTime = formatBillDate(bill.billDate || bill.createdAt, true);

  const rowRecY = recBoxY + 7.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.0);
  doc.text(` ${recDateShort}`, recBoxX + 1.0, rowRecY);
  doc.text(bill.receiptNo || invoiceNo, recBoxX + 19.0, rowRecY);
  doc.text(receivedStr, recBoxX + 43.0, rowRecY, { align: 'right' });
  doc.text(paymentType, recBoxX + 56.0, rowRecY, { align: 'center' });

  doc.text(`EntryBy:${entryBy},`, recBoxX + 78.0, rowRecY);
  doc.text(`PCName:${pcName},`, recBoxX + 78.0, rowRecY + 3.2);
  doc.text(`At:${entryTime}.`, recBoxX + 78.0, rowRecY + 6.4);

  // Line & sum in receipt box
  doc.line(recBoxX + 30.0, rowRecY + 9.5, recBoxX + 45.0, rowRecY + 9.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(receivedStr, recBoxX + 43.0, rowRecY + 13.0, { align: 'right' });

  // Right Totals
  const totalVal = Number(bill.totalAmount || 0);
  const dueVal = Number(bill.dueAmount || 0);
  const totalStr = Number.isInteger(totalVal) ? totalVal.toFixed(0) : totalVal.toFixed(2);
  const dueStr = Number.isInteger(dueVal) ? dueVal.toFixed(0) : dueVal.toFixed(2);

  const totLabelX = boxX + 138.0;
  const totValX = boxX + 165.0;
  let totY = totalsStartY + 4.5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.text('Total', totLabelX, totY);
  doc.text(':', totValX - 3.0, totY);
  doc.text(totalStr, totValX + 18.0, totY, { align: 'right' });

  totY += 5.0;
  doc.text('Received', totLabelX, totY);
  doc.text(':', totValX - 3.0, totY);
  doc.text(receivedStr, totValX + 18.0, totY, { align: 'right' });

  totY += 12.0;
  doc.setFontSize(9.0);
  doc.text('Due', totLabelX, totY);
  doc.text(':', totValX - 3.0, totY);
  doc.text(dueStr, totValX + 18.0, totY, { align: 'right' });

  // 6. Footer Section
  const footerY = recBoxY + recBoxH + 4.0;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.0);
  doc.setTextColor(50, 50, 50);

  doc.text('Subject to SURAT Jurisdiction', boxX + 3.0, footerY);
  doc.text('Payment by cheque Subject To Realization', boxX + 3.0, footerY + 3.5);
  doc.text(`EntryBy:${entryBy}, PCName:${pcName}, At:${entryTime}.`, boxX + 3.0, footerY + 7.0);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Authorized Signatory', boxX + boxW - 25.0, footerY + 6.0, { align: 'center' });

  return doc.output('blob');
}

/**
 * Open or print the patient bill PDF in a new browser tab with popup blocker protection
 */
export async function openPatientBillPdf(
  bill: PatientBillRecord,
  backendUrl?: string
): Promise<void> {
  const win = window.open('about:blank', '_blank');
  if (win) {
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Generating Bill - ${bill.invoiceNo}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background-color: #f8fafc;
              color: #334155;
            }
            .spinner {
              width: 38px;
              height: 38px;
              border: 3px solid #cbd5e1;
              border-top-color: #0d9488;
              border-radius: 50%;
              animation: spin 0.8s linear infinite;
              margin-bottom: 16px;
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div class="spinner"></div>
          <p style="font-weight: 600; font-size: 1.05rem; margin-bottom: 4px;">Preparing Bill & Receipt (${bill.invoiceNo})...</p>
          <p style="font-size: 0.85rem; color: #64748b;">Generating printable A4 bill for ${bill.patientName} (${bill.uhid})</p>
        </body>
      </html>
    `);
  }

  try {
    let targetPdfUrl = '';
    if (backendUrl) {
      try {
        const testRes = await fetch(backendUrl, { method: 'HEAD' });
        if (testRes.ok) {
          targetPdfUrl = backendUrl;
        }
      } catch {
        // Fallback to client-side generation
      }
    }

    if (!targetPdfUrl) {
      const blob = generatePatientBillPdfBlob(bill);
      targetPdfUrl = URL.createObjectURL(blob);
    }

    if (win) {
      win.location.href = targetPdfUrl;
    } else {
      window.open(targetPdfUrl, '_blank');
    }
  } catch (err) {
    if (win) {
      win.document.body.innerHTML = `
        <div style="padding: 24px; text-align: center; color: #b91c1c; font-family: sans-serif;">
          <h3>Failed to Generate Bill PDF</h3>
          <p>${err instanceof Error ? err.message : 'An unexpected error occurred.'}</p>
        </div>
      `;
    }
  }
}
