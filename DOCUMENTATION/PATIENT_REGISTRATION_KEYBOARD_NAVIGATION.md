# Patient Registration — Keyboard Navigation (Shift + Enter)

## Executive Summary

To accelerate clinical data entry and improve ergonomic keyboard workflow for hospital receptionists and data clerks, the **Patient Registration module** now supports **`Shift + Enter`** keyboard navigation.

Pressing **`Shift + Enter`** automatically moves focus sequentially to the next logical field in the registration form, scrolling it into view and highlighting it with a clear focus ring, without triggering premature form submissions.

---

## 1. Keyboard Shortcut Specification

| Key Combination | Action | Details |
|:---|:---|:---|
| **`Shift + Enter`** | **Navigate to Next Field** | Advances focus to the next enabled, editable field in the defined sequence. Automatically selects text in text/numeric inputs for quick modification. |
| **`Tab`** | **Standard Forward Navigation** | Preserved completely for native browser tab order. |
| **`Shift + Tab`** | **Standard Backward Navigation** | Preserved completely for native browser backward tab order. |
| **`Enter`** (alone) | **Standard Element Behavior** | In buttons: activates the button. In dropdowns: selects option. In text inputs: standard behavior. Does not interfere with normal typing. |
| **`Space`** | **Standard Selection / Activation** | Toggles checkboxes, activates buttons, and opens dropdown menus. |

---

## 2. Logical Field Navigation Sequence

The sequence strictly mirrors the visual layout of the Patient Registration form across all 4 logical sections:

| # | Field Name | Element Type | Section | Behavior |
|:---:|:---|:---:|:---|:---|
| 1 | `category` | `<select>` | Section 1: Basic Information | Category selection (NEW / OLD) |
| 2 | `firstName` | `<input type="text">` | Section 1: Basic Information | Required field, auto-selects text |
| 3 | `middleName` | `<input type="text">` | Section 1: Basic Information | Optional field |
| 4 | `lastName` | `<input type="text">` | Section 1: Basic Information | Optional field |
| 5 | `birthDate` | `<input type="date">` | Section 1: Basic Information | Date picker control |
| 6 | `age` | `<input type="number">` | Section 1: Basic Information | Age input (auto-calculates with birthDate) |
| 7 | `ageUnit` | `<select>` | Section 1: Basic Information | Years / Months / Days |
| 8 | `sex` | `<select>` | Section 1: Basic Information | Male / Female / Other |
| 9 | `hospitalDoctor` | `<select>` | Section 2: Demographics & Clinical | Doctor selection |
| 10 | `referenceBy` | `<select>` | Section 2: Demographics & Clinical | Referral doctor |
| 11 | `religion` | `<select>` | Section 2: Demographics & Clinical | Religion dropdown |
| 12 | `maritalStatus` | `<select>` | Section 2: Demographics & Clinical | Marital status dropdown |
| 13 | `weight` | `<input type="number">` | Section 2: Demographics & Clinical | Weight in kg |
| 14 | `height` | `<input type="number">` | Section 2: Demographics & Clinical | Height in cm |
| 15 | `mobile` | `<input type="tel">` | Section 3: Contact & Address | Primary telephone (10-15 digits) |
| 16 | `email` | `<input type="email">` | Section 3: Contact & Address | Email address |
| 17 | `autoSms` | `<input type="checkbox">` | Section 3: Contact & Address | SMS notification consent |
| 18 | `streetAddress` | `<input type="text">` | Section 3: Contact & Address | Street address |
| 19 | `city` | `<input type="text">` | Section 3: Contact & Address | City (e.g. SURAT) |
| 20 | `state` | `<input type="text">` | Section 3: Contact & Address | State (e.g. GUJARAT) |
| 21 | `pinCode` | `<input type="text">` | Section 3: Contact & Address | 6-digit PIN code |
| 22 | `estimate` | `<input type="text">` | Section 4: Other Details | Financial estimate |
| 23 | `aadharNo` | `<input type="text">` | Section 4: Other Details | 12-digit Aadhar ID |
| 24 | `panNo` | `<input type="text">` | Section 4: Other Details | 10-character PAN ID |
| 25 | `mediclaim` | `<input type="text">` | Section 4: Other Details | Insurance / Mediclaim provider |
| 26 | `membershipId` | `<input type="text">` | Section 4: Other Details | Hospital membership ID |
| 27 | `employeeId` | `<input type="text">` | Section 4: Other Details | Corporate employee ID |
| 28 | `companyName` | `<input type="text">` | Section 4: Other Details | Corporate employer name |
| 29 | `remark` | `<input type="text">` | Section 4: Other Details | Clinical / administrative remarks |
| 30 | `submitButton` | `<button type="submit">` | Form Actions | Focuses primary button (`Register Patient` / `Update Patient Record`) |

