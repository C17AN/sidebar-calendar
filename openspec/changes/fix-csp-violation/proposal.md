# Fix CSP Violation

## Summary
Remove inline `onclick` handlers from dynamically generated HTML to comply with Chrome Extension Content Security Policy (CSP).

## Problem
The error `Executing inline event handler violates...` occurs because `popup.js` injects HTML containing `onclick="event.stopPropagation()"`. Chrome Extensions (MV3) strictly forbid inline scripts.

## Solution
1.  **Remove Inline Handler:** Delete `onclick="..."` from the HTML template string in `renderNextUp`.
2.  **Attach Listener Programmatically:** After setting `card.innerHTML`, query the `<a>` tag (if present) and attach the `click` listener using `addEventListener`.

## Risks
-   None. This is the standard, secure way to handle events.
