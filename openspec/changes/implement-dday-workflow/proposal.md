# Implement D-Day Workflow

## Summary
Implement a complete D-Day management workflow in the Chrome Extension. This includes a drag-and-drop interface for adding dates from selected text, a list view in the popup, configurable lead-time notifications via background alarms, and optional Google Calendar synchronization.

## Problem
Currently, the extension is a skeleton. Users have no way to add dates, view them, or receive notifications. Manually typing dates is tedious; users often encounter dates in text on web pages and want to quickly track them.

## Solution
1.  **Drag & Drop Parsing:** Allow users to select text on any page (or within the popup) and drag it. If the popup is open, dropping the text parses `YYYY-MM-DD` dates and prompts to add them.
2.  **D-Day Management:** A popup UI to list saved dates, showing "D-X" or "D+X". Users can delete items.
3.  **Notifications:** A background service worker schedules `chrome.alarms` based on the D-day date minus a user-configured "Lead Time" (in hours).
4.  **Google Calendar (Optional):** If authenticated, add the D-day as an all-day event or timed event in the user's primary calendar.

## Riskiest Assumptions
-   The user keeps the popup open while dragging from a webpage? *Correction:* Chrome extension popups usually close when clicking/dragging outside.
    -   *Mitigation:* The "drag" might need to happen *within* the popup (e.g., user pastes text or drags from an input field), OR we rely on a content script to handle drops on the *page* which then sends a message.
    -   *Refined Approach:* The prompt says "Chrome 확장(Drag D-Day)의 팝업 UI에 YYYY-MM-DD 형식의 날짜를 포함한 텍스트를 드래그하면". This implies the drop target is the popup. **Constraint:** You generally cannot drag from a webpage *into* the extension popup because the popup closes when focus is lost (clicking on the page).
    -   *Alternative:* The user opens the popup, *then* selects text *inside* the popup (maybe from a "scratchpad" area) or simpler: The user copies text, opens popup, and we auto-detect clipboard? Or maybe the prompt implies dragging *files* or text *into* the popup from another window if the popup stays open?
    -   *Wait:* If I select text on a page, then click the extension icon, the popup opens. Can I drag that selection in? No, clicking the icon changes focus.
    -   *Interpretation:* The most standard "Drag" workflow for extensions is:
        1.  Content Script adds a drop zone to the *current page*.
        2.  OR: User drags text *into the popup* from a separate non-browser window?
        3.  OR: The user pastes text into an input, then drags?
    -   *Decision for Proposal:* I will support dragging text *into* the popup's drop zone. If Chrome closes the popup when dragging *from* the web page starts (because focus shifts), I will also provide a "Paste & Add" fallback or a content-script based approach in a future iteration if needed. However, sticking to the prompt: "drag text... to popup UI". I will assume the user manages to get the text to the popup (e.g. from a side-by-side window or if the popup persists).
    -   *Better UX:* "Add from Clipboard" is safer, but I will implement the Drag & Drop as requested.

## Architecture
-   **Popup (UI):** Reacts to `dragenter`, `dragover`, `drop`. Parses text. Updates `chrome.storage.local`.
-   **Storage:** `items: { id, date, note, created_at }[]`, `settings: { leadHours }`.
-   **Background:** Listens to storage changes (or messages) to update `chrome.alarms`. Handles `onAlarm` to fire `chrome.notifications`.
