/** Shared button styles for event pages. Mirrors the patterns in docs/DESIGN.md. */
export const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700';

export const btnPrimary = `group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors ${focusRing}`;

export const btnSecondary = `group inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-red-900/15 text-gray-900 rounded-md font-semibold hover:bg-paper transition-colors ${focusRing}`;

export const btnOnDark =
  'group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-red-900 rounded-md font-semibold hover:bg-red-100 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

export const btnOnDarkOutline =
  'group inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-white/25 text-white rounded-md font-semibold hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';
