# UI Polish

## MODIFIED Requirements

### Requirement: No Empty List Placeholder
The system MUST NOT display "일정이 없습니다" or "No events" text when a list is empty.

#### Scenario: Empty Day
- Given a day with no events is selected
- Then the `selected-date-list` container is empty.

### Requirement: Full Width Event Items
Event list items MUST span the full width of the container without horizontal padding.

#### Scenario: Verify Width
- Given the "Next Up" list is rendered
- Then the items touch the horizontal edges of the panel (or follow parent body padding).

### Requirement: Add Button Spacing
The "Add New Event" button MUST have a 16px bottom margin.

#### Scenario: Check Spacing
- Given the "Add New Event" button is visible
- Then there is a 16px gap below it.