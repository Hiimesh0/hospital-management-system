# CENTRALIZED HOSPITAL CONFIGURATION DOCUMENTATION

**Module:** Hospital Management / EMR System  
**Date:** October 2026  
**Status:** Verified & Live  

---

## 1. Executive Summary

Hospital identity parameters (hospital name, address, telephone, email, and related institutional branding) have been centralized into a single authoritative configuration architecture across both frontend and backend environments.

All hardcoded occurrences of former facility strings (including `UNICARE`, `Acme Plaza...`, `0261-2639700`, `unicareheartinstitute@gmail.com`, and `Bharat Cancer Hospital`) have been removed and replaced with unified references to the central configuration.

Per specification, temporary placeholder values are currently established:
- **Hospital Name:** `XYZ`
- **Hospital Address:** `XYZ`
- **Hospital Phone:** `XYZ`
- **Hospital Email:** `XYZ`

These values can be updated in a single place to immediately propagate across the entire application UI, navigation headers, login screens, patient registration workflows, and generated PDF documents (bills, receipts, and patient stickers).

---

## 2. Configuration Architecture & Locations

A dual-tier single-source-of-truth strategy was implemented to accommodate both client-side static environments (GitHub Pages, Vercel) and backend Django server environments:

```
                                 +--------------------------------+
                                 |  Central Hospital Identity     |
                                 |  Name: XYZ, Address: XYZ       |
                                 |  Phone: XYZ, Email: XYZ        |
                                 +---------------+----------------+
                                                 |
                       +-------------------------+-------------------------+
                       |                                                   |
                       v                                                   v
        [Backend Canonical Config]                               [Frontend Canonical Config]
    backend/config/hospital_config.py                       frontend/src/config/hospitalConfig.ts
                       |                                                   |
     +-----------------+-----------------+               +-----------------+-----------------+
     |                 |                 |               |                 |                 |
     v                 v                 v               v                 v                 v
REST API View     Bill PDF Gen     Sticker PDF Gen   App Header & Nav  Bill Preview/PDF  Registration UI
/api/hospital/   (bill_pdf.py)    (sticker_pdf.py)   (App.tsx, Login) (patientBillGen)   (Registration)
config/
```

### Primary Files Created:

1. **Backend Configuration:**
   - **File:** `backend/config/hospital_config.py`
   - **Re-exports:** `backend/hospital_backend/hospital_config.py` & `backend/patients/hospital_config.py`
   - **Exposed Endpoint:** `GET /api/hospital/config/`
   - **Content Schema:**
     ```python
     HOSPITAL_CONFIG = {
         "name": "XYZ",
         "subTitle": "XYZ",
         "address": "XYZ",
         "phone": "XYZ",
         "email": "XYZ",
         "managedBy": "",
         "cinNo": "",
         "logoUrl": "",
     }
     ```

2. **Frontend Configuration:**
   - **File:** `frontend/src/config/hospitalConfig.ts`
   - **Type Definition:** `HospitalConfig` interface
   - **Content Schema:**
     ```typescript
     export const HOSPITAL_CONFIG: HospitalConfig = {
       name: 'XYZ',
       subTitle: 'XYZ',
       address: 'XYZ',
       phone: 'XYZ',
       email: 'XYZ',
       managedBy: '',
       cinNo: '',
       logoUrl: '',
       nabhAccredited: true,
     };
     ```

---

## 3. Updated Components and Pages

