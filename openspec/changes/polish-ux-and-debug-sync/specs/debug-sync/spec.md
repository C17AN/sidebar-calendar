# Debug Sync

## MODIFIED Requirements

### Requirement: Detailed Sync Errors
The system MUST provide detailed error messages when sync fails.

#### Scenario: Auth Failure
- Given the OAuth token cannot be retrieved
- When the sync fails
- Then the alert includes the specific error message from `chrome.runtime.lastError`.
