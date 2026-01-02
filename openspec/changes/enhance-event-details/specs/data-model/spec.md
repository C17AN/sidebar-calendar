# Data Model

## MODIFIED Requirements

### Requirement: Extended Event Details
The system MUST support storing optional details for each event.

#### Scenario: Save Details
- Given an existing event
- When the user updates it with Time "14:00", Link "zoom.us", and Location "Office"
- Then these fields are saved in storage.