| Location / File | Previous Hardcoded Values | Updated Behavior |
|-----------------|---------------------------|------------------|
| `frontend/src/App.tsx` (Sidebar branding) | Hardcoded `"Hospital System"` | Displays `{HOSPITAL_CONFIG.name}` (`XYZ`) with developer brand (`Mixu Infosystem`) preserved. |
| `frontend/src/App.tsx` (Mobile top header) | Hardcoded `"Hospital System"` | Displays `{HOSPITAL_CONFIG.name}` (`XYZ`). |
| `frontend/src/components/Login/Login.tsx` | `"Hospital Management System"` | Displays `{HOSPITAL_CONFIG.name}` with subtitle referencing `{HOSPITAL_CONFIG.name}`. |
| `frontend/src/components/PatientRegistration/PatientRegistration.tsx` | Generic JSON storage subtitle | Subtitle displays: `"Register new patient to XYZ and save securely"`. |
| `frontend/src/components/PatientRegistrationList/PatientRegistrationList.tsx` | Generic JSON storage subtitle | Subtitle displays: `"Search, filter, view, edit, and manage registered patients at XYZ"`. |
| `frontend/src/components/BillPreview/BillPreview.tsx` | `UNICARE`, `Acme Plaza...`, `0261-2639700`, `unicareheartinstitute@gmail.com` | Renders `{HOSPITAL_CONFIG.name}`, `{HOSPITAL_CONFIG.address}`, `{HOSPITAL_CONFIG.phone}`, and `{HOSPITAL_CONFIG.email}` dynamically. Optional `managedBy` and `cinNo` render only when configured. |
| `frontend/src/utils/patientBillGenerator.ts` | Hardcoded `UNICARE`, `Acme Plaza...`, phone/email | Renders centralized `HOSPITAL_CONFIG` values in generated client-side bill PDF. |
| `backend/patients/bill_pdf.py` | Hardcoded `UNICARE`, `Acme Plaza...`, phone/email | Imports and renders `HOSPITAL_CONFIG` dynamically in backend bill PDF stream. |
| `frontend/src/components/PartPayment/PartPayment.tsx` | `"Bharat Cancer Hospital [OPD-BCH]"` | Renders `{HOSPITAL_CONFIG.name}`. |
| `backend/patients/sticker_pdf.py` | No hospital branding | Includes sheet header with `HOSPITAL_CONFIG` (`XYZ`) and print instructions on A4 sheet outside the label. |
| `frontend/src/utils/patientStickerGenerator.ts` | No hospital branding | Includes sheet header with `HOSPITAL_CONFIG` (`XYZ`) and 100% scale print instructions on A4 sheet. |
| `frontend/src/api/patientApi.ts` | N/A | Added `getHospitalConfig()` helper querying `/api/hospital/config/` with fallback to `HOSPITAL_CONFIG`. |
| `backend/patients/views.py` & `urls.py` | N/A | Added `HospitalConfigView` handling `GET /api/hospital/config/`. |

---

## 4. Preservation of Non-Hospital Entities

In accordance with strict boundary requirements:
1. **Developer Branding:** The Mixu Infosystem software developer emblem and company title were preserved across navigation components.
2. **Clinical Data Integrity:** Patient names, attending doctor names (`hospitalDoctor`), referring physician names, UHIDs, and invoice IDs remain strictly untouched.
3. **No Fabricated Data:** Empty legal registration strings or CIN identifiers are not fabricated or replaced with dummy legal codes; they are omitted gracefully when empty.

---

## 5. Verification & Test Results

1. **Backend Unit Tests:**
   - Test `test_hospital_config_endpoint`: Verified `GET /api/hospital/config/` returns 200 OK and JSON structure matching `XYZ`.
   - Test `test_patient_sticker_pdf_endpoint`: Verified generated PDF text includes `XYZ`.
   - Result: 9 of 9 unit tests passed.

2. **End-to-End Regression Test (`backend/test_sticker_e2e.py`):**
   - Verified live HTTP response from `http://127.0.0.1:8000/api/hospital/config/`.
   - Verified `XYZ` appearance in both bill PDF and sticker PDF.
   - Result: 7 of 7 verification checks passed.

3. **Browser Interactive Testing:**
   - Verified sidebar branding displays `XYZ`.
   - Verified login card displays `XYZ`.
   - Verified Patient Registration subtitle displays `XYZ`.
   - Verified Bill Preview displays `XYZ` header, `XYZ` address, and `Ph: XYZ | E-mail: XYZ`.
