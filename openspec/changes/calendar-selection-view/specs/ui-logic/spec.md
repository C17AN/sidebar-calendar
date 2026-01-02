# UI Logic

## MODIFIED Requirements

### Requirement: Calendar Date Selection
The user MUST be able to click on a day in the calendar to select it.

#### Scenario: Select and Filter
- Given the calendar is visible
- When the user clicks on "Jan 12"
- Then the "Jan 12" cell is visually highlighted.
- And the list below shows only events for "Jan 12".
- And the header changes to "Jan 12 Schedule".

#### Scenario: Deselect
- Given "Jan 12" is selected
- When the user clicks "Jan 12" again
- Then the selection is cleared.
- And the list shows all upcoming events ("NEXT UP").
