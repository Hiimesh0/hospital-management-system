# Patient Registration and Dynamic Billing Improvements Report

## Executive Summary
This update modernizes the **Patient Registration** and **Billing** modules of the Hospital Management / EMR application. Based on healthcare workflow requirements and UI feedback, the redundant right-side action sidebar was removed to give the registration form 100% full width, while the bottom footer action bar was upgraded to be the single, authoritative, sticky action bar across desktop and mobile screens. Furthermore, a comprehensive **Bill Discount** feature was added with validation and authorizing doctor tracking, invoice numbering persistence was hardened to prevent restarts across restarts/reloads, and printable bill PDFs (both ReportLab and jsPDF) were updated to render subtotal, discount, net payable, and authorization notes.

---

## 1. Scope & Architecture

The changes strictly adhere to the project scope and architecture:
- **No Database Migrations or Extra Tables**: All data persists in JSON storage files (`backend/data/bills.json`, `backend/data/patients.json`, `backend/data/charge_master.json`, and client localStorage fallbacks).
- **Dual Engine PDF Consistency**: ReportLab (`backend/patients/bill_pdf.py`) and jsPDF (`frontend/src/utils/patientBillGenerator.ts`) both render identical A4 printable bill layouts.
- **Centralized Hospital Configuration**: Preserved centralized branding (`XYZ` hospital name and details) and developer emblem (Mixu Infosystem).

---

## 2. Key Changes Implemented

### Part 1 — Single Source of Actions (Removal of Duplicate Sidebar)
- **Problem**: The Patient Registration page featured duplicate action panels (a right-side sidebar card and a bottom footer bar) which constricted form input fields and caused confusion.
- **Solution**:
  - Removed `<aside className={styles.actionSidebar}>` completely.
  - Removed `<div className={styles.mobileStickyBottomBar}>` completely.
  - Expanded `.formContainerWrapper` and `.formMain` to `width: 100%`.
  - Styled `<div className={styles.actions}>` as a sticky bottom bar (`position: sticky; bottom: 0; z-index: 90;`) with responsive flex wrapping and safe-area insets.
  - Unified all actions into the footer bar depending on current mode:
    - **Create/New Mode**: `Clear Form`, `Quick Search Patient`, `Patient Registration List`, `Register / Save Patient`.
    - **Locked Mode**: `Bill`, `Sticker`, `Edit Record`, `New Registration`, `Quick Search Patient`, `Patient Registration List`.
    - **Edit Mode**: `Reset Values`, `Cancel Edit`, `Bill`, `Sticker`, `Update Patient Record`.

### Part 2 & 3 — Dynamic Bill Discount System & Validation
- **Problem**: Previously, bills only calculated raw charge totals without support for authorized patient discounts, concessions, or required authorization audit trails.
- **Solution**:
  - Added discount controls to the Dynamic Bill Card modal:
    - **Discount Type**: Toggle between Percentage (`%`) and Fixed Amount (`₹`).
    - **Discount Value**: Numeric input with bounds checking ($0\% \le \text{discount} \le 100\%$ for percentage; $0 \le \text{discount} \le \text{subtotal}$ for fixed).
    - **Calculated Discount Display**: Real-time read-only display of the exact discount amount in ₹.
    - **Discount Authorizing Doctor**: Dropdown populated from established hospital doctors:
      - Dr. NILESH MAHALE
      - Dr. ASHOK PATEL
      - Dr. SHARMA
      - Dr. R. K. DESAI
      - DR. NIKUNJ VITHALANI
      - DR. ANAND SHAH
      - Dr. DEVANG DESAI / JIGAR PATEL
    - **Discount Remark / Reason**: Required text note explaining why the discount was granted (e.g., "Staff relative", "Senior citizen", "BPL concession").
  - **Validation Rules**:
    - When discount $> 0$, both Authorizing Doctor and Remark are mandatory.
    - Discount cannot exceed subtotal; Net Payable cannot be negative.
  - **Highlighted Net Amount Payable**: Displays $\text{Subtotal} - \text{Discount Amount}$ in an emerald callout banner.
  - **Quick Action**: "Paid in Full" button automatically sets Amount Received to the Net Payable amount.
  - **Authoritative Backend Recalculation**: `backend/patients/bill_storage.py` and `backend/patients/views.py` enforce server-side validation and recalculate all monetary values before saving.

