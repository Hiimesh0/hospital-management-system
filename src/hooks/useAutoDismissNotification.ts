import { useState, useRef, useEffect, useCallback } from 'react';

export interface AppNotification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  uhid?: string;
  persistent?: boolean;
}

export const AUTO_DISMISS_DURATION_MS = 5000;

/**
 * Custom hook to handle notifications with automatic 5-second dismissal.
 * 
 * Requirements handled:
 * - Automatically dismisses temporary notifications after exactly 5000 milliseconds.
 * - Leaves persistent notifications (e.g. form validation errors) visible until resolved.
 * - Cancels pending timer immediately when a notification is manually dismissed.
 * - Clears old timer and restarts fresh 5-second timer when a notification is replaced.
 * - Cleans up active timer on component unmount to prevent leaks and stale callbacks.
 */
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
    // Clear any pending timer whenever notification or duration changes
    clearTimer();

    // Do not schedule auto-dismiss if notification is empty or marked persistent
    if (!notification || notification.persistent) {
      return;
    }

    // Schedule auto-dismissal after 5000ms
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
