# UI Polish

## MODIFIED Requirements

### Requirement: Readable Button Hover
The "Settings" button text MUST remain clearly readable when the mouse cursor is hovered over it.

#### Scenario: Dark Mode Hover
- Given the application is in Dark Mode
- When the user hovers over the "Settings" button
- Then the button color changes slightly
- And the text "Settings" is still visible.

#### Scenario: Light Mode Hover
- Given the application is in Light Mode
- When the user hovers over the "Settings" button
- Then the button color does NOT become extremely dark
- And the text "Settings" is still visible.