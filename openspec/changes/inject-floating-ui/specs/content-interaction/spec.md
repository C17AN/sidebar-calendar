# Content Interaction

## ADDED Requirements

### Requirement: Floating Add Button
The system MUST display a floating "Add" button when a user selects text containing a date on a web page.

#### Scenario: Select Date
- Given a web page with text "Due: 2026-05-20"
- When the user highlights "2026-05-20"
- Then a floating button appears next to the cursor/selection.

#### Scenario: Click Add
- Given the floating button is visible
- When the user clicks it
- Then the date is added to the extension storage
- And the button disappears.
