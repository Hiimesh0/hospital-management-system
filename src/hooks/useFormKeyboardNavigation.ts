import { useRef, useCallback } from 'react';

/**
 * Predefined logical sequence of fields for the Patient Registration form.
 * Matches the actual visual structure across all sections:
 * 1. Basic Information
 * 2. Demographics & Clinical
 * 3. Contact & Address
 * 4. Other Details & Identification
 */
export const PATIENT_REGISTRATION_FIELD_ORDER = [
  // Section 1: Basic Information
  'category',
  'firstName',
  'middleName',
  'lastName',
  'birthDate',
  'age',
  'ageUnit',
  'sex',

  // Section 2: Demographics & Clinical
  'hospitalDoctor',
  'referenceBy',
  'religion',
  'maritalStatus',
  'weight',
  'height',

  // Section 3: Contact & Address
  'mobile',
  'email',
  'autoSms',
  'streetAddress',
  'city',
  'state',
  'pinCode',

  // Section 4: Other Details & Identification
  'estimate',
  'aadharNo',
  'panNo',
  'mediclaim',
  'membershipId',
  'employeeId',
  'companyName',
  'remark'
] as const;

export type PatientRegistrationFieldName = typeof PATIENT_REGISTRATION_FIELD_ORDER[number];

/**
 * Validates whether a DOM element is focusable and ready for keyboard interaction.
 * Skips hidden, disabled, and read-only elements.
 */
export function isFieldFocusable(element: HTMLElement | null): boolean {
  if (!element) return false;

  // Check disabled state
  if ('disabled' in element && (element as HTMLInputElement | HTMLSelectElement | HTMLButtonElement).disabled) {
    return false;
  }

  // Check read-only state
  if ('readOnly' in element && (element as HTMLInputElement).readOnly) {
    return false;
  }

  // Check tabIndex
  if (element.tabIndex === -1) {
    return false;
  }

  // Check aria-hidden or hidden attribute
  if (element.hasAttribute('hidden') || element.getAttribute('aria-hidden') === 'true') {
    return false;
  }

  // Check visibility and dimensions (offsetParent is null if display: none or inside hidden container)
  if (element.offsetParent === null && window.getComputedStyle(element).position !== 'fixed') {
    return false;
  }

  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
    return false;
  }

  return true;
}

/**
 * Focuses an element, scrolls it into the visible viewport, and selects text for quick editing.
 */
export function focusField(element: HTMLElement) {
  element.focus({ preventScroll: false });

  // Scroll smoothly ensuring comfortable visibility within form
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest'
  });

  // Select text if it's a text/number/email/tel input so clerks can immediately overwrite or inspect
  if (
    element instanceof HTMLInputElement &&
    ['text', 'tel', 'email', 'number', 'search'].includes(element.type)
  ) {
    try {
      element.select();
    } catch {
      // Ignore if browser restricts select
    }
  }
}

export interface UseFormKeyboardNavigationOptions {
  fieldOrder?: readonly string[];
  submitButtonSelector?: string;
  onNavigate?: (fromFieldName: string, toFieldName: string) => void;
}

/**
 * Custom React hook managing Shift + Enter keyboard navigation within a form.
 * 
 * Features:
 * - Listens for Shift + Enter at the form level.
 * - Moves focus sequentially through the configured field order.
 * - Skips hidden, disabled, and read-only inputs.
 * - At the final field, moves focus to the primary submit button without submitting.
 * - On the submit button, Shift + Enter cycles back to the first field.
 * - Preserves standard browser Tab, Shift + Tab, and regular Enter keys.
 * - Prevents accidental form submission during Shift + Enter.
 */
export function useFormKeyboardNavigation(options?: UseFormKeyboardNavigationOptions) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const fieldOrder = options?.fieldOrder ?? PATIENT_REGISTRATION_FIELD_ORDER;
  const submitButtonSelector = options?.submitButtonSelector ?? 'button[type="submit"]';

  const moveToNextField = useCallback(
    (currentElement?: HTMLElement) => {
      const container = formRef.current;
      if (!container) return;

      const active = currentElement || (document.activeElement as HTMLElement | null);
      if (!active) return;

      const currentName = active.getAttribute('name') || active.id || '';
      const currentIndex = currentName ? fieldOrder.indexOf(currentName as PatientRegistrationFieldName) : -1;

      // 1. If currently on a field in the sequence
      if (currentIndex !== -1) {
        // Look ahead for the next focusable field
        for (let i = currentIndex + 1; i < fieldOrder.length; i++) {
          const nextName = fieldOrder[i];
          const candidate = container.querySelector<HTMLElement>(`[name="${nextName}"], #${nextName}`);
          if (candidate && isFieldFocusable(candidate)) {
            focusField(candidate);
            options?.onNavigate?.(currentName, nextName);
            return;
          }
        }

        // Reached end of fields: focus primary submit button without submitting
        const submitBtn = container.querySelector<HTMLElement>(submitButtonSelector);
        if (submitBtn && isFieldFocusable(submitBtn)) {
          focusField(submitBtn);
          options?.onNavigate?.(currentName, 'submitButton');
          return;
        }
      }

      // 2. If currently focused on the submit button, cycle back to the first focusable field
      const submitBtn = container.querySelector<HTMLElement>(submitButtonSelector);
      if (active === submitBtn) {
        for (let i = 0; i < fieldOrder.length; i++) {
          const fieldName = fieldOrder[i];
          const candidate = container.querySelector<HTMLElement>(`[name="${fieldName}"], #${fieldName}`);
          if (candidate && isFieldFocusable(candidate)) {
            focusField(candidate);
            options?.onNavigate?.('submitButton', fieldName);
            return;
          }
        }
      }

      // 3. Fallback: If focused on any other element inside the form, find first valid field
      for (let i = 0; i < fieldOrder.length; i++) {
        const fieldName = fieldOrder[i];
        const candidate = container.querySelector<HTMLElement>(`[name="${fieldName}"], #${fieldName}`);
        if (candidate && isFieldFocusable(candidate)) {
          focusField(candidate);
          options?.onNavigate?.(currentName || 'unknown', fieldName);
          return;
        }
      }
    },
    [fieldOrder, submitButtonSelector, options]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLFormElement>) => {
      // Check for Shift + Enter (strictly Shift + Enter, not Ctrl/Alt/Meta)
      if (e.key === 'Enter' && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        // Crucial: Prevent default form submission or newline insertion
        e.preventDefault();
        e.stopPropagation();

        const activeElement = document.activeElement as HTMLElement | null;
        if (!activeElement || !formRef.current?.contains(activeElement)) {
          return;
        }

        moveToNextField(activeElement);
      }
    },
    [moveToNextField]
  );

  return {
    formRef,
    handleKeyDown,
    moveToNextField,
    fieldOrder
  };
}
