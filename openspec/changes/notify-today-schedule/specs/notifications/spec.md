# Notifications

## ADDED Requirements

### Requirement: Badge Count
The system MUST display the number of today's D-Day events on the extension toolbar icon.

#### Scenario: Two Events Today
- Given there are 2 events with date matching today
- When the background script updates
- Then the extension badge displays "2".

### Requirement: Floating Reminder Pill
The system MUST display a floating reminder on web pages if there are events today.

#### Scenario: Show Reminder
- Given there is 1 event today "Meeting"
- When the user visits a web page
- Then a floating pill appears in the bottom-right corner.
- And clicking it reveals "Meeting".
