# Design: Real-time & Theming

## Real-time Updates
-   **Component:** `popup.js`
-   **Logic:**
    ```javascript
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local') {
        if (changes.dday_items) renderCalendarView();
        if (changes.dday_settings) applyTheme(changes.dday_settings.newValue.theme);
      }
    });
    ```

## Theming Architecture
-   **File:** `theme.css`
-   **Variables:**
    -   `--md-sys-color-primary`
    -   `--md-sys-color-on-primary`
    -   `--md-sys-color-surface`
    -   `--md-sys-color-surface-variant`
    -   `--md-elevation-1`, `--md-elevation-2`...
-   **Palettes:**
    -   **Blue (Default):** `#1a73e8`
    -   **Purple:** `#6750a4`
    -   **Green:** `#1e8e3e`
    -   **Red:** `#d93025`
-   **Application:**
    -   `popup.js` reads `settings.theme` on load and applies a data-attribute or style to `document.body`.
    -   Actually, simpler: Set `--md-sys-color-primary` dynamically in `style` tag or body style.

## Settings UI
-   Replace the simple "Lead Time" input with a "Settings" icon button in the header.
-   Opens a `<dialog>` or overlay with:
    -   Lead Time Input.
    -   Color Picker (Radio buttons with colors).
