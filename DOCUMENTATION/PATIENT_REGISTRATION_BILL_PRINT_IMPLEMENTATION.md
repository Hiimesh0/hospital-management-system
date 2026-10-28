# Patient Registration Bill Button & Printable Bill PDF Implementation

## Overview

A functional **Bill** button has been added to the **Patient Registration** module in the Hospital Management / EMR application, enabling users to generate, preview, and print an authentic **BILL CUM RECEIPT** matching the reference image `Bill.jpeg`.

This feature is strictly scoped to the Patient Registration workflow, uses thread-safe atomic JSON file storage (`backend/data/bills.json` and client-side fallback `mixu_bills_storage`), and requires zero database migrations or tables.

---

## 1. Files Created and Modified

### Backend Files
- **Created:**
  - `backend/patients/bill_storage.py`: Thread-safe, atomic JSON-file storage for bill records with stable invoice numbering.
  - `backend/patients/bill_pdf.py`: A4 portrait printable PDF generator matching `Bill.jpeg` using FPDF2 (`fpdf2 2.8.8`).
  - `backend/data/bills.json`: Persistent JSON storage for issued bills.
  - `backend/patients/assets/unicare_tulip.png`: Cleaned UNICARE tulip/heart emblem extracted from reference.
  - `backend/patients/assets/nabh_seal.png`: Cleaned NABH accreditation seal extracted from reference.
- **Modified:**
  - `backend/patients/views.py`: Added `PatientBillView` (`GET`, `POST`) and `PatientBillPdfView` (`GET`).
  - `backend/patients/urls.py`: Registered routes for bill JSON API and PDF stream.
  - `backend/patients/tests.py`: Added automated test suite covering bill issuance, stable invoice persistence, duplicate prevention, and PDF streaming (all 8 tests passing).

### Frontend Files
- **Created:**
  - `frontend/src/utils/patientBillGenerator.ts`: Client-side A4 Portrait PDF generator via `jsPDF` for static environments, popup-blocker handling, and date formatting.
  - `frontend/src/components/BillPreview/BillPreview.tsx`: Dedicated printable preview route (`#/bill-preview?id=...`) with Print Bill, Open PDF, and Back actions.
  - `frontend/src/components/BillPreview/BillPreview.module.css`: Print-optimized CSS rules with `@media print`, logo styling, and watermark suppression.
  - `frontend/src/assets/unicare_tulip.png` & `frontend/public/assets/unicare_tulip.png`: High-resolution hospital tulip logo.
  - `frontend/src/assets/nabh_seal.png` & `frontend/public/assets/nabh_seal.png`: NABH accreditation seal.
- **Modified:**
  - `frontend/src/api/patientApi.ts`: Added billing data types (`BillItem`, `PatientBillRecord`, `BillCreatePayload`), `getPatientBill()`, `createOrGetPatientBill()`, `getBillPdfUrl()`, and `localStorage['mixu_bills_storage']` fallback.
  - `frontend/src/components/PatientRegistration/PatientRegistration.tsx`: Added **Bill** button to the action bar, success notification banner, and quick lookup list; added charge confirmation modal; added duplicate prevention guards.
  - `frontend/src/components/PatientRegistration/PatientRegistration.module.css`: Added responsive styles for `.btnBill`, `.billModalGrid`, `.billSummaryCard`, and `.billTotalsRow`.
  - `frontend/src/App.tsx`: Registered `<Route path="/bill-preview" element={<BillPreview />} />`.

---

## 2. Bill Button Location & Workflow

### Location
1. **Primary Action Bar:** Positioned prominently at the bottom of the Patient Registration form alongside `Print Patient Sticker`, `Reset Values`, and `Register / Save Patient`.
2. **Success Notification Banner:** Displayed immediately after registering or updating a patient, allowing instant one-click bill generation alongside the `Print Sticker` button.
3. **Quick Search Patient Lookup Modal:** Available on each registered patient item for immediate bill reprint or view.

### Behavior & Guardrails
- **Unsaved Patient Protection:** For new, unsaved patients, the button displays a helpful tooltip ("Save patient first to enable bill generation") and warns the user if clicked before saving.
- **Unsaved Changes Warning:** If an existing patient record has unsaved modifications in the registration form, the user is notified to save changes first so the bill reflects the latest details.
- **Single Source of Truth:** Bills are tied directly to the patient's stable `UHID` (`patientId`), preserving existing UHIDs without generating duplicates.
- **Double-Click Protection:** Uses `isGeneratingBill` state lock to disable actions while generation or lookup is in flight.

