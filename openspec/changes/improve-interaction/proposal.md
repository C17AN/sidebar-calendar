# Improve Interaction

## Summary
Enable opening the Side Panel by clicking the "Today's Reminder" pill and support Enter key submission for the "Add D-Day" input.

## Problem
1.  **Navigation:** Clicking the reminder pill currently does nothing (or just closes it). Users expect to see the calendar.
2.  **Usability:** Users have to click "Save" after typing a title. Enter key is standard behavior.

## Solution
1.  **Side Panel Trigger:**
    -   Content Script: Send `OPEN_SIDE_PANEL` message on pill click.
    -   Background: Listen for message. Call `chrome.sidePanel.open({ tabId: sender.tab.id })`.
        -   *Constraint:* Requires Chrome 116+.
        -   *Permission:* `sidePanel` is already present.
2.  **Enter Key:**
    -   Content Script: Add `keydown` listener to the `<input>`.
    -   If `key === 'Enter'`, trigger the Save logic.

## Risks
-   **Browser Support:** `chrome.sidePanel.open` is relatively new.
    -   *Mitigation:* If the API fails (older Chrome), we can just show a notification saying "Open the extension to view details". But we assume modern environment (Manifest V3).
