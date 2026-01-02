# Calendar Selection View

## Summary
Allow users to select a date in the calendar grid. When a date is selected, the "NEXT UP" section will be replaced by a filtered "Schedule for [Date]" view showing events for that specific day.

## Problem
Currently, the "NEXT UP" list shows all future events. Users cannot easily see events for a specific day by clicking on the calendar, even if they see a "dot" on that day.

## Solution
1.  **Selection State:** Track `selectedDateStr` (e.g., "2026-01-02") in the popup state.
2.  **Calendar Interaction:**
    -   Clicking a day cell sets `selectedDateStr`.
    -   Re-clicking the same cell clears it (toggles back to "NEXT UP").
    -   Visually highlight the selected cell.
3.  **Dynamic List:**
    -   If `selectedDateStr` is active:
        -   Change the section header to "[Month] [Day] Schedule" (localized).
        -   Filter the list to only items matching that exact date.
    -   If null:
        -   Show "NEXT UP" (default behavior).
4.  **Localization:**
    -   Add translations for "Schedule" and the date format in the header.

## Risks
-   **Confusion:** Users might get "stuck" in a filtered view.
    -   *Mitigation:* Ensure clicking away or re-clicking toggles back. Show a "View All" link if space permits.
