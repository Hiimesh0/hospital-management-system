# 15 PRIORITY FIX LIST

## IMPLEMENTATION FIX QUEUE

### P0 — MUST FIX BEFORE PRODUCTION
- **Screenshot:** (Multiple)
- **Problem:** Missing implementation for 28+ screens including Masters, Utility, and Certificates.
- **Why:** Incomplete system.
- **Recommended:** Implement all missing modules.
- **Priority:** P0

### P1 — SHOULD FIX BEFORE PRODUCTION
- **Screenshot:** Indoor Register.jpg
- **Element:** Age
- **Current:** Text Input (in legacy screenshot)
- **Problem:** Age should be numeric, but legacy screenshot shows a basic text field. Our implementation upgraded it to numeric, but we need to ensure the database layer enforces Integer.
- **Recommended:** Validate numeric boundary (0-150) on frontend and backend.
- **Priority:** P1

- **Screenshot:** Billing.jpg
- **Element:** Amount
- **Current:** Text Input (in legacy screenshot)
- **Problem:** Amount fields in legacy are free-text. Our implementation uses text inputs for now.
- **Recommended:** Upgrade to Currency/Numeric inputs with 2 decimal places.
- **Priority:** P1
