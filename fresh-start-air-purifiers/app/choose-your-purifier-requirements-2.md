# Choose Your Purifier — Product Requirements (v2)

> **Changelog (Oct 2, 2025):** Updated flow to start with filtration needs, merged room questions, removed shipping estimator, added post-result email option, product links in recommendations, unified button styling, and replaced numeric percent with a simple progress bar.

## 1) Goal & Success Criteria
- **Goal:** Help visitors pick the right Austin Air model quickly (≤90 seconds) and proceed to product pages or cart with confidence.
- **Success =** (a) ≥60% reach a recommendation, (b) ≥25% click a recommended product link or add-to-cart, (c) ≥10% open the side-by-side compare.

## 2) Scope (MVP)
- Guided quiz with **5–6 steps** → ranked recommendations (top 1–3).
- “Why we chose this” explainer + filter life & projected replacement cost.
- Side-by-side compare (up to 4 models).
- “Junior vs Standard” size nudge based on room selection.
- **Include Immunity Machine** in catalog and logic.
- **No shipping estimator in MVP.**
- **Offer email send after results** (post-recommendation opt-in).

## 3) Audience & Personas
- **Fragrance/VOC-sensitive parent** (needs strong gas removal).
- **Allergy/asthma household** (dust/pollen/mold focus).
- **Pet household** (dander + odors).
- **New build/remodel** (formaldehyde/VOCs).
- **Small room** (nursery/office) vs **whole room** (master/living).

## 4) Inputs (Quiz) — *Order matters*
Each step is one screen with large tap targets (mobile-first). Show a **top progress bar** (no numeric %).

1) **Filtration needs (primary concerns)** — multi-select chips:
   - Fragrances/VOCs
   - Smoke
   - Formaldehyde/new materials
   - Dust/pollen
   - Mold humidity/sensitivity
   - Viruses/bacteria
   - Pet dander/odors
   - General air freshness

2) **Sensitivity level** — Typical | Sensitive | Very sensitive (MCS/MCAS).

3) **Noise tolerance (night use?)** — Low | Medium | Any (include “bedroom while sleeping” hint).

4) **Budget comfort** — Entry | Mid | Premium.

5) **Space & placement (single merged question)** — “Where will you use it most?” (also drives size guidance)
   - Bedroom (typically ≤300–500 ft²)
   - Living area / open space (typically 500–1200+ ft²)
   - Small office / nursery (≤300 ft²)
   - Classroom / clinic / high-traffic shared space
   - Whole small apartment / multi-room rotation

> **Removed:** Separate “room size” and “placement” questions — now combined.  
> **Removed:** Zip code / shipping estimate.  
> **After results:** Email field **optional** to send their personalized results.

## 5) Catalog (Models to Recommend)
- **HealthMate (HM400/HM200 Jr)** — balanced particle + odors (large carbon bed). Everyday choice.
- **HealthMate Plus (HMP)** — enhanced VOC/formaldehyde capability (impregnated carbon/zeolite).
- **Allergy Machine** — particle-first, great for pollen/mold/asthma (HEGA cloth assists gases).
- **Bedroom Machine** — bedroom-focused stack incl. HEGA; strong for sleepers & viruses.
- **Junior variants** (HM Jr / HMP Jr / Allergy Jr) — small rooms.
- **Immunity Machine (NEW)** — 8-phase: dual prefilters → granular carbon + impregnated carbon + zeolite + impregnated zeolite → Medical-grade HEPA → HEGA carbon cloth; for high-exposure/VOCs/formaldehyde/virus defense.

## 6) Scoring & Recommendation Logic (MVP)
Assign points per model based on answers; return top 1–3.

**Weights (suggested, tweak via JSON config):**
- **Concerns → model points**
  - Fragrances/VOCs: +4 HMP, +3 Bedroom, +5 Immunity, +2 HM
  - Formaldehyde/new materials: +5 HMP, +4 Immunity, +3 Bedroom
  - Smoke: +4 HMP, +3 HM, +4 Immunity
  - Dust/pollen: +4 Allergy, +3 HM, +2 Bedroom
  - Mold sensitivity: +4 Allergy, +3 Bedroom, +2 HM, +2 Immunity
  - Viruses/bacteria: +4 Bedroom, +3 Immunity, +2 HM/HMP
  - Pet dander/odors: +3 HM/HMP, +2 Bedroom
- **Sensitivity level**
  - Sensitive: +1 Allergy/Bedroom/HMP/Immunity
  - Very sensitive (MCS): +2 HMP & Immunity
- **Noise tolerance**
  - “Low” +1 Bedroom/Allergy (tip: “run on low at night”); “Any” +1 HM/HMP/Immunity
- **Budget**
  - Entry: −2 Bedroom/Immunity, +1 HM/Allergy/Jr
  - Premium: +2 Bedroom/HMP/Immunity
- **Space & placement (merged)**
  - Bedroom: +2 Bedroom Machine; Small office/nursery: +2 Jr variants
  - Living/open space: +1 HM/HMP; Classroom/clinic: +2 Immunity
  - If inferred size ≤300 ft²: prefer Junior (convert top standard pick → Jr)
  - If inferred size ≥700 ft²: prefer Standard; ≥1200 ft²: suggest multiple units/placement tips

