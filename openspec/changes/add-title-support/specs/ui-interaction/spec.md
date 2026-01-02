# UI Interaction

## MODIFIED Requirements

### Requirement: Floating Input
The Floating UI MUST provide an input field for the user to edit the event title before saving.

#### Scenario: Edit Title
- Given the "Add D-Day" button is clicked
- When the input field appears
- Then it is pre-filled with the selected text (truncated).
- And the user can modify it.

### Requirement: Display Title in Calendar
The Side Panel Calendar View MUST display the event title.

#### Scenario: Render Item
- Given an item with title "Birthday"
- When rendered in the calendar
- Then the text "Birthday" is visible on the card.
