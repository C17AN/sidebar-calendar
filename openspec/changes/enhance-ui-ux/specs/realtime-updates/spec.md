# Real-time Updates

## MODIFIED Requirements

### Requirement: Auto-Refresh Calendar
The Calendar View MUST automatically update when items are added, modified, or removed, even if the change originated from another context (e.g., Content Script).

#### Scenario: Add from Web
- Given the Side Panel is open
- And the user adds a D-Day from a web page
- When the background script saves the new item
- Then the Side Panel immediately displays the new item without user intervention.
