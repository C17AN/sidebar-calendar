# Fix Floating UI Interaction

## Summary
Prevent the floating UI from closing immediately when clicked.

## Problem
The `document.addEventListener('mouseup', ...)` logic runs on every click. When the user clicks the "Add D-Day" button inside the Shadow DOM, the event bubbles to the document. The listener sees that the text selection might be lost or changed, or simply re-evaluates, causing `removeOverlay()` to be called immediately after the button click, destroying the UI before the input form can appear.

## Solution
1.  **Event Check:** In the global `mouseup` listener, check if the event target (or `composedPath`) includes the `shadowHost`.
2.  **Ignore Internal Clicks:** If the click originated from the overlay, do nothing (return early).

## Risks
-   None. This is a standard pattern for custom overlays.
