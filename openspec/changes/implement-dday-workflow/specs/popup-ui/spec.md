# Popup UI

## ADDED Requirements

### Requirement: Drag and Drop Overlay
The Popup UI MUST display a visual overlay when text is dragged over the extension window.
#### Scenario: Drag Enter
- Given the popup is open
- When the user drags text into the window
- Then a "Drop to Add" overlay covers the content.

#### Scenario: Drop
- Given the overlay is active
- When the user drops the text
- Then the text is sent to the parsing logic
- And the overlay disappears.

### Requirement: Render D-Day List
The Popup UI MUST display the list of saved D-Days.
#### Scenario: Display Format
- Given a saved item for "2026-01-01" and today is "2026-01-02"
- Then the item displays as "D+1" (or similar relative time) along with the date.

### Requirement: Configure Lead Time
The Popup UI MUST provide an input to set the notification lead time in hours.
#### Scenario: Update Setting
- Given the input field
- When the user changes the value
- Then the new value is saved to settings.
