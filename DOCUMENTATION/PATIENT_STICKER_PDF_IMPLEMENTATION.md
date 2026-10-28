# PATIENT STICKER PDF GENERATION & BARCODE SCANNING IMPLEMENTATION REPORT

**Author:** Senior Full-Stack React/Django Engineer & Healthcare Workflow Specialist  
**Module:** Patient Registration (Hospital Management / EMR System)  
**Date:** October 2026  
**Reference Design:** `Sticker.jpeg`  

---

## 1. Executive Summary

A patient identification sticker PDF generation and barcode workflow has been implemented exclusively for the **Patient Registration** module. The system generates high-resolution, print-ready identification labels matching the physical layout and typographic styling of the reference image `Sticker.jpeg`.

Each sticker contains a unique, stable **Code 128 barcode** representing the patient's unique hospital identifier (**UHID**). The feature includes:
1. A **Print Patient Sticker** button in the Patient Registration action bar.
2. Protection against printing unsaved records in Create Mode.
3. Dual PDF generation engines: Django backend (`/api/patients/<id>/sticker.pdf`) using `fpdf2` & `python-barcode`, accompanied by a client-side generator in `jsPDF` & `JsBarcode` for static environments (GitHub Pages, Vercel).
4. Direct USB keyboard-wedge barcode scanner support with an integrated **Barcode Scanner / UHID Quick Lookup** toolbar.
5. Integration across Patient Registration and Patient Registration List.
6. Scannability verified via `zxing-cpp` decoder and browser subagent automated testing.

---

## 2. Files Created and Modified

### Backend (Django REST Framework + JSON Storage)
| File | Action | Purpose |
|------|--------|---------|
| `backend/patients/sticker_pdf.py` | **Created** | Generates 100mm × 50mm landscape PDF labels matching `Sticker.jpeg` using `fpdf2` and `python-barcode` (Code 128). |
| `backend/patients/views.py` | **Modified** | Added `PatientStickerPdfView` responding to `GET /api/patients/<patient_id>/sticker.pdf` with `application/pdf` stream. |
| `backend/patients/urls.py` | **Modified** | Registered routes `patients/<str:patient_id>/sticker.pdf` and `patients/<str:patient_id>/sticker/`. |
| `backend/patients/tests.py` | **Modified** | Added test cases verifying 200 OK, Content-Type, PDF magic bytes (`%PDF-`), and scannable Code 128 barcode matching UHID. |
| `backend/test_sticker_e2e.py` | **Created** | Automated end-to-end regression script testing PDF dimensions, barcode decoding, idempotency, security, and HTTP endpoints. |

### Frontend (React 19, TypeScript, Vite)
| File | Action | Purpose |
|------|--------|---------|
| `frontend/src/utils/patientStickerGenerator.ts` | **Created** | Client-side PDF generator using `jsPDF` and `JsBarcode` with popup-safe new tab opening strategy. |
| `frontend/src/api/patientApi.ts` | **Modified** | Added `getStickerPdfUrl(patientId)` helper method. |
| `frontend/src/components/PatientRegistration/PatientRegistration.tsx` | **Modified** | Added `Print Patient Sticker` button, unsaved record validation, instant print toast trigger, and top Barcode Scanner quick lookup toolbar. |
| `frontend/src/components/PatientRegistration/PatientRegistration.module.css` | **Modified** | Added styles for `.btnPrintSticker`, `.barcodeScanBar`, `.barcodeInput`, and `.barcodeBadge`. |
| `frontend/src/components/PatientRegistrationList/PatientRegistrationList.tsx` | **Modified** | Added Print Sticker icon to patient table rows and Patient Details modal. |

---

## 3. Sticker Dimensions and PDF Format