### Part 4 — Printable Bill PDF Updates
- **ReportLab (`backend/patients/bill_pdf.py`)**:
  - Displays Subtotal, Discount (`Disc. (X%)` or `Discount`), Net Amount Payable, Amount Received, and Balance Due in the summary table.
  - Adds a dedicated authorization note: `Discount Authorized By: {Doctor} | Reason: {Remark}`.
- **jsPDF (`frontend/src/utils/patientBillGenerator.ts`)**:
  - Renders matching Subtotal, Discount row, Net Payable, and authorization notice for offline/client printing.

### Part 5 — Persistent Invoice Numbering (Never Restarts)
- **Problem**: Invoice sequence numbers were susceptible to restarting from 1 or resetting if server restarted, records were filtered, or `forceNew: true` was triggered on reprinting.
- **Solution**:
  - Implemented persistent sequence tracking in `backend/data/bills.json` (`last_invoice_seq: 6147`) and client storage fallback (`mixu_last_invoice_seq`).
  - Added robust regex sequence extraction (`_find_max_seq`) that inspects all existing invoice numbers in format `OPDyy/####`.
  - Added `update_existing` support so reprinting or editing an existing patient's bill preserves its original `invoiceNo` without generating a duplicate or incrementing the sequence counter.
  - Fixed `PatientRegistration.tsx` to pass `updateExisting: Boolean(existingPatientBill)` and `forceNew: !existingPatientBill`.

---

## 3. Test & Verification Results

### Backend Unit Tests
Executed Django test suite for the `patients` app:
```bash
python manage.py test patients
```
**Result**:
- Ran 13 tests in 1.359s
- **OK (All 13 passed)**
- Verified `test_bill_discount_calculation_and_validation` and `test_persistent_invoice_numbering_never_restarts`.

### Frontend Build
Executed production Vite build:
```bash
npm run build
```
**Result**:
- Transform & bundling completed with 0 errors.
- Generated distribution bundle successfully.

---

## 4. Files Modified

| File | Changes |
|------|---------|
| `backend/patients/bill_storage.py` | Added regex sequence extraction, persistent `last_invoice_seq`, discount calculation & validation, and update support. |
| `backend/patients/views.py` | Added discount extraction (`discountType`, `discountValue`, `discountDoctor`, `discountRemark`, `updateExisting`). |
| `backend/patients/bill_pdf.py` | Updated ReportLab bill PDF table layout with Subtotal, Discount, Net Payable, and Authorization note. |
| `backend/data/bills.json` | Added `"last_invoice_seq": 6147`. |
| `backend/patients/tests.py` | Added tests for discount calculation, validation, and persistent invoice numbering. |
| `frontend/src/api/patientApi.ts` | Updated interfaces, mobile network IP handling, and client fallback storage. |
| `frontend/src/utils/patientBillGenerator.ts` | Updated jsPDF generator to render Subtotal, Discount row, Net Payable, and Doctor authorization note. |
| `frontend/public/data/bills.json` | Mirrored updated `bills.json` with `last_invoice_seq`. |
| `frontend/src/components/PatientRegistration/PatientRegistration.module.css` | Removed sidebar styles, set form to 100% width, made `.actions` sticky, added discount styling classes. |
| `frontend/src/components/PatientRegistration/PatientRegistration.tsx` | Removed sidebar and mobile bar JSX, integrated discount state and validation into Dynamic Bill Card, unified footer action bar. |
| `DOCUMENTATION/PATIENT_REGISTRATION_AND_BILLING_IMPROVEMENTS.md` | Comprehensive technical documentation. |
