# Sync Floating UI Settings

## Summary
Synchronize the Floating UI (on web pages) with the extension's theme and language settings. Add a "System" theme mode option.

## Problem
1.  **Inconsistency:** The floating "Add D-Day" UI is always English and Blue/Light, regardless of user settings.
2.  **Missing Feature:** Users want an "Auto" mode that follows system dark/light preferences.

## Solution
1.  **System Theme Mode:**
    -   Add `system` value to `themeMode`.
    -   Use `window.matchMedia('(prefers-color-scheme: dark)')` to determine actual appearance.
2.  **Floating UI Sync:**
    -   `content.js` will listen for `chrome.storage.onChanged`.
    -   On change (or initial load), update its internal state (`lang`, `theme`, `mode`).
    -   Apply `data-mode` and custom CSS variables to the Shadow DOM host.
3.  **Localization:**
    -   Add a small translation dictionary to `content.js` for "Add D-Day", "Save", "Cancel", "Saved!", etc.

## Risks
-   **Shadow DOM Theming:** Shadow DOM prevents inheritance. We must manually inject/update the theme variables.
-   **Latency:** Slight delay in theme switching on open pages when settings change.