**Tie-breakers:**
1) If any VOC-type concern, higher VOC/chem score wins.  
2) Virus/bacteria + night use → Bedroom > Immunity > HMP.  
3) Budget “Entry” caps to HM/HM Jr/Allergy Jr unless explicit VOC concern (allow HMP Jr).

**Pseudocode:**
```ts
type Model = 'HM'|'HMjr'|'HMP'|'HMPjr'|'Allergy'|'AllergyJr'|'Bedroom'|'Immunity';

function scoreAnswers(a): Record<Model, number> { /* apply weights above */ }
function inferSizeVariant(m: Model, placement: string): Model { /* swap to Jr for small rooms */ }
function rank(modelsScores){ /* sort desc, apply tie-breakers */ }
```

## 7) Output UI
- **Top progress bar:** simple, animated bar (no numeric %).
- **Result cards (top 1–3):**
  - Model name + **product link** to the PDP.
  - Short “Why it’s a fit” sentence mapped from their highest-weight concerns.
  - “Excels at” chips (VOCs/formaldehyde, pollen/mold, bedroom/virus, pets, smoke).
  - Size guidance (Jr vs Standard) based on their placement.
  - Filter life & replacement cost note.
  - CTAs:
    - **View product** (primary → links to PDP)
    - **Add to cart** (if available from results context)
    - **Compare** (adds to compare tray)
- **Compare drawer/table:** HM / HMP / Allergy / Bedroom / Immunity (toggle Jr where relevant) with rows for best-for, VOC strength, particle strength, HEGA presence, filter stack summary (Immunity shows 8 phases), size guidance, filter life & replacement SKU, MSRP/MAP (optional).

- **Email option (post-results):** Inline field + button: “Email me my results.” Show privacy blurb.

## 8) Visual & Interaction Guidelines
- **Buttons:** Match the site’s existing look & feel (same Tailwind classes / theme tokens). Use the primary color for the main CTA, subtle secondary for compare.
- **Chips:** Rounded, high-contrast state for selected, accessible focus ring.
- **Animations:** Smooth but minimal (200–250ms). Progress bar animates to next step.
- **Accessibility:** Keyboard navigable, aria-live on step change, 44px targets, WCAG AA contrast.

## 9) Tech Spec
**Frontend**
- Framework: React + Tailwind. Components:
  - `<QuizStepper/>`, `<AnswerChoice/>`, `<ProgressBar/>` (no percent), `<ResultCard/>`, `<CompareTable/>`, `<EmailResults/>`.
- State: local (Zustand or React context). Persist latest result in `localStorage`.
- Product links pulled from CMS/config (ensure PDP slugs present).

**Content/config**
- All weights and copy snippets in a JSON config (editable without redeploy).
- Map “concern” selections → tailored “why it’s a fit” copy.

**API / Data**
- CMS schema `purifierModel`: `slug`, `displayName`, `sizeVariant`, `bestFor[]`, `filterStack[]`, `hasHEGA`, `vocScore`, `particleScore`, `virusScore`, `msrp`, `map`, `replacementFilterSKU`, `images[]`, `pdpUrl`.
- Email: simple POST to `/api/email-results` (store consent + snapshot of answers + chosen models).

**Analytics**
- Track: quiz start, step progression, completion, selected concerns, product link clicks, compare opens, email sends, add-to-cart from results.

**Performance**
- Defer compare images until opened; quiz JS ≤30 KB gzipped; no blocking fonts.

## 10) Copy (MVP examples)
- **HMP “why”**: “Renovations or new cabinetry? HealthMate Plus targets formaldehyde & VOCs with a specialized carbon/zeolite blend.”
- **HM “why”**: “Balanced particle + odor removal with a large carbon bed—great everyday choice.”
- **Bedroom “why”**: “For sleepers & sensitive airways: adds HEGA for gases and night-friendly operation.”
- **Allergy “why”**: “Extra focus on pollen, dust, and mold allergens for reactive airways.”
- **Immunity “why”**: “Our most comprehensive 8-phase defense—prefilters, multi-carbon/zeolite, medical HEPA, and HEGA—for high-exposure environments.”

## 11) Edge Cases
- Multiple rooms / whole home → suggest two units or prioritize bedroom first.
- Very large open spaces (>1500 ft²) → recommend multiple units and placement tips.
- Budget cap + VOC concern → suggest HMP Jr compromise.
- “Not sure” → “Talk to a human” CTA.

## 12) QA Checklist
- Filtration-needs-first flow implemented; merged space question live.
- Progress bar renders without numeric percentage.
- Recommendation cards include **working PDP links**.
- Email-after-results flow works and sends the exact recommendation bundle.
- Jr conversion logic triggers correctly based on placement.
- Compare table hides fields not applicable (e.g., HEGA where absent).

## 13) Future Enhancements (post-MVP)
- “Good / Better / Best” ribbons and budget slider.
- Local AQI awareness (wildfire season nudge).
- Save/email result history in user account.
- Inline education cards (“Why carbon matters for VOCs”).

