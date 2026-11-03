# Medicine Master Implementation Report

## 1. Overview
The **Medicine Master** module has been converted from a static interface into a complete, clinically sound drug formulary and pharmacy inventory master system. It faithfully preserves all layout details from `SS/SS/Master/Medicine Master.jpg`, while adding complete CRUD operations, client-side and backend validations, fast search, and safe deactivation.

---

## 2. Screenshot Elements & Layout Preservation
The layout corresponds to `SS/SS/Master/Medicine Master.jpg`:
- **Header Bar**:
  - Record Counter (`1 of 5` or `New Medicine`).
  - Medicine ID badge (`ID: MED-XXXX`).
  - Page Title: `Medicine Master`.
- **Main Layout Grid (Two-Column Layout)**:
  - **Left Form Section**:
    - `Brand Name`: Styled with yellow highlight background (`highlightInput`), required.
    - `Dosage Form`: Controlled dropdown (`Tablet`, `Capsule`, `Syrup`, `Injection`, `Ointment / Gel`, `Eye/Ear Drops`, `Surgical Suture`, `IV Infusion`, `Inhaler`).
    - `Strength`: Text input (e.g. `650 mg`, `500 mg + 125 mg`, `40 mg`).
    - `Frequency`: Text input (e.g. `1-0-1`, `1-1-1`, `TDS`, `Once Daily`, `SOS`).
    - `Availability`: Text input (e.g. `In Stock`, `Pharmacy`, `Available`).
    - `Remark 1`: Clinical intake instructions (e.g. `Take after food`).
    - `Remark 2`: Duration / therapy notes (e.g. `Complete full course`).
    - `Total Days`: Numeric duration field (non-negative).
    - `For`: Controlled dropdown (`Both`, `OPD Only`, `IPD Only`, `Male`, `Female`).
    - `Notes`: Precautions / contraindications text input.
    - `Pricing (₹)`: Selling Price / MRP numeric currency input (non-negative).
    - `Stock Qty`: Current stock balance integer (non-negative).
    - `Status`: Radio toggle `Active` / `Inactive`.
  - **Right Form Section**:
    - `Medicine Group`: Therapeutic category (e.g. `Analgesics & Antipyretics`, `Antibiotics`, `Cardiovascular`, `Surgical Consumables & Sutures`).
    - `Generic Name`: Chemical active ingredient input, required.
    - `Manufacturer`: Pharmaceutical company name.
    - `Batch / Expiry`: Batch number and Expiry Date inputs.
    - `Large Formulary Display Box`: Real-time formatted summary displaying the complete composition, dosage frequency, stock level, pricing, and clinical notes.
- **Bottom Action Bar**:
  - Navigation Controls: First, Previous, Next, Last.
  - `Particular Search`: Opens real-time search & filter modal.
  - `Print`: Opens print-ready pharmacy record modal.
  - `Add` / `Save Medicine`: Create mode toggle and save action.
  - `Update`: Updates existing medicine attributes.
  - `Delete / Deactivate`: Safe deactivation confirmation workflow.
  - `Exit`: Navigates back to dashboard.

---

## 3. Data Validation & Rules
| Field | Type | Required | Validation Rules |
| :--- | :--- | :--- | :--- |
| `brandName` | Text | Yes | Minimum 2 characters. |
| `genericName` | Text | Yes | Minimum 2 characters. |
| `totalDays` | Integer | No | Non-negative integer (`>= 0`). |
| `purchasePrice` | Float | No | Non-negative currency (`>= 0.0`). |
| `sellingPrice` | Float | No | Non-negative currency (`>= 0.0`). |
| `stockQty` | Integer | No | Non-negative integer (`>= 0`). |
| `reorderLevel` | Integer | No | Non-negative integer (`>= 0`). |
| `gst` | Float | No | Percentage between `0.0` and `100.0`. |
| `status` | Choice | Yes | Controlled choice: `active` or `inactive`. |

---

## 4. Deactivation vs Deletion
Medicines linked to patient prescriptions or pharmacy sales cannot be permanently purged without breaking historical chart integrity. The module provides a confirmation modal with **Deactivate (Safe)** as the default primary action, marking the drug inactive while keeping prescription histories intact.

---

## 5. Backend Endpoints & Storage
- Storage file: `backend/data/medicines.json` (thread-safe, atomic tempfile rename).
- Seed Data: 5 clinical drugs (Paracetamol 650, Augmentin 625 Duo, Pan 40, Azithral 500, Zzzvicryl 1 Nw2347).
- REST API:
  - `GET /api/medicines/`: Filter by `search`, `group`, `dosage_form`, `active_only`.
  - `POST /api/medicines/`: Create medicine with server-side `MedicineSerializer` validation.
  - `GET /api/medicines/<id>/`: Retrieve single medicine record.
  - `PUT /api/medicines/<id>/` / `PATCH /api/medicines/<id>/`: Update medicine record.
  - `DELETE /api/medicines/<id>/?force=false`: Deactivate or delete record.
