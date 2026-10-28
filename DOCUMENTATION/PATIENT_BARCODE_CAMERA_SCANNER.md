# CAMERA-BASED BARCODE SCANNER IMPLEMENTATION REPORT

**Author:** Senior Full-Stack React/Django Developer & Healthcare Workflow Specialist  
**Module:** Patient Registration (Hospital Management / EMR System)  
**Date:** October 2026  
**Target Symbology:** Code 128 (Matching `Sticker.jpeg` Patient Identification Labels)  

---

## 1. Executive Summary

A fully functional, camera-based barcode scanning feature has been implemented exclusively for the **Patient Registration** module. This feature allows hospital registration staff to quickly scan printed patient barcode stickers (such as those generated via the Patient Sticker PDF module) using built-in webcams or mobile rear cameras.

The decoded barcode directly identifies the patient's unique hospital identifier (**UHID**), retrieves their verified demographic and clinical record from the existing JSON storage via backend APIs, and populates the registration form in **Edit Existing Patient** mode.

### Key Highlights:
1. **Prominent UI Integration:** "Scan Patient Barcode" button prominently positioned in the Patient Registration header beside the page title and in the barcode lookup bar.
2. **Privacy-Preserving Camera Flow:** The camera is **never** started prematurely. Clicking the scan button opens a selection modal where the user explicitly chooses their camera and clicks **Start Scanning**.
3. **Hardware Selection & Mobile Optimization:** Enumerates connected cameras; automatically defaults mobile devices to rear-facing cameras (`facingMode: "environment"`).
4. **Local Browser Decoding:** Utilizes `@zxing/library` to decode Code 128 barcodes directly in the browser. Zero video frames or photographs are transmitted to external servers.
5. **Safe Data Lifecycle & Unsaved Data Protection:** If registration staff has unsaved entries in the form, the system intercepts the scan with an **Unsaved Changes Confirmation Dialog** to prevent accidental data loss.
6. **Graceful Stream Cleanup:** Camera tracks are unconditionally stopped when scanning finishes, the modal is closed, or the user navigates away.

---

## 2. Files Modified and Created

### Frontend (`frontend/`)
| File | Action | Description |
|------|--------|-------------|
| `package.json` & `package-lock.json` | **Modified** | Added `@zxing/library` (`^0.23.0`) for client-side 1D/2D barcode decoding. |
| `src/components/PatientRegistration/BarcodeCameraModal.tsx` | **Created** | Dedicated modal component managing device enumeration, permission requests, live video preview, targeting reticle, scan debounce, audio feedback, file upload fallback, and stream lifecycle. |
| `src/components/PatientRegistration/BarcodeCameraModal.module.css` | **Created** | Mixu Infosystem styled modal styles with viewfinder reticle brackets, animated red/green laser scan line, responsive video viewport, status alerts, and control buttons. |
| `src/components/PatientRegistration/PatientRegistration.tsx` | **Modified** | Added primary `Scan Patient Barcode` button in the header and quick-lookup bar; added `handleProcessBarcodeLookup`, `applyScannedPatient`, unsaved changes detection (`hasUnsavedChanges`), and confirmation dialog. |
| `src/components/PatientRegistration/PatientRegistration.module.css` | **Modified** | Added styling for `.btnScanCamera` with hover elevation, icon alignment, and responsive wrapping. |

### Documentation (`DOCUMENTATION/`)
| File | Action | Description |
|------|--------|-------------|
| `DOCUMENTATION/PATIENT_BARCODE_CAMERA_SCANNER.md` | **Created** | Comprehensive implementation, architectural, testing, and operational reference manual. |

---

## 3. Architecture & Scanning Workflow

