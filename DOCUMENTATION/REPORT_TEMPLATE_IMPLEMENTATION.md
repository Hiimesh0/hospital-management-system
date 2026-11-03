# Report Template Implementation Report

## 1. Overview
The **Report Template** module provides template management for diagnostic, sonographic, radiological, and pathological reporting workflows. It mirrors the exact visual layout and controls from the screenshot (`SS/SS/Investigation Report/Template Master.jpg`), including the exact Sonography Bilateral Upper Limb Doppler clinical template, interactive template previewing, full CRUD actions, search, and safe deactivation.

---

## 2. Screenshot Elements & Layout Preservation
The layout corresponds to `SS/SS/Investigation Report/Template Master.jpg`:
- **Header Bar**:
  - Badge: Record Counter (`17 Of 17` or `1 Of 5`).
  - Page Title: `Report Template`.
  - Template Code Badge (`ID: TPL-XXX`).
- **Main Section Form**:
  - `Group Name`: Dropdown (`Sonography`, `Radiology`, `Pathology`, `Cardiology`, `Echo`, `Endoscopy`, `Biochemistry`, `General`).
  - `Department`: Department title text input (e.g., `Radiology & Imaging`).
  - `TemplateName`: Unique template title input, required (e.g. `COLOR DOPPLER BOTH UPPER LIMB`).
  - `ReportHeader`: Standard report header text (e.g. `BILATERAL UPPER LIMB DOPPLER`).
  - `Details`: Large structured text area with monospace readability for entering clinical findings, organ-by-organ evaluation, CDI/spectral waveforms, comments, and impressions.
  - `Status`: Radio toggle `Active` / `Inactive`.
- **Bottom Action Bar**:
  - Record Navigation Controls: First (`|<<`), Previous (`<`), Next (`>`), Last (`>>|`).
  - Print Checkbox: Interactive toggle preserved from screenshot.
  - `Print Preview`: Triggers a print-ready investigation report modal.
  - `Search` (Binoculars Icon): Opens Particular Search modal with instant filtering.
  - `Add` / `Save Template`: Toggle new record entry and save action.
  - `Update`: Commits edits to the currently selected template.
  - `Delete`: Safe deactivation confirmation workflow.
  - `Exit`: Navigates back to dashboard.

---

## 3. Print-Friendly Template Preview
The module includes a print-ready **Investigation Report Preview Modal** formatted to hospital stationery standards:
- **Centralized Hospital Header**: Sourced from `HOSPITAL_CONFIG` (`XYZ`, address, telephone, email).
- **Department Banner**: Displays the specific clinical department (e.g., `DEPARTMENT OF SONOGRAPHY & DIAGNOSTICS`).
- **Patient Placeholder Metadata**: Clear placeholders indicating where patient information (`Patient Name`, `Age / Gender`, `UHID`, `Referring Doctor`, `Date`) will be inserted during actual patient reporting.
- **Report Header**: Centered uppercase report title.
- **Structured Findings**: Preserves multi-paragraph spacing and clinical alignment.
- **Signature Block**: Standard medical transcriptionist and reporting consultant doctor signature lines.

---

## 4. Backend Endpoints & Storage
- Storage file: `backend/data/report_templates.json` (thread-safe, atomic tempfile rename).
- Seed Data: 5 standardized diagnostic report templates:
  1. `COLOR DOPPLER BOTH UPPER LIMB` (Sonography - exact copy from screenshot)
  2. `ULTRASOUND WHOLE ABDOMEN & PELVIS` (Sonography)
  3. `CHEST X-RAY PA VIEW` (Radiology)
  4. `2D TRANSTHORACIC ECHOCARDIOGRAPHY` (Cardiology)
  5. `COMPLETE BLOOD COUNT (CBC)` (Pathology)
- REST API:
  - `GET /api/report-templates/`: Filter by `search`, `group`, `department`, `active_only`.
  - `POST /api/report-templates/`: Create template with server-side `ReportTemplateSerializer` validation.
  - `GET /api/report-templates/<id>/`: Retrieve single template record.
  - `PUT /api/report-templates/<id>/` / `PATCH /api/report-templates/<id>/`: Update template record.
  - `DELETE /api/report-templates/<id>/?force=false`: Deactivate or delete record.
