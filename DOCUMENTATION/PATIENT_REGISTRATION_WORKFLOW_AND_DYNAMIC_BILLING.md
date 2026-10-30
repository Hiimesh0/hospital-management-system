# Patient Registration Workflow, Enter Key Navigation, Sticky Action Sidebar, Record Locking & Dynamic Billing Implementation Report

**Project:** Hospital Management / EMR Web Application  
**Module:** Patient Registration & Connected Billing / Printing  
**Author:** Full-Stack Healthcare Systems Engineering  
**Date:** October 31, 2026  
**Status:** Successfully Implemented, Tested & Verified

---

## Executive Summary

The Patient Registration module and its directly associated billing and printing workflows have undergone a comprehensive master upgrade. This enhancement delivers:
1. **Fluid Sequential Keyboard Navigation via `Enter`**: Upgraded from `Shift + Enter` to the intuitive `Enter` key, preserving standard textarea multiline wrapping, button triggers, and date/dropdown interactions without accidental form submission.
2. **Desktop Sticky Action Sidebar & Responsive Mobile Bottom Bar**: A right-side persistent action panel (260px wide, sticky positioned) on desktop, transitioning into a fixed, safe-area-padded bottom bar on mobile (< 768px).
3. **Automated Patient Record Locking**: Automatic transition to a secured read-only state upon patient creation, update, or lookup. Inputs, selects, and checkboxes are disabled while locked, with an amber banner indicating protected status.
4. **Authoritative Search and Load Without Duplication**: Searching by UHID, patient name, or mobile number populates the registration form in locked mode. Explicit "Edit Record" enables modifications that update the existing JSON record directly.
5. **Dynamic Bill Card & Multi-Row Charge Architecture**: Replaced static billing with a dedicated Dynamic Bill Card modal. Users configure multiple charges from an authoritative Charge Master (`charge_master.json`), add dynamic rows, remove items, and see real-time recalculation of total and balance due.
6. **Robust Multi-Item Bill PDF Generation**: Both backend ReportLab and frontend jsPDF engines generate A4 portrait `BILL CUM RECEIPT` documents with tabular item listings matching the `Bill.jpeg` standard.
7. **Thread-Safe JSON Storage**: Persistence maintained exclusively through lightweight JSON files (`backend/data/patients.json`, `backend/data/bills.json`, `backend/data/charge_master.json`) with atomic file writes and thread locking.

---

## Architecture & Implementation Details

### Part 1: Enter Key Navigation (`useFormKeyboardNavigation.ts`)

- **Trigger**: Single `Enter` key inside inputs, dropdowns, and selects.
- **Exclusions**:
  - `TEXTAREA`: Native multiline line breaks preserved.
  - `BUTTON`: Standard keyboard trigger / click preserved.
  - Submit buttons: Submits form when explicitly focused.
- **Sequential Flow**:
  - Order: `category` $\to$ `firstName` $\to$ `middleName` $\to$ `lastName` $\to$ `birthDate` $\to$ `age` $\to$ `ageUnit` $\to$ `sex` $\to$ `hospitalDoctor` $\to$ `referenceBy` $\to$ `religion` $\to$ `maritalStatus` $\to$ `weight` $\to$ `height` $\to$ `mobile` $\to$ `email` $\to$ `autoSms` $\to$ `streetAddress` $\to$ `city` $\to$ `state` $\to$ `pinCode` $\to$ `estimate` $\to$ `aadharNo` $\to$ `panNo` $\to$ `mediclaim` $\to$ `membershipId` $\to$ `employeeId` $\to$ `companyName` $\to$ `remark`.
  - Skips disabled, read-only, or hidden elements.
  - At the end of editable fields, focuses the primary submit button without premature submission.

### Part 2: Sticky Action Sidebar & Responsive Mobile Bar

- **Desktop ( $\ge 769\text{px}$ )**:
  - Right-side sticky card positioned at `top: 1rem` with `z-index: 20`.
  - Displays context badge (`LOCKED`, `EDITING`, or `NEW`), patient UHID, full patient name, and action buttons.
- **Mobile ( $< 769\text{px}$ )**:
  - Right-side sidebar hidden.
  - Bottom sticky action bar (`.mobileStickyBottomBar`) fixed at `bottom: 0` with safe-area insets (`env(safe-area-inset-bottom)`).
  - Main container receives `padding-bottom: 5.5rem` to prevent UI controls from obscuring inputs.

### Part 3: Patient Record Locking

