# Refine Sidebar Layout

## Summary
Refine the sidebar layout by adjusting padding for the content area, adding a bottom margin to the settings button, and implementing a divider line.

## Problem
1.  **Padding:** The area below the calendar (events list) needs more breathing room (16px horizontal padding).
2.  **Footer Spacing:** The settings button is too close to the bottom edge.
3.  **Visual Hierarchy:** A divider is needed to separate the main content from the settings footer.

## Solution
1.  **Padding:** Apply `padding: 0 16px` to `.section-header`, `.event-list`, and `.settings-footer`.
2.  **Margin:** Add `margin-bottom: 16px` to `.settings-btn`.
3.  **Divider:**
    -   Add `border-top: 1px solid var(--border-subtle)` to `.settings-footer`.
    -   Set `.settings-footer` top padding to `4px` to achieve the requested gap.

## Risks
-   None.
