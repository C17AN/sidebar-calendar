# Design: Drag D-Day Workflow

## User Interface
### Popup
-   **Default State:** Displays a list of D-Days sorted by proximity.
    -   Each item: "D-5 (2026-01-07)", Delete button.
    -   Bottom/Top: "Lead Time (Hours)" input.
-   **Drag State:**
    -   Event listeners on `document.body` for `dragenter`, `dragover`, `dragleave`, `drop`.
    -   Overlay: "Drop to Add D-Day" (Semi-transparent backdrop).
    -   Logic: On drop, read `dataTransfer.getData('text/plain')`.

## Data Model
### `chrome.storage.local`
```typescript
interface DDayItem {
  id: string;         // Unique ID (Timestamp + Random)
  date: string;       // YYYY-MM-DD
  sourceText: string; // The text dragged (truncated if long)
  createdAt: number;
}

interface Settings {
  leadHours: number;  // Default: 0 (Notification at 09:00 AM on the day) 
                      // or positive integer for hours *before* 09:00 AM.
}
```

## Background Service
-   **Alarm Management:**
    -   When an item is added: Calculate trigger time.
    -   Trigger Time: `Date(YYYY-MM-DD 09:00) - leadHours`.
    -   Create `chrome.alarms.create(id, { when: timestamp })`.
    -   If `leadHours` changes: Clear all alarms and recreate.
-   **Notification:**
    -   `chrome.alarms.onAlarm`: Look up item by ID.
    -   `chrome.notifications.create`: Title "D-Day Reminder", Message "D-Day for [date] is here!".

## Google Calendar Integration (Optional)
-   Requires `manifest.json` `oauth2` scopes: `https://www.googleapis.com/auth/calendar.events`.
-   Flow:
    1.  User clicks "Sync to Calendar" (or auto-sync option).
    2.  `chrome.identity.getAuthToken`.
    3.  `POST https://www.googleapis.com/calendar/v3/calendars/primary/events`.
    4.  Body: `{ summary: "D-Day", start: { date: "YYYY-MM-DD" }, end: { date: "YYYY-MM-DD" } }`.

## Constraints & Edge Cases
-   **Invalid Dates:** Show a toast/error if no date found in dropped text.
-   **Past Dates:** Do not schedule alarms, but save to list (historical view?). *Spec decision: Skip alarms for past.*
-   **Permissions:** Request permissions only when needed if possible, though `alarms` is in manifest. `identity` is optional.
