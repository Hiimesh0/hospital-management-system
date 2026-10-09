# 09 Financial Calculation Audit
## Findings
- Frontend inputs are properly constrained to `type="number"` and `step="0.01"` for financial fields.
- Subtotal/Total calculations do not exist dynamically in the frontend logic; they are purely visual input fields currently.
- Decimal-safe arithmetic must be implemented once the backend is created.