---

## 3. Visual Layout & Page Size (Matching `Bill.jpeg`)

The generated PDF and on-screen preview faithfully recreate `Bill.jpeg`:

### Dimensions & Outer Boundary
- **Format:** Standard A4 Portrait (210 mm × 297 mm).
- **Outer Box:** Sharp outer bounding box (0.35 pt border) enclosing the receipt.
- **Margins:** 10 mm left, right, top, and bottom.

### Header Elements
- **Tulip / Heart Emblem:** Authentic UNICARE emblem positioned on the top left.
- **Hospital Title:** `UNICARE` (16 pt bold), `HEART INSTITUTE & RESEARCH CENTER` (8.5 pt bold).
- **Management & CIN:** `(Managed By : South Gujarat Cardiac Care Pvt. Ltd.)` and `CIN No. - U85110GJ2013PTC073815`.
- **NABH Accreditation:** Circular seal on top right with accreditation identifier `SHCO-2023-0801`.
- **Address & Contact:** `Acme Plaza, B-Wing, Near Sosyo Circle, Behind New Civil Hospital, Canal Road, Surat-395002` and `Ph: 0261-2639700/9800 | E-mail: unicareheartinstitute@gmail.com`.
- **Horizontal Divider:** Crisp vector divider line separating header from the title band.

### Title Band
- Full-width shaded slate band (RGB 225, 228, 232) containing bold uppercase title: **`BILL CUM RECEIPT`**.

### Patient & Invoice Information Grid
- **Left Column:**
  - `Name          : <PATIENT_NAME>`
  - `Age / Sex     : <AGE> Yrs. / <SEX>`   `Mobile : <MOBILE>`
  - `Treating Dr   : <TREATING_DOCTOR>`
  - `Reference Dr  : <REFERENCE_DOCTOR>`
- **Right Column:**
  - `UHID          : <UHID>`
  - `Invoice No.   : OPD2627/<SEQ>`
  - `Date          : DD-Mon-YYYY`

### Bill Items Table
- **Columns:** `Sr. No.` (18 mm, center) | `Details` (132 mm, left) | `Rate` (40 mm, right).
- Configurable service entry (e.g. `OPD Consultation / Registration Charge`) with explicit numeric rate (e.g. `500.00`).
- No silently invented follow-up charges without explicit user confirmation.

### Payment & Totals Section
- **Left Receipt Sub-box:**
  - Columns: `Rec.Date` | `Receipt No` | `Amt.` | `Payment Type` | `User`
  - Values: e.g. `29-Oct-2026` | `OPD2627/6146` | `500.00` | `Cash` | `EntryBy:Jenil Bundela, PCName:RECEPTION1, At:29-Oct-2026 03:12:55 AM.`
  - Underline with received sum.
- **Right Totals:**
  - `Total     :  500.00`
  - `Received  :  500.00`
  - `Due       :    0.00`

### Footer
- Left: `Subject to SURAT Jurisdiction` and `Payment by cheque Subject To Realization`.
- Left: `EntryBy:Jenil Bundela, PCName:RECEPTION1, At:<TIMESTAMP>`.
- Right: `Authorized Signatory` signature line.

---

## 4. JSON Storage Schema (`backend/data/bills.json`)

Bill records are stored separately from demographic patient records in `backend/data/bills.json`:

```json
{
  "bills": [
    {
      "id": "BILL-A87BC12D",
      "patientId": "UHID-1001",
      "uhid": "UHID-1001",
      "invoiceNo": "OPD2627/6146",
      "billDate": "2026-10-29T03:12:55.123456+00:00",
      "patientName": "AARAV KISHORE PATEL",
      "age": "32",
      "ageUnit": "Years",
      "sex": "Male",
      "mobile": "9876543201",
      "treatingDoctor": "Dr. NILESH MAHALE",
      "referenceDoctor": "DR. NIKUNJ VITHALANI",
      "items": [
        {
          "srNo": 1,
          "details": "OPD Consultation / Registration Charge",
          "rate": 500.0,
          "amount": 500.0
        }
      ],
      "totalAmount": 500.0,
      "amountReceived": 500.0,
      "paymentType": "Cash",
      "receiptNo": "OPD2627/6146",
      "dueAmount": 0.0,
      "entryBy": "Jenil Bundela",
      "pcName": "RECEPTION1",
      "createdAt": "2026-10-29T03:12:55.123456+00:00",
      "updatedAt": "2026-10-29T03:12:55.123456+00:00"
    }
  ]
}
```

