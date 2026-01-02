# UI Polish

## MODIFIED Requirements

### Requirement: Sidebar Content Padding
The area below the calendar MUST have 16px of horizontal padding.

#### Scenario: Verify Padding
- Given the "Next Up" list is displayed
- Then the list items have a 16px gap from the left and right edges.

### Requirement: Settings Button Margin
The Settings button MUST have a 16px margin at the bottom.

#### Scenario: Check Bottom Space
- Given the sidebar is rendered
- Then there is a 16px vertical gap between the Settings button and the bottom edge of the panel.

### Requirement: Footer Divider
The system MUST display a divider line 4px above the Settings button.

#### Scenario: Visual Check
- Given the sidebar is rendered
- When the user looks at the bottom
- Then a subtle horizontal line is visible exactly 4px above the Settings button.