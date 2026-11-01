# COMBINED PATIENT REGISTRATION AND PATIENT HISTORY WORKFLOW

## Executive Summary

This document details the architectural consolidation of the **Patient Registration** page and **Patient History List** into a single, high-efficiency, end-to-end patient workflow within the Hospital Management / EMR application.

Previously, front-desk operators and hospital staff had to navigate back and forth between two distinct pages: one to register or edit a patient, and another to search for previous visit history. The updated system unifies both experiences into a single view:
- **Top Section**: Streamlined Patient Registration form with clean, high-priority **Basic Information** and 3 collapsible accordions for secondary details.
- **Bottom Section**: Embedded, real-time **Patient History List** with instant client-side search, intelligent duplicate prevention, date range filtering, and one-click record loading.

All existing core features—including **JSON-backed backend persistence**, **barcode camera scanning**, **USB wedge hardware lookup**, **dynamic billing with discount management**, **ReportLab and jsPDF bill generation**, and **100mm x 50mm patient sticker printing**—remain fully preserved and operational.

---

## 1. Unified Page Layout & Architecture

The unified page is structured into distinct, logical functional areas:

```
+-------------------------------------------------------------------------+
| Compact Page Header (Title + Subtle Status Pill: New / Locked / Editing)|
+-------------------------------------------------------------------------+
| TOP SECTION: Patient Registration Form                                  |
|                                                                         |
| [1] Basic Information (Always Visible & Prominent)                      |
|     - Category (NEW / OLD)                                              |
|     - First Name * (min 2 chars) | Middle Name | Last Name              |
|     - Birth Date (max: today)                                           |
|     - Age * (Years / Months / Days 3-Column Structured Input)           |
|     - Sex * (Male / Female / Other / Transgender)                       |
|     - Hospital Doctor * (Treating / Consultant Doctor)                  |
|     - Mobile Number * (10-15 digits, tel input) | Email                 |
|                                                                         |
| [v] Collapsible Section 1: Demographics & Clinical Details               |
|     (Reference By, Religion, Marital Status, Weight, Height)            |
|                                                                         |
| [v] Collapsible Section 2: Address Details                              |
|     (Street Address, City, State, PIN Code, Auto SMS)                   |
|                                                                         |
| [v] Collapsible Section 3: Other Details & Identification               |
|     (Estimate, Aadhar No, PAN No, Mediclaim, Membership, Remark)        |
+-------------------------------------------------------------------------+
| STICKY ACTION BAR (Single Source of Truth)                              |
| [Clear Form] [Quick Search (Wedge)] [Scan Barcode] [Register/Save]     |
| (When Locked: [Unlock to Edit] [Issue Bill] [Print Sticker])            |
+-------------------------------------------------------------------------+
| BOTTOM SECTION: Live Patient History & Duplicate Prevention             |
|                                                                         |
| [Search by Name, UHID, Mobile...] [From Date] [To Date] [Doctor] [Clear]|
| +---------------------------------------------------------------------+ |
| | UHID     | Name        | Age/Sex | Mobile     | Doctor   | Action   | |
| | UHID-1001| Ramesh Shah | 45 Y    | 9876543210 | Dr. Mah..| [LOAD]   | |
| +---------------------------------------------------------------------+ |
| If no match: "No existing patient found. [Register New Patient]"        |
+-------------------------------------------------------------------------+
```

---

## 2. Basic Information Form (Top Section)

The **Basic Information** card houses all primary identification fields required for immediate patient intake:

1. **Category**: Select dropdown with options `NEW` and `OLD`.
2. **First Name** (`*` Required): Validated to minimum 2 characters; trims excess whitespace.
3. **Middle Name**: Optional text field.
4. **Last Name**: Optional text field.
5. **Birth Date**: HTML5 date input restricted with `max={today}` to disallow future dates.
6. **Age Structure** (`*` Required):
   - Structured into 3 sub-inputs: **Years**, **Months**, and **Days** side-by-side.
   - **Bidirectional Date of Birth (DOB) Synchronization**:
     - Selecting or changing **Birth Date** automatically calculates exact completed Years, Months, and Days using calendar month arithmetic.
     - Manually typing **Years** updates the approximate Date of Birth (`${calculatedBirthYear}-${currentMonth}-${currentDay}`) while preserving entered months and days.
   - Backward-compatible serialization: Backend accepts `ageMonths` and `ageDays` optionally while preserving `age` and `ageUnit`.
7. **Sex** (`*` Required): Dropdown options `Male`, `Female`, `Other`, `Transgender`.
8. **Hospital Doctor** (`*` Required): Dropdown pre-populated with hospital consulting doctors (`Dr. NILESH MAHALE`, `Dr. SNEHAL MAHALE`, etc.).
9. **Mobile Number** (`*` Required): `type="tel"` validated for 10 to 15 digits.
10. **Email**: Optional email address input.

