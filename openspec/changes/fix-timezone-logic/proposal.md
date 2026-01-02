# Fix Timezone Logic

## Summary
Update the "Next Up" list filtering logic to use the user's Local Time instead of UTC when determining which events are upcoming.

## Problem
Currently, `popup.js` uses `new Date().toISOString().split('T')[0]` to get "Today's Date". This returns the date in UTC.
-   If a user in UTC+9 (Korea) is at Jan 3rd 01:00 AM, UTC is Jan 2nd 16:00 PM. `nowStr` is "Jan 2". "Jan 3" items are shown (Correct).
-   If a user in UTC-5 (USA) is at Jan 2nd 20:00 PM, UTC is Jan 3rd 01:00 AM. `nowStr` is "Jan 3". "Jan 2" items (Today) are **hidden** because "Jan 2" < "Jan 3".

Wait, the user's report is: "Cannot add 2026-01-03".
If it's hidden, they might think it's not added.

## Solution
Replace `toISOString()` with manual `getFullYear()`, `getMonth()`, `getDate()` construction to ensure we get the Local YYYY-MM-DD string.

## Risks
-   None. This aligns the data (stored as plain strings) with the user's wall-clock expectation.