```text
[ Patient Registration Page ]
              │
              ▼ Click "Scan Patient Barcode"
┌────────────────────────────────────────────────────────┐
│               Scan Patient Barcode Modal               │
│                                                        │
│  1. Camera is IDLE (no hardware stream active)         │
│  2. User selects device:                               │
│     - Back Camera (Environment / Mobile)               │
│     - Front Camera (User / Webcam)                     │
│     - Or explicit device from enumerated list          │
│  3. User clicks [Start Scanning]                       │
└─────────────────────────────┬──────────────────────────┘
                              │
                              ▼ Browser requests camera permission
┌────────────────────────────────────────────────────────┐
│                   Active Video Stream                  │
│                                                        │
│  - Live video preview with targeted reticle & laser    │
│  - @zxing/library decodes video frame locally          │
│  - Code 128 barcode detected                           │
│  - Audio beep tone sounds, stream STOPPED instantly    │
└─────────────────────────────┬──────────────────────────┘
                              │
                              ▼ Decoded UHID (e.g. "UHID-1001")
┌────────────────────────────────────────────────────────┐
│             Unsaved Form Data Check                    │
│                                                        │
│  - Does the form contain unsaved user input?           │
│    ├─ YES ──► Prompt User Confirmation:                │
│    │          [Keep Current Form] or [Discard & Load]  │
│    └─ NO  ──► Proceed with Patient Lookup              │
└─────────────────────────────┬──────────────────────────┘
                              │ User confirms
                              ▼
┌────────────────────────────────────────────────────────┐
│           Backend API Lookup & Population              │
│                                                        │
│  - patientApi.getPatientById(scannedUhid)              │
│  - Backend matches record in JSON storage              │
│  - Switch form to "Edit Existing Patient" mode         │
│  - Pre-populate all matching fields                    │
│  - Retain permanent UHID & creation timestamp          │
└────────────────────────────────────────────────────────┘
```

---

## 4. Scanning Library & Barcode Symbology

### Library Choice: `@zxing/library` (v0.23.0)
- **Engine:** Pure TypeScript/JavaScript implementation of the industrial Zebra Crossing (ZXing) barcode processing engine.
- **Compatibility:** Fully compatible with React 19, Vite, ES Modules, and modern browser standards.
- **Zero WebAssembly Hassles:** Unlike some C++ WASM ports, `@zxing/library` has zero external `.wasm` binary dependencies, avoiding MIME-type issues on CDNs and static hosts like Vercel and GitHub Pages.
- **Client-Side Processing:** All barcode parsing occurs directly in the browser's JavaScript execution thread on the HTML5 `<video>` canvas. No patient image or video feed is ever transmitted over the network.

### Supported Barcode Formats
- **Code 128:** Primary format used by the hospital sticker generator (`backend/patients/sticker_pdf.py` and `frontend/src/utils/patientStickerGenerator.ts`).
- **Additional 1D/2D Formats:** Code 39, EAN-13, EAN-8, UPC-A, UPC-E, and QR Codes are also decoded by ZXing's `BrowserMultiFormatReader`.

### Barcode Payload
- The barcode payload contains strictly the patient's **UHID** (e.g. `UHID-1001`).
- **Zero Sensitive Data:** The barcode does not encode Aadhaar numbers, PAN, phone numbers, or clinical diagnoses.

---

## 5. Camera Permission & Hardware Lifecycle

### 1. Zero Premature Activation
- When the modal opens, the camera hardware is **never** started automatically.
- The user sees a clear status: *"Camera is currently idle. Click 'Start Scanning' when ready."*
- This avoids unnecessary permission prompts, saves battery life, and respects user privacy.

### 2. Device Selection & Mobile Optimization
- The modal presents a dropdown list of available video devices.
- On mobile devices, rear cameras (`facingMode: "environment"`) are prioritized by default for clear macro barcode focus.
- On desktop workstations, the user webcam is selected.
- If device labels are withheld prior to permission grant, the modal provides intuitive default options:
  - `Environment-facing camera (Back Camera / Mobile)`
  - `User-facing camera (Webcam / Front Camera)`

### 3. Immediate Stream Release
The camera hardware is guaranteed to be shut down in all of the following scenarios:
1. When a valid barcode is decoded.
2. When the user clicks **Stop Scanning**.
3. When the user clicks **Cancel** or the modal's close button (`×`).
4. When the user clicks outside the modal backdrop or presses Escape.
5. When the user navigates away or the component unmounts.

