/**
 * Rudhirsetu's headline figures: the single source for the hero stats strip, the home
 * bento and impact ledger, and the donations page.
 *
 * Keep these in sync with docs/BRAND.md ("Voice and words") and never add a figure that
 * the organisation has not confirmed. They are not editable in Sanity yet; moving them
 * there needs a new field in the Studio schema, which lives outside this repository.
 */
export const IMPACT = {
  foundedYear: 2010,
  campsPerYear: 50,
  emergenciesSupported: 9800,
  eyeCheckups: 15000,
  womenReached: 20000,
  thalassemiaPatients: 68,
} as const;

/** Display labels shared by every place that shows the figures, so wording can't drift. */
export const IMPACT_LABELS = {
  campsPerYear: 'Blood camps every year',
  emergenciesSupported: 'Emergencies supported',
  eyeCheckups: 'Eye checkups',
  womenReached: 'Women reached',
} as const;
