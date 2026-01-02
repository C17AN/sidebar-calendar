# Dual List View

## Summary
Refactor the event list to show two separate sections: "Selected Date Schedule" (if a date is selected) and "NEXT UP" (always visible). Add an "Add New Event" button to the selected date section.

## Problem
Currently, selecting a date replaces the "NEXT UP" list. Users want to see both their selected day's details and their general upcoming schedule simultaneously. Also, there is no way to manually add a new event directly for a selected date in the popup.

## Solution
1.  **Layout Refactor:**
    -   Container 1: `selected-date-section` (Visible only if `selectedDateStr` is set).
        -   Includes "Add New Event" button.
    -   Container 2: `next-up-section` (Always visible).
2.  **Add New Event Logic:**
    -   Clicking "Add New Event" opens the Edit Dialog.
    -   Sets `editingItemId = null` (new item mode).
    -   Pre-fills the `edit-date` field with the currently selected date.
    -   On Save: If `editingItemId` is null, call `addItem` instead of `updateItem`.
3.  **UI Feedback:**
    -   Ensure the scrollable area handles both lists gracefully.

## Risks
-   **Vertical Space:** Two lists + Calendar might exceed the fixed height.
    -   *Mitigation:* Use a single scrollable container for the entire list area or set reasonable max-heights.
