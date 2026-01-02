# Fix GCal Click Handler

## Summary
Investigate why the "Sync" button has no effect. Add logging and ensure event propagation is handled correctly.

## Problem
User reports "No response" when clicking the sync button. This implies the click handler is not firing, or it's firing but failing silently before any alert.

## Solution
1.  **Logging:** Add `console.log` to the `onclick` handler.
2.  **Event Handling:** Ensure `e.preventDefault()` is also called alongside `stopPropagation()`.
3.  **UI:** Check if the button is physically clickable (z-index, size).
4.  **Error Handling:** Wrap the entire handler in a `try/catch` block that alerts *any* error immediately.

## Risks
-   None.
