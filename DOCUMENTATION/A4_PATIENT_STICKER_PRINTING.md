# A4 PATIENT STICKER PRINTING IMPLEMENTATION DOCUMENTATION

**Module:** Patient Registration (Hospital Management / EMR System)  
**Date:** October 2026  
**Reference Design:** `Sticker(1).jpeg` / `Sticker.jpeg`  
**Status:** Implemented, Tested & Verified  

---

## 1. Executive Summary

The patient identification sticker workflow has been updated to output a standard **ISO A4 Portrait PDF page (210 mm × 297 mm)** while preserving the physical dimensions, aspect ratio, and typography of the individual identification sticker shown in the `Sticker(1).jpeg` reference.

### Critical Distinction: A4 Paper vs. Sticker Dimensions
In previous implementations, the PDF canvas was set directly to the label size (100 mm × 50 mm). When sent to ordinary desktop office printers or printed through default browser print dialogs, standard A4 paper trays caused the sticker to stretch across the full page or print misaligned.

In this implementation:
1. **The PDF page is standard A4 size (210 mm × 297 mm)**.
2. **The individual patient sticker retains its exact physical dimensions (100 mm × 50 mm)** and is positioned cleanly at the configured top-left margin.
3. **The sticker is NOT stretched** to fill the A4 page.
4. An optional, subtle 0.15 mm cutting/peel guide outline is drawn around the sticker boundary so staff can cleanly cut or peel the sticker from standard A4 paper or label sheets.
5. The remaining portion of the A4 page remains clean, crisp white.

---

## 2. Reference Analysis & Assumed Measurements

Inspection of `Sticker(1).jpeg` reveals a print preview on a computer monitor displaying an A4 portrait document with a patient identification block at the top and whitespace below it.

Because a photograph of a screen cannot provide laser-calibrated physical millimetres, the measurements were designed with explicit, fully configurable parameters in millimetres:

```text
+---------------------------------------------------------------------------------------------------+
| A4 Page (210 mm x 297 mm)                                                                         |
|                                                                                                   |
| [Header] XYZ | Patient Identification Label | Address: XYZ | Ph: XYZ   [Scale: 100% / Actual Size]|
|                                                                                                   |
|  top_margin = 18 mm                                                                               |
|  left_margin = 15 mm                                                                              |
|  +---------------------------------------------------------------------------------------------+  |
|  | Sticker Box (Width = 100.0 mm, Height = 50.0 mm)                                            |  |
|  |                                                                                             |  |
|  | Name      : VIPUL KUMAR KESARSINGH VASAVA                                                   |  |
|  | Age       : 30 Yrs.     Sex :Male                                                           |  |
|  | Address   : SURAT  GUJARAT                                                                  |  |
|  |                                                                                             |  |
|  | Dr.Name   : Dr. DEVANG DESAI / JIGAR PATEL                                                  |  |
|  | MOB       : 8141298303  Date :28-Oct-2026                                                   |  |
|  | Ref.Dr.   : DR. DAYARAM VASAVA                                                              |  |
|  | UHID      : UHID-1001                         |||| ||| ||||| |||| ||||||||||                |  |
|  +---------------------------------------------------------------------------------------------+  |
|                                                                                                   |
|                                                                                                   |
|                                    [Clean White A4 Page Body]                                     |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

### Exact Layout Specifications (in Millimetres)

| Configuration Parameter | Value | Description |
|-------------------------|-------|-------------|
| `page_size` | `"A4"` | Standard ISO 216 paper format |
| `page_orientation` | `"P"` / `"portrait"` | Portrait orientation |
| `page_width_mm` | `210.0 mm` | Width of A4 page (595.28 pt) |
| `page_height_mm` | `297.0 mm` | Height of A4 page (841.89 pt) |
| `sticker_width_mm` | `100.0 mm` | Physical sticker width (2:1 aspect ratio) |
| `sticker_height_mm` | `50.0 mm` | Physical sticker height |
| `left_margin_mm` | `15.0 mm` | Left margin of the sticker on A4 sheet |
| `top_margin_mm` | `18.0 mm` | Top margin of the sticker on A4 sheet |
| `columns` | `1` | Single-sticker mode (primary) |
| `rows` | `1` | Single-sticker mode (primary) |
| `horizontal_gap_mm` | `5.0 mm` | Column spacing for multi-label sheets |
| `vertical_gap_mm` | `5.0 mm` | Row spacing for multi-label sheets |
| `draw_cutting_guide` | `True` | Subtle 0.15 mm outline (`#b4c0d0`) for peeling/cutting |
| `show_sheet_header` | `True` | Hospital identity (`XYZ`) & print scaling recommendation |

---

## 3. Sticker Content & Typography (Faithful to Reference)

Relative to the sticker origin `(x0, y0)`:

