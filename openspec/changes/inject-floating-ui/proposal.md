# Inject Floating UI

## Summary
Inject a Content Script into web pages to detect text selection. If the selected text contains a valid date, display a floating "Add D-Day" button next to the selection.

## Problem
Currently, users must drag text all the way to the Side Panel. This is a long travel distance and requires the Side Panel to be open.

## Solution
1.  **Content Script:** Monitors `mouseup` events on web pages.
2.  **Date Detection:** reuse (or duplicate) parsing logic to check for dates in selection.
3.  **Floating UI:** Render a Shadow DOM overlay near the selection coordinates.
4.  **Action:** Clicking the button sends a message to the extension to add the item.

## Risks
-   **Style Conflicts:** Web pages might mess up the button styling. -> Use Shadow DOM.
-   **False Positives:** Showing the button too often. -> Only show if regex matches a date.
