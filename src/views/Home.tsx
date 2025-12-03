import { useState, useEffect } from "react";
import PreloadLink from "../components/PreloadLink";
import {
  ArrowRight,
  Heart,
  Calendar,
  ExternalLink,
  Activity,
  Zap,
  Award,
  Image,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import Hero from "../components/Hero";

interface HomeProps {
  heroAnimationsReady?: boolean;
}
import CountUp from "../components/CountUp";

import { Event, GalleryImage, ContactSettings } from "../types/sanity";
import { eventService, settingsService } from "../services/sanity-client";
import {
  FeaturedCarousel,
  ImageLightbox,
} from "../components/GalleryComponents";
import { client } from "../lib/sanity";
import { QUERIES } from "../lib/sanity";
import EventCard from "../components/EventCard";
import SpotlightCard from "../components/SpotlightCard";

const Home = ({ heroAnimationsReady = true }: HomeProps) => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [featuredImages, setFeaturedImages] = useState<GalleryImage[]>([]);
  const [
    contactSettings,
    setContactSettings,
  ] = useState<ContactSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isEventsVisible, setIsEventsVisible] = useState(false);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load critical data first (events for main content)
        const loadCriticalData = async () => {
          try {
            const [eventsData, pastData] = await Promise.all([
              eventService.fetchUpcoming(1, 3),
              eventService.fetchPast(1, 3),
            ]);

            if (eventsData && eventsData.data) {
              setUpcomingEvents(eventsData.data);
            } else {
              console.warn("Failed to load upcoming events");
            }

            if (pastData && pastData.data) {
              setPastEvents(pastData.data);
            } else {
              console.warn("Failed to load past events");
            }
          } catch (err) {
            console.error("Error loading events:", err);
            setError("Failed to load events. Please refresh the page.");
            // Still show events section even if there's an error
            setTimeout(() => {
              setIsEventsVisible(true);
            }, 200);
          }
        };

        // Load critical data first
        await loadCriticalData();
        
        setLoading(false);
        
        // Trigger events section animation after critical loading completes
        setTimeout(() => {
          setIsEventsVisible(true);
        }, 200);

        // Load non-critical data after main content is ready (deferred)
        const loadDeferredData = async () => {
          const loadImages = async () => {
            try {
              const imagesData = await client.fetch(QUERIES.featuredImages);
              if (imagesData) {
                setFeaturedImages(imagesData || []);
              }
            } catch (err) {
              console.error("Error loading images:", err);
              // Images are less critical, don't show error for this
            }
          };

          const loadContact = async () => {
            try {
              const contactData = await settingsService.fetchContact();
              if (contactData) {
                setContactSettings(contactData);
              }
            } catch (err) {
              console.error("Error loading contact settings:", err);
              // Contact info is less critical, don't show error for this
            }
          };

          // Load non-critical data in parallel but separately from critical data
          await Promise.allSettled([loadImages(), loadContact()]);
        };

        // Defer non-critical data loading
        setTimeout(() => {
          loadDeferredData();
        }, 300);

      } catch (err) {
        console.error("Error loading data:", err);
        setError("Something went wrong. Please refresh the page.");
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Intersection Observer for lazy loading the map
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !shouldLoadMap) {
          // Add a small delay to ensure other critical resources load first
          setTimeout(() => {
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

    // Find the map container element
    const mapContainer = document.getElementById('map-container');
    if (mapContainer) {
      observer.observe(mapContainer);
    }

    return () => observer.disconnect();
  }, [shouldLoadMap]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0.75 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0.75, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0.75, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.75 },
    },
  };

  const keyAreas = [
    {
      title: "Blood Donation",
      description:
        "Monthly camps and emergency support with blood centers & hospitals",
      extendedDescription:
        "Our primary mission focuses on organizing blood donation camps, providing emergency blood support.",
      stats: [
        { label: "Blood Donation Camps", value: "50+" },
        { label: "Emergency Support", value: "24/7" },
      ],
      icon: <Heart className="w-12 h-12 text-red-500" />,
      color: "bg-red-50",
      accentColor: "border-red-200",
      spotlightColor: "rgba(239, 68, 68, 0.2)",
      gridClass: "md:col-span-2 md:row-span-2",
    },
    {
      title: "Cancer Awareness",
      description:
        "Focus on cervical and breast cancer awareness with free testing camps",
      icon: <Award className="w-10 h-10 text-purple-500" />,
      color: "bg-purple-50",
      accentColor: "border-purple-200",
      spotlightColor: "rgba(168, 85, 247, 0.2)",
      gridClass: "md:col-span-2",
    },
    {
      title: "Thalassemia Support",
      description:
        "Free testing camps and comprehensive patient support for 68+ patients",
      icon: <Activity className="w-10 h-10 text-emerald-500" />,
      color: "bg-emerald-50",
      accentColor: "border-emerald-200",
      spotlightColor: "rgba(34, 197, 94, 0.2)",
      gridClass: "md:col-span-1",
    },
    {
      title: "Eye Care",
      description: "Free eye checkups, cataract screening & operations",
      icon: <Zap className="w-10 h-10 text-blue-500" />,
      color: "bg-blue-50",
      accentColor: "border-blue-200",
      spotlightColor: "rgba(59, 130, 246, 0.2)",
      gridClass: "md:col-span-1",
    },
  ];

  const impactStats = [
    {
      label: "Blood Donation Camps",
      value: 50,
      suffix: "+",
      subtext: "Annually",
      color: "from-red-500 to-red-600",
      duration: 0.4,
    },
    {
      label: "Emergencies Supported",
      value: 9800,
      suffix: "+",
      subtext: "And counting",
      color: "from-orange-500 to-red-500",
      duration: 0.1,
    },
    {
      label: "Eye Checkups",
      value: 15000,
      suffix: "+",
      subtext: "Completed",
      color: "from-emerald-500 to-emerald-600",
      duration: 0.1,
    },
    {
      label: "Cancer Awareness",
      value: 20000,
      suffix: "+",
      subtext: "Women reached",
      color: "from-indigo-500 to-indigo-600",
      duration: 0.1,
    },
  ];

  return (
    <div className="space-y-0 overflow-x-hidden bg-white">
      <Hero startAnimations={heroAnimationsReady} />

      {/* Key Focus Areas */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="mx-auto md:mx-16 px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden"
      >
        <div className="relative z-10 ">
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center text-center max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20"
          >
            <h2 className="text-black font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6 sm:mb-7 md:mb-8">
              Our Key Focus
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-xl text-gray-600 leading-relaxed max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl px-4 sm:px-0">
              We&apos;re dedicated to creating positive impact through these key
              initiatives
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8 auto-rows-fr">
            {keyAreas.map((area) => (
              <motion.div
                key={area.title}
                variants={itemVariants}
                className={`h-full ${area.gridClass}`}
              >
                <SpotlightCard
                  className={`h-full min-h-[240px] sm:min-h-[260px] md:min-h-[280px] ${
                    area.title === "Blood Donation"
                      ? "lg:min-h-[380px] xl:min-h-[400px] flex flex-col relative"
                      : area.title === "Cancer Awareness"
                      ? "flex flex-col relative"
                      : ""
                  }`}
                  spotlightColor={area.spotlightColor}
                >
                  <div className="mb-6">{area.icon}</div>

                  {area.title === "Blood Donation" ? (
                    <>
                      <div className="absolute hidden md:block bottom-50 left-30 scale-[3] opacity-10 pointer-events-none z-0">
                        <svg
                          width="100"
                          height="100"
                          viewBox="0 0 94.006 94.005"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-red-500"
                        >
                          <path d="M94.006,35.071c0,2.673-0.438,5.31-1.288,7.845c-3.993,18.067-38.521,39.923-39.99,40.853c-0.459,0.285-0.974,0.434-1.499,0.434c-0.524,0-1.046-0.132-1.505-0.434c-0.395-0.257-10.123-6.396-19.986-14.834c-1.181-1.018-1.305-2.774-0.314-3.95c1.015-1.166,2.769-1.308,3.952-0.317c7.352,6.281,14.782,11.359,17.867,13.405c10.37-6.761,33.263-23.962,36.069-36.648c0.733-2.241,1.064-4.279,1.064-6.348c0-7.202-3.921-13.841-10.235-17.319c-8.063-4.474-18.856-2.411-24.755,4.7c-1.06,1.284-3.24,1.284-4.32,0c-5.917-7.116-16.702-9.163-24.754-4.708c-6.334,3.486-10.255,10.121-10.255,17.316c0,2.055,0.348,4.102,0.996,6.079c0.416,1.85,1.212,3.659,2.225,5.536h16.356l5.617-12.909c0.481-1.105,1.63-1.8,2.812-1.676c1.204,0.105,2.208,0.971,2.476,2.147l4.135,17.482l5.349-8.771c0.504-0.833,1.411-1.342,2.391-1.342h10.151c1.545,0,2.801,1.251,2.801,2.803c0,1.544-1.256,2.802-2.801,2.802h-8.578l-8.058,13.236c-0.514,0.844-1.42,1.348-2.383,1.348c-0.153,0-0.301-0.012-0.438-0.033c-1.129-0.181-2.018-1.013-2.289-2.118L41.04,43.726l-2.986,6.873c-0.446,1.033-1.457,1.685-2.572,1.685H2.802C1.268,52.283,0,51.029,0,49.482c0-1.544,1.268-2.802,2.802-2.802h8.217c-0.583-1.391-1.054-2.741-1.346-4.047c-0.782-2.268-1.205-4.909-1.205-7.568c0-9.242,5.026-17.751,13.147-22.225c9.406-5.203,21.853-3.567,29.626,3.737c7.752-7.305,20.19-8.94,29.612-3.737C88.964,17.308,94.006,25.823,94.006,35.071z"/>
                        </svg>
                      </div>

                      <div className="flex-grow z-10 relative">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                          {area.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-lg mb-6">
                          {area.extendedDescription}
                        </p>
                      </div>

                      <div className="mt-auto space-y-6 z-10 relative">
                        <div className="hidden md:grid grid-cols-2 gap-4">
                          {area.stats?.map((stat) => (
                            <div
                              key={stat.label}
                              className="text-center p-4 bg-red-50/50 rounded-xl border border-red-200/50"
                            >
                              <div className="text-2xl font-bold text-red-600 mb-1">
                                {stat.value}
                              </div>
                              <div className="text-sm text-gray-600">
                                {stat.label}
                              </div>
                            </div>
                          ))}
                        </div>

                        <PreloadLink
                          href="/camp"
                          priority="high"
                          className="hidden md:inline-flex items-center justify-center w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors duration-200 group border border-red-600"
                        >
                          <span>Join Our Next Camp</span>
                          <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                        </PreloadLink>
                      </div>
                    </>
                  ) : area.title === "Cancer Awareness" ? (
                    <>
                      {/* Cancer Ribbon SVG positioned to the right */}
                      <div className="absolute hidden md:block bottom-20 right-24 scale-400 opacity-30 pointer-events-none z-[-1]">
                        <svg
                          width="80"
                          height="44"
                          viewBox="0 0 489 267"
                          fill="transparent"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-purple-500"
                          strokeWidth={2}
                        >
                          <path
                            d="M0 0 C161.37 0 322.74 0 489 0 C489 88.11 489 176.22 489 267 C327.63 267 166.26 267 0 267 C0 178.89 0 90.78 0 0 Z "
                            fill="transparent"
                          />
                          <path
                            d="M0 0 C8.8178217 8.97847027 11.88372616 25.97400988 13 38 C13.16048828 39.50046875 13.16048828 39.50046875 13.32421875 41.03125 C13.91070178 51.35335127 10.42541246 60.43012097 7 70 C6.60554688 71.15757813 6.21109375 72.31515625 5.8046875 73.5078125 C3.18184933 80.82608125 -0.27458202 87.53920598 -4.1418457 94.26611328 C-4.5255835 94.95302246 -4.90932129 95.63993164 -5.3046875 96.34765625 C-5.8303833 97.26043335 -5.8303833 97.26043335 -6.36669922 98.19165039 C-7.18593728 100.53093192 -6.85459567 101.69954434 -6 104 C-4.65413709 105.9670304 -3.22377013 107.87688571 -1.75 109.75 C-1.30962402 110.31146729 -0.86924805 110.87293457 -0.41552734 111.45141602 C1.04732889 113.30827429 2.52203897 115.15514577 4 117 C4.51208008 117.64114746 5.02416016 118.28229492 5.55175781 118.94287109 C9.32867979 123.66110748 13.15102575 128.34041365 17 133 C17.52416504 133.63679687 18.04833008 134.27359375 18.58837891 134.9296875 C33.663667 153.16950892 54.99244076 172.75222027 79 178 C82.65224305 177.6679779 84.32250592 176.0289195 86.8125 173.4375 C87.51117188 172.71175781 88.20984375 171.98601562 88.9296875 171.23828125 C91.38860445 168.57986727 93.78734302 165.87882666 96.15234375 163.13671875 C99.70244217 159.03121382 103.33647254 155.00432072 107 151 C107.58652344 150.34644531 108.17304688 149.69289062 108.77734375 149.01953125 C114.21780898 143.22063537 121.6887515 137.32690849 129.87573242 136.82299805 C132.97615761 136.76839854 136.07613413 136.72342477 139.17700195 136.70483398 C141.16315908 136.68770986 143.14902687 136.64382424 145.13476562 136.59960938 C155.29395892 136.53253497 161.46720307 138.02387055 168.71630859 145.16186523 C169.22242676 145.68594971 169.72854492 146.21003418 170.25 146.75 C170.79865723 147.3056665 171.34731445 147.86133301 171.91259766 148.43383789 C176.69189791 153.40548753 180.826888 158.79708669 184.77832031 164.44238281 C188.49617616 169.67600028 192.65070176 175.02312135 199 176.875 C204.9005458 175.15400747 207.91560676 169.81898221 210.9375 164.75 C213.39645311 156.07134197 212.70458592 148.9552337 208.38671875 141.05859375 C207.08488357 138.96690074 207.08488357 138.96690074 205.33203125 137.41015625 C204 136 204 136 204 133 C222.37593985 132.45864662 222.37593985 132.45864662 230 135 C235.54092966 140.75293044 236.42077444 145.28629389 236.35913086 153.14916992 C236.07074686 163.16538565 232.34186451 169.6322268 225.50390625 176.796875 C213.65112251 187.22584541 197.81162876 185.69939485 183 185 C170.56093548 183.552456 163.66835323 177.41557295 156 168 C155.195625 167.05125 154.39125 166.1025 153.5625 165.125 C152 163 152 163 152 161 C151.34 161 150.68 161 150 161 C148.2734375 159.03125 148.2734375 159.03125 146.375 156.5 C145.74335938 155.6646875 145.11171875 154.829375 144.4609375 153.96875 C143.73777344 152.99421875 143.73777344 152.99421875 143 152 C138.16615326 153.43408383 135.32767396 156.35818123 131.95703125 159.92578125 C130.78868627 161.12722042 129.62005723 162.32838343 128.45117188 163.52929688 C126.63441231 165.41400466 124.82197396 167.30256527 123.01538086 169.19702148 C113.17886603 179.47801802 105.08411759 185.9384114 90.6875 188.3125 C89.72054199 188.47637207 88.75358398 188.64024414 87.75732422 188.80908203 C70.09957693 191.47876194 48.77836312 193.36751332 32.625 184.4375 C31.98216064 184.08743896 31.33932129 183.73737793 30.67700195 183.37670898 C24.53458485 179.9229846 19.24244173 175.69984502 14 171 C13.10152344 170.20980469 12.20304687 169.41960937 11.27734375 168.60546875 C-0.17618593 158.43392472 -10.78238808 147.38819508 -19.87768555 135.05078125 C-22.01926368 132.05749651 -22.01926368 132.05749651 -25 130 C-25.23460937 130.67804688 -25.46921875 131.35609375 -25.7109375 132.0546875 C-27.30034859 135.68625101 -29.40339642 138.86078163 -31.625 142.125 C-32.29486938 143.11632935 -32.29486938 143.11632935 -32.97827148 144.12768555 C-39.44087505 153.64588273 -46.09221553 162.61774846 -54 171 C-54.87785156 171.95712891 -54.87785156 171.95712891 -55.7734375 172.93359375 C-60.94178181 178.38098012 -66.83201319 183.38694962 -73.88671875 186.1171875 C-77.47197304 185.98223439 -77.89755056 185.55676172 -80.359375 183.140625 C-81.50898676 181.86091861 -82.63870417 180.56311737 -83.75 179.25 C-84.32621094 178.60289062 -84.90242188 177.95578125 -85.49609375 177.2890625 C-92 169.92100087 -92 169.92100087 -92 166 C-89.8046875 164.1328125 -89.8046875 164.1328125 -86.875 162.125 C-85.86566406 161.4134375 -84.85632813 160.701875 -83.81640625 159.96875 C-82.42228516 158.99421875 -82.42228516 158.99421875 -81 158 C-75.28937905 153.74502753 -71.26983949 148.63913285 -67 143 C-66.36288086 142.15937012 -66.36288086 142.15937012 -65.71289062 141.30175781 C-50.68196669 123.74023911 -50.68196669 123.74023911 -43.20703125 103.62109375 C-44.14360506 100.52532515 -45.52616799 98.32483927 -47.3125 95.625 C-51.35421455 89.31184569 -54.89260434 82.76028334 -58.375 76.125 C-58.89876221 75.13838379 -59.42252441 74.15176758 -59.9621582 73.13525391 C-68.04474742 57.61784121 -68.61714548 38.34959392 -64.3125 21.375 C-63.60214305 19.22902655 -62.83669507 17.09994057 -62 15 C-61.62617187 14.030625 -61.25234375 13.06125 -60.8671875 12.0625 C-57.78456155 5.03982895 -54.29787205 2.03795811 -47.50390625 -1.18359375 C-34.43066645 -6.20107888 -12.32178914 -7.587211 0 0 Z "
                            fill="#d4bbff"
                            transform="translate(190,47)"
                          />
                        </svg>
                      </div>

                      <div className="flex-grow">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">
                          {area.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {area.extendedDescription || area.description}
                        </p>
                      </div>
                    </>
                  ) : area.title === "Thalassemia Support" ? (
                    <>
                      {/* Thalassemia Blood Cell SVG */}
                      <div className="absolute hidden md:block -top-8 -right-0 scale-[2.5] opacity-10 pointer-events-none z-0">
                        <svg
                          width="100"
                          height="100"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-emerald-500"
                          strokeWidth={1}
                        >
                          {/* Cell 1 */}
                          <path d="M17 10c2.76 0 5-2.24 5-5s-2.24-5-5-5s-5 2.24-5 5S14.24 10 17 10z M17 3c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2S15.9 3 17 3z"/>
                          {/* Cell 2 */}
                          <path d="M7 16c3.31 0 6-2.69 6-6s-2.69-6-6-6S1 6.69 1 10S3.69 16 7 16z M7 7c1.66 0 3 1.34 3 3s-1.34 3-3 3s-3-1.34-3-3S5.34 7 7 7z"/>
                          {/* Cell 3 */}
                          <path d="M16 24c3.31 0 6-2.69 6-6s-2.69-6-6-6s-6 2.69-6 6S12.69 24 16 24z M16 15c1.66 0 3 1.34 3 3s-1.34 3-3 3s-3-1.34-3-3S14.34 15 16 15z"/>
                        </svg>
                      </div>
                      <div className="z-10 relative">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">
                          {area.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {area.extendedDescription || area.description}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {area.title === "Eye Care" && (
                        <div className="absolute hidden md:block -bottom-4 -right-2 scale-[2] opacity-10 pointer-events-none z-0">
                          <svg
                            width="100"
                            height="100"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-blue-500"
                          >
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                          </svg>
                        </div>
                      )}
                      
                      <div className="z-10 relative">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">
                          {area.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {area.description}
                        </p>
                      </div>
                    </>
                  )}
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Upcoming Events Section */}
      <motion.section
        initial="hidden"
        animate={isEventsVisible ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-24 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.div
            variants={itemVariants}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-black font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6 sm:mb-7 md:mb-8">
              Events & Camps
            </h2>
            <p className="text-xl text-gray-600">
              Discover our recent activities and join us in upcoming events to
              be part of our mission to serve the community.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="animate-pulse bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
                >
                  <div className="h-64 bg-white" />
                  <div className="p-8 space-y-4">
                    <div className="h-6 bg-white rounded w-3/4" />
                    <div className="h-4 bg-white rounded w-1/2" />
                    <div className="h-4 bg-white rounded w-full" />
                    <div className="h-10 bg-white rounded" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : error ? (
            <motion.div variants={itemVariants} className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-red-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                  Failed to Load Events
                </h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-md font-medium border border-red-600 hover:bg-red-700 transition-colors duration-200"
                >
                  Refresh Page
                </button>
              </div>
            </motion.div>
          ) : (
            (() => {
              // Combine and prioritize upcoming events first, then past events
              const allEvents = [...upcomingEvents, ...pastEvents];
              const mobileEvents = allEvents.slice(0, 1); // Latest 1 event for mobile
              const desktopEvents = allEvents.slice(0, 3); // Latest 3 events for desktop

              return allEvents.length > 0 ? (
                <>
                  {/* Mobile: Show 1 event */}
                  <div className="grid grid-cols-1 gap-8 md:hidden">
                    {mobileEvents.map((event) => (
                      <motion.div 
                        key={event._id} 
                        variants={itemVariants}
                      >
                        <EventCard
                          event={event}
                          variant={
                            upcomingEvents.some((e) => e._id === event._id)
                              ? "upcoming"
                              : "past"
                          }
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Desktop: Show 3 events */}
                  <div className="hidden md:grid md:grid-cols-3 gap-8 items-stretch">
                    {desktopEvents.map((event) => (
                      <motion.div 
                        key={event._id} 
                        variants={itemVariants}
                        className="flex"
                      >
                        <EventCard
                          event={event}
                          variant={
                            upcomingEvents.some((e) => e._id === event._id)
                              ? "upcoming"
                              : "past"
                          }
                        />
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-16"
                >
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white flex items-center justify-center">
                      <Calendar className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                      No Events Available
                    </h3>
                    <p className="text-gray-600 mb-6">
                      We don&apos;t have any events to display at the moment.
                      Please check back soon for new announcements.
                    </p>
                  </div>
                </motion.div>
              );
            })()
          )}

          <motion.div variants={itemVariants} className="text-center mt-16">
            <PreloadLink
              href="/camp"
              priority="high"
              className="inline-flex items-center justify-center px-8 py-4 bg-red-600 text-white rounded-md font-medium border border-red-600 hover:bg-red-700 transition-colors duration-300 group"
            >
              <span>View All Events</span>
              <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
            </PreloadLink>
          </motion.div>
        </div>
      </motion.section>

      {/* Impact Statistics */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-24 text-white relative overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/rudhirsetu-bg.webp"
            alt="Impact Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={itemVariants}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <span className="px-4 py-1.5 bg-white/10 text-white text-sm font-medium rounded-full mb-6 inline-flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Our Impact
            </span>
            <h2 className="text-4xl font-bold mb-6">
              The Change We&apos;re Making
            </h2>
            <p className="text-xl text-white/90">
              With your support, we&apos;ve achieved significant milestones in
              our mission to transform lives
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div className="bg-white/10 rounded-xl p-6 border border-white/10 hover:border-white/30 transition-all h-full backdrop-blur-sm">
                  <h3 className="text-4xl sm:text-5xl font-bold mb-3 text-white">
                    <CountUp
                      from={0}
                      to={stat.value}
                      duration={stat.duration}
                      delay={0}
                      separator=","
                      className="text-white"
                    />
                    {stat.suffix}
                  </h3>
                  <div className="text-xl font-semibold mb-1 text-white">
                    {stat.label}
                  </div>
                  <div className="text-white/70">{stat.subtext}</div>
                </div>
              </motion.div>
            ))}
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
          className="py-24 bg-white"
        >
          <div className="container mx-auto px-4">
            <motion.div
              variants={itemVariants}
              className="text-center mb-16 max-w-3xl mx-auto"
            >
              <span className="px-4 py-1.5 bg-red-100 text-red-900 text-sm font-medium rounded-full mb-6 inline-flex items-center">
                <Image className="w-4 h-4 mr-2" />
                Featured Gallery
              </span>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                Moments That Matter
              </h2>
              <p className="text-xl text-gray-600">
                Take a glimpse at the remarkable moments we&apos;ve captured
                during our journey of service
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-16">
              <FeaturedCarousel
                featuredImages={featuredImages}
                onImageClick={(image, index) => {
                  setSelectedImage(image);
                  setSelectedImageIndex(index);
                }}
                aspectRatio="md:aspect-[21/9] aspect-[7/9]"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <PreloadLink
                href="/gallery"
                priority="medium"
                className="inline-flex items-center justify-center px-8 py-4 bg-red-600 text-white rounded-md font-medium border border-red-600 hover:bg-red-700 transition-colors duration-300 group"
              >
                <span>View Full Gallery</span>
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
              </PreloadLink>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Call to Action - EventCard Style */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="container mx-auto px-4 py-20 md:py-24"
      >
        <motion.div variants={fadeInUpVariants} className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200/40 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Content Section */}
              <div className="flex-1 flex flex-col">
                {/* Title Section */}
                <div className="p-8 md:p-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 hover:text-[#9B2C2C] transition-colors duration-300">
                    Join Us in Making a Difference!
                  </h2>
                </div>

                {/* Divider */}
                <div className="mx-8 md:mx-10">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                </div>

                {/* Contact Details Section */}
                <div className="px-8 md:px-10 py-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contactSettings?.phone && (
                      <div className="flex items-center text-gray-700 p-6 rounded-lg border border-gray-100 bg-white/50">
                        <Phone className="min-w-8 min-h-8 mr-4 text-[#9B2C2C]" />
                        <span className="text-lg font-medium">
                          {contactSettings.phone}
                        </span>
                      </div>
                    )}
                    {contactSettings?.email && (
                      <div className="flex items-center overflow-wrap text-gray-700 p-6 rounded-lg border border-gray-100 bg-white/50">
                        <Mail className="min-w-8 min-h-8 mr-4 text-[#9B2C2C]" />
                        <span className="text-lg font-medium">
                          {contactSettings.email}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Address Row */}
                  {contactSettings?.address && (
                    <div className="flex items-center text-gray-700 p-6 rounded-lg border border-gray-100 bg-white/50">
                      <MapPin className="min-w-8 min-h-8 mr-4 text-[#9B2C2C]" />
                      <span className="text-lg font-medium">
                        {contactSettings.address}
                      </span>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="mx-8 md:mx-10">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                </div>

                {/* Description Section */}
                <div className="px-8 md:px-10 py-5">
                  <div className="text-gray-600 p-4 rounded-lg border border-gray-100 bg-white/30">
                    <p className="text-base leading-relaxed">
                      Whether you want to donate, volunteer, or partner with us,
                      your support can help transform lives and empower
                      communities. Join our mission to serve those in need.
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="mx-8 md:mx-10 mt-auto">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                </div>

                {/* Action Buttons Section */}
                <div className="p-8 md:p-10">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <PreloadLink
                      href="/contact"
                      priority="high"
                      className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-red-600 text-white font-medium rounded-md transition-colors duration-300 text-base border border-red-600 hover:bg-red-700"
                    >
                      <span>Contact Us</span>
                      <ExternalLink className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </PreloadLink>
                    <PreloadLink
                      href="/donations"
                      priority="high"
                      className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-white text-gray-700 hover:bg-white font-medium rounded-md transition-colors duration-300 text-base border border-gray-200"
                    >
                      <span>Donate Now</span>
                      <Heart className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </PreloadLink>
                  </div>
                </div>
              </div>

              {/* Google Map Section */}
              <div className="lg:w-2/5 bg-white">
                <div className="h-full min-h-[300px] lg:min-h-full" id="map-container">
                  {contactSettings?.googleMapsUrl ? (
                    <div className="relative w-full h-full lg:h-full">
                      {/* Mobile: aspect ratio container, Desktop: full height */}
                      <div className="lg:absolute lg:inset-0 relative w-full h-0 pb-[100%] lg:h-full lg:pb-0">
                        {shouldLoadMap ? (
                          <iframe
                            src={contactSettings.googleMapsUrl}
                            className="absolute top-0 left-0 w-full h-full border-0"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Rudhirsetu Location"
                          />
                        ) : (
                          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white">
                            <div className="text-center p-8">
                              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
                              <p className="text-gray-500">Loading map...</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center p-8">
                        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Map loading...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
            </div>
          </div>
        </motion.div>
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
  );
};

export default Home;
