import { useRef, useCallback } from 'react';

/**
 * Predefined logical sequence of fields for the Patient Registration form.
 * Matches the actual visual structure across all sections:
 * 1. Basic Information (Category, First, Middle, Last, DOB, Age, Unit, Sex)
 * 2. Demographics & Clinical (Doctor, Ref By, Religion, Marital, Weight, Height)
 * 3. Contact & Address (Mobile, Email, AutoSMS, Street, City, State, PIN)
 * 4. Other Details & Identification (Estimate, Aadhar, PAN, Mediclaim, Member ID, Emp ID, Company, Remark)
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
 * Skips hidden, disabled, read-only, and non-editable elements.
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
 * Focuses an element, scrolls it into view, and selects text for rapid inspection/editing.
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
 * Custom React hook managing Enter-key navigation within a form.
 * 
 * Rules:
 * - Enter moves to the next logical field.
 * - Textareas retain normal multiline Enter behavior.
 * - Buttons retain normal Enter / Space activation.
 * - Dropdowns (selects) allow normal option selection.
 * - Tab / Shift+Tab retain default browser navigation.
 * - Never submits form accidentally when Enter is pressed in normal inputs.
 * - At the last field, moves focus to the primary action button without auto-submitting.
 */
export function useFormKeyboardNavigation(options?: UseFormKeyboardNavigationOptions) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const fieldOrder = options?.fieldOrder ?? PATIENT_REGISTRATION_FIELD_ORDER;
  const submitButtonSelector = options?.submitButtonSelector ?? 'button[type="submit"], .btnPrimaryAction';

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

        // Reached end of fields: move focus to primary action button without submitting!
        // Also look outside form if the submit button is in sticky action sidebar
        let submitBtn = container.querySelector<HTMLElement>(submitButtonSelector);
        if (!submitBtn) {
          submitBtn = document.querySelector<HTMLElement>(submitButtonSelector);
        }
        if (submitBtn && isFieldFocusable(submitBtn)) {
          focusField(submitBtn);
          options?.onNavigate?.(currentName, 'submitButton');
          return;
        }
      }

      // 2. If currently focused on the submit button, cycle back to the first focusable field
      const submitBtn = container.querySelector<HTMLElement>(submitButtonSelector) || document.querySelector<HTMLElement>(submitButtonSelector);
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

      // 3. Fallback: Find first focusable field
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
      // Only process Enter key
      if (e.key !== 'Enter') {
        return;
      }

      // Don't intercept if modified by Ctrl, Alt, or Meta
      if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }

      const activeElement = document.activeElement as HTMLElement | null;
      if (!activeElement || !formRef.current?.contains(activeElement)) {
        return;
      }

      // 1. Textarea: allow multiline Enter without moving focus
      if (activeElement.tagName === 'TEXTAREA') {
        return;
      }

      // 2. Button: allow default activation (Enter activates button)
      if (activeElement.tagName === 'BUTTON') {
        return;
      }

      // 3. Select element: if Enter is pressed on closed select, advance; do not block option selection
      // Normal input: prevent form submission & move to next field
      e.preventDefault();
      e.stopPropagation();
      moveToNextField(activeElement);
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
