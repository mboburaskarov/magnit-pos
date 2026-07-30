# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Localization (mandatory)

Every user-facing text added or changed in the app (labels, buttons, messages, toasts, titles, placeholders, tooltips, aria-labels, etc.) **must** be provided in all 3 supported languages:

- **O'zbek (uz)** — tushunarli, sodda tilda. This is the source/reference language: write the original value here first, then translate naturally (not word-for-word) into ru and en.
- **Русский (ru)** — also the app's runtime `fallbackLng` in `src/i18n.js` (kept intentionally; do not change without discussing first).
- **English (en)**

No hardcoded UI text may live inside a component in any single language — always add/update the key in all three locale files under `constants/locales/{en,ru,uz}/translation.json` and reference it via `t('key')` (from `useTranslation()`, or a `t` prop where the component already receives one — several POS components pass `t` down rather than calling the hook directly; follow the existing pattern in the file you're editing).

**Key naming convention**: flat, dot-separated strings (not nested JSON objects — the files store literal keys like `"pos.error_adding_product"`, and `i18next`'s `keySeparator: '.'` turns the dots into nested lookup at runtime). Namespace by area, e.g.:
- `pos.*` — POS/sale-screen text (`pos.error_fill_fields`, `pos.currency_short`)
- `table_columns.*` — AgGrid/table column headers (`table_columns.barcode`)
- `create_register.*`, `close_shift.*`, `product_drawer.*`, `login.*`, `date_range.*` — screen/feature-scoped namespaces
- A few flat legacy keys with no prefix also exist (`cart`, `price`, `client`, `retry`) — check for an existing matching key before adding a new one; reuse when the meaning is identical, but never reuse a key whose existing value has a different meaning just because the English gloss looks similar (e.g. `pos.change` already means "cash change due", not the verb "to change/edit" — a real bug found and fixed during the 2026-07 i18n migration).
- Interpolation uses `{{paramName}}` (e.g. `t('pos.result_error', { detail })`).
- If a piece of "text" is actually a data-driven flag used for logic (e.g. matching a substring of an API error message to branch UI behavior), don't route it through `t()` as-is — translating the display string would silently break the check. Introduce a separate boolean/enum alongside the translated message instead (see `create_register.wrong_branch_message` + the `wrongBranch` flag in `create-cash-register/index.jsx` for the pattern).

After adding/changing keys, run `npm run i18n:check` — it reports any key missing (or empty) in one language but present in another. Fix reported gaps before considering the change done. (As of the 2026-07 i18n migration, there is a pre-existing, unrelated gap of ~86 keys under `menu.products.import.*` / `menu.reports.*` that only exist in `ru` — a legacy admin import/inventory feature that was never localized; that gap is tracked separately and is not something new code needs to fix incidentally.)

**Migration status (2026-07, in progress — not finished):** The POS terminal screens (`src/pages/sales/new-sale/pos/*`), cash-shift open/close flows, and most of `components/Sales/*` are fully migrated and verified clean of hardcoded text. Large parts of the codebase are **not yet migrated** — mainly admin/back-office screens (`components/AgGridTable/*`, most of `components/Inputs/*`, various drawers/filters outside Sales). Before assuming a file is already localized, check it directly rather than trusting this note:
- `grep -rlP "[а-яА-ЯёЁ]" --include="*.jsx" --include="*.js" . --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=locales` lists files with leftover hardcoded Cyrillic text.
- A file with zero `react-i18next` import (`grep -L "from 'react-i18next'"`) that renders JSX almost certainly has never been touched — but check for dead code first (search whether the component is actually imported anywhere) before spending time on it; several already-hardcoded files turned out to be unused and were deleted rather than translated.
- Hardcoded Latin-script (uz/en-only) text isn't caught by the Cyrillic grep above and hasn't been systematically audited — don't assume a file is clean just because it has no Cyrillic.

## POS screen target (mandatory)

This is a touchscreen POS terminal app. Every screen, page, and dialog **must** be designed and tested for a **1024×768px** viewport (4:3), not for typical desktop/responsive breakpoints.

- Build layouts to fit **without page scroll** at 1024×768. If content genuinely overflows, scroll a specific inner region (a list/grid panel), never the whole page.
- Touch targets (buttons, list rows, icons, checkboxes) must be large enough for finger input — minimum **~44×44px**, with clear spacing between adjacent tappable elements to avoid mis-taps. No UI that depends on hover states (tooltips-only actions, hover-to-reveal menus) since there is no mouse/cursor on the terminal.
- Favor large, high-contrast text and icons, generous padding, and a clear visual hierarchy over dense/compact layouts — this is a cashier-facing screen used quickly under time pressure, not an admin back-office grid.
- Keep primary actions (pay, confirm, cancel, print) prominent, thumb-reachable, and consistently placed across screens.
- When adding or changing any POS screen, think and act as a senior product/UX designer: verify the layout actually fits and reads well at 1024×768 before considering the work done, not just that it compiles.

## Receipt printer target (mandatory)

Our receipt (check) printers use **58mm paper**. When editing the receipt template (`utils/receiptBuilder.js`, `components/ReceiptPreviewCanvas.jsx`), lay text out for 58mm-wide paper (40-column monospace at the printer's default font). A prior attempt to switch this to 80mm/48-column broke real printouts (font enlarged and wrapped onto a second line), and was reverted — do not redo that change without confirming on real hardware first.

Note: the actual ESC/POS rendering (font, bold, QR module size, cut) is performed by a separate local native print agent app (`http://localhost:7788` / `:7777`, launched via the `magnitposprinter://` URL scheme) that is **not part of this repository**. This repo only builds a text/tag protocol (`[BOLD_START]`, `[BOLD_END]`, `[QR:data]`, `[HEX:...]`, `[CUT]`) and POSTs it to that agent's `/print/raw-template` endpoint. Physical sizing quirks (paper width, QR pixel size) that persist after a template change may require changes in that external agent, not here.
