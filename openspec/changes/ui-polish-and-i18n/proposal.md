# UI Polish & I18n

## Summary
Optimize calendar width usage, add language selection (Korean/English), and apply the Pretendard font.

## Problem
1.  **Padding:** The calendar grid has excessive side padding, wasting space.
2.  **Language:** The app is currently implicitly English (or mixed). User requested explicit "Korean / English" toggle.
3.  **Font:** The current system font stack is generic. User requested "Pretendard".

## Solution
1.  **Layout:** Reduce `body` and container padding in `style.css`. Make the grid `width: 100%`.
2.  **I18n:**
    -   Add `language` to Settings (storage).
    -   Update `renderCalendar` to use the selected locale (`ko-KR` or `en-US`).
    -   Translate UI strings (Headers, Buttons) based on the setting.
3.  **Font:**
    -   Import Pretendard via CDN (or local, but CDN is easier for extension if allowed, otherwise verify CSP).
    -   *Constraint:* Chrome Extensions can load remote fonts if CSP allows, or we package a subset.
    -   *Decision:* Use `cnd.jsdelivr.net` import in CSS. If blocked by default CSP, we might need to package it. Given "Prototyping" context, I'll try CDN. If risky, I'll use a system font stack that prioritizes Korean fonts.
    -   *Safer Approach:* Use `@font-face` with a CDN URL.

## Risks
-   **CSP:** Remote fonts might be blocked.
    -   *Mitigation:* I will add the CDN to `content_security_policy` in `manifest.json` or just use the system font stack which usually looks good enough, but user asked specifically for Pretendard.
    -   *Alternative:* I will attempt to use the web font.

## Architecture
-   **Storage:** `settings.language` ('ko', 'en').
-   **UI:** Settings dialog radio buttons.
-   **Logic:** `getTranslation(key)` helper.
