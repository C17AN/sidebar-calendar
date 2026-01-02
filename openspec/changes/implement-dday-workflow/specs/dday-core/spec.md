# D-Day Core Logic

## ADDED Requirements

### Requirement: Parse Dates from Text
The system MUST extract date strings in the format `YYYY-MM-DD` from any provided text string.
#### Scenario: Single Date
- Given the text "The project starts on 2026-05-20."
- When parsed
- Then it returns `["2026-05-20"]`.

#### Scenario: Multiple Dates
- Given the text "Vacation from 2026-08-01 to 2026-08-15"
- When parsed
- Then it returns `["2026-08-01", "2026-08-15"]`.

#### Scenario: No Date
- Given the text "Hello World"
- When parsed
- Then it returns an empty list.

### Requirement: Manage D-Day Items
The system MUST provide CRUD operations for D-Day items in `chrome.storage.local`.
#### Scenario: Add Item
- Given a valid date string "2026-12-25"
- When the `addItem` action is invoked
- Then a new object `{ id, date, ... }` is saved to storage.

#### Scenario: Delete Item
- Given an existing item ID
- When `deleteItem` is invoked
- Then the item is removed from storage.
