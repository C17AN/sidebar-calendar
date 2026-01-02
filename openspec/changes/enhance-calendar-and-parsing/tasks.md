# Implementation Tasks

## Parsing
- [x] Update `utils/dateParser.js` to add regex patterns for `MM/DD/YYYY`, `Month DD, YYYY`, and `DD-Mon-YYYY`. <!-- id: 0 -->
- [x] Implement normalization logic in `utils/dateParser.js` to convert all matches to `YYYY-MM-DD`. <!-- id: 1 -->

## UI
- [x] Refactor `popup.js` to replace `renderList` with `renderCalendarView`. <!-- id: 2 -->
- [x] Implement logic to generate 14 `day-card` elements for the next 2 weeks. <!-- id: 3 -->
- [x] Update `style.css` to style the calendar view (day headers, card layout). <!-- id: 4 -->