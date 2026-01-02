# Implementation Tasks

- [x] Delete `utils/gcal.js`. <!-- id: 0 -->
- [x] Remove `SETUP.md`. <!-- id: 1 -->
- [x] Update `manifest.json`: Remove `identity` permission and `oauth2` configuration. <!-- id: 2 -->
- [x] Update `popup.js`:
    -   Remove `syncToCalendar` import.
    -   Repurpose `syncBtn` click handler to call `openEditDialog`.
    -   Update `syncBtn` tooltip label. <!-- id: 3 -->
- [x] Update `style.css`: Set `dialog` width to `calc(100% - 48px)` and remove `max-width`. <!-- id: 4 -->