# Calendar UI

## ADDED Requirements

### Requirement: 2-Week Agenda View
The UI MUST display a list of the next 14 days starting from the current date.

#### Scenario: Display Days
- Given today is "2026-01-02"
- When the user views the calendar
- Then 14 distinct day sections are visible, from "2026-01-02" to "2026-01-15".

#### Scenario: Show Events
- Given a D-Day exists for "2026-01-05"
- When the calendar renders
- Then the item appears inside the section for "2026-01-05".
