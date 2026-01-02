# UI Logic

## MODIFIED Requirements

### Requirement: Persist Overlay on Interaction
The Floating UI MUST NOT close when the user clicks inside it.

#### Scenario: Click Button
- Given the "Add D-Day" button is visible
- When the user clicks the button
- Then the overlay remains visible
- And the input form is rendered.