```typescript
// Hardware cleanup implementation in BarcodeCameraModal.tsx
const stopCameraStream = useCallback(() => {
  if (codeReaderRef.current) {
    codeReaderRef.current.reset();
  }
  if (streamRef.current) {
    streamRef.current.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch (err) {
        console.warn('Error stopping video track:', err);
      }
    });
    streamRef.current = null;
  }
  if (videoRef.current) {
    videoRef.current.srcObject = null;
  }
  setIsStreaming(false);
}, []);
```

---

## 6. Backend Patient Lookup API

### Endpoint
- **URL:** `GET /api/patients/<str:patient_id>/`
- **Controller:** `PatientDetailView.as_view()` in `backend/patients/views.py`
- **Storage:** JSON storage file (`backend/data/patients.json`) with in-memory persistence.
- **Client API Adapter:** `patientApi.getPatientById(patientId)` in `frontend/src/api/patientApi.ts`

### Request & Response Example
**Request:**
```http
GET /api/patients/UHID-1001/ HTTP/1.1
Host: 127.0.0.1:8000
Accept: application/json
```

**Response (200 OK):**
```json
{
  "id": "UHID-1001",
  "patientId": "UHID-1001",
  "prefix": "Mr.",
  "firstName": "VIPUL KUMAR",
  "middleName": "KESARSINGH",
  "lastName": "VASAVA",
  "gender": "Male",
  "dob": "1996-03-15",
  "age": 30,
  "address": "SURAT GUJARAT",
  "mobile": "8141298303",
  "email": "vipul.vasava@example.com",
  "doctor": "Dr. DEVANG DESAI / JIGAR PATEL",
  "refDoctor": "DR. DAYARAM VASAVA",
  "registrationDate": "2026-10-28",
  "createdAt": "2026-10-28T10:00:00Z"
}
```

---

## 7. Patient Field Mapping & Form Mode

### Form Field Population
When a patient record is retrieved, all matching fields are populated:
- `id` / `patientId` (UHID)
- `prefix` (Title: Mr., Mrs., Ms., Dr., Baby, Mast.)
- `firstName`, `middleName`, `lastName`
- `gender`
- `dob` (Date of Birth)
- `age`
- `address`, `city`, `state`, `pincode`
- `mobile`, `email`
- `bloodGroup`
- `doctor` (Attending Doctor)
- `refDoctor` (Referring Doctor)
- `category`, `paymentMode`
- `notes`

### Excluded Fields Compliance
In accordance with prior architectural requirements, the five previously removed fields remain **completely excluded**:
- ❌ `Wedding Date`
- ❌ `Language`
- ❌ `Education`
- ❌ `Occupation`
- ❌ `Spouse Occupation`

### Edit Mode Transition
1. Setting the URL route to `#/patient-registration?id=<UHID>` automatically places the form into **Edit Existing Patient** mode.
2. The permanent UHID and original `createdAt` timestamp are preserved.
3. The submit button displays **Update Patient Record** instead of **Register Patient**.
4. Submitting the form calls `PUT /api/patients/<UHID>/`, updating the existing JSON record rather than creating a duplicate.

---

## 8. Data Safety & Unsaved Changes Protection

To protect users against accidental data loss when scanning an ID card:
1. **Unsaved Edits Detection:**
   - In **Create Mode**: Checks if any primary fields (`firstName`, `mobile`, `address`, `age`, etc.) contain non-empty user input.
   - In **Edit Mode**: Checks whether `JSON.stringify(formData) !== JSON.stringify(initialEditData)`.
2. **Confirmation Dialog:**
   - If unsaved edits exist, an alert modal appears:
     > *"You have unsaved changes in the registration form. Discarding will replace your current entries with the scanned patient's record."*
   - Options provided:
     - **Keep Current Form (Cancel):** Retains all currently entered data untouched.
     - **Discard & Load Patient:** Safely overwrites form data with the verified scanned record.

---

## 9. Visual Aesthetics (Mixu Infosystem Brand)

