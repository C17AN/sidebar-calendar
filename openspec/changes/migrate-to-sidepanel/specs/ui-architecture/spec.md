# UI Architecture

## MODIFIED Requirements

### Requirement: Persistent UI
The application MUST use the Chrome Side Panel API to maintain a persistent user interface.

#### Scenario: Dragging from Web
- Given the Side Panel is open
- When the user clicks and drags text from a web page
- Then the Side Panel remains open and accepts the drop.

#### Scenario: Opening the App
- Given the extension is installed
- When the user clicks the extension toolbar icon
- Then the Side Panel opens.