---

## 3. Real-Time Patient History Search & Match

Directly below the registration form, the **Patient History List** provides immediate search feedback:

- **Zero-Latency Client-Side Search**: On page load, the patient repository is fetched once into local component state. As the user types into the Search box (or as they enter a First Name in create mode), filtering runs instantly via React's `useMemo` without making repeated network roundtrips.
- **Search Criteria**: Matches against:
  - Patient First Name
  - Full Name (`firstName middleName lastName`)
  - Patient UHID (`UHID-XXXX`)
  - Mobile Number
- **Patient Found**: Displays matching patient cards/rows with UHID, Full Name, Age/Sex, Mobile, Hospital Doctor, and Registration Date, alongside a prominent **Load Patient** button.
- **No Existing Patient Found**: Displays a clean notice:
  > *"No existing patient found. You can register this patient as new."*
  with a **Register New Patient** button that pre-populates the entered search query into the First Name or Mobile field.

---

## 4. One-Click "Load Patient" & Unsaved Changes Guard

When a user identifies a returning patient:

1. **Clicking "Load Patient"**:
   - Checks if the user currently has unsaved edits in an active form session.
   - If unsaved changes are present, displays an **Unsaved Changes Confirmation Modal** offering:
     - *Discard Changes & Load*: Loads the selected record.
     - *Cancel*: Closes modal and keeps current input intact.
   - If no unsaved changes (or after confirmation):
     - Populates all form fields (Basic Info, Demographics, Address, Other Identification).
     - Retains the exact original `uhid`.
     - Switches the form into **Locked Record Mode** (`isLocked = true`) to prevent accidental overwrites.
     - Smoothly scrolls to the top of the page (`window.scrollTo({ top: 0, behavior: 'smooth' })`).
     - Updates browser URL to `/patient-registration?id={uhid}` via React Router history without full reload.
2. **Editing Loaded Records**:
   - While locked, form inputs are disabled (`readOnly` / `disabled`).
   - Clicking **"Edit Record"** unlocks all inputs for editing.
   - Clicking **"Cancel Edit"** restores the original saved record and re-locks the view.
   - Submitting updates the existing patient record via `PUT /api/patients/{uhid}/` without duplicating records or generating a new UHID.

---

## 5. Collapsible Additional Registration Sections

To maintain a clean, uncluttered interface while supporting comprehensive clinical and administrative records, secondary fields are grouped into three collapsible accordions:

1. **Demographics & Clinical Details**:
   - `referenceBy` (Referring Doctor / Agency)
   - `religion` (Hindu, Muslim, Christian, Jain, Sikh, Other)
   - `maritalStatus` (Single, Married, Divorced, Widowed)
   - `weight` (kg)
   - `height` (cm)
2. **Address Details**:
   - `streetAddress`
   - `city`
   - `state`
   - `pinCode`
   - `autoSms` (Checkbox toggle)
3. **Other Details & Identification**:
   - `estimate`
   - `aadharNo`
   - `panNo`
   - `mediclaim`
   - `membershipId`
   - `employeeId`
   - `companyName`
   - `remark`

### Accordion Behavior:
- **Default State**: Basic Information is expanded by default; all three additional accordions are collapsed by default.
- **Toggle Controls**: Full-width interactive header buttons featuring chevron icons (`ChevronDown` when collapsed, `ChevronUp` when expanded).
- **Data Persistence**: Toggling sections does **not** reset or lose any entered data.

---

## 6. Streamlined Page Header & Status Indicators

The previous bulky status banner (which occupied significant vertical screen space with labels like `MODE: CREATE`, `Total Records: 23`, `Next UHID: UHID-1024`, and `⌨️ Enter: Next Field`) has been removed.

It has been replaced by:
- A compact title block: **Patient Registration & History**.
- A subtle, color-coded **Status Pill**:
  - `New Registration`: Teal pill indicating new intake mode.
  - `Locked Record: UHID-XXXX`: Grey/blue pill with a lock icon indicating view-only safety mode.
  - `Editing: UHID-XXXX`: Amber pill indicating active modification of an existing patient.

---

## 7. Patient History Filter Improvements

The Patient History filter bar was audited and upgraded:

- **Removed**: Redundant Gender filter.
- **Added Date Range Filtering**:
  - **From Date**: Filter records registered on or after this date.
  - **To Date**: Filter records registered on or before this date.
  - **Validation**: Enforces `From Date <= To Date` via input `min`/`max` constraints and query checking.
- **Category Filter**: Filter by `All`, `NEW`, or `OLD`.
- **Doctor Filter**: Filter by `All Doctors` or dynamically populated doctor list.
- **Clear Filters Button**: One-click action to reset date range, category, doctor, and search terms.
- **Refactored Stats Bar**: Replaced gender counts with relevant clinical metrics:
  - Total Patients
  - New Registrations
  - Old / Follow-up Patients
  - Today's Registrations

