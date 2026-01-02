# Fix Add Manual and Title

## Summary
Fix the "Add New Event" functionality and implement dynamic dialog titles (Add vs Edit).

## Problem
1.  **Functional Bug:** "Add New Event" might be failing due to missing storage updates or UI re-render issues in the new dual-list structure.
2.  **UI Inconsistency:** The dialog title is always "일정 수정" (Edit Event), even when adding a new one.

## Solution
1.  **Dialog Title Logic:** Update `openEditDialog` to change the text of `#label-edit-event` based on whether `item` is null.
2.  **Add Translation:** Add `label-add-event` to the dictionary.
3.  **Fix Logic:** Ensure `addItem` is called correctly and `editingItemId` is reset.

## Risks
-   None.
