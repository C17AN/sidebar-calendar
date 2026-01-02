# Logic Correction

## MODIFIED Requirements

### Requirement: Local Time Filtering
The system MUST filter "Next Up" events based on the user's local timezone date, not UTC.

#### Scenario: Evening in New York
- Given it is Jan 2nd 20:00 PM in New York (UTC Jan 3rd 01:00 AM)
- When the user views the list
- Then events for "2026-01-02" are visible (not hidden as past).
