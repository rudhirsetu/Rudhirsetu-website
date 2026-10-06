'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Camera } from 'lucide-react';
import { motion, MotionConfig } from 'framer-motion';
import { client } from '../lib/sanity';
import { QUERIES } from '../lib/queries';
import type { GalleryImage } from '../types/sanity';
import { FeaturedCarousel, ImageLightbox } from '../components/GalleryComponents';
import { GalleryGrid, GalleryGridSkeleton } from '../components/gallery/GalleryGrid';
import { CategoryFilter, type CategoryOption } from '../components/gallery/CategoryFilter';
import { Pagination } from '../components/gallery/Pagination';
import { formatCategory } from '../components/gallery/image-utils';
import { Accent, SectionHeader, sectionItemVariants } from '../components/ui/Section';

const IMAGES_PER_PAGE = 16;
const CATEGORY_ORDER = ['blood-donation', 'eye-care', 'cancer-awareness', 'thalassemia-support', 'other'];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const categoryOf = (image: GalleryImage) => (image.category || 'other').toLowerCase();

interface GalleryProps {
  /** Non-featured photos, fetched on the server. */
  initialImages: GalleryImage[];
  /** Featured photos, fetched on the server. */
  featuredImages: GalleryImage[];
  /** The server fetch failed: try again from the browser. */
  loadError?: boolean;
}

type LightboxState = { list: 'featured' | 'grid'; index: number } | null;

