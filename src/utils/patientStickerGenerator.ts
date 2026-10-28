/**
 * Patient Sticker PDF Generator (Client-Side & Utilities)
 * Generates 100mm x 50mm landscape patient identification stickers matching Sticker.jpeg.
 * Includes Code 128 barcode encoding the patient's UHID.
 */

import { jsPDF } from 'jspdf';
import JsBarcode from 'jsbarcode';
import type { PatientRecord } from '../api/patientApi';

export const STICKER_CONFIG = {
  widthMm: 100,
  heightMm: 50,
  marginLeftMm: 4,
  marginTopMm: 4,
  marginRightMm: 4,
  barcodeWidthMm: 44,
  barcodeHeightMm: 11.5,
  barcodeXMm: 51,
  barcodeYMm: 33.5,
};

/**
 * Format date string into DD-Mon-YYYY (e.g. 28-Oct-2026)
 */
export function formatStickerDate(dateStr?: string): string {
  if (!dateStr) {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day}-${months[d.getMonth()]}-${d.getFullYear()}`;
  }

  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return dateStr;
    }
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day}-${months[d.getMonth()]}-${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

/**
 * Generate a Code 128 barcode as a Data URL (PNG) using HTML5 Canvas
 */
export function generateBarcodeDataUrl(text: string): string {
  if (typeof document === 'undefined') {
    return '';
  }

  const canvas = document.createElement('canvas');
  JsBarcode(canvas, text, {
    format: 'CODE128',
    width: 2,
    height: 48,
    displayValue: false, // UHID is printed cleanly alongside in high-quality text
    margin: 2,
    background: '#ffffff',
    lineColor: '#000000',
  });
  return canvas.toDataURL('image/png');
}

/**
 * Generate a 100mm x 50mm PDF Blob for the given patient record
 */
export function generatePatientStickerPdfBlob(patient: PatientRecord): Blob {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [STICKER_CONFIG.widthMm, STICKER_CONFIG.heightMm],
  });

  const fullParts = [patient.firstName, patient.middleName, patient.lastName]
    .map(s => (s || '').trim().toUpperCase())
    .filter(Boolean);
  const fullName = fullParts.join(' ') || 'UNKNOWN PATIENT';

  const age = (patient.age || '').trim();
  let ageUnit = (patient.ageUnit || 'Yrs.').trim();
  if (ageUnit.toLowerCase() === 'years' || ageUnit.toLowerCase() === 'year') {
    ageUnit = 'Yrs.';
  }
  const ageDisplay = age ? `${age} ${ageUnit}` : 'N/A';
  const sex = (patient.sex || 'N/A').trim();

  // Address
  const addrParts = [patient.streetAddress, patient.city, patient.state, patient.pinCode]
    .map(s => (s || '').trim().toUpperCase())
    .filter(Boolean);
  const addressDisplay = addrParts.join('  ') || 'N/A';

  const doctor = (patient.hospitalDoctor || 'N/A').trim().toUpperCase();
  const refDr = (patient.referenceBy || '').trim().toUpperCase() || '-';
  const mobile = (patient.mobile || '').trim() || 'N/A';
  const regDate = formatStickerDate(patient.createdAt || patient.birthDate);
  const uhid = (patient.uhid || patient.id || 'UNKNOWN').trim();

  // Styling: Bold Helvetica, pure black
  doc.setTextColor(0, 0, 0);

  const col1LabelW = 17;
  const col1ValX = STICKER_CONFIG.marginLeftMm + col1LabelW + 1;
  const col2X = 48;

  // Line 1: Name (y = 6mm baseline)
  let y = 6.8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Name      :', STICKER_CONFIG.marginLeftMm, y);
  doc.setFontSize(8.5);
  doc.text(fullName.substring(0, 42), col1ValX, y);

  // Line 2: Age & Sex (y = 11.4mm)
  y += 4.6;
  doc.setFontSize(8);
  doc.text('Age       :', STICKER_CONFIG.marginLeftMm, y);
  doc.text(ageDisplay, col1ValX, y);
  doc.text(`Sex :${sex}`, col2X, y);

  // Line 3: Address (y = 16.0mm)
  y += 4.6;
  doc.setFontSize(8);
  doc.text('Address   :', STICKER_CONFIG.marginLeftMm, y);
  doc.setFontSize(7.5);
  doc.text(addressDisplay.substring(0, 50), col1ValX, y);

  // Line 4: Dr.Name (y = 21.8mm - spacing gap matching Sticker.jpeg)
  y += 5.8;
  doc.setFontSize(8);
  doc.text('Dr.Name   :', STICKER_CONFIG.marginLeftMm, y);

  if (doctor.length > 36) {
    const parts = doctor.split(' / ');
    if (parts.length >= 2) {
      const line1 = parts[0] + ' /';
      const line2 = parts.slice(1).join(' / ');
      doc.text(line1, col1ValX, y);
      y += 3.6;
      doc.text(line2, col1ValX, y);
    } else {
      doc.text(doctor.substring(0, 36), col1ValX, y);
      y += 3.6;
      doc.text(doctor.substring(36), col1ValX, y);
    }
  } else {
    doc.text(doctor, col1ValX, y);
  }

  // Line 5: MOB & Date (y = 26.4mm)
  y += 4.6;
  doc.setFontSize(8);
  doc.text('MOB       :', STICKER_CONFIG.marginLeftMm, y);
  doc.text(mobile, col1ValX, y);
  doc.text(`Date :${regDate}`, col2X, y);

  // Line 6: Ref.Dr. (y = 31.0mm)
  y += 4.6;
  doc.text('Ref.Dr.   :', STICKER_CONFIG.marginLeftMm, y);
  doc.text(refDr.substring(0, 28), col1ValX, y);

  // Line 7: UHID + Barcode (y = 36.2mm)
  y += 5.2;
  doc.setFontSize(8);
  doc.text('UHID      :', STICKER_CONFIG.marginLeftMm, y);
  doc.setFontSize(9);
  doc.text(uhid, col1ValX, y);

  // Embed Barcode
  try {
    const barcodeDataUrl = generateBarcodeDataUrl(uhid);
    if (barcodeDataUrl) {
      doc.addImage(
        barcodeDataUrl,
        'PNG',
        STICKER_CONFIG.barcodeXMm,
        STICKER_CONFIG.barcodeYMm,
        STICKER_CONFIG.barcodeWidthMm,
        STICKER_CONFIG.barcodeHeightMm
      );
    }
  } catch {
    // If barcode rendering fails, fallback to boxed human-readable text
    doc.setFontSize(7);
    doc.text(`[${uhid}]`, STICKER_CONFIG.barcodeXMm, y);
  }

  return doc.output('blob');
}

/**
 * Open or print the patient sticker PDF in a new tab with popup blocker protection
 */
export async function openPatientStickerPdf(
  patient: PatientRecord,
  backendUrl?: string
): Promise<void> {
  // 1. Immediately open window to avoid popup blocker
  const win = window.open('about:blank', '_blank');
  if (win) {
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Generating Patient Sticker - ${patient.uhid}</title>
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
              width: 36px;
              height: 36px;
              border: 3px solid #cbd5e1;
              border-top-color: #2563eb;
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
          <p style="font-weight: 500;">Generating Patient Sticker (${patient.uhid})...</p>
          <p style="font-size: 0.85rem; color: #64748b;">Preparing 100mm × 50mm PDF label with barcode</p>
        </body>
      </html>
    `);
  }

  try {
    // Try backend PDF endpoint first if available
    let targetPdfUrl = '';
    if (backendUrl) {
      try {
        const testRes = await fetch(backendUrl, { method: 'HEAD' });
        if (testRes.ok) {
          targetPdfUrl = backendUrl;
        }
      } catch {
        // Backend not directly accessible -> fallback to client-side generation
      }
    }

    if (!targetPdfUrl) {
      const blob = generatePatientStickerPdfBlob(patient);
      targetPdfUrl = URL.createObjectURL(blob);
    }

    if (win) {
      win.location.href = targetPdfUrl;
    } else {
      // If window.open was blocked entirely, create hidden link and click
      const a = document.createElement('a');
      a.href = targetPdfUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  } catch (err) {
    if (win) {
      win.document.body.innerHTML = `
        <div style="padding: 24px; text-align: center; color: #dc2626; font-family: sans-serif;">
          <h3>Failed to Generate Patient Sticker</h3>
          <p>${err instanceof Error ? err.message : 'Unknown error'}</p>
        </div>
      `;
    }
    throw err;
  }
}
