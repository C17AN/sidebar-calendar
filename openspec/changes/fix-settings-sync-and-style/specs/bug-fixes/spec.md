# Bug Fixes

## MODIFIED Requirements

### Requirement: Reactive Floating UI Localization
The Floating UI MUST reflect the current language setting immediately upon change.

#### Scenario: Live Update
- Given a web page is open
- When the user changes the extension language from English to Korean
- And selects text on the web page
- Then the floating button displays "D-Day 추가".

### Requirement: Reliable System Theme Detection
The application MUST accurately detect and follow the operating system's color scheme when "System" mode is active.

#### Scenario: Detection
- Given the OS is set to Dark Mode
- And the application theme is set to "System"
- When the application starts
- Then it MUST render in Dark Mode.
