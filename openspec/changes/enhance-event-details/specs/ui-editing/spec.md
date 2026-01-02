# UI Editing

## ADDED Requirements

### Requirement: Edit Event Dialog
The system MUST provide a dialog to edit event details.

#### Scenario: Open Edit
- Given an event in the list
- When the user clicks "Edit"
- Then a dialog opens pre-filled with the event's current data.

#### Scenario: Save Changes
- Given the edit dialog is open
- When the user modifies fields and clicks "Save"
- Then the changes are reflected in the UI immediately.

### Requirement: Display Details
The system MUST display Time and Location in the event list if they are set.

#### Scenario: Show Link
- Given an event has a Link "https://example.com"
- When displayed in the list
- Then the title is a clickable link.