# Security Compliance

## MODIFIED Requirements

### Requirement: No Inline Scripts
The system MUST NOT use inline event handlers (e.g., `onclick`) in HTML.

#### Scenario: Link Click
- Given an event with a link
- When the user clicks the link
- Then the link opens
- And the event card click (Edit) is NOT triggered.
- And no CSP error appears in the console.