---

## 8. Keyboard Navigation (`Enter` Key Flow)

The Enter-key focus management hook (`useFormKeyboardNavigation.ts`) was updated to reflect the new visual sequence:

```typescript
export const PATIENT_REGISTRATION_FIELD_ORDER = [
  // Section 1: Basic Information
  'category',
  'firstName',
  'middleName',
  'lastName',
  'birthDate',
  'age',
  'ageMonths',
  'ageDays',
  'sex',
  'hospitalDoctor',
  'mobile',
  'email',

  // Section 2: Demographics & Clinical (Collapsible)
  'referenceBy',
  'religion',
  'maritalStatus',
  'weight',
  'height',

  // Section 3: Contact & Address (Collapsible)
  'streetAddress',
  'city',
  'state',
  'pinCode',
  'autoSms',

  // Section 4: Other Details & Identification (Collapsible)
  'estimate',
  'aadharNo',
  'panNo',
  'mediclaim',
  'membershipId',
  'employeeId',
  'companyName',
  'remark'
];
```

Pressing `Enter` automatically advances focus to the next visible, enabled input element.

---

## 9. Hardware & PDF Integration Preservation

1. **Barcode Camera Scanner**:
   - Mobile and desktop responsive camera scanner modal with ZXing MultiFormatReader.
   - Dual-mode scanning (continuous rear camera feed with fallbacks).
   - Scanning a barcode triggers patient lookup; if found, prompts or loads record in locked mode.
2. **USB Wedge Barcode Scanner**:
   - Quick search input in sticky action bar listens for keyboard wedge barcode scanner inputs.
3. **Dynamic Bill Issuing & Printing**:
   - Bill modal allows adding/removing line items from `chargeMaster`.
   - Supports percentage and fixed cash discounts with authorization doctor and remarks.
   - Generates persistent invoice numbers (`INV-YYYYMM-XXXX`) saved to `bills.json`.
   - Dual PDF generation: Django backend ReportLab PDF (`/api/patients/{uhid}/bill/pdf/`) with client-side jsPDF fallback.
4. **Patient Sticker PDF**:
   - One-click sticker printing (`100mm x 50mm` thermal format and A4 multi-label grid).
   - Backend ReportLab endpoint (`/api/patients/{uhid}/sticker-pdf/`) with jsPDF fallback.

---

## 10. Verification & Test Results

### Backend Test Suite
Executed: `python manage.py test patients`
```
Found 13 test(s).
System check identified no issues (0 silenced).
.............
----------------------------------------------------------------------
Ran 13 tests in 2.789s

OK
```
**Result**: 13 of 13 tests passed.

### Frontend Production Build
Executed: `npm run build`
```
vite v8.3.0 building client environment for production...
transforming...
✓ 2483 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                          1.19 kB │ gzip:   0.59 kB
dist/assets/PatientRegistration-lybzI9Yl.js            536.50 kB │ gzip: 140.32 kB
✓ built in 2.52s
```
**Result**: Built with 0 TypeScript/Vite compilation errors.

### Code Quality Linting
Executed: `npm run lint` (`oxlint`)
**Result**: 0 errors across 56 files.

---

## 11. Modified Files Summary

| File Path | Description of Changes |
| :--- | :--- |
| `backend/patients/serializers.py` | Added optional `ageMonths` and `ageDays` fields for 3-part structured age storage. |
| `frontend/src/api/patientApi.ts` | Updated `PatientRecord`, `PatientFormData`, and `PatientBillRecord` interfaces with `ageMonths` and `ageDays`. |
| `frontend/src/hooks/useFormKeyboardNavigation.ts` | Updated `PATIENT_REGISTRATION_FIELD_ORDER` to align with the new Basic Info $\to$ Demographics $\to$ Address $\to$ Other sequence. |
| `frontend/src/components/PatientRegistration/PatientRegistration.tsx` | Combined registration and history view, structured age input with auto-DOB sync, 3 collapsible panels, compact header, load/new patient workflows, and history list. |
| `frontend/src/components/PatientRegistration/PatientRegistration.module.css` | Added styling for compact header, status pills, age input row, collapsible accordions, chevrons, history table, and mobile responsive breakpoints. |
| `frontend/src/components/PatientRegistrationList/PatientRegistrationList.tsx` | Standalone history list updated to replace Gender filter with Date Range (From/To) filter, New/Old category stats, and clean reset actions. |
| `frontend/src/components/PatientRegistrationList/PatientRegistrationList.module.css` | Added date input styles and responsive layout updates. |
| `DOCUMENTATION/COMBINED_PATIENT_REGISTRATION_AND_HISTORY.md` | Comprehensive architectural and user documentation. |
