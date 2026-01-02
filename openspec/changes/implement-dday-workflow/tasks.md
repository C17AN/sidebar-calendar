# Implementation Tasks

## Phase 1: Core & UI Structure
- [x] Create `utils/dateParser.js` to implement regex parsing for `YYYY-MM-DD`. <!-- id: 0 -->
- [x] Create `utils/storage.js` to wrap `chrome.storage.local` for D-Day items and settings. <!-- id: 1 -->
- [x] Modify `popup.html` and `style.css` to add the basic layout (list container, settings area, drop overlay). <!-- id: 2 -->
- [x] Implement Drag & Drop event listeners in `popup.js` to detect text drops and trigger parsing. <!-- id: 3 -->

## Phase 2: Feature Logic
- [x] Implement `renderList()` in `popup.js` to display saved items with D-Day calculation (e.g., "D-5"). <!-- id: 4 -->
- [x] Implement `deleteItem` functionality in the UI and Storage. <!-- id: 5 -->
- [x] Implement `leadTime` setting input and save logic. <!-- id: 6 -->

## Phase 3: Background Services
- [x] Implement `background.js` logic: Listen for new D-Day items and schedule `chrome.alarms`. <!-- id: 7 -->
- [x] Implement `background.js` logic: Listen for `leadTime` changes and reschedule all alarms. <!-- id: 8 -->
- [x] Implement `chrome.alarms.onAlarm` listener to fire `chrome.notifications`. <!-- id: 9 -->

## Phase 4: Integrations (Optional)
- [x] Add `oauth2` placeholder in `manifest.json` (User must supply `client_id`). <!-- id: 10 -->
- [x] Implement `utils/gcal.js` to handle `chrome.identity` and Calendar API calls. <!-- id: 11 -->
- [x] Add UI button to "Sync to Calendar" for specific items. <!-- id: 12 -->