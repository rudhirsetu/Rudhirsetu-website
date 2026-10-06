/**
 * First-visit splash: a maroon curtain with the logo, a 0-100 counter and a
 * progress bar that lifts to reveal the hero.
 *
 * It is pure markup + CSS (see "Home intro" in globals.css). It is always
 * server-rendered but hidden unless the inline script in layout.tsx added
 * `html.intro` before first paint, so there is no flash, no hydration wait and
 * no JavaScript animation work.
 */

/** When the curtain starts lifting (ms after first paint). Matches --intro-reveal in globals.css. */
export const LOADING_REVEAL_MS = 1050;
/** When the curtain is fully gone. */
export const LOADING_TOTAL_MS = LOADING_REVEAL_MS + 650;

const LoadingScreen = () => (
  <div
    aria-hidden="true"
    data-lenis-prevent
    className="intro-curtain pointer-events-none fixed inset-x-0 top-0 z-[9999] h-screen select-none bg-red-950 text-white supports-[height:100dvh]:h-[100dvh]"
  >
    {/* Rounded lower edge that appears as the curtain lifts, echoing the hero card. */}
    <div className="absolute inset-x-0 top-full h-10 rounded-b-[2.5rem] bg-red-950" />

    {/* Soft glow (a gradient, not a blur filter) */}
    <div className="pointer-events-none absolute -top-24 left-1/2 h-[30rem] w-[56rem] max-w-[200%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(220,38,38,0.3),transparent)]" />

    {/* Logo */}
    <div className="relative flex h-full flex-col items-center justify-center px-4 pb-24 text-center">
      <div className="intro-logo flex flex-col items-center">
        <img src="/images/logo-light.svg" alt="" width={160} height={165} className="h-auto w-32 md:w-40" />
        <p className="mt-8 text-sm font-medium uppercase tracking-[0.2em] text-red-300">
          Rudhirsetu means bridge of blood
        </p>
      </div>
    </div>

    {/* Counter + progress */}
    <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-7xl px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-8 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <p className="pb-2 text-sm font-semibold uppercase tracking-[0.15em] text-white/40">Loading</p>
        <p className="font-display text-6xl font-bold leading-none tracking-tight tabular-nums sm:text-8xl">
          {/* Counted up by the intro script in layout.tsx before hydration. */}
          <span className="intro-count" suppressHydrationWarning>
            0
          </span>
          <span className="text-red-300">%</span>
        </p>
      </div>
      <div className="mt-4 h-px w-full bg-white/15 sm:mt-6">
        <div className="intro-bar h-0.5 w-full bg-red-400" suppressHydrationWarning />
      </div>
    </div>
  </div>
);

export default LoadingScreen;
