# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Localization (mandatory)

Every user-facing text added or changed in the app (labels, buttons, messages, toasts, titles, placeholders, etc.) **must** be provided in all 3 supported languages:

- **O'zbek (uz)** — tushunarli, sodda tilda
- **Русский (ru)**
- **English (en)**

Add/update the corresponding key in all three locale files under `constants/locales/{en,ru,uz}/translation.json`, and reference it via `t('...')` — never hardcode UI text in a single language directly in a component.

## POS screen target (mandatory)

This is a touchscreen POS terminal app. Every screen, page, and dialog **must** be designed and tested for a **1024×768px** viewport (4:3), not for typical desktop/responsive breakpoints.

- Build layouts to fit **without page scroll** at 1024×768. If content genuinely overflows, scroll a specific inner region (a list/grid panel), never the whole page.
- Touch targets (buttons, list rows, icons, checkboxes) must be large enough for finger input — minimum **~44×44px**, with clear spacing between adjacent tappable elements to avoid mis-taps. No UI that depends on hover states (tooltips-only actions, hover-to-reveal menus) since there is no mouse/cursor on the terminal.
- Favor large, high-contrast text and icons, generous padding, and a clear visual hierarchy over dense/compact layouts — this is a cashier-facing screen used quickly under time pressure, not an admin back-office grid.
- Keep primary actions (pay, confirm, cancel, print) prominent, thumb-reachable, and consistently placed across screens.
- When adding or changing any POS screen, think and act as a senior product/UX designer: verify the layout actually fits and reads well at 1024×768 before considering the work done, not just that it compiles.
