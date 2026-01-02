# Add Title Support

## Summary
Allow users to specify a title (name) for D-Day events when adding them via the floating UI. Save and display this title in the Side Panel.

## Problem
Currently, items are saved with only a date. The UI displays "D-Day" for every item, making it impossible to distinguish between different events (e.g., "Meeting" vs "Birthday") occurring on the same or different days. The floating UI also gives no visual feedback when clicked.

## Solution
1.  **Data Model:** Add `title` string to the Item interface.
2.  **Floating UI:**
    -   When "Add D-Day" is clicked, expand the overlay.
    -   Show an `<input>` field pre-filled with the selected text.
    -   Show "Save" and "Cancel" buttons.
    -   On Save: Send `title` + `date` to background.
    -   Show "Saved!" success message before closing.
3.  **Storage:** Update `addItem` to accept and save `title`.
4.  **Side Panel:** Render the `title` instead of the static string "D-Day".

## Risks
-   **Long Titles:** Selected text might be a whole paragraph.
    -   *Mitigation:* Truncate pre-fill to ~50 chars. Allow user to edit.
