# Google Calendar Integration

## ADDED Requirements

### Requirement: Authenticate User
The system MUST obtain an OAuth2 token from Google Identity Services to access the Calendar API.
#### Scenario: First Sync
- Given the user has not authorized the app
- When the "Sync" action is triggered
- Then `chrome.identity.getAuthToken` is called.

### Requirement: Create Calendar Event
The system MUST create an all-day event in the user's primary calendar for the D-Day.
#### Scenario: Add to Calendar
- Given a valid OAuth token and a D-Day item
- When the user clicks "Add to Calendar" (or auto-sync is enabled)
- Then a `POST` request is sent to the Google Calendar API `events.insert` endpoint.
