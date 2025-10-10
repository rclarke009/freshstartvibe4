# Choose Your Purifier — Quick Picker (MVP)

**Approach:** One-screen selector with two chip groups (needs + placement). Instant recommendations update on the same page. No stepper. Optional email capture **after** recommendations. Buttons match site styling. Pretty progress bar is optional (can be omitted in one-screen flow).

## UI
- **Group 1 — “What do you need help with?”** (multi-select chips): Pets, Allergies (pollen/mold), Fragrances/VOCs, Smoke, Viruses, “I’m not sure”.
- **Group 2 — “Where will it live?”** (single-select): Bedroom, Small office/nursery, Living room/open space, Classroom/clinic.
- **Results (inline on the same page):** Show up to 2 cards:
  - **Best match** and **Also consider**
  - Model name, 1-sentence “Why it fits”, **View product** (PDP link)
  - Optional: “Add to cart” (if you wire it)
- **Email (post-results):** Inline field + button “Email me these results.”

## Logic (tiny config-driven scoring)
- Needs → model scores (additive)
- Placement → nudges (additive)
- If bedroom + viruses → prefer Bedroom
- If any VOC concern → prefer HMP/Immunity
- If “Small office/nursery” → use Jr variants
- Return top 1–2 models

```ts
const rules = {
  pets: { HM: 3, HMP: 2, Bedroom: 1 },
  allergies: { Allergy: 4, HM: 2, Bedroom: 1 },
  vocs: { HMP: 4, Immunity: 3, Bedroom: 2, HM: 1 },
  smoke: { HMP: 3, Immunity: 3, HM: 2 },
  viruses: { Bedroom: 3, Immunity: 2 },
  unsure: { HM: 1, Bedroom: 1 },
};

const placementNudges = {
  bedroom: { Bedroom: 2, HM: 1 },
  small:   { HMjr: 2, AllergyJr: 2 },
  living:  { HM: 1, HMP: 1 },
  clinic:  { Immunity: 2 },
};

function recommend(needs: string[], place: keyof typeof placementNudges) {
  const score: Record<string, number> = {};
  for (const need of needs) for (const [m,v] of Object.entries(rules[need]||{})) score[m]=(score[m]||0)+v;
  for (const [m,v] of Object.entries(placementNudges[place]||{})) score[m]=(score[m]||0)+v;
  if (needs.includes('vocs')) score['HMP'] = (score['HMP']||0) + 1;
  if (needs.includes('viruses') && place==='bedroom') score['Bedroom'] = (score['Bedroom']||0) + 2;
  const top = Object.entries(score).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([m])=>m);
  return top;
}
```

## Visual
- **Buttons:** Use your existing Tailwind utility classes (primary for main CTA)
- **Chips:** Rounded, clear selected/hover/focus states (keyboard accessible)
- **Progress bar:** Optional (thin top bar without % numbers)

## Analytics
- Log chip selections, model impressions, product link clicks, email submits.

## Email
- POST `/api/email-results` with `{ email, needs, placement, picks }`.
- Show a short privacy blurb.

## File drop
- `QuickPicker.jsx` — drop-in React component (Tailwind). 
- `models.config.json` — PDP links + copy.