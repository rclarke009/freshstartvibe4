# Choose Your Purifier — Product Requirements

## 1) Goal & Success Criteria
- **Goal:** Help visitors pick the right Austin Air model in ≤90 seconds, then add to cart with confidence.
- **Success =** (a) ≥60% of users reach a recommendation, (b) ≥25% click-through to a product page or add-to-cart, (c) ≥10% use the side-by-side compare.

## 2) Scope (MVP)
- Guided quiz with 5–7 questions → ranked recommendations (top 1–3).
- “Why we chose this” explainer + filter change interval & projected cost.
- Side-by-side compare (up to 4 models).
- “Junior vs Standard” size nudge when room size is small/medium.
- **Include Immunity Machine** in catalog and logic.

## 3) Audience & Personas
- **Fragrance/VOC-sensitive parent** (needs strong gas removal).
- **Allergy/asthma household** (dust/pollen/mold focus).
- **New build/remodel** (formaldehyde/VOCs).
- **Small room** (nursery/office) vs **whole room** (master/living).

## 4) Inputs (Quiz)
Ask with large tap targets (mobile-first), 1 screen per step:
1) **Room size** (ft²): <150, 150–300, 300–700, 700–1200, 1200–1500+
2) **Primary concerns** (multi-select): Fragrances/VOCs, Smoke, Formaldehyde/new materials, Dust/pollen, Mold humidity/sensitivity, Viruses/bacteria, General air quality, Pet odors.
3) **Sensitivity level:** Typical | Sensitive | Very sensitive (MCS/MCAS).
4) **Noise tolerance:** Low | Medium | Any (for “bedroom use while sleeping”).
5) **Budget comfort:** Entry | Mid | Premium.
6) **Placement:** Bedroom | Living area | Whole small apartment | Office/classroom.
7) **Maintenance preference:** “Change filters rarely” vs “Fine to change more often”.

Optional: **Zip code** (for shipping estimate from the chart), **email** to send the personalized results.

## 5) Catalog (Models to Recommend)
- **HealthMate (HM400/HM200 Jr)** — general particle + odors, 15 lb carbon on standard size. Good all-rounder.
- **HealthMate Plus (HMP)** — stronger VOC/formaldehyde adsorption (impregnated carbon/zeolite). Great for new build/remodel, chemical sensitivity.
- **Allergy Machine** — particle-forward with HEGA cloth; good for pollen/mold/asthma.
- **Bedroom Machine** — most comprehensive multi-media stack for bedroom air & sleep (adds HEGA layer).
- **Junior variants** (HM Jr / HMP Jr / Allergy Jr) — for smaller rooms.
- **Immunity Machine (NEW)** — **8-phase**: dual prefilters → granular carbon + impregnated carbon + zeolite + impregnated zeolite → Medical-grade HEPA → **HEGA carbon cloth**; designed for high-exposure environments, virus defense, VOCs, formaldehyde, ammonia/NO₂.

## 6) Scoring & Recommendation Logic (MVP)
Assign points per model based on answers; return top 1–3.

**Weights (suggested, tweak in config):**
- **Concerns → model points**
  - Fragrances/VOCs: +4 HMP, +3 Bedroom, +5 Immunity, +2 HM
  - Formaldehyde/new materials: +5 HMP, +4 Immunity, +3 Bedroom
  - Smoke: +4 HMP, +3 HM, +4 Immunity
  - Dust/pollen: +4 Allergy, +3 HM, +2 Bedroom
  - Mold sensitivity: +4 Allergy, +3 Bedroom, +2 HM, +2 Immunity
  - Viruses/bacteria: +4 Bedroom, +3 Immunity, +2 HM/HMP
  - Pet odors: +3 HM/HMP, +2 Bedroom
- **Sensitivity level**
  - Sensitive: +1 to Allergy/Bedroom/HMP/Immunity
  - Very sensitive (MCS): +2 to HMP & Immunity
- **Noise tolerance**
  - “Low” +1 Bedroom/Allergy (recommend “run on low at night” tip); “Any” +1 HM/HMP/Immunity
- **Budget**
  - Entry: −2 Bedroom/Immunity, +1 HM/Allergy/Jr
  - Premium: +2 Bedroom/HMP/Immunity
- **Placement & room size**
  - Bedroom: +2 Bedroom Machine; Living area: +1 HM/HMP; Classroom/office: +2 Immunity
  - If room size ≤300 ft²: prefer Junior (convert top standard pick → Jr variant)
  - ≥700 ft² single room: prefer Standard; ≥1200 ft²: recommend multiple units or placement tips
- **Maintenance preference**
  - “Change rarely”: +1 all Austin (5-yr filters typical use), surface as benefit.

**Tie-breakers (in code):**
1) Higher VOC/chem score wins if any VOC-type concern selected.
2) If virus/bacteria selected and night use: Bedroom > Immunity > HMP.
3) If budget “Entry,” cap to HM/HM Jr/Allergy Jr unless explicit VOC concern (then allow HMP Jr).

**Pseudocode (sketch):**
```ts
type Model = 'HM'|'HMjr'|'HMP'|'HMPjr'|'Allergy'|'AllergyJr'|'Bedroom'|'Immunity';

function scoreAnswers(a): Record<Model, number> { /* apply weights above */ }
function sizeVariant(m: Model, sqft: number): Model { /* swap to Jr if sqft<=300 */ }
function rank(modelsScores){ /* sort desc, apply tie-breakers */ }
```

## 7) Output UI
- **Result card (for each of top 1–3):**
  - Model name + short “Why it’s a fit” sentence mapped from highest-weight concerns.
  - “What it excels at” chips (e.g., VOCs/formaldehyde, pollen/mold, bedroom/virus defense).
  - Room size fit (Jr vs Standard guidance).
  - Est. filter life & cost note (5-year typical; show MSRP for replacements).
  - CTA: **View details** + **Add to cart** (or “Talk to us” micro-CTA if unsure).

- **Side-by-side compare drawer:**
  - Columns: HM / HMP / Allergy / Bedroom / Immunity (toggle Jr where relevant)
  - Rows:
    - Best for (chips)
    - Gas/VOC strength (scale)
    - Particle/allergen strength (scale)
    - Virus/bacteria layer (HEPA vs HEGA present)
    - Filter stack summary (bulleted media list; Immunity shows **8 phases**, incl. HEGA)
    - Room size guidance
    - Noise guidance (practical: “Low at night; Medium by day”)
    - Filter life (yrs) & replacement SKU
    - MSRP/MAP (optional on consumer site)

- **Shipping estimator:** If user enters ZIP, show zone-based S&H from chart (ground).

## 8) Data Sources (internal)
- **Model & filter catalog** (names, SKUs, colorways, MSRP/MAP/wholesale)
- **Product claims/positioning** (VOC emphasis, etc.)
- **General HM strengths & carbon mass talking points**
- **Immunity Machine 8-phase details & use cases**
- **Shipping zones & rates**

## 9) Tech Spec
**Frontend**
- Framework: React + Tailwind. Components:
  - `<QuizStepper/>`, `<AnswerChoice/>`, `<ResultCard/>`, `<CompareTable/>`, `<ShippingEstimator/>`.
- State: local (Zustand or React context). Persist last result in `localStorage`.
- Accessibility: all choices reachable by keyboard, 44px targets, high contrast, announce step changes.

**Content/config**
- Store weights, copy snippets and chip labels in JSON config for easy tweaks.
- Map concerns → explanations.

**API / Data**
- If using Sanity, create `purifierModel` schema with fields for slug, displayName, sizeVariant, bestFor[], filterStack[], hasHEGA, vocScore, particleScore, virusScore, msrp, map, replacementFilterSKU, images[], pdpUrl.
- Shipping: client-side lookup from JSON derived from chart.

**Analytics**
- Track quiz start, drop step, completion, selected concerns, model CTR, compare opens, add-to-cart.
- A/B later: short 5-Q vs 7-Q flow; auto-recommend vs compare-first.

**Performance**
- Defer compare images until opened; quiz JS ≤30 KB gzipped; no blocking fonts.

## 10) Copy (MVP)
- **HMP “why”**: “Formaldehyde & VOCs from paints, cabinetry, or renovations? HealthMate Plus uses a specialized carbon/zeolite blend designed for those gases.”
- **HM “why”**: “Balanced particle + odor removal with a large carbon bed—great everyday choice.”
- **Bedroom “why”**: “Best for overnight use and sensitive sleepers; adds a HEGA layer for gases.”
- **Allergy “why”**: “Extra focus on pollen, dust, and mold allergens for reactive airways.”
- **Immunity “why”**: “Most comprehensive 8-phase defense—prefilters + multi-carbon/zeolite + medical HEPA + HEGA—for high-exposure environments and maximum protection.”

## 11) Edge Cases
- **Multiple rooms or whole home:** Suggest 2 units or prioritize bedroom first.
- **Very large open spaces (>1500 ft²):** Recommend multiple units and placement tips.
- **Hard budget cap + VOC concern:** Offer HMP Jr as compromise.
- **Not sure:** Provide “Talk to a human” CTA.

## 12) QA Checklist
- Scoring sanity checks for each persona.
- Jr swap occurs correctly by ft².
- Compare table never shows irrelevant fields (e.g., HEGA if not present).
- Shipping estimator returns expected zone price per unit type.
- All external links resolve; SKUs match pricing sheet.

## 13) Future Enhancements (post-MVP)
- “Good / Better / Best” ribbons and budget slider.
- Auto-detect local AQI (wildfire season nudge).
- Save/email results.
- Inline education cards (“Why carbon matters for VOCs”).
- “Replace filter” schedule estimator with calendar add.
