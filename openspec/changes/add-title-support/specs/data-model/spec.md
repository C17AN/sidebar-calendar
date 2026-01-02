# Data Model

## MODIFIED Requirements

### Requirement: Store Event Title
The system MUST store a user-provided title for each D-Day item.

#### Scenario: Add with Title
- Given a date "2026-05-20" and title "Project Launch"
- When `addItem` is called
- Then the saved object contains `title: "Project Launch"`.

#### Scenario: Legacy Fallback
- Given an existing item without a title
- When retrieved
- Then it is treated as having a default title (e.g., "D-Day").
