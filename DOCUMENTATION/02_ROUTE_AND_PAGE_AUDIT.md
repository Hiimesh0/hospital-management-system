# 02 Route and Page Audit
## Discovered Routes
- `/` (Login)
- `/dashboard` (Main Dashboard)
- Multiple nested routes under `src/components/` registered in `App.tsx` (e.g., Patient Registration, Billing, Discharge, Room Status).
## Findings
- Routes exist and correctly load respective components.
- Direct navigation works via HashRouter.
- Unauthorized access is superficially blocked by local storage flags (no real backend auth).
- No console errors on load. Empty states display properly after demo data cleanup.
