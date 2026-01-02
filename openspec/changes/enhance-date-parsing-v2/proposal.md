# Enhance Date Parsing V2

## Summary
Fix regex construction bugs and expand support for 2-digit years and DD/MM/YYYY formats.

## Problem
1.  **Bug:** Text-based regex uses `new RegExp` with single backslashes, causing `\b` to become a backspace character and `\d` to become `d`, failing to match `Feb 21, 2018`.
2.  **Missing Feature:** 2-digit years like `18` (for 2018) are ignored.
3.  **Missing Feature:** Dates like `21/02/2018` are ignored because the parser assumes MM/DD and rejects "Month 21".

## Solution
1.  **Escape Regex:** Properly escape string-based Regex constructors (e.g., `\\b`, `\\d`).
2.  **2-Digit Years:** Update regex to match `\d{2}` or `\d{4}`. Convert `YY` to `20YY` (threshold strategy: 00-99 -> 2000-2099? Or standard pivot? I'll use 2000s for simplicity as per "D-Day" context usually implies near future).
3.  **Smart Swap:** If the first number in `A/B/Y` is > 12, treat it as Day.

## Risks
-   **Ambiguity:** `01/02/18`. Jan 2nd 2018? Feb 1st 2018? Jan 2nd 1918?
    -   *Decision:* Default to `MM/DD/YYYY` for ambiguous cases (US standard), unless `DD > 12`.
    -   For Year `18`, assume `2018`.
