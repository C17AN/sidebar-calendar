# Fix Button Hover Visibility

## Summary
Ensure the "Settings" button text remains visible when hovered, in both Light and Dark modes.

## Problem
The `.settings-btn:hover` style uses a hardcoded dark color (`#2a2c3d`). 
- In Dark Mode, this is a subtle change but might be too dark.
- In Light Mode, it contrasts poorly with the dark text, making the button unreadable.

## Solution
Update the hover background to use a relative adjustment (e.g., `brightness()` filter or a semi-transparent white/black overlay) or a mode-specific CSS variable. 
Preferably, use `brightness()` as it's simple and works for both light and dark backgrounds.

## Risks
- None.
