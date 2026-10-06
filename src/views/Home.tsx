import { useState, useEffect } from "react";
import type { ComponentType, ReactNode } from "react";
import PreloadLink from "../components/PreloadLink";
import {
  ArrowRight,
  Heart,
  HeartPulse,
  HandHeart,
  Calendar,
  Activity,
  Ribbon,
  Eye,
  Image as ImageIcon,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { motion, MotionConfig, type Variants } from "framer-motion";
import Hero from "../components/Hero";
import CountUp from "../components/CountUp";
import {
  Accent,
  Eyebrow,
  SectionHeader,
  SectionLink,
  sectionItemVariants,
} from "../components/ui/Section";

import { Event, GalleryImage, ContactSettings } from "../types/sanity";
import { ImageLightbox } from "../components/GalleryComponents";
import FeaturedMosaic from "../components/gallery/FeaturedMosaic";
import EventCard from "../components/EventCard";
import { safeMapsEmbedUrl } from "../lib/maps";
import { IMPACT, IMPACT_LABELS } from "../lib/impact";

interface HomeProps {
  heroAnimationsReady?: boolean;
  /** Fetched on the server in app/page.tsx and passed down. */
  upcomingEvents?: Event[];
  pastEvents?: Event[];
  featuredImages?: GalleryImage[];
  contactSettings?: ContactSettings | null;
}

type IconType = ComponentType<{ className?: string; strokeWidth?: number }>;

interface FocusArea {
  title: string;
  description: string;
  image: string;
  /** Intrinsic [width, height] of the illustration, so the browser reserves its space. */
  size: [number, number];
  /** Height override for unusually wide or tall illustrations. */
  imageClass?: string;
  stats?: { label: string; value: string }[];
}

const TileIndex = ({ index, dark = false }: { index: number; dark?: boolean }) => (
  <span
    aria-hidden="true"
    className={`text-sm font-semibold tabular-nums ${
      dark ? "text-white/50" : "text-red-700/50"
    }`}
  >
    {String(index).padStart(2, "0")}
  </span>
);

const FocusTile = ({
  area,
  index,
  variants,
  className,
  wide = false,
  dark = false,
}: {
  area: FocusArea;
  index: number;
  variants: Variants;
  className: string;
  wide?: boolean;
  dark?: boolean;
}) => (
  <motion.article
    variants={variants}
    className={`group relative overflow-hidden rounded-3xl p-7 sm:p-8 flex ${
      wide ? "flex-row items-center gap-6" : "flex-col"
    } ${className}`}
  >
    <div className="flex flex-1 flex-col self-stretch">
      <div className="flex items-start justify-between gap-4">
        <TileIndex index={index} dark={dark} />
        {!wide && (
          <img
            src={area.image}
            alt=""
            aria-hidden="true"
            loading="lazy"
            width={area.size[0]}
            height={area.size[1]}
            className={`-mt-2 -mr-2 ${area.imageClass ?? "h-24 sm:h-28"} w-auto drop-shadow-xl transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6`}
          />
        )}
      </div>
      <div className={`mt-auto ${wide ? "pt-16" : "pt-6"}`}>
        <h3 className="font-display text-2xl font-bold tracking-tight">
          {area.title}
        </h3>
        <p
          className={`mt-2 leading-relaxed ${
            dark ? "text-white/75" : "text-gray-600"
          }`}
        >
          {area.description}
        </p>
      </div>
    </div>
    {wide && (
      <img
        src={area.image}
        alt=""
        aria-hidden="true"
        loading="lazy"
        width={area.size[0]}
        height={area.size[1]}
        className="h-40 sm:h-48 w-auto shrink-0 drop-shadow-xl transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6"
      />
    )}
  </motion.article>
);

const ContactRow = ({
  icon: Icon,
  label,
  href,
  children,
}: {
  icon: IconType;
  label: string;
  href?: string;
  children: ReactNode;
}) => {
  const content = (
    <>
      <span className="flex w-11 h-11 shrink-0 items-center justify-center rounded-full bg-paper text-red-700 transition-colors group-hover:bg-red-700 group-hover:text-white">
        <Icon className="w-5 h-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm text-gray-500">{label}</span>
        <span className="block font-medium text-gray-900 break-words">
          {children}
        </span>
      </span>
    </>
  );

  return (
    <li className="border-b border-red-900/10">
      {href ? (
        <a href={href} className="group flex items-center gap-4 py-4">
          {content}
        </a>
      ) : (
        <div className="group flex items-center gap-4 py-4">{content}</div>
      )}
    </li>
  );
};

const Home = ({
  heroAnimationsReady = true,
  upcomingEvents = [],
  pastEvents = [],
  featuredImages = [],
  contactSettings = null,
}: HomeProps) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isEventsVisible, setIsEventsVisible] = useState(false);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);

  // Trigger the events section reveal shortly after mount (the data is already in the HTML).
  useEffect(() => {
    const timeoutId = setTimeout(() => setIsEventsVisible(true), 200);
    return () => clearTimeout(timeoutId);
  }, []);

  // Intersection Observer for lazy loading the map
  useEffect(() => {
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) return;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          // Add a small delay to ensure other critical resources load first
          timeoutId = setTimeout(() => {
            setShouldLoadMap(true);
          }, 150);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '50px', // Reduced margin to prevent early loading that causes lag
        threshold: 0.1
      }
    );
    observer.observe(mapContainer);

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = sectionItemVariants;

  const keyAreas: FocusArea[] = [
    {
      title: "Blood Donation",
      description:
        "Our primary mission focuses on organizing blood donation camps, providing emergency blood support.",
      stats: [
        { label: "Camps every year", value: `${IMPACT.campsPerYear}+` },
        { label: "Emergency support", value: "24/7" },
      ],
      image: "/images/focus/blood-donation.webp",
      size: [440, 630],
    },
    {
      title: "Cancer Awareness",
      description:
        "Focus on cervical and breast cancer awareness with free testing camps.",
      image: "/images/focus/cancer-awareness.webp",
      size: [490, 800],
    },
    {
      title: "Thalassemia Support",
      description:
        `Free testing camps and comprehensive patient support for ${IMPACT.thalassemiaPatients}+ patients.`,
      image: "/images/focus/thalassemia.webp",
      size: [800, 742],
    },
    {
      title: "Eye Care",
      description: "Free eye checkups, cataract screening & operations.",
      image: "/images/focus/eye-care.webp",
      size: [800, 433],
      // Landscape (spectacles): shorter so it stays clear of the tile number.
      imageClass: "h-20 sm:h-24",
    },
  ];

  const [bloodDonation, cancerAwareness, thalassemia, eyeCare] = keyAreas;

  const impactStats = [
    {
      label: "Blood donation camps",
      value: IMPACT.campsPerYear,
      suffix: "+",
      unit: "every year",
      description:
        "Organised with blood centres and hospitals so supply never runs dry.",
      icon: HeartPulse,
    },
    {
      label: IMPACT_LABELS.emergenciesSupported,
      value: IMPACT.emergenciesSupported,
      suffix: "+",
      unit: "and counting",
      description:
        "Patients connected to blood when it mattered most, around the clock.",
      icon: Activity,
    },
    {
      label: IMPACT_LABELS.eyeCheckups,
      value: IMPACT.eyeCheckups,
      suffix: "+",
      unit: "completed",
      description:
        "Free screenings, cataract detection and operations for those in need.",
      icon: Eye,
    },
    {
      label: IMPACT_LABELS.womenReached,
      value: IMPACT.womenReached,
      suffix: "+",
      unit: "through awareness",
      description:
        "Cervical and breast cancer awareness, backed by free testing camps.",
      icon: Ribbon,
    },
  ];

  const yearsOfService = new Date().getFullYear() - IMPACT.foundedYear;
  const mapUrl = safeMapsEmbedUrl(contactSettings?.googleMapsUrl);

  const allEvents = [...upcomingEvents, ...pastEvents];
  const getEventVariant = (event: Event) =>
    upcomingEvents.some((e) => e._id === event._id) ? "upcoming" : "past";

  return (
    <MotionConfig reducedMotion="user">
    <div className="space-y-0 overflow-x-clip bg-white">
      <Hero startAnimations={heroAnimationsReady} />

      {/* Key Focus Areas */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            icon={HandHeart}
            eyebrow="What we do"
            title={
              <>
                Our key <Accent>focus</Accent>
              </>
            }
            description="We're dedicated to creating positive impact through these key initiatives."
          />

          <div className="grid grid-cols-1 md:grid-cols-4 md:auto-rows-[minmax(15rem,auto)] gap-4 lg:gap-5">
            {/* Blood Donation: feature tile */}
            <motion.article
              variants={itemVariants}
              className="group relative overflow-hidden rounded-3xl bg-red-950 text-white p-7 sm:p-10 md:col-span-2 md:row-span-2 flex flex-col"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -right-24 w-[28rem] h-[28rem] bg-[radial-gradient(closest-side,rgba(220,38,38,0.35),transparent)]"
              />
              <div className="relative flex items-start justify-between gap-4">
                <TileIndex index={1} dark />
                <img
                  src={bloodDonation.image}
                  alt=""
                  aria-hidden="true"
                  width={bloodDonation.size[0]}
                  height={bloodDonation.size[1]}
                  className="-mt-2 h-44 sm:h-56 lg:h-64 w-auto drop-shadow-[0_30px_60px_rgba(220,38,38,0.45)] transition-transform duration-700 group-hover:scale-105 group-hover:-rotate-3"
                />
              </div>
              <div className="relative mt-auto pt-8">
                <h3 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                  {bloodDonation.title}
                </h3>
                <p className="mt-4 text-lg text-white/70 leading-relaxed max-w-md">
                  {bloodDonation.description}
                </p>
                <dl className="mt-8 grid grid-cols-2 border-t border-white/15">
                  {bloodDonation.stats?.map((stat, i) => (
                    <div
                      key={stat.label}
                      className={`pt-5 ${i === 1 ? "pl-6 border-l border-white/15" : ""}`}
                    >
                      <dd className="font-display text-4xl font-bold tabular-nums">
                        {stat.value}
                      </dd>
                      <dt className="mt-1 text-sm text-white/60">{stat.label}</dt>
                    </div>
                  ))}
                </dl>
                <PreloadLink
                  href="/camp"
                  priority="high"
                  className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-red-900 rounded-md font-semibold hover:bg-red-100 transition-colors group/cta"
                >
                  Join Our Next Camp
                  <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform" />
                </PreloadLink>
              </div>
            </motion.article>

            {/* Cancer Awareness: wide tile */}
            <FocusTile
              area={cancerAwareness}
              index={2}
              variants={itemVariants}
              className="md:col-span-2 bg-paper"
              wide
            />

            {/* Thalassemia */}
            <FocusTile
              area={thalassemia}
              index={3}
              variants={itemVariants}
              className="md:col-span-1 bg-white border border-red-900/10"
            />

            {/* Eye Care */}
            <FocusTile
              area={eyeCare}
              index={4}
              variants={itemVariants}
              className="md:col-span-1 bg-red-700 text-white"
              dark
            />
          </div>
        </div>
      </motion.section>

      {/* Upcoming Events Section */}
      <motion.section
        initial="hidden"
        animate={isEventsVisible ? "visible" : "hidden"}
        variants={containerVariants}
        className="bg-paper px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            icon={Calendar}
            eyebrow="Events & Camps"
            title={
              <>
                Where you can <Accent>help</Accent>
              </>
            }
            description="Discover our recent activities and join us in upcoming events to be part of our mission to serve the community."
            action={<SectionLink href="/camp">View all events</SectionLink>}
          />

          {allEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {allEvents.slice(0, 3).map((event, i) => (
                <motion.div
                  key={event._id}
                  variants={itemVariants}
                  className={`flex ${i > 0 ? "hidden md:flex" : ""}`}
                >
                  <EventCard event={event} variant={getEventVariant(event)} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div variants={itemVariants} className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white border border-red-900/10 flex items-center justify-center">
                  <Calendar className="w-9 h-9 text-gray-400" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3 text-gray-900">
                  No events right now
                </h3>
                <p className="text-gray-600">
                  We don&apos;t have any events to display at the moment.
                  Please check back soon for new announcements.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Impact Statistics */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="relative bg-white px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Intro */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-5 lg:sticky lg:top-32 self-start"
            >
              <Eyebrow icon={Activity}>Our Impact</Eyebrow>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-gray-900">
                The change
                <br />
                we&apos;re <Accent>making</Accent>
              </h2>
              <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-md">
                With your support, we&apos;ve achieved significant milestones in
                our mission to transform lives.
              </p>

              <div className="mt-10 flex items-center gap-5">
                <span className="font-display text-6xl sm:text-7xl font-bold tracking-tight text-red-700 tabular-nums">
                  {yearsOfService}
                </span>
                <span className="text-gray-600 leading-snug">
                  <span className="block font-semibold text-gray-900">
                    years of service
                  </span>
                  and still showing up, since {IMPACT.foundedYear}
                </span>
              </div>

              <PreloadLink
                href="/donations"
                priority="medium"
                className="mt-10 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors group"
              >
                Support Our Work
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </PreloadLink>
            </motion.div>

            {/* Stats */}
            <ul className="lg:col-span-7 border-t border-red-900/10">
              {impactStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.li
                    key={stat.label}
                    variants={itemVariants}
                    className="group relative grid grid-cols-[2.5rem_1fr] sm:grid-cols-[3rem_1fr_auto] gap-x-4 sm:gap-x-6 py-8 sm:py-10 border-b border-red-900/10"
                  >
                    <span aria-hidden="true" className="pt-2 sm:pt-4 text-sm font-semibold text-red-700/50 tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <div className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 tabular-nums transition-colors duration-300 group-hover:text-red-700">
                        <CountUp
                          from={0}
                          to={stat.value}
                          duration={1}
                          separator=","
                        />
                        {stat.suffix}
                      </div>
                      <div className="mt-3 flex flex-wrap items-baseline gap-x-2">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                          {stat.label}
                        </h3>
                        <span className="text-sm font-medium text-red-700">
                          {stat.unit}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600 leading-relaxed max-w-md">
                        {stat.description}
                      </p>
                    </div>
                    <span className="hidden sm:flex w-14 h-14 items-center justify-center rounded-full border border-red-900/10 bg-paper text-red-700/50 transition-colors duration-300 group-hover:bg-red-700 group-hover:border-red-700 group-hover:text-white">
                      <Icon className="w-6 h-6" />
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Featured Gallery Showcase */}
      {featuredImages.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="bg-paper px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32"
        >
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              icon={ImageIcon}
              eyebrow="Featured Gallery"
              title={
                <>
                  Moments that <Accent>matter</Accent>
                </>
              }
              description="Take a glimpse at the remarkable moments we've captured during our journey of service."
              action={<SectionLink href="/gallery">View full gallery</SectionLink>}
            />

            <motion.div variants={itemVariants}>
              <FeaturedMosaic
                images={featuredImages}
                onImageClick={(image, index) => {
                  setSelectedImage(image);
                  setSelectedImageIndex(index);
                }}
              />
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Get Involved + Map */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="bg-white px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <motion.div variants={itemVariants} className="lg:col-span-5 flex flex-col">
            <Eyebrow icon={HandHeart}>Get Involved</Eyebrow>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05] text-gray-900">
              Join us in making a <Accent>difference</Accent>
            </h2>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Whether you want to donate, volunteer, or partner with us, your
              support can help transform lives and empower communities.
            </p>

            <ul className="mt-8 border-t border-red-900/10">
              {contactSettings?.phone && (
                <ContactRow icon={Phone} label="Call us" href={`tel:${contactSettings.phone}`}>
                  {contactSettings.phone}
                </ContactRow>
              )}
              {contactSettings?.email && (
                <ContactRow icon={Mail} label="Email us" href={`mailto:${contactSettings.email}`}>
                  {contactSettings.email}
                </ContactRow>
              )}
              {contactSettings?.address && (
                <ContactRow icon={MapPin} label="Visit us">
                  {contactSettings.address}
                </ContactRow>
              )}
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <PreloadLink
                href="/contact"
                priority="high"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors group"
              >
                Contact Us
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </PreloadLink>
              <PreloadLink
                href="/donations"
                priority="high"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-red-900/15 text-gray-900 rounded-md font-semibold hover:bg-paper transition-colors"
              >
                Donate Now
                <Heart className="w-4 h-4 text-red-700" />
              </PreloadLink>
            </div>
          </motion.div>

          {/* Google Map */}
          <motion.div variants={itemVariants} className="lg:col-span-7">
            <div
              id="map-container"
              className="relative h-full min-h-[22rem] lg:min-h-[32rem] overflow-hidden rounded-3xl border border-red-900/10 bg-paper"
            >
              {mapUrl && shouldLoadMap ? (
                <iframe
                  src={mapUrl}
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                  title="Rudhirsetu Location"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <MapPin className={`w-10 h-10 text-red-700/40 mx-auto mb-3 ${mapUrl ? "animate-pulse" : ""}`} />
                    <p className="text-gray-500">{mapUrl ? "Loading map..." : "Map unavailable"}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Lightbox */}
      {selectedImage && (
        <ImageLightbox
          selectedImage={selectedImage}
          images={featuredImages}
          selectedIndex={selectedImageIndex}
          onClose={() => {
            setSelectedImage(null);
          }}
          onPrev={() => {
            const newIndex =
              (selectedImageIndex - 1 + featuredImages.length) %
              featuredImages.length;
            setSelectedImage(featuredImages[newIndex]);
            setSelectedImageIndex(newIndex);
          }}
          onNext={() => {
            const newIndex = (selectedImageIndex + 1) % featuredImages.length;
            setSelectedImage(featuredImages[newIndex]);
            setSelectedImageIndex(newIndex);
          }}
        />
      )}
    </div>
    </MotionConfig>
  );
};

export default Home;
