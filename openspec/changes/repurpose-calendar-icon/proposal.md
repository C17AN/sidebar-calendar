# Repurpose Calendar Icon

## Summary
Remove Google Calendar synchronization and repurpose the calendar icon button to trigger the event editing dialog. Adjust the edit dialog layout to fill the side panel width with specific margins.

## Problem
The Google Calendar integration is no longer desired. Users want a more direct way to open the edit dialog (the calendar icon is a good candidate). Also, the current edit dialog size is fixed and small, which doesn't utilize the side panel space effectively.

## Solution
1.  **Remove GCal:**
    -   Delete `utils/gcal.js`.
    -   Remove `identity` permission and `oauth2` configuration from `manifest.json`.
    -   Remove GCal imports and alerts from `popup.js`.
2.  **Repurpose Icon:**
    -   Change the 📅 button tooltip to "Edit" (localized).
    -   Update its click handler to call `openEditDialog(item)`.
3.  **UI Layout:**
    -   Update `style.css` so that the `dialog` element has a width of `calc(100% - 48px)`.
    -   Remove `max-width: 280px` from dialogs.

## Risks
-   None. This simplifies the application.
