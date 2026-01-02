# Theming

## MODIFIED Requirements

### Requirement: System Theme Mode
The application MUST provide an "Auto" or "System" option that follows the operating system's color scheme.

#### Scenario: Follow System Dark
- Given the system is in Dark Mode
- And the user has selected "System" theme
- Then the application renders in Dark Mode.

### Requirement: Floating UI Theming
The Floating UI on web pages MUST mirror the extension's theme settings.

#### Scenario: Change to Light
- Given the user changes the extension to Light Mode
- When the user selects text on a web page
- Then the floating "Add D-Day" UI appears in Light Mode.
