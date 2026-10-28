/**
 * Patient Sticker PDF Generator (Client-Side & Utilities)
 * Generates an A4 portrait printable PDF (210mm x 297mm) containing the individual
 * 100mm x 50mm patient identification sticker matching Sticker.jpeg reference.
 * Includes Code 128 barcode encoding the patient's UHID.
 * The sticker retains its physical dimensions and is not stretched across the page.
 */

import { jsPDF } from 'jspdf';
import JsBarcode from 'jsbarcode';
import type { PatientRecord } from '../api/patientApi';
import { HOSPITAL_CONFIG } from '../config/hospitalConfig';

// ==============================================================================
// Configurable A4 Page & Sticker Measurements (in millimetres)
// ==============================================================================
export const STICKER_A4_CONFIG = {
  // Page specifications (Standard ISO A4)
  pageSize: 'a4',
  pageOrientation: 'portrait' as const,
  pageWidthMm: 210.0,
  pageHeightMm: 297.0,

  // Physical sticker label dimensions (from Sticker.jpeg reference)
  stickerWidthMm: 100.0,
  stickerHeightMm: 50.0,

  // Top-left placement margins on A4 sheet
  leftMarginMm: 15.0,
  topMarginMm: 18.0,

  // Grid / Sheet mode settings
  columns: 1, // Single-sticker mode (primary)
  rows: 1,
  horizontalGapMm: 5.0,
  verticalGapMm: 5.0,

  // Visual guide settings
  drawCuttingGuide: true, // Subtle border showing 100x50mm sticker boundary
  guideColorRgb: [180, 192, 208] as [number, number, number],
  guideLineWidthMm: 0.15,

  // Sheet header settings
  showSheetHeader: true,
};

