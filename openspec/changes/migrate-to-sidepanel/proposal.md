# Migrate to Side Panel

## Summary
Switch the extension's primary UI from a temporary Popup to a persistent Side Panel. This enables users to interact with web pages (drag text) without the extension UI closing.

## Problem
The current Popup UI closes immediately when the user clicks anywhere else, including the web page they want to drag text from. This makes the core "Drag & Drop" feature impossible to use directly from a web page.

## Solution
1.  **Manifest Update:** Use the `side_panel` API instead of `action.default_popup`.
2.  **Interaction:** Clicking the extension icon toggles the Side Panel.
3.  **Permissions:** Add `sidePanel` permission.

## Risks
-   Requires Chrome 114+.
-   User might prefer a popup for quick checks, but the core feature demands persistence.
