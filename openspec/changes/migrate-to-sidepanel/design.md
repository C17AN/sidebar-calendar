# Design: Side Panel Migration

## Architecture
-   **Manifest:**
    -   Remove `action.default_popup`.
    -   Add `side_panel: { "default_path": "popup.html" }`.
    -   Add `permissions: ["sidePanel"]`.
-   **Background Script:**
    -   `chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })` ensures clicking the icon opens the panel.

## UI Changes
-   None required to the HTML/JS logic itself, as the Side Panel hosts standard web content just like the popup.
