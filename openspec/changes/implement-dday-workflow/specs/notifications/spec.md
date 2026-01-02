# Notifications & Alarms

## ADDED Requirements

### Requirement: Schedule Alarms
The system MUST schedule a `chrome.alarms` event for each D-Day item.
#### Scenario: Future Date
- Given a D-Day "2026-05-01" and Lead Time "24 hours"
- When the item is added
- Then an alarm is scheduled for "2026-04-30 09:00:00".

#### Scenario: Past Date
- Given a D-Day in the past
- When the item is added
- Then no alarm is scheduled.

### Requirement: Trigger Notification
The system MUST show a system notification when an alarm fires.
#### Scenario: Alarm Fires
- Given an alarm with name `dday-<id>`
- When `onAlarm` event is triggered
- Then `chrome.notifications.create` is called with the item details.

### Requirement: Sync Alarms
The system MUST update all alarms when the Lead Time setting changes.
#### Scenario: Change Lead Time
- Given existing alarms
- When Lead Time changes
- Then all existing D-Day alarms are cleared and recreated with the new offset.