---

## 5. Invoice Number Generation & Duplicate Prevention

### Format
- Format: `OPD<FY>/<SEQUENCE>`
- Example: `OPD2627/6146`, where `2627` represents the financial year 2026–2027 and `6146` is the sequential identifier starting immediately after reference `6145`.

### Rules
1. **Stable Number:** Reopening, reprinting, or clicking "Bill" multiple times looks up the existing bill record by `patientId` / `uhid` and returns the same invoice number.
2. **No Accidental Invoices:** A new invoice sequence is only generated when a genuine new bill is created for a patient who does not yet have one.
3. **Thread Safety:** Atomic file replacement with `threading.RLock()` ensures concurrency protection and avoids race conditions.

---

## 6. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/patients/<patient_id>/bill/` | Retrieve existing bill record for a patient. Returns `404` with `exists: false` if no bill has been issued yet. |
| `POST` | `/api/patients/<patient_id>/bill/` | Issue or retrieve bill for a patient. If already exists and `!forceNew`, returns existing record without duplicating. |
| `GET` | `/api/patients/<patient_id>/bill.pdf` | Streams A4 Portrait PDF bill inline with `Content-Type: application/pdf` and `Content-Disposition: inline; filename="Bill_<invoice>.pdf"`. |

---

## 7. Automated Test Results

Backend test execution verified with Django test runner (`python manage.py test patients`):

```
Found 8 test(s).
System check identified no issues (0 silenced).
........
----------------------------------------------------------------------
Ran 8 tests in 0.900s

OK
```

### Verified Test Cases
1. `test_initial_patient_list_is_empty`: Initial state validation.
2. `test_create_patient_success`: Registration CRUD.
3. `test_create_patient_validation_failures`: Data validation.
4. `test_get_patient_by_uhid`: Patient retrieval.
5. `test_update_patient_details`: Patient updates.
6. `test_delete_patient_success`: Patient deletion.
7. `test_patient_sticker_pdf_endpoint`: Barcode generation and 100x50mm sticker streaming.
8. `test_patient_bill_and_pdf_endpoints`: Initial 404, issuance of bill, stable invoice persistence across repeated POST and GET requests, PDF stream validation (`%PDF-`), and 404 on invalid patient IDs.

---

## 8. Frontend Verification

Automated browser testing (`browser_subagent`) verified the complete user journey:
1. **Patient Registration Page:**
   - The **Bill** button is rendered with the file icon in the action bar near `Print Patient Sticker`, `Reset Values`, and `Update Patient Record`.
   - Disabled/guarded for unsaved records; displays appropriate warning.
2. **Issue Patient Bill Modal:**
   - Displays patient summary (UHID, Name, Doctor, Mobile, City).
   - Allows configuring service details, explicit numeric rate, payment method, and received amount.
   - Live calculates Due Balance.
3. **Bill Preview (`#/bill-preview?id=UHID-1001`):**
   - Displays authentic UNICARE header with tulip emblem and NABH seal.
   - Shows shaded `BILL CUM RECEIPT` title band.
   - Shows patient and invoice details grid with colons aligned.
   - Shows items table with rate.
   - Shows payment receipt details box with entry info and right totals.
   - Pure white background with no background watermark bleeding through.
4. **PDF Generation & New Tab:**
   - Opens PDF directly in a new tab via backend streaming endpoint with client-side jsPDF fallback.
   - Prints cleanly using the browser's native print interface.

---

## 9. Remaining Limitations & Extensibility

- **Single Service Item Default:** Default workflow initializes an OPD Consultation / Registration charge; additional multi-item line editing can be extended via the `items` array schema in future phases.
- **Taxes / GST:** The reference bill does not include GST or taxes; if tax breakdown is needed later, `taxPercent` and `taxAmount` can be added to `backend/data/bills.json` without schema breakage.
