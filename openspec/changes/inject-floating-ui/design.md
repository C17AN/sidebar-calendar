# Design: Floating UI

## Content Script (`content.js`)
-   **Event:** `document.addEventListener('mouseup', handleSelection)`
-   **Logic:**
    -   `window.getSelection().toString().trim()`
    -   If empty, remove existing button.
    -   Run regex parser.
    -   If match:
        -   `range = selection.getRangeAt(0)`
        -   `rect = range.getBoundingClientRect()`
        -   Create/Move Shadow Host to `(rect.right + scrollX, rect.top + scrollY)`
-   **Shadow DOM:**
    -   `<button>Add D-Day</button>`
    -   Styles isolated from page.

## Communication
-   **Content -> Background:**
    -   `chrome.runtime.sendMessage({ type: 'ADD_DDAY', date: 'YYYY-MM-DD' })`
-   **Background:**
    -   Listens for `ADD_DDAY`.
    -   Calls `storage.addItem()`.
    -   (Optional) Sends success response or triggers notification.