1. **Name** (`y = y0 + 4.8 mm`): Patient full name (`FIRST MIDDLE LAST`), Helvetica Bold 8.5 pt.
2. **Age & Sex** (`y = y0 + 9.4 mm`): Age display (`X Yrs.`) at col 1 (`x0 + 22 mm`), `Sex :Male/Female` at col 2 (`x0 + 48 mm`).
3. **Address** (`y = y0 + 14.0 mm`): Street, city, state, pincode joined without redundant labels.
4. **Attending Doctor** (`y = y0 + 19.6 mm`): `Dr.Name   : <DOCTOR>` (wraps automatically to a second indented line if length > 36 characters).
5. **Mobile & Registration Date** (`y = y0 + 25.2 mm`): `MOB       : <MOBILE>` at col 1, `Date :DD-Mon-YYYY` at col 2.
6. **Referring Doctor** (`y = y0 + 29.8 mm`): `Ref.Dr.   : <REF_DOCTOR>` or `-` if none specified.
7. **UHID & Barcode** (`y = y0 + 35.0 mm`):
   - Human-readable UHID on left (`x0 + 22 mm`, Helvetica Bold 9 pt).
   - High-density Code 128 barcode image on right (`x0 + 51 mm, y0 + 33.5 mm, w = 44 mm, h = 11.5 mm`).

---

## 4. Barcode Specifications & Scannability Verification

- **Symbology:** **Code 128** (Universal alphanumeric 1D barcode).
- **Payload:** Authoritative patient **UHID** (e.g. `UHID-1001`).
- **Privacy & Security:** The barcode encodes strictly the unique non-sensitive patient identifier. Clinical history, Aadhaar, PAN, and diagnoses are never embedded in the barcode.
- **Idempotency:** Reprinting the sticker produces identical barcodes.
- **Scannability Verification:**
  - Automated testing via `zxing-cpp` decodes the barcode directly from the rendered A4 PDF image.
  - Verified 100% scan accuracy at 300 DPI resolution.
  - Camera scanner in `BarcodeCameraModal` and USB keyboard-wedge barcode scanner both recognize and decode the printed sticker.

---

## 5. Printing Instructions & Scaling Notice

To ensure accurate physical print dimensions on an ordinary office or thermal A4 printer:

1. **Paper Size Selection:** Select **A4** in the printer properties dialog.
2. **Page Scaling:** Set scaling to **100%** or **Actual Size**.
3. **Disable "Fit to Printable Area" / "Shrink to Fit":** Browser options such as "Fit to Page" scale documents by 90-95% to compensate for unprintable hardware borders. Ensure this option is **disabled** so the sticker prints at its true 100 mm × 50 mm dimension.
4. **Orientation:** Portrait.
5. **Margins:** Default / None.

A discreet header note `A4 Sheet | Print at 100% / Actual Size` is included at the top-right of the sheet outside the cutting area as an operational reminder for clinic personnel.

---

## 6. Files Created and Modified

| File | Action | Purpose |
|------|--------|---------|
| `backend/patients/sticker_pdf.py` | **Modified** | Re-implemented using `fpdf2` to produce A4 portrait PDFs (210×297mm) with 100×50mm sticker layout and Code 128 barcode. |
| `frontend/src/utils/patientStickerGenerator.ts` | **Modified** | Re-implemented using `jsPDF` to produce matching client-side A4 portrait PDFs with 100×50mm sticker and JsBarcode. |
| `backend/patients/views.py` | **Modified** | Added `HospitalConfigView` and updated `PatientStickerPdfView` streaming A4 sticker PDF. |
| `backend/patients/tests.py` | **Modified** | Added automated tests asserting A4 page dimensions (210×297mm), barcode decode via `zxingcpp`, and `XYZ` presence. |
| `backend/test_sticker_e2e.py` | **Modified** | Updated end-to-end regression test validating 7 critical criteria. |
| `frontend/src/config/hospitalConfig.ts` | **Created** | Centralized hospital configuration holding `XYZ` values. |
| `backend/config/hospital_config.py` | **Created** | Centralized backend hospital configuration holding `XYZ` values. |

---

## 7. Verification Test Results

### 1. Backend Django Unit Tests (`python manage.py test patients`)
```text
Found 9 test(s).
System check identified no issues (0 silenced).
.........
----------------------------------------------------------------------
Ran 9 tests in 1.057s

OK
```

### 2. End-to-End Regression Test (`python test_sticker_e2e.py`)
```text
=== STARTING A4 STICKER PDF & HOSPITAL CONFIG VERIFICATION ===
[PASS] [1/7] Configured measurements: A4 (210x297mm) and sticker (100x50mm) verified.
[PASS] [2/7] A4 page geometry verified (210.00mm x 297.00mm).
[PASS] [3/7] Centralized hospital details (XYZ) rendered on A4 sheet header.
[PASS] [4/7] Barcode decoded accurately from PDF: 'UHID-1001' (Format: Code 128).
[PASS] [5/7] Barcode uniqueness & reprint stability verified.
[PASS] [6/7] Security verified: Barcode payload contains ONLY the non-sensitive UHID.
[PASS] [7/7] Live Django HTTP endpoints (/sticker.pdf, /hospital/config/, 404) verified.

ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!
```

### 3. Frontend Production Build (`npm run build`)
- Successfully compiled in `2.77s` with zero errors or warnings.
