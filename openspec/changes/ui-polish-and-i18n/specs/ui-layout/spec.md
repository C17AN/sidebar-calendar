# UI Layout

## MODIFIED Requirements

### Requirement: Full Width Calendar
The Calendar Grid MUST utilize the full available width of the panel.

#### Scenario: View Calendar
- Given the Side Panel is open
- When the user views the calendar
- Then the grid extends to the edges with minimal padding (e.g., < 8px).

### Requirement: Custom Font
The application MUST use the Pretendard font family.

#### Scenario: Font Rendering
- Given the application is loaded
- When text is displayed
- Then it renders using Pretendard (or fallback sans-serif).