- **Physical Label Dimensions:** `100.0 mm × 50.0 mm` (Standard landscape thermal sticker / chart label).
- **Page Margins:** Left: 4.0 mm, Top: 4.0 mm, Right: 4.0 mm.
- **Orientation:** Landscape (`format=(50, 100)` in FPDF2, `[100, 50]` in jsPDF).
- **Color Scheme:** Pure black (`#000000`) text on white (`#FFFFFF`) background.
- **Typography:** Helvetica Bold / Arial Bold with aligned colons (`:`) for medical record scannability.
- **Print Optimization:** Zero unwanted blank pages, fixed physical dimensions, browser print dialog compatibility.

---

## 4. Visual Layout (Faithful to `Sticker.jpeg`)

```text
+------------------------------------------------------------------------------------+
| Name      : VIPUL KUMAR KESARSINGH VASAVA                                          |
| Age       : 30 Yrs.     Sex :Male                                                  |
| Address   : SURAT  GUJARAT                                                         |
|                                                                                    |
| Dr.Name   : Dr. DEVANG DESAI / JIGAR PATEL                                         |
| MOB       : 8141298303  Date :28-Oct-2026                                          |
| Ref.Dr.   : DR. DAYARAM VASAVA                                                     |
| UHID      : UHID-1001                         |||| ||| ||||| |||| ||||||||||       |
+------------------------------------------------------------------------------------+
```

### Layout Elements & Coordinate Specs:
1. **Name** (`y = 4.8mm`): Prominent patient full name (`FIRST MIDDLE LAST`), 8.5 pt font.
2. **Age & Sex** (`y = 9.4mm`): Age display (`X Yrs.`) at column 1; `Sex :Male/Female` at column 2 (`x = 48mm`).
3. **Address** (`y = 14.0mm`): Combined street, city, state, pin code without redundant labels.
4. **Vertical Gap** (`y = 19.6mm`): Subtle visual separation before attending physician data.
5. **Dr.Name** (`y = 20.2mm`): Attending hospital doctor name. Wraps neatly onto second indented line if multiple physicians are on duty.
6. **MOB & Date** (`y = 25.8mm`): Patient phone number and registration date in `DD-Mon-YYYY` format.
7. **Ref.Dr.** (`y = 30.4mm`): Referring doctor name, or `-` if omitted.
8. **UHID & Barcode** (`y = 35.8mm`): Human-readable UHID on left (`x = 22mm`), Code 128 barcode on right (`x = 51mm, y = 33.5mm, w = 44mm, h = 11.5mm`).

---

## 5. Barcode Payload & Security Architecture

### Payload Design
- **Format:** **Code 128** (Compact, high-density alphanumeric symbology supported by all commercial 1D/2D laser and optical scanners).
- **Payload Value:** The patient's authoritative **UHID** (e.g., `UHID-1001`).
- **Human-Readable Text:** Rendered alongside the barcode so hospital personnel can visually verify patient identity if the scanner is temporarily unavailable.

### Healthcare Privacy & Security Compliance
- **Zero Sensitive Data:** The barcode does **not** contain Aadhaar numbers, PAN, phone numbers, diagnoses, or clinical history.
- **Lookup Authentication:** The barcode acts strictly as an opaque reference key. Scanned lookups route through the authorized application API, preserving role-based permissions and audit logs.
- **Deterministic & Idempotent:** Generating a sticker multiple times produces identical barcodes. Editing patient demographic details updates the next printout without mutating the permanent UHID.

---

## 6. Barcode Scanning & USB Keyboard-Wedge Workflow

Hospital admissions desks predominantly utilize USB or Bluetooth handheld barcode scanners operating in **keyboard-wedge mode** (the scanner acts as a fast keyboard that inputs text and terminates with an `Enter` keystroke).

