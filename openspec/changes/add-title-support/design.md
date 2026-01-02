# Design: Title Support

## Floating UI Interaction
1.  **Initial State:** Small button "Add D-Day: [Date]".
2.  **Click:**
    -   Overlay expands.
    -   Input: `<input type="text" value="[Truncated Selection]">`
    -   Buttons: `[Save]` `[Cancel]`
3.  **Save:**
    -   `chrome.runtime.sendMessage({ type: 'ADD_DDAY', date: '...', title: input.value })`
    -   Overlay content becomes "Saved!" (Green text/check icon).
    -   Fade out after 1s.

## Data Structure
```typescript
interface DDayItem {
  id: string;
  date: string;
  title: string; // New field
  createdAt: number;
}
```

## Side Panel UI
-   Replace `<span class="dday-tag">D-Day</span>` with `<span class="dday-tag">${item.title}</span>`.
-   If title is missing (legacy items), fallback to "D-Day".
