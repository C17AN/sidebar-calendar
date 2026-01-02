# UI Layout

## MODIFIED Requirements

### Requirement: Persistent Next Up List
The "NEXT UP" list MUST always be visible in the sidebar.

#### Scenario: View Both
- Given a date "Jan 12" is selected
- Then the sidebar displays the "Jan 12 Schedule" section.
- AND the "NEXT UP" section is visible below it.

### Requirement: Manual Add Event
The system MUST allow users to manually add an event for a selected date.

#### Scenario: Manual Add
- Given a date is selected
- When the user clicks "Add New Event" (새 일정 추가하기)
- Then the "Edit Event" dialog opens with the date pre-filled.
- AND saving adds a new event to that date.
