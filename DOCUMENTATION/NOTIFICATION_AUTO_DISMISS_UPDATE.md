# Notification System Update — 5-Second Auto-Dismissal

## Overview & Executive Summary

In the Hospital Management / EMR application, the notification system has been upgraded to provide automatic dismissal of temporary feedback banners after **5 seconds (5000 milliseconds)** while preserving persistent form validation messages until users correct and resolve them.

This update covers all key patient registration workflows:
- **Patient Creation:** Success toast appears with the assigned UHID and automatically dismisses after 5000ms.
- **Patient Update:** Success toast appears confirming modifications and automatically dismisses after 5000ms.
- **Patient Deletion:** Success toast appears confirming record deletion and automatically dismisses after 5000ms.
- **Temporary Errors & Feedback:** Network errors, reset confirmations, and loading feedback automatically dismiss after 5000ms.
- **Persistent Validation Errors:** Required form field warnings remain on screen indefinitely until the user fixes the form inputs, resubmits, or manually closes the message.

---

## Technical Architecture & Implementation

### 1. Reusable Hook: `useAutoDismissNotification`
A custom hook was created at `frontend/src/hooks/useAutoDismissNotification.ts` to manage timer lifecycles, memory safety, and cleanup:

```typescript
export interface AppNotification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  uhid?: string;
  persistent?: boolean;
}

export const AUTO_DISMISS_DURATION_MS = 5000;

export function useAutoDismissNotification<T extends AppNotification = AppNotification>(
  initialState: T | null = null,
  durationMs: number = AUTO_DISMISS_DURATION_MS
) {
  const [notification, setNotification] = useState<T | null>(initialState);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const dismissNotification = useCallback(() => {
    clearTimer();
    setNotification(null);
  }, [clearTimer]);

  useEffect(() => {
    // Clear any pending timer whenever notification changes
    clearTimer();

    // Do not schedule auto-dismiss if empty or marked persistent
    if (!notification || notification.persistent) {
      return;
    }

    // Schedule auto-dismissal after exactly 5000ms
    timerRef.current = setTimeout(() => {
      setNotification(null);
      timerRef.current = null;
    }, durationMs);

    // Clean up timer on unmount or before next effect run
    return () => {
      clearTimer();
    };
  }, [notification, durationMs, clearTimer]);

  return {
    notification,
    setNotification,
    dismissNotification,
    clearTimer,
  };
}
```

### 2. Key Lifecycle Protections
1. **Accurate 5000ms Duration:** Configured with `AUTO_DISMISS_DURATION_MS = 5000`.
2. **Persistent Form Validation:** When form validation fails in `PatientRegistration.tsx` (e.g. missing First Name, invalid Mobile Number, missing Doctor), notifications are dispatched with `{ persistent: true }`. The hook checks `if (!notification || notification.persistent) return;`, bypassing the timer so the user has ample time to review and correct the required fields.
3. **Manual Close Cancellation:** Clicking the close (`X`) button calls `dismissNotification()`, which immediately executes `clearTimer()` and sets `notification` to `null`.
4. **Replacement Safety:** When a new notification arrives while an existing one is visible, the previous timer is canceled immediately before the new timer starts. This prevents an old timer from prematurely dismissing a newly created alert.
5. **Unmount Cleanup:** When the user switches pages (e.g. navigates between Patient Registration and Patient Registration List), the `useEffect` cleanup hook fires `clearTimer()`, preventing memory leaks or `setState` calls on unmounted components.
6. **No Page Reloads:** All dismissals modify React component state directly without page refreshes or navigation jumps.

---

## Files Changed

| File Path | Change Type | Purpose |
|:---|:---:|:---|
| `frontend/src/hooks/useAutoDismissNotification.ts` | **Created** | Encapsulates the 5-second timer lifecycle, persistent flag checks, timer clearing on manual close/unmount, and replacement protection. |
| `frontend/src/components/PatientRegistration/PatientRegistration.tsx` | **Modified** | Integrated `useAutoDismissNotification`; added `persistent: true` to required field validations; updated manual dismiss handler. |
| `frontend/src/components/PatientRegistrationList/PatientRegistrationList.tsx` | **Modified** | Integrated `useAutoDismissNotification`; patient deletion success/error toasts automatically dismiss after 5000ms. |

---

## Verification & Test Results

### 1. Automated Lifecycle Unit Tests
An automated test suite was executed covering all timer permutations:
- **Test 1 (Temporary Success Auto-Dismissal):** Verified message was visible initially and automatically cleared after the timeout period (`PASS`).
- **Test 2 (Persistent Form Validation Error):** Verified notification with `persistent: true` remained visible after the timeout period had elapsed (`PASS`).
- **Test 3 (Manual Dismissal):** Verified that clicking manual close immediately cleared state and canceled pending timers (`PASS`).
- **Test 4 (Replacement Safety):** Replaced an existing notification before its timer expired; verified the old timer did not dismiss the new notification prematurely, and the new notification enjoyed its own full duration (`PASS`).
- **Test 5 (Component Unmount Cleanup):** Verified that unmounting cleared active timers without triggering callbacks (`PASS`).

### 2. Browser Verification (Live Running App)
Interactive end-to-end testing was performed in the live web application on `http://localhost:5173/hospital-management-system/`:

| Test Case | Steps Executed | Expected Result | Actual Result |
|:---|:---|:---|:---:|
| **Patient Deletion Auto-Dismiss** | Clicked delete icon for patient on Patient List; confirmed deletion modal. | Green success banner appears; automatically disappears after 5 seconds. | **PASSED** (Banner appeared, then cleanly disappeared after 5s) |
| **Persistent Validation Error** | Attempted to submit Patient Registration with empty First Name. | Red error alert appears; remains visible after 6+ seconds. | **PASSED** (Remained on screen past 8 seconds without dismissing) |
| **Manual Error Dismissal** | Clicked `X` button on active persistent validation alert. | Alert immediately closes; timer canceled. | **PASSED** (Disappeared immediately) |
| **Patient Creation Auto-Dismiss** | Registered new patient with valid details; clicked Save. | Success banner displays assigned UHID; automatically disappears after 5s. | **PASSED** (Auto-dismissed after 5000ms) |
| **Console & Memory Inspection** | Inspected browser developer tools console across repeated actions. | 0 unhandled exceptions, 0 timer warnings. | **PASSED** |

### 3. Build & Bundler Validation
- `npm run build` executed and passed with **0 errors** (bundle time: 1.81s).
- `npm run lint` verified with **0 errors**.

---

## Conclusion

The notification system now strictly adheres to all specified requirements: temporary alerts disappear after exactly 5000ms with full replacement and unmount safety, while persistent form validation messages stay on screen until addressed by the user.
