# Notify Today's Schedule

## Summary
Notify the user of D-Day events scheduled for the "current day" using both the extension icon badge and an on-page floating pill.

## Problem
Users might miss "Today's" events if they don't open the calendar or if the system notification (alarm) was dismissed or missed. The user requested a persistent reminder on the page.

## Solution
1.  **Icon Badge:**
    -   Background script calculates the number of events for `YYYY-MM-DD` (Local Time).
    -   Updates `chrome.action.setBadgeText`.
2.  **On-Page Floating Pill:**
    -   Content script checks storage on load.
    -   If items exist for today:
        -   Render a small, collapsed pill in the bottom-right corner: "📅 2".
        -   Hover/Click expands to show titles: "Project Launch", "Birthday".
        -   Includes a "Dismiss" (X) button to hide it for the session.

## Risks
-   **Intrusiveness:** Users might find the on-page pill annoying.
    -   *Mitigation:* Make it small by default. Provide a permanent "Don't show on this page" or session dismiss.

## Architecture
-   **Background:** Monitors storage/alarms -> Updates Badge.
-   **Content:** Reads storage -> Renders Shadow DOM UI.
