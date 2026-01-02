# UI Logic

## MODIFIED Requirements

### Requirement: Dynamic Dialog Title
The event dialog MUST display a relevant title based on the action ("Add" vs "Edit").

#### Scenario: Add Mode
- Given the user clicks "Add New Event"
- Then the dialog title is "새 일정 추가" (or "Add New Event").

#### Scenario: Edit Mode
- Given the user clicks an existing event
- Then the dialog title is "일정 수정" (or "Edit Event").

### Requirement: Functional Manual Add
The "Add New Event" button MUST successfully save a new event to storage.

#### Scenario: Verify Save
- Given the add dialog is open
- When the user enters a title and clicks "Save"
- Then the event appears in the list.
- AND it is stored in `chrome.storage.local`.