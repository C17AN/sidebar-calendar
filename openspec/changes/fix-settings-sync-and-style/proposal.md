# Fix Settings Sync and Style

## Summary
Fix localization sync for the floating UI, improve "System" theme detection, and enhance Settings button visibility in Light Mode.

## Problem
1.  **I18n Sync:** Changing the language in the extension does not immediately update the floating UI text on already open web pages.
2.  **System Theme:** The user expects Dark Mode at 8 PM, but "System" follows the OS setting. If the OS is set to Light, it remains Light. However, I should ensure the detection logic is robust.
3.  **Light Mode Visibility:** The Settings button blends into the background in Light Mode.

## Solution
1.  **I18n Sync:**
    -   Ensure `content.js` correctly reads and applies the `language` setting on every `storage.onChanged` event.
    -   Add a fallback to `chrome.i18n.getUILanguage()` if no setting is found.
2.  **System Theme:**
    -   Verify and ensure `matchMedia` listeners are correctly updating the `actualMode`.
    -   Note: "System" mode strictly follows the OS. If the user wants Time-based switching, that's a different feature. I will clarify that "System" = "OS Preference".
3.  **Light Mode Visibility:**
    -   In `theme.css`, update Light Mode `--bg-card` or the `.settings-btn` style to have a subtle border or a darker neutral background (e.g., `#f1f3f4` instead of `#ffffff`).

## Risks
-   None.
