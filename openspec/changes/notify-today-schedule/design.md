# Design: Today's Notification

## Icon Badge
-   **Color:** Red (`#FF0000` or MD3 Error container?). Let's use standard Chrome Red.
-   **Text:** Number of items (e.g., "1", "3"). Empty if 0.

## Floating Pill (Content Script)
-   **Position:** Fixed, Bottom-Right (20px from edges).
-   **Z-Index:** Max.
-   **Style (MD3):**
    -   Container: Surface Color, Elevated (Shadow 2), Rounded corners (Full).
    -   Content: Flex row, Icon + Text.
-   **States:**
    -   **Collapsed:** Icon ("📅") + Count badge.
    -   **Expanded:** List of titles.
-   **Behavior:**
    -   Auto-expand on hover? Or Click? Click is safer for mobile/touch.
    -   Let's do: **Small Pill "📅 2 D-Days"**. Click -> Expands list.

## Data Logic
-   **Date Check:** `item.date === new Date().toLocaleDateString('en-CA')` (YYYY-MM-DD).
    -   *Note:* Ensure timezone consistency. `en-CA` gives YYYY-MM-DD in local time.
