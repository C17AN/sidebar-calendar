# Date Parsing

## MODIFIED Requirements

### Requirement: Support Multiple Date Formats
The system MUST parse and extract dates in various common formats.

#### Scenario: Slash Format
- Given text "Meeting on 05/20/2026"
- When parsed
- Then it returns "2026-05-20" (assuming MM/DD/YYYY).

#### Scenario: Long Format
- Given text "Due by January 15, 2026"
- When parsed
- Then it returns "2026-01-15".

#### Scenario: Dashed Format
- Given text "12-Jan-2026"
- When parsed
- Then it returns "2026-01-12".
