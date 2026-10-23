# MIXU INFOSYSTEM WATERMARK VISIBILITY FIX REPORT

**Project:** Hospital Management / EMR Web Application  
**Module:** Universal Watermark & Layout Diagnostics  
**Date:** October 2026  
**Status:** Verified & Deployed  

---

## 1. Root Cause Diagnosis

Following visual inspection and DOM/computed-style diagnostics in the running application, three distinct root causes were identified that previously made the watermark too faint or obscured:

1. **Sub-Optimal Opacity & Color Washout:**
   - The initial target opacity (0.045) was calibrated too conservatively. Against white card surfaces (`#FFFFFF`) and modern IPS/LCD monitors with standard contrast curves, 0.045 caused the yellow (`#FBBC05`), light blue, and fine circuit traces of the logo to completely wash out, leaving only an imperceptible grey silhouette.

2. **RGB White Background vs True Alpha Channel:**
   - The uploaded asset `MIXU Infosystem Tech Emblem.png` was encoded in RGB color mode with near-white background pixels `(253, 255, 254)` instead of a transparent alpha channel.
   - At lower opacities or with standard alpha blending, this cast a slight rectangular boundary box across the content area rather than rendering pure transparent emblem artwork.

3. **Layer Blending and Stacking Contexts:**
   - Components such as `PatientRegistration`, `Billing`, `PatientPastInfo`, and `RoomCharges` utilize solid white surface cards (`background: var(--surface)` / `#FFFFFF`).
   - Using `mix-blend-mode: multiply` on the newly transparent alpha PNG with `z-index: 1` and `pointer-events: none` allows the logo's four brand colors (Blue, Red, Yellow, Green) and typography to cleanly multiply onto the card surfaces without altering the deep contrast of dark text (`#1F2937`) or obstructing input controls.

---

## 2. Implemented Technical Changes

### 2.1 Alpha Channel Transparency Conversion
- Converted `mixu-infosystem-logo.png` to an RGBA asset with true alpha transparency.
- Near-white background pixels were converted to `alpha: 0` with anti-aliasing edges preserved around the emblem and typography.
- Assets updated:
  - `frontend/public/assets/mixu-infosystem-logo.png`
  - `frontend/src/assets/mixu-infosystem-logo.png`

### 2.2 Sizing, Opacity & Stacking Updates (`frontend/src/index.css`)
```css
/* Main content area with clearly visible brand watermark */
.appMainContent {
  position: relative;
  isolation: isolate;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
}

.appMainContent::before {
  content: "";
  position: fixed;
  inset: 0;
  left: var(--sidebar-actual-width, 270px);
  background-image: var(--watermark-url, url('/assets/mixu-infosystem-logo.png'));
  background-repeat: no-repeat;
  background-position: center;
  background-size: min(50vw, 560px);
  opacity: 0.13; /* Meets target 0.10–0.16 */
  pointer-events: none;
  z-index: 1;
  user-select: none;
  mix-blend-mode: multiply;
  transition: left 0.24s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Tablet Responsive Sizing (<= 1024px) */
@media (max-width: 1024px) {
  .appMainContent::before {
    left: 0 !important;
    top: var(--mobile-header-height, 56px) !important;
    background-size: min(72vw, 320px) !important;
    opacity: 0.12 !important;
  }
}

/* Mobile Responsive Sizing (<= 480px, including iPhone 16 / 393px) */
@media (max-width: 480px) {
  .appMainContent::before {
    background-size: min(82vw, 260px) !important;
    opacity: 0.11 !important;
  }
}
```

---

## 3. Visual Verification Matrix

| Route | Viewport | Watermark Recognition | Text & Form Contrast | Interactivity | Status |
|---|---|---|---|---|---|
| `/login` | 1366x768 | Centered behind login card, colors recognizable | High contrast, inputs clearly legible | 100% Clickable | **PASSED** |
| `/patient-registration` | 1366x768 | Clearly visible across form sections | High contrast, all labels & fields readable | 100% Clickable | **PASSED** |
| `/patient-history` | 1366x768 | Visible behind multi-column clinical cards | High contrast, clinical inputs legible | 100% Clickable | **PASSED** |
| `/billing` | 1366x768 | Clearly visible across billing calculation tables | High contrast, numbers & buttons sharp | 100% Clickable | **PASSED** |
| `/room-charges` | 1366x768 | Clearly visible across room matrices | High contrast, room cards readable | 100% Clickable | **PASSED** |
| `/patient-registration` | 393x852 (iPhone 16) | Centered, scaled to 260px, recognizable | High contrast, no horizontal overflow | 100% Touch-friendly | **PASSED** |
| `/patient-registration` | 320x640 (iPhone SE) | Centered, scaled to 260px, zero clipping | Compact layout preserved | 100% Touch-friendly | **PASSED** |
| `/patient-registration` | 768x1024 (iPad) | Centered, scaled to 320px, balanced opacity | Tablet card layout preserved | 100% Clickable | **PASSED** |

---

## 4. Key Highlights & Safety Assurances

1. **Non-Blocking Interaction:** `pointer-events: none` guarantees that clicking form fields, dragging scrollbars, selecting text, and triggering action buttons (Save, Print, Update, Exit) remain completely uninterrupted.
2. **Text Legibility:** The dark text (`#1F2937`) remains 100% sharp and high-contrast, meeting WCAG AA requirements.
3. **No Container Fading:** `opacity` was NOT applied to `.pageContainer` or cards, preventing any text or controls from fading.
4. **Zero Tile & No Overflow:** `background-repeat: no-repeat` and responsive `min()` dimensions prevent repeated tiling or horizontal scrollbars.
