# Parsing Logic

## MODIFIED Requirements

### Requirement: Support 2-Digit Years
The system MUST correctly parse dates with 2-digit years, assuming the 21st century.

#### Scenario: Short Year
- Given text "Meeting on 05/20/18"
- When parsed
- Then it returns "2018-05-20".

### Requirement: Support Day-First Numeric Dates
The system MUST correctly parse numeric dates where the day clearly precedes the month (Day > 12).

#### Scenario: Day First
- Given text "21/02/2018"
- When parsed
- Then it returns "2018-02-21".

### Requirement: Fix Text Date Regex
The system MUST correctly parse text-based dates that were previously failing due to regex errors.

#### Scenario: Text Date
- Given text "Feb 21, 2018"
- When parsed
- Then it returns "2018-02-21".
