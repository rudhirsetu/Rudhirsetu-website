/**
 * Route-level loading skeletons (used by each route's `loading.tsx`).
 *
 * They mirror the real page layout (same top padding, left-aligned SectionHeader,
 * same grids) so nothing jumps when the page arrives. Pages are prerendered, so these
 * only flash briefly during a client navigation to a route that is not cached yet.
 * Server component: no client JS.
 */

type Variant = 'camp' | 'gallery' | 'donations' | 'contact' | 'social';

const block = 'rounded bg-red-900/5';

const sectionClass: Record<Variant, string> = {
  camp: 'bg-paper px-4 pb-20 pt-32 sm:px-6 sm:pb-24 sm:pt-36 lg:px-8 lg:pb-32 lg:pt-44',
  gallery: 'bg-white px-4 pb-4 pt-28 sm:px-6 sm:pb-8 sm:pt-36 lg:px-8 lg:pt-40',
  donations: 'bg-white px-4 pb-20 pt-32 sm:px-6 sm:pb-24 sm:pt-36 lg:px-8 lg:pb-32 lg:pt-40',
  contact: 'bg-white px-4 pb-20 pt-32 sm:px-6 sm:pb-24 sm:pt-36 lg:px-8 lg:pb-32 lg:pt-40',
  social: 'bg-white px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-36 lg:px-8 lg:pb-32 lg:pt-40',
};

/** Same footprint as `SectionHeader`: eyebrow pill + two-line title, description on the right from lg. */
const HeaderSkeleton = () => (
  <div className="mb-12 flex flex-col gap-6 sm:mb-16 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
    <div className="w-full max-w-2xl">
      <div className="mb-6 h-8 w-36 rounded-full bg-red-100" />
      <div className={`h-10 w-11/12 sm:h-12 lg:h-14 ${block} rounded-xl`} />
      <div className={`mt-3 h-10 w-2/3 sm:h-12 lg:h-14 ${block} rounded-xl`} />
    </div>
    <div className="flex w-full flex-col gap-3 lg:max-w-md lg:pb-2">
      <div className={`h-4 w-full ${block}`} />
      <div className={`h-4 w-11/12 ${block}`} />
      <div className={`h-4 w-3/4 ${block}`} />
    </div>
  </div>
);

const CampBody = () => (
  <>
    <div className="mb-16 grid grid-cols-3 border-y border-red-900/10 sm:mb-20">
      {[0, 1, 2].map((i) => (
        <div key={i} className={`py-6 sm:py-8 ${i > 0 ? 'border-l border-red-900/10 pl-4 sm:pl-8' : ''}`}>
          <div className={`h-9 w-16 sm:h-11 sm:w-24 ${block}`} />
          <div className={`mt-3 h-4 w-20 sm:w-28 ${block}`} />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`rounded-3xl border border-red-900/10 bg-white ${i === 1 ? 'hidden md:block' : i === 2 ? 'hidden lg:block' : ''}`}
        >
          <div className="m-2.5 aspect-[4/3] rounded-2xl bg-red-900/5" />
          <div className="space-y-3 p-6">
            <div className={`h-6 w-3/4 ${block}`} />
            <div className={`h-4 w-1/2 ${block}`} />
            <div className={`h-4 w-2/3 ${block}`} />
          </div>
        </div>
      ))}
    </div>
  </>
);

/** Rendered after the header section: the featured carousel sits in a full-width paper band. */
const GalleryBand = () => (
  <div aria-hidden="true" className="bg-paper px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
    <div className="mx-auto max-w-7xl motion-safe:animate-pulse">
      <div className="aspect-[4/3] rounded-3xl bg-red-900/5 sm:aspect-[21/9]" />
    </div>
  </div>
);

const DonationsBody = () => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:gap-5">
    <div className="min-h-[24rem] rounded-3xl border border-red-900/10 bg-white p-7 sm:p-8 md:col-span-8">
      <div className="h-11 w-11 rounded-full bg-paper" />
      <div className={`mt-6 h-7 w-1/2 ${block}`} />
      <div className="mt-6 space-y-5 border-t border-red-900/10 pt-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`h-5 ${i === 1 ? 'w-2/3' : 'w-5/6'} ${block}`} />
        ))}
      </div>
    </div>
    <div className="hidden min-h-[24rem] rounded-3xl bg-paper md:col-span-4 md:block" />
  </div>
);

const ContactBody = () => (
  <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
    <ul className="border-t border-red-900/10 lg:col-span-5">
      {[0, 1, 2, 3].map((i) => (
        <li key={i} className="flex items-center gap-4 border-b border-red-900/10 py-5">
          <div className="h-11 w-11 shrink-0 rounded-full bg-paper" />
          <div className="flex-1 space-y-2">
            <div className={`h-3 w-16 ${block}`} />
            <div className={`h-5 ${i % 2 ? 'w-1/2' : 'w-3/4'} ${block}`} />
          </div>
        </li>
      ))}
    </ul>
    <div className="min-h-[22rem] rounded-3xl border border-red-900/10 bg-paper lg:col-span-7 lg:min-h-[32rem]" />
  </div>
);

const SocialBody = () => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
    {[0, 1, 2, 3].map((i) => (
      <div key={i} className={`min-h-[19rem] rounded-3xl bg-red-900/5 sm:min-h-[21rem] ${i >= 2 ? 'hidden md:block' : ''}`} />
    ))}
  </div>
);

const bodies: Record<Variant, (() => React.ReactElement) | null> = {
  camp: CampBody,
  gallery: null,
  donations: DonationsBody,
  contact: ContactBody,
  social: SocialBody,
};

export default function PageSkeleton({ variant }: { variant: Variant }) {
  const Body = bodies[variant];
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading page</span>
      <section className={sectionClass[variant]}>
        {/* One pulse on the wrapper (not per block) keeps it to a single composited layer. */}
        <div aria-hidden="true" className="mx-auto max-w-7xl motion-safe:animate-pulse">
          <HeaderSkeleton />
          {Body && <Body />}
        </div>
      </section>
      {variant === 'gallery' && <GalleryBand />}
    </div>
  );
}