const StateMessage = ({
  illustration,
  size,
  title,
  children,
  action,
}: {
  illustration: string;
  size: [number, number];
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) => (
  <div className="mx-auto max-w-md py-12 text-center sm:py-16">
    <img
      src={illustration}
      alt=""
      aria-hidden="true"
      width={size[0]}
      height={size[1]}
      decoding="async"
      className="mx-auto mb-8 h-40 w-auto"
    />
    <h2 className="font-display text-2xl font-bold tracking-tight text-gray-900">{title}</h2>
    <p className="mt-3 text-gray-600">{children}</p>
    {action && <div className="mt-8">{action}</div>}
  </div>
);

const Gallery = ({ initialImages, featuredImages, loadError = false }: GalleryProps) => {
  const [fetched, setFetched] = useState<{ images: GalleryImage[]; featured: GalleryImage[] } | null>(null);
  const [status, setStatus] = useState<'ready' | 'loading' | 'error'>(loadError ? 'loading' : 'ready');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [lightbox, setLightbox] = useState<LightboxState>(null);
  const gridTopRef = useRef<HTMLDivElement>(null);

  const images = fetched?.images ?? initialImages;
  const featured = fetched?.featured ?? featuredImages;
  const hasFeatured = featured.length > 0;
  const totalPhotos = images.length + featured.length;

  // Browser fallback, only used when the server fetch failed. Status starts as
  // 'loading' in that case; the retry button sets it itself before calling this.
  const loadInBrowser = useCallback(
    (isCancelled: () => boolean = () => false) =>
      Promise.all([
        client.fetch<GalleryImage[]>(QUERIES.galleryImages),
        client.fetch<GalleryImage[]>(QUERIES.featuredImages),
      ]).then(
        ([grid, feat]) => {
          if (isCancelled()) return;
          setFetched({ images: grid || [], featured: feat || [] });
          setStatus('ready');
        },
        (err) => {
          if (isCancelled()) return;
          console.error('Error loading gallery images:', err);
          setStatus('error');
        },
      ),
    [],
  );

  useEffect(() => {
    if (!loadError) return;
    let cancelled = false;
    void loadInBrowser(() => cancelled);
    return () => {
      cancelled = true;
    };
  }, [loadError, loadInBrowser]);

  // Categories that actually have photos, with counts.
  const categoryOptions = useMemo<CategoryOption[]>(() => {
    const counts = new Map<string, number>();
    images.forEach((image) => counts.set(categoryOf(image), (counts.get(categoryOf(image)) ?? 0) + 1));
    const rank = (id: string) => {
      const i = CATEGORY_ORDER.indexOf(id);
      return i === -1 ? CATEGORY_ORDER.length : i;
    };
    const categories = [...counts.keys()]
      .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
      .map((id) => ({ id, label: formatCategory(id), count: counts.get(id) ?? 0 }));
    return [{ id: 'all', label: 'All photos', count: images.length }, ...categories];
  }, [images]);

  const activeCategory = categoryOptions.some((o) => o.id === selectedCategory) ? selectedCategory : 'all';

  const filteredImages = useMemo(
    () => (activeCategory === 'all' ? images : images.filter((image) => categoryOf(image) === activeCategory)),
    [images, activeCategory],
  );

  const totalPages = Math.max(1, Math.ceil(filteredImages.length / IMAGES_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * IMAGES_PER_PAGE;
  const pageImages = filteredImages.slice(pageStart, pageStart + IMAGES_PER_PAGE);

  const handleCategoryChange = (id: string) => {
    setSelectedCategory(id);
    setPage(1);
  };

  const handlePageChange = (next: number) => {
    setPage(next);
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    gridTopRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  // Lightbox navigation
  const lightboxImages = lightbox?.list === 'featured' ? featured : filteredImages;
  const lightboxImage = lightbox ? (lightboxImages[lightbox.index] ?? null) : null;
  const stepLightbox = (delta: number) =>
    setLightbox((current) =>
      current
        ? { ...current, index: (current.index + delta + lightboxImages.length) % lightboxImages.length }
        : current,
    );

  return (
    <MotionConfig reducedMotion="user">
      {/* Page header */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`bg-white px-4 pt-28 sm:px-6 sm:pt-36 lg:px-8 lg:pt-40 ${
          hasFeatured ? 'pb-4 sm:pb-8' : 'pb-0'
        }`}
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            as="h1"
            icon={Camera}
            eyebrow="Photo gallery"
            title={
              <>
                Our <Accent>gallery</Accent>
              </>
            }
            description="Take a look at the moments we've captured while serving our community through healthcare initiatives, blood donation drives and awareness camps."
            action={
              totalPhotos > 0 ? (
                <p className="flex items-center gap-4">
                  <span className="font-display text-5xl font-bold tabular-nums tracking-tight text-red-700">
                    {totalPhotos}
                  </span>
                  <span className="leading-snug text-gray-600">
                    <span className="block font-semibold text-gray-900">photos</span>
                    from camps and drives
                  </span>
                </p>
              ) : undefined
            }
          />
        </div>
      </motion.section>

      {/* Featured photos */}
      {hasFeatured && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
          className="bg-paper px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <h2 className="sr-only">Featured photos</h2>
            <motion.div variants={sectionItemVariants}>
              <FeaturedCarousel
                featuredImages={featured}
                onImageClick={(_image, index) => setLightbox({ list: 'featured', index })}
                aspectRatio="md:aspect-[21/9] aspect-[7/9]"
                priority
              />
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* All photos */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={containerVariants}
        className={`bg-white px-4 sm:px-6 lg:px-8 ${
          hasFeatured ? 'py-20 sm:py-24 lg:py-32' : 'pb-20 sm:pb-24 lg:pb-32'
        }`}
      >
        <div ref={gridTopRef} className="mx-auto max-w-7xl scroll-mt-28">
          <h2 className="sr-only">All photos</h2>

          {status === 'loading' && <GalleryGridSkeleton />}

          {status === 'error' && (
            <StateMessage
              illustration="/images/illustrations/not-found.webp"
              size={[530, 720]}
              title="We couldn't load the gallery"
              action={
                <button
                  type="button"
                  onClick={() => {
                    setStatus('loading');
                    void loadInBrowser();
                  }}
                  className="inline-flex items-center justify-center rounded-md bg-red-600 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-red-700"
                >
                  Try again
                </button>
              }
            >
              Something went wrong while fetching the photos. Please check your connection and try again.
            </StateMessage>
          )}

          {status === 'ready' && images.length === 0 && (
            <StateMessage
              illustration="/images/illustrations/empty-gallery.webp"
              size={[720, 589]}
              title="No photos yet"
            >
              {hasFeatured
                ? 'The rest of our archive is on its way. Check back soon.'
                : 'We are still putting the gallery together. Please check back soon.'}
            </StateMessage>
          )}

          {status === 'ready' && images.length > 0 && (
            <>
              <motion.div
                variants={sectionItemVariants}
                className="mb-8 flex flex-col gap-5 sm:mb-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10"
              >
                <CategoryFilter
                  options={categoryOptions}
                  selected={activeCategory}
                  onChange={handleCategoryChange}
                />
                <p className="shrink-0 text-sm tabular-nums text-gray-500" aria-live="polite">
                  Showing{' '}
                  <span className="font-semibold text-gray-900">
                    {pageStart + 1}&ndash;{pageStart + pageImages.length}
                  </span>{' '}
                  of <span className="font-semibold text-gray-900">{filteredImages.length}</span>{' '}
                  {filteredImages.length === 1 ? 'photo' : 'photos'}
                </p>
              </motion.div>

              <motion.div variants={sectionItemVariants}>
                <GalleryGrid
                  images={pageImages}
                  eagerCount={!hasFeatured && currentPage === 1 ? 4 : 0}
                  onOpen={(index) => setLightbox({ list: 'grid', index: pageStart + index })}
                />
              </motion.div>

              <Pagination page={currentPage} totalPages={totalPages} onChange={handlePageChange} />
            </>
          )}
        </div>
      </motion.section>

      {lightbox && lightboxImage && (
        <ImageLightbox
          selectedImage={lightboxImage}
          images={lightboxImages}
          selectedIndex={lightbox.index}
          onClose={() => setLightbox(null)}
          onPrev={() => stepLightbox(-1)}
          onNext={() => stepLightbox(1)}
        />
      )}
    </MotionConfig>
  );
};

export default Gallery;
