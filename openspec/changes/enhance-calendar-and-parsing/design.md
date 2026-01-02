# Design: Calendar & Parsing

## Date Parser Strategy
-   **Regex Patterns:**
    1.  `YYYY-MM-DD` (ISO)
    2.  `MM/DD/YYYY` (US Common)
    3.  `DD-Mon-YYYY` (e.g., `12-Jan-2026`)
    4.  `Month DD, YYYY` (e.g., `January 12, 2026`)
-   **Normalization:**
    -   Convert all matched dates to `YYYY-MM-DD` for storage consistency.
    -   Use `new Date(string)` as a fallback validator.

## UI Design (Side Panel)
-   **View Mode:**
    -   **Current:** Simple List (All future items).
    -   **New:** "Two-Week View" (Focus).
-   **Layout:**
    -   **Header:** "Upcoming 14 Days"
    -   **Container:** `div.calendar-view`
    -   **Day Card:** `div.day-card` (for each of 14 days)
        -   **Header:** `div.day-header` (e.g., "Fri 02")
        -   **Content:** List of D-Days falling on this date.
        -   **Empty State:** Minimal height, just the date.
-   **Navigation:** Scrollable.