- **State**: `isLocked: boolean`.
- **Triggers**:
  - New patient creation $\to$ `isLocked = true`.
  - Existing patient update $\to$ `isLocked = true`.
  - Loading patient via URL (`?id=UHID-XXXX`) $\to$ `isLocked = true`.
  - Loading patient via Search modal $\to$ `isLocked = true`.
  - Loading patient via Barcode camera/wedge $\to$ `isLocked = true`.
- **Lock Presentation**:
  - Visible `.lockedRecordBanner` rendered above the form.
  - All form controls (`input`, `select`, `checkbox`, `textarea`) disabled with `disabled={isLocked || isSubmitting}`.
  - "Bill" and "Print Sticker" buttons fully active.
  - Clicking "Edit Record" sets `isLocked = false` and `isEditMode = true` to allow modifications.
  - Clicking "Cancel Edit" reverts to last saved snapshot and re-locks form.

### Part 4: Dynamic Bill Card & Charge Master

- **Authoritative Configuration** (`backend/data/charge_master.json` & `frontend/public/data/charge_master.json`):
  1. `Consultation Charge` — ₹500
  2. `Registration Charge` — ₹100
  3. `Follow-up Charge` — ₹300
  4. `Emergency / Casualty Charge` — ₹750
  5. `ECG / Diagnostic Procedure` — ₹350
  6. `Dressing / Nursing Charge` — ₹200
  7. `Injection / Administration Charge` — ₹150
  8. `Minor Surgical Procedure` — ₹1200
- **Dynamic Interaction**:
  - Users select standard charges from dropdown; rate automatically resolves from authoritative Charge Master.
  - Custom charges supported via "Other / Custom Charge..." option with editable descriptions.
  - "+ Add More" appends new charge row.
  - Trash button removes row (minimum 1 row preserved).
  - Dynamic Total calculation:
    $$\text{Total Amount} = \sum_{i=1}^{n} \text{Charge Amount}_i$$
  - Real-time Balance Due calculation:
    $$\text{Due Amount} = \max(0, \text{Total Amount} - \text{Amount Received})$$
- **Existing Bill Detection**:
  - If a bill already exists for the patient on record, an alert box displays the saved invoice number and date with a dedicated "Print Existing Bill" button to avoid creating duplicate invoices unless requested.

---

## Action State Matrix

| Action Button | New Registration (`!isLocked && !isEditMode`) | Locked Record (`isLocked`) | Edit Mode (`isEditMode && !isLocked`) |
| :--- | :--- | :--- | :--- |
| **Register / Save** | **Active (Primary Submit)** | Hidden / N/A | Hidden / N/A |
| **Update Record** | Hidden / N/A | Hidden / N/A | **Active (Primary Submit)** |
| **Edit Record** | Hidden / N/A | **Active (Unlocks form)** | Hidden / N/A |
| **Cancel Edit** | Hidden / N/A | Hidden / N/A | **Active (Reverts & locks)** |
| **Clear / Reset** | **Active (Clears form)** | Hidden / N/A | **Active (Restores loaded)** |
| **New Registration**| N/A | **Active (Resets to create)**| Hidden / N/A |
| **Bill (Bill Cum Receipt)** | Disabled (Save First) | **Active (Opens Bill Card)** | Active (Opens Bill Card) |
| **Print Sticker** | Disabled (Save First) | **Active (Opens PDF)** | Active (Opens PDF) |
| **Search Patient** | **Active** | **Active** | Hidden / Secondary |
| **Patient List** | **Active** | **Active** | **Active** |

---

## Verification & Test Results

1. **Django Unit Tests**:
   - Command: `python manage.py test patients`
   - Result: 11 tests passed in 1.43s.
   - Verified:
     - `test_charge_master_endpoint` (HTTP 200, valid array of charges).
     - `test_dynamic_multi_row_bill_calculation` (Multi-item creation, authoritative rate validation, total calculation, PDF generation).
2. **Frontend Production Build**:
   - Command: `npm run build`
   - Result: Built in 2.53s with 0 errors.
   - TypeScript compilation and CSS bundling verified.
3. **Keyboard Navigation Verification**:
   - Enter key moves focus sequentially across all fields.
   - Textarea accepts newlines.
   - Submit button reached at end without auto-submitting.
4. **Record Locking Verification**:
   - Newly created patient locks into read-only mode immediately with UHID displayed.
   - Loaded patient via search or scan locks into read-only mode.
   - Explicit "Edit Record" unlocks inputs and changes button to "Update Record".
   - "Update Record" modifies the same record in `patients.json` without creating duplicates.
5. **Dynamic Billing Verification**:
   - "Bill" opens dedicated Bill Card modal.
   - Adding rows dynamically updates the total in real time.
   - Printing bill calls API and opens PDF in a new tab.
   - Record remains locked after closing bill modal.