The camera scanner modal follows the established **Mixu Infosystem** brand guidelines:
- **Blue (`#4285F4`):** Primary branding, active reticle borders, camera control buttons.
- **Red (`#EA4335`):** Danger notifications, cancel buttons, stop streaming button.
- **Green (`#34A853`):** Successful barcode acquisition highlight, animated laser scan beam.
- **Yellow (`#FBBC05`):** Unsaved changes warning alerts, camera device switch indicators.
- **Target Reticle:** Stylized corner brackets framing the optical target area with an animated laser beam.
- **Audio Feedback:** Synthesizes an immediate high-pitched audio beep tone (880 Hz) using the Web Audio API upon successful barcode acquisition.

---

## 10. Error Handling & Edge Cases

| Scenario | Symptom / Trigger | System Response |
|----------|-------------------|-----------------|
| **Permission Denied** | User blocks camera in browser prompt | Catches `NotAllowedError`. Displays clear instructions to enable permissions in the URL bar with a "Dismiss" action. |
| **No Camera Available** | Device lacks video input hardware | Catches `NotFoundError`. Informs user no camera was found and provides an image upload fallback. |
| **Hardware Busy** | Another application (Zoom, Teams) has locked the webcam | Catches `NotReadableError`. Advises user to close other camera-using apps and retry. |
| **Unrecognized Barcode** | Barcode format unsupported or unreadable | Status indicator prompts user to hold the sticker steady, improve lighting, or adjust distance. |
| **Patient Not Found** | Barcode decodes a UHID not present in backend JSON | Displays red alert: `Patient Not Found (UHID: XXXXX)`. Keeps the form intact and allows instant re-scan. |
| **Duplicate Scan Suppression** | Camera reads the same barcode multiple times per second | Debounce mechanism locks scanning immediately after the first successful frame decode. |
| **Unsaved Form Input** | Staff has typed partial information into the form | Warns user and requires explicit confirmation before overwriting data. |

---

## 11. Test Results & Verification

### Browser Automated Test Suite
Verified via autonomous browser subagent (`verify_camera_scanner_1793216863788.webp`):
1. **Modal Invocations:** Verified clicking `Scan Patient Barcode` opens the modal with device selection.
2. **Idle State:** Confirmed camera does NOT activate until user explicitly clicks `Start Scanning`.
3. **Modal Dismissal:** Tested Cancel button and backdrop dismiss; verified clean shutdown.
4. **Unsaved Data Protection:** 
   - Typed `UnsavedTestUser` into First Name field.
   - Triggered barcode scan for `UHID-1001`.
   - Verified Unsaved Changes dialog appeared with prompt.
   - Clicked "Keep Current Form" -> Verified `UnsavedTestUser` was preserved.
   - Triggered scan again, clicked "Discard & Load Patient" -> Verified form transitioned to Edit Mode with `VIPUL KUMAR KESARSINGH VASAVA`.
5. **Form Population:** All fields (Name, Gender, DOB, Age, Mobile, Address, Doctor) populated accurately.
6. **Sticker Barcode Scannability:** Barcode in generated PDF (`UHID-1001`) decoded accurately by ZXing.

### Build & Lint Verification
- **Build:** `npm run build` completed in `2.70s` with **0 errors**.
- **Linting:** `npm run lint` completed with **0 warnings / 0 errors**.

---

## 12. Browser Limitations & Security Considerations

1. **Secure Context Requirement:**
   - Modern browser security standards mandate that `navigator.mediaDevices.getUserMedia` is only accessible over **HTTPS** or `http://localhost`.
   - In production deployments (Vercel, GitHub Pages), HTTPS is enforced automatically.
2. **Device Label Privacy:**
   - Device labels (e.g. *"Logitech HD Pro C920"*) are masked by browsers until camera permission has been granted at least once. The component handles this transparently by providing fallback labels (`Back Camera`, `Front Camera`).
3. **Mobile Browser Autoplay Policies:**
   - The `<video>` preview element includes `playsInline`, `muted`, and `autoPlay` attributes to prevent mobile iOS Safari and Chrome Android from full-screening the video stream.
4. **Local Execution:**
   - Barcode processing is 100% client-side; zero video streams are transmitted to third-party endpoints or stored on disk.
