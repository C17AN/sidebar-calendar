# Visual Design

## MODIFIED Requirements

### Requirement: Dark Dashboard Theme
The application MUST use a specific dark color scheme inspired by the reference.

#### Scenario: Background Color
- Given the application is open
- When the user views the main panel
- Then the background color is a deep navy/black (`#0e1015`).

### Requirement: Monthly Calendar Grid
The application MUST display a 7-column grid for the current month.

#### Scenario: Render Grid
- Given the current month is October
- When the calendar renders
- Then it shows a header row "S M T W T F S"
- And grid cells for all days in October.
