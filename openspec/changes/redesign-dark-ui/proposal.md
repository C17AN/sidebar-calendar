# Redesign Dark UI

## Summary
Overhaul the UI to match a specific "Dark Mode Dashboard" aesthetic. This involves replacing the 14-day agenda view with a Monthly Calendar Grid and a separate "Next Up" event list, using a deep navy/black color palette.

## Problem
The current Material Design UI is light-themed and generic. The user provided a reference screenshot featuring a sleek, dark interface with a calendar grid and card-based event list.

## Solution
1.  **Theme:** Switch to a permanent Dark Theme.
    -   Background: `#0e1015` (Deep Navy/Black)
    -   Surface: `#1e1f2b` (Dark Blue-Grey)
    -   Primary: `#246bfd` (Vibrant Blue)
    -   Text: `#ffffff` / `#a0a0a0`
2.  **Layout:**
    -   **Top:** Month/Year Header with Navigation (< >).
    -   **Middle:** 7-column Calendar Grid (S M T W T F S).
    -   **Bottom:** "Next Up" scrollable list.
    -   **Footer:** Fixed "Settings" button.
3.  **Components:**
    -   **Calendar Day:** Minimal number, blue circle for selected/today, dots for events.
    -   **Event Card:** Rounded container, left-aligned date box (Month/Day), title, time.

## Risks
-   **Space Constraints:** The monthly grid might be tight in a Side Panel width.
    -   *Mitigation:* Keep font size small (12px), minimize padding.
