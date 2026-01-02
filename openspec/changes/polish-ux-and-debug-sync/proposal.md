# Polish UX and Debug Sync

## Summary
Apply `user-select: none` globally and investigate/fix the Google Calendar sync failure.

## Problem
1.  **UX:** Text selection in the popup UI feels unpolished for an app-like interface.
2.  **Sync Failure:** The user reports that sync fails even with a `client_id`. This is likely due to the `manifest.json` `oauth2` configuration not matching the actual extension ID or key, or the `chrome.identity.getAuthToken` flow failing silently/ambiguously.

## Solution
1.  **CSS:** Add `* { user-select: none; }` to `style.css`, allowing selection only on inputs.
2.  **Debug Sync:**
    -   Verify `manifest.json` oauth2 scope structure.
    -   Enhance `utils/gcal.js` error logging to provide more specific feedback (e.g., differentiating between "Token Error" and "API Error").
    -   *Hypothesis:* The `key` field in `manifest.json` might be missing. For a consistent Extension ID (required for the Google Cloud Console redirect URI), the `key` must be persistent. Without it, the ID changes on reload, breaking the OAuth redirect.
    -   *Action:* I cannot generate a persistent `key` for the user, but I can improve the error message to guide them to check if the Extension ID matches the one in their Google Cloud Console.

## Risks
-   **Inputs:** `user-select: none` on `*` breaks inputs.
    -   *Mitigation:* `input, textarea { user-select: text; }`.

## Architecture
-   **Style:** Global CSS rule.
-   **Logic:** Enhanced error handling in `syncToCalendar`.
