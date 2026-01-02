# Enhance Event Details

## Summary
Add support for Time, Link, and Location fields to D-Day events. Provide an UI to edit these details after an event is created.

## Problem
Currently, events only have a Date and Title. Users want to track specific times, meeting links, or locations.

## Solution
1.  **Data Model:** Add `time` (HH:MM string), `link` (URL string), `location` (string) to the Item object.
2.  **UI:**
    -   Add an "Edit" button to event cards.
    -   Create an `<dialog id="edit-dialog">` with inputs for:
        -   Title (Text)
        -   Date (Date)
        -   Time (Time)
        -   Link (URL)
        -   Location (Text)
    -   Update "Next Up" list to display Time/Location if present.
    -   Update "Next Up" title to be a clickable link if `link` is present.

## Risks
-   **Layout:** "Next Up" cards might get crowded.
    -   *Mitigation:* Show Time next to title or in date box. Show Location/Link icon only.
