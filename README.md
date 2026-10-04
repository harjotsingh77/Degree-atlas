# DegreeAtlas — Discover & Compare Online Degrees

Student-first prototype for a university UI/UX competition. Original brand, no copying of College Vidya / CollegeDekho.

**Run:** `npm install && npm run dev` → http://localhost:5173
**Routes:** `/` · `/universities/chitkara-online` · `/programmes/chitkara-online-mba`

## Design concept
- **Target user:** 17–28yr Indian UG/PG aspirant comparing online degrees on mobile, confused by fees/eligibility/specialisations.
- **Visual direction:** Premium ed-tech editorial + Gen-Z clean. Warm off-white `#F8F7F4`, Midnight Navy `#17182E`, Purple `#7457E8`, Mint `#BCE8D2`. Manrope headings / Inter body, 8px grid, 16px radius, fine borders, restrained shadows. Original visuals only: programme-card preview + mini comparison illustration. No stock photos, gradients, or glassmorphism.
- **Information architecture:** Home (discovery) → University profile → Programme detail, with global compare tray + modal on all pages. Detail pages answer in <30s: hero → quick facts → fees/eligibility → curriculum → FAQ → sticky CTA.
- **Key UX decisions:** (1) One comparison model everywhere (card → header badge → tray → modal, max 3, localStorage). (2) Search + filters really filter local data with chips + empty states. (3) Honesty by design: every unverified fee/review/recognition carries a `Sample` pill; no rankings, placements, salaries, urgency or discounts invented.

## What was built
- Homepage: sticky header + compare badge + hamburger, editorial hero with search/suggestions/UG-PG tabs/chips, 6 category cards, popular programmes (6 cards), 5 universities, functional filters + chips + counts, compare callout, 4-step How, illustrative reviews + trust, 3 guides, FAQ accordion, final CTA + footer.
- University page: breadcrumbs + sticky sub-nav, hero + compare/enquire, 5 quick facts, about + Read More, recognition with programme-level disclaimer, UG/PG tabs + fee/duration filters, admissions, learning (6 cards), careers (no guarantees), illustrative reviews, 4 similar universities, FAQ, sticky side panel + mobile bottom bar.
- Programme page: breadcrumbs, hero with fee/eligibility + enquire/curriculum/compare, quick info bar, overview highlights, fee table + transparency note, eligibility card + prototype checklist, selectable specialisations, semester accordion with Expand/Collapse, methodology, careers (potential roles), certificates (demo), reviews, related, compare confirmation, FAQ, final enquiry CTA with validated form (demo success, nothing stored).
- Global: CompareContext (add/remove/clear, dedupe, limit notice, header counter, tray, modal table row-aligned, mobile scrollable), EnquiryModal validation, responsive 1440/768/390, keyboard-accessible accordions/tabs, focus states, 44px targets.

## Data rules
INR formatting, Indian context. All fees/recognition/reviews/curriculum marked sample/illustrative where unverified. Legal/social links are prototype placeholders.

## QA
`npm run build` passes. Verified: 3 routes render, nav works, compare shared + persists, filters change results, no dead CTA (guides open enquiry demo, View-all scrolls), no horizontal overflow at 390px, compare modal scrolls on mobile, empty states for search/filters/compare.
