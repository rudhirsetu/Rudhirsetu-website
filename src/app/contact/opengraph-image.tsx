import { createPresetImage } from '../_og/preset-image';

// Prerendered at build time by Next's file convention; the design lives in src/app/_og.
export const alt = 'Rudhirsetu Seva Sanstha: get in touch';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/jpeg';
// Refreshes daily in the background (and repairs an image built while Google Fonts was unreachable).
export const revalidate = 86400;

export default createPresetImage('contact');
