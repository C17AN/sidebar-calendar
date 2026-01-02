# Polish List and Button

## Summary
Remove the "No events" placeholder text, remove horizontal padding from event lists, and add a bottom margin to the manual add button.

## Problem
1.  **UX:** The "일정이 없습니다" text is unnecessary and cluttering.
2.  **Layout:** Items have too much horizontal margin/padding.
3.  **Spacing:** The "Add New Event" button needs more space below it.

## Solution
1.  **Logic:** Update `renderEventCards` in `popup.js` to return an empty container if no items exist.
2.  **Style:** 
    -   Remove `padding: 0 16px` from `.event-list` in `style.css`.
    -   Add `margin-bottom: 16px` to `.add-manual-btn`.
    -   Clean up inline styles in `popup.html`.

## Risks
-   None.
