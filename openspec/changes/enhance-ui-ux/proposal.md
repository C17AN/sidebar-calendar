# Enhance UI/UX

## Summary
Implement real-time UI updates in the Side Panel and overhaul the visual design to follow Material Design 3 principles, including user-configurable color themes.

## Problem
1.  **Stale Data:** The Side Panel doesn't reflect items added via the floating UI until manually refreshed or re-opened.
2.  **Basic UI:** The current look is generic. The user requested "Material UI".
3.  **No Personalization:** Users cannot change the color scheme.

## Solution
1.  **Real-Time Sync:** Add `chrome.storage.onChanged` listener to `popup.js` to trigger a re-render whenever `dday_items` changes.
2.  **Material Design System:**
    -   Implement `theme.css` with CSS variables for MD3 tokens (Primary, OnPrimary, Surface, etc.).
    -   Refactor `style.css` to use these tokens.
    -   Update DOM structure in `popup.html` / `popup.js` to support MD3 components (Cards, FABs, Text Fields).
3.  **Theme Settings:**
    -   Add a "Settings" dialog/view.
    -   Allow users to select a primary color (Blue, Purple, Green, Red).
    -   Save to `storage.settings`.

## Risks
-   **CSS Complexity:** Implementing a full MD3 system from scratch is heavy.
    -   *Mitigation:* Use a lightweight set of core tokens and standard components (Cards, Buttons, App Bar). strictly focused on the existing UI elements.
