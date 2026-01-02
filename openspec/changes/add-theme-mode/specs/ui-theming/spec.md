# UI Theming

## MODIFIED Requirements

### Requirement: Light Mode Support
The system MUST support a Light Mode visual theme.

#### Scenario: Enable Light Mode
- Given the user has selected "Light Mode"
- When the application renders
- Then the background is light (e.g., white) and text is dark.

### Requirement: Dark Mode Support (Default)
The system MUST support a Dark Mode visual theme as the default.

#### Scenario: Default Rendering
- Given no preference is saved
- When the application renders
- Then it appears in Dark Mode.
