# UI Logic

## MODIFIED Requirements

### Requirement: Repurposed Calendar Icon
The calendar icon button (📅) on event cards MUST open the Edit Event dialog.

#### Scenario: Click Calendar Icon
- Given an event card with a 📅 icon
- When the user clicks the 📅 icon
- Then the "Edit Event" dialog opens for that specific item.

### Requirement: Responsive Dialog Width
All dialogs MUST occupy the full width of the side panel minus a 24px margin on each side.

#### Scenario: Dialog Sizing
- Given a dialog is opened (Settings or Edit)
- Then the dialog width is exactly `100%` of the panel minus `48px` total margin.