> **Note on Final-Field Behavior:** When the user presses `Shift + Enter` on `remark`, focus moves directly to the primary submission button without triggering submission. Pressing `Shift + Enter` on the submit button cycles focus back to `category`.

---

## 3. Technical Implementation

### A. Reusable Hook: `useFormKeyboardNavigation`
File: `frontend/src/hooks/useFormKeyboardNavigation.ts`

- **Single Event Listener:** Uses event bubbling at the `<form>` root rather than registering 29 individual `onKeyDown` listeners.
- **Focusability Validation (`isFieldFocusable`):**
  - Skips `disabled` elements.
  - Skips `readOnly` elements.
  - Skips elements with `tabIndex === -1`.
  - Skips elements with `hidden`, `aria-hidden="true"`, or CSS `display: none` / `visibility: hidden`.
- **Smooth Scroll & Focus (`focusField`):**
  - Calls `element.focus()`.
  - Calls `element.scrollIntoView({ behavior: 'smooth', block: 'center' })` to keep the active field centered and avoid clipping under sticky headers or action bars.
  - Automatically selects text for text, number, email, and tel inputs.
- **Submission Prevention:**
  - Calls `e.preventDefault()` and `e.stopPropagation()` strictly on `Shift + Enter` to prevent browser form submission or textarea newline creation.

### B. Component Integration
File: `frontend/src/components/PatientRegistration/PatientRegistration.tsx`

```tsx
// Fast keyboard navigation via Shift + Enter
const { formRef, handleKeyDown: handleFormKeyDown } = useFormKeyboardNavigation();

...

<form ref={formRef} onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} noValidate>
```

Header badge added:
```tsx
<span className={styles.badge} title="Press Shift + Enter to quickly jump to the next field">
  ⌨️ Shift + Enter: Next Field
</span>
```

### C. Enhanced Focus Styling
File: `frontend/src/components/PatientRegistration/PatientRegistration.module.css`

```css
.input:focus, .select:focus {
  outline: 2px solid var(--primary, #0284c7);
  outline-offset: 1px;
  border-color: var(--primary, #0284c7);
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
}

.checkbox:focus-visible {
  outline: 2px solid var(--primary, #0284c7);
  outline-offset: 2px;
}
```

---

## 4. Verification and Test Results

### 1. Automated Unit Tests (Node.js Test Suite)
- **Test 1 (Full Sequence Navigation):** Traversed all 29 fields + submit button in exact sequence (**PASSED**).
- **Test 2 (Skip Disabled Fields):** Verified disabled fields are bypassed (**PASSED**).
- **Test 3 (Skip Read-Only Fields):** Verified read-only fields are bypassed (**PASSED**).
- **Test 4 (Skip Hidden Fields):** Verified elements with `hidden` or CSS display/visibility hidden are bypassed (**PASSED**).
- **Test 5 (Last Field to Submit Button):** Verified `remark` shifts focus to primary submit button (**PASSED**).
- **Test 6 (Cycle from Submit Button):** Verified `Shift + Enter` on submit button wraps to first field (**PASSED**).

### 2. Live Browser Subagent Verification
- **Create Mode Test:**
  - Entered `First Name` ("TestShift"), navigated with `Shift + Enter` through `Middle Name` ("K"), `Last Name` ("User"), `Birth Date`, `Age` ("29"), `Age Unit`, `Sex`.
  - Advanced through Demographics & Clinical fields to `Mobile` ("9876543210").
  - Traversed Communication, Address, and Other Identification to `Remark` ("Keyboard testing patient").
  - Pressed `Shift + Enter` on `Remark`: focus landed directly on the primary `Register / Save Patient` submit button.
  - Confirmed the form **did not submit prematurely**.
- **Edit Mode Test (`?id=UHID-1001`):**
  - Navigated to Edit Patient Record.
  - Pressed `Shift + Enter` across fields: loaded values were completely preserved without alteration.
- **Tab & Shift + Tab:**
  - Native Tab and Shift + Tab keys functioned normally without interference.
- **Build & Lint Verification:**
  - `npm run build`: 0 errors (7.61s).
  - `npm run lint`: 0 errors.

---

## 5. Scope & Boundary Conformance

- Implemented **strictly in Patient Registration**.
- No other modules (OPD, IPD, Billing, Master, Certificate) were altered.
- All 5 previously removed fields remain absent.
- Full responsive design and watermark integrity preserved.