// Backward compatibility alias
export const STICKER_CONFIG = {
  widthMm: STICKER_A4_CONFIG.stickerWidthMm,
  heightMm: STICKER_A4_CONFIG.stickerHeightMm,
  marginLeftMm: STICKER_A4_CONFIG.leftMarginMm,
  marginTopMm: STICKER_A4_CONFIG.topMarginMm,
  barcodeWidthMm: 44.0,
  barcodeHeightMm: 11.5,
  barcodeXMm: 51.0,
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
 * Render an individual sticker at origin (x0, y0) on the jsPDF document
 */
function renderSingleStickerToDoc(
  doc: jsPDF,
  x0: number,
  y0: number,
  patient: PatientRecord,
  barcodeDataUrl?: string
): void {
  const sw = STICKER_A4_CONFIG.stickerWidthMm;
  const sh = STICKER_A4_CONFIG.stickerHeightMm;

  // 1. Subtle cutting / peel guide outline (0.15 mm line)
  if (STICKER_A4_CONFIG.drawCuttingGuide) {
    doc.setDrawColor(
      STICKER_A4_CONFIG.guideColorRgb[0],
      STICKER_A4_CONFIG.guideColorRgb[1],
      STICKER_A4_CONFIG.guideColorRgb[2]
    );
    doc.setLineWidth(STICKER_A4_CONFIG.guideLineWidthMm);
    doc.rect(x0, y0, sw, sh);
  }

  // Extract patient demographic details
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

  // Offsets inside 100mm x 50mm sticker
  const col1X = x0 + 4.0;
  const col1LabelW = 17.0;
  const col1ValX = col1X + col1LabelW + 1.0;
  const col2X = x0 + 48.0;

  // Styling: Bold Helvetica, pure black
  doc.setTextColor(0, 0, 0);

  // Line 1: Name (y = y0 + 6.8mm)
  let y = y0 + 6.8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Name      :', col1X, y);
  doc.setFontSize(8.5);
  doc.text(fullName.substring(0, 42), col1ValX, y);

  // Line 2: Age & Sex (y = y0 + 11.4mm)
  y += 4.6;
  doc.setFontSize(8);
  doc.text('Age       :', col1X, y);
  doc.text(ageDisplay, col1ValX, y);
  doc.text(`Sex :${sex}`, col2X, y);

  // Line 3: Address (y = y0 + 16.0mm)
  y += 4.6;
  doc.setFontSize(8);
  doc.text('Address   :', col1X, y);
  doc.setFontSize(7.5);
  doc.text(addressDisplay.substring(0, 50), col1ValX, y);

  // Line 4: Dr.Name (y = y0 + 21.8mm)
  y += 5.8;
  doc.setFontSize(8);
  doc.text('Dr.Name   :', col1X, y);

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

  // Line 5: MOB & Date (y = y0 + 26.4mm)
  y += 4.6;
  doc.setFontSize(8);
  doc.text('MOB       :', col1X, y);
  doc.text(mobile, col1ValX, y);
  doc.text(`Date :${regDate}`, col2X, y);

  // Line 6: Ref.Dr. (y = y0 + 31.0mm)
  y += 4.6;
  doc.text('Ref.Dr.   :', col1X, y);
  doc.text(refDr.substring(0, 28), col1ValX, y);

  // Line 7: UHID + Barcode (y = y0 + 36.2mm)
  y += 5.2;
  doc.setFontSize(8);
  doc.text('UHID      :', col1X, y);
  doc.setFontSize(9);
  doc.text(uhid, col1ValX, y);

  // Embed Barcode at x = x0 + 51.0mm, y = y0 + 33.5mm
  const barcodeX = x0 + 51.0;
  const barcodeY = y0 + 33.5;
  const barcodeW = 44.0;
  const barcodeH = 11.5;

  if (barcodeDataUrl) {
    try {
      doc.addImage(barcodeDataUrl, 'PNG', barcodeX, barcodeY, barcodeW, barcodeH);
    } catch {
      doc.setFontSize(7);
      doc.text(`[${uhid}]`, barcodeX, y);
    }
  } else {
    doc.setFontSize(7);
    doc.text(`[${uhid}]`, barcodeX, y);
  }
}

/**
 * Generate an A4 Portrait PDF Blob (210mm x 297mm) containing the patient sticker
 */
export function generatePatientStickerPdfBlob(patient: PatientRecord): Blob {
  // A4 Portrait: 210mm wide x 297mm high
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // 1. Top Sheet Header outside sticker
  if (STICKER_A4_CONFIG.showSheetHeader) {
    const hName = HOSPITAL_CONFIG.name || 'XYZ';
    const hAddr = HOSPITAL_CONFIG.address || 'XYZ';
    const hPhone = HOSPITAL_CONFIG.phone || 'XYZ';

    doc.setTextColor(110, 120, 135);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(
      `${hName}  |  Patient Identification Label  |  Address: ${hAddr}  |  Ph: ${hPhone}`,
      STICKER_A4_CONFIG.leftMarginMm,
      9.0
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text(
      'A4 Sheet | Print at 100% / Actual Size',
      STICKER_A4_CONFIG.pageWidthMm - 15.0,
      9.0,
      { align: 'right' }
    );
  }

  // Pre-generate barcode data URL
  const uhid = (patient.uhid || patient.id || 'UNKNOWN').trim();
  const barcodeDataUrl = generateBarcodeDataUrl(uhid);

  // 2. Render sticker(s) based on configuration (single-sticker primary)
  const cols = Math.max(1, STICKER_A4_CONFIG.columns);
  const rows = Math.max(1, STICKER_A4_CONFIG.rows);
  const startX = STICKER_A4_CONFIG.leftMarginMm;
  const startY = STICKER_A4_CONFIG.topMarginMm;
  const sw = STICKER_A4_CONFIG.stickerWidthMm;
  const sh = STICKER_A4_CONFIG.stickerHeightMm;
  const hGap = STICKER_A4_CONFIG.horizontalGapMm;
  const vGap = STICKER_A4_CONFIG.verticalGapMm;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const xPos = startX + c * (sw + hGap);
      const yPos = startY + r * (sh + vGap);
      if (
        xPos + sw <= STICKER_A4_CONFIG.pageWidthMm &&
        yPos + sh <= STICKER_A4_CONFIG.pageHeightMm
      ) {
        renderSingleStickerToDoc(doc, xPos, yPos, patient, barcodeDataUrl);
      }
    }
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
          <title>Patient Sticker - ${patient.uhid} (${HOSPITAL_CONFIG.name})</title>
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
          <p style="font-size: 0.85rem; color: #64748b;">Preparing A4 PDF with 100mm × 50mm label & barcode</p>
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
