# Add Theme Mode

## Summary
Add a Light/Dark mode toggle in the Settings dialog.

## Problem
The app is currently locked to Dark Mode. Users might prefer a Light Mode for better visibility in bright environments.

## Solution
1.  **CSS:** Update `theme.css` to define variables for both modes.
    -   Default: Dark (to match current state).
    -   `[data-mode="light"]`: Light colors (White background, Black text, etc.).
2.  **Settings:** Add a "Theme" selector (Light / Dark) to the Settings dialog.
3.  **Storage:** Save `settings.themeMode` ('light' | 'dark').
4.  **Logic:** Apply `data-mode` attribute to `body` on load and change.

## Risks
-   **Color Contrast:** Need to ensure Light Mode colors are accessible.
    -   *Strategy:* Invert the Dark palette logic.
        -   Background: `#ffffff` / `#f8f9fa`
        -   Card: `#ffffff` (with shadow) or `#f1f3f4`
        -   Text: `#202124`
