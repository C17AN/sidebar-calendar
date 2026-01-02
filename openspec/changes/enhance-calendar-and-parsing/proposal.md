# Enhance Calendar & Parsing

## Summary
Upgrade the application to support a 2-week calendar visualization in the Side Panel and robustly parse various date formats (e.g., `MM/DD/YYYY`, `DD-Mon-YYYY`) based on standard conventions.

## Problem
1.  **Limited Parsing:** Currently only detects `YYYY-MM-DD`. Users encounter diverse formats on the web.
2.  **Basic UI:** The simple list view is functional but doesn't provide a "calendar-like" overview of the upcoming schedule, which the user prefers.

## Solution
1.  **Advanced Parsing:** Implement a more comprehensive parser supporting:
    -   `YYYY-MM-DD`, `YYYY/MM/DD`
    -   `MM/DD/YYYY`, `MM-DD-YYYY`
    -   `DD-MM-YYYY` (Ambiguous cases like 01/02/2026 will default to US `MM/DD` unless context implies otherwise, or we can use the user's locale. *Decision:* Prioritize `YYYY-MM-DD` and `MM/DD/YYYY` as they are common in the prompt's context, but respect `DD.MM.YYYY` if detected).
    -   Text formats: `Jan 1, 2026`, `2 January 2026`.
2.  **2-Week Calendar UI:**
    -   Render a view showing the *current day* + next 13 days.
    -   Visual style: A vertical "Agenda" list or a mini-grid? User asked for "Google Calendar-like side panel... 2 weeks". Google Calendar Side Panel uses a mini-month grid or day list. "2 weeks" implies a specific focus.
    -   *Design:* A vertical scrollable list grouped by Date (Agenda View) for the next 14 days is the most space-efficient and readable for a side panel. If no events, show empty state for that day? Or just list upcoming events?
    -   *Refinement:* "Render a calendar by 2 weeks" -> Let's show a grid of 14 days (2 rows of 7) or a list. A list is safer for variable width. Let's do a **Bi-Weekly Agenda View**:
        -   Header: "Upcoming 2 Weeks"
        -   List of days: [Today] [Tomorrow] ... [Day 14]
        -   Each day shows the date and any active D-Days.

## Risks
-   **Date Ambiguity:** `01/02/2026` -> Jan 2nd or Feb 1st?
    -   *Mitigation:* Use `Date.parse()` or a library like `chrono-node`?
    -   *Constraint:* Minimize dependencies. I will implement expanded Regex support for clear formats and standard `Date` parsing for others.
