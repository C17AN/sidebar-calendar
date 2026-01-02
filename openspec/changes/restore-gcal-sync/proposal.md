# Restore Google Calendar Sync

## Summary
Re-enable Google Calendar synchronization by adding a "Sync" button to the event cards in the new Dark UI and guiding the user to configure their Client ID.

## Problem
The "Sync to Calendar" feature was lost during the UI redesign. The logic exists but is inaccessible. Additionally, the user needs to know that a `client_id` is required in `manifest.json`.

## Solution
1.  **UI:** Add a "Sync" button (📅 icon) to the `event-card` or the `edit-dialog`.
    -   *Decision:* Add it to the **Edit Dialog** actions for cleaner UI, or as a small icon next to the Delete button on the card.
    -   *Choice:* Add a small icon button on the card (next to Delete) for quick access.
2.  **Logic:** Connect the button to `utils/gcal.js`.
3.  **Documentation:** Add a `SETUP.md` or console warning explaining how to get a Client ID.

## Risks
-   **Authentication Failure:** If `client_id` is invalid, `chrome.identity` fails silently or with an error.
    -   *Mitigation:* Catch errors in `syncToCalendar` and alert the user: "Authentication failed. Please check your Client ID in manifest.json".

## Architecture
-   **Popup:** Import `syncToCalendar`.
-   **Event Card:** Add Sync button. Click -> `syncToCalendar(item)`.