### Scanner Integration:
1. **Dedicated Scan Toolbar:** Positioned above the form with a `USB Barcode Scanner Ready (Code 128)` indicator badge.
2. **Keyboard Event Interception:** The scan input listens for `Enter` keypresses, stops event propagation (preventing accidental main form submission), and extracts the scanned UHID.
3. **Automated Patient Lookup:**
   - Queries `patientApi.getPatientById(scannedCode)`.
   - If found: Navigates to `/patient-registration?id=<UHID>`, loads all demographics into edit mode, and displays a success notification:
     `"✅ Barcode Scanned: Successfully loaded patient UHID-1001 for editing."`
   - If not found: Displays an informative error notification:
     `"❌ Patient not found: No registered record matches scanned barcode 'UHID-9999'."`
   - Clears the scan input immediately so it is ready for the next patient.

---

## 7. Action Button Behavior & Validation

### Create Mode:
- If a user clicks **Print Patient Sticker** while registering a new patient before saving, the operation is blocked and a persistent warning toast is shown:
  `"Please register and save the patient record first before generating or printing the patient sticker."`
- Upon saving a new patient, the success toast includes an instant **Print Sticker** action button for seamless workflow completion.

### Edit Mode:
- Clicking **Print Patient Sticker** retrieves the authoritative saved patient record by ID.
- If there are unsaved edits in the form, a warning notification alerts the user:
  `"Notice: Printing sticker with the last saved record. Save changes to update the sticker details."`
- Opens the PDF in a new browser tab with popup-blocker mitigation (pre-allocates a temporary blank tab on click event before asynchronous resolution).

---

## 8. Verification & Test Results

### 1. Django REST Framework Tests (`backend/patients/tests.py`)
```bash
python manage.py test
Ran 7 tests in 0.771s - OK
```
- Test `test_patient_sticker_pdf_endpoint`: Verified 200 OK, `application/pdf`, header `%PDF-`, scannable Code 128 barcode matching UHID, and 404 on invalid patient ID.

### 2. End-to-End Decoder Verification (`backend/test_sticker_e2e.py`)
```bash
python test_sticker_e2e.py
[PASS] [1/6] Configured dimensions: 100mm x 50mm verified.
[PASS] [2/6] PDF binary generation successful (5213 bytes).
[PASS] [3/6] Barcode decoded accurately: 'UHID-1001' (Format: Code 128).
[PASS] [4/6] Barcode uniqueness & reprint stability verified.
[PASS] [5/6] Security verified: Barcode payload contains ONLY the non-sensitive UHID lookup identifier.
[PASS] [6/6] Live Django HTTP endpoints (/sticker.pdf 200 OK & 404) verified.
ALL 6 VERIFICATION CHECKS PASSED SUCCESSFULLY!
```

### 3. Interactive Browser Subagent Testing (`verify_patient_sticker_1793215294067.webp`)
- **Step 1:** Verified UI in Create Mode. Clicked "Print Patient Sticker" -> Error alert appeared requiring patient save first.
- **Step 2:** Tested barcode input with `UHID-1001` + Enter -> Form switched to Edit Mode, loaded VIPUL KUMAR VASAVA, and displayed barcode scan success toast.
- **Step 3:** Tested invalid barcode `UHID-9999` -> Error alert displayed "Patient not found".
- **Step 4:** Verified `Shift + Enter` fast keyboard navigation preserved from First Name to Middle Name.

### 4. Build & Lint Validation
- `npm run build`: Built in 2.56s with 0 errors.
- `npm run lint`: 0 errors.

---

## 9. Printing Instructions

1. Focus or load the desired patient in **Patient Registration** or **Patient Registration List**.
2. Click **Print Patient Sticker**.
3. A new browser tab opens rendering the `100mm × 50mm` PDF.
4. Press `Ctrl + P` (or click the browser PDF viewer Print icon).
5. In printer settings:
   - **Destination:** Choose thermal label printer (e.g. Zebra ZD220, TSC TE200, Citizen, etc.).
   - **Paper Size:** Select `100mm × 50mm` (or 4" × 2" label stock).
   - **Margins:** Set to "None" or "Default".
   - **Scale:** Set to "Default" / "100%".
6. Click **Print**.
