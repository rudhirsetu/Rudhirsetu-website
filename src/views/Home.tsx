import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Heart, Calendar, ExternalLink, Activity, Zap, Award, Image, Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import CountUp from '../components/CountUp';

import { Event, GalleryImage, ContactSettings } from '../types/sanity';
import { eventService, settingsService } from '../services/sanity-client';
import { FeaturedCarousel, ImageLightbox } from '../components/GalleryComponents';
import { client } from '../lib/sanity';
import { QUERIES } from '../lib/sanity';
import EventCard from '../components/EventCard';
import SpotlightCard from '../components/SpotlightCard';

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [featuredImages, setFeaturedImages] = useState<GalleryImage[]>([]);
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isEventsVisible, setIsEventsVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load each data source independently to avoid total failure
        const loadEvents = async () => {
          try {
            const [eventsData, pastData] = await Promise.all([
              eventService.fetchUpcoming(1, 2),
              eventService.fetchPast(1, 2)
            ]);

            if (eventsData && eventsData.data) {
              setUpcomingEvents(eventsData.data);
            } else {
              console.warn('Failed to load upcoming events');
            }

            if (pastData && pastData.data) {
              setPastEvents(pastData.data);
            } else {
              console.warn('Failed to load past events');
            }
                     } catch (err) {
             console.error('Error loading events:', err);
             setError('Failed to load events. Please refresh the page.');
             // Still show events section even if there's an error
             setTimeout(() => {
               setIsEventsVisible(true);
             }, 200);
           }
        };

        const loadImages = async () => {
          try {
            const imagesData = await client.fetch(QUERIES.featuredImages);
            if (imagesData) {
              setFeaturedImages(imagesData || []);
            }
          } catch (err) {
            console.error('Error loading images:', err);
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
            console.error('Error loading contact settings:', err);
            // Contact info is less critical, don't show error for this
          }
        };

        // Load events, images, and contact settings independently
        await Promise.allSettled([loadEvents(), loadImages(), loadContact()]);

      } catch (err) {
        console.error('Error loading data:', err);
        setError('Something went wrong. Please refresh the page.');
      } finally {
        setLoading(false);
        // Trigger events section animation after loading completes
        setTimeout(() => {
          setIsEventsVisible(true);
        }, 200);
      }
    };
    loadData();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  const keyAreas = [
    {
      title: 'Blood Donation',
      description: 'Monthly camps and emergency support with blood centers & hospitals',
      extendedDescription: 'Our primary mission focuses on organizing blood donation camps, providing emergency blood support.',
      stats: [
        { label: 'Blood Donation Camps', value: '50+' },
        { label: 'Emergency Support', value: '24/7' }
      ],
      icon: <Heart className="w-12 h-12 text-red-500" />,
      color: 'bg-red-50',
      accentColor: 'border-red-200',
      spotlightColor: 'rgba(239, 68, 68, 0.2)',
      gridClass: 'md:col-span-2 md:row-span-2'
    },
    {
      title: 'Cancer Awareness',
      description: 'Focus on cervical and breast cancer awareness with free testing camps',
      icon: <Award className="w-10 h-10 text-purple-500" />,
      color: 'bg-purple-50',
      accentColor: 'border-purple-200',
      spotlightColor: 'rgba(168, 85, 247, 0.2)',
      gridClass: 'md:col-span-2'
    },
    {
      title: 'Thalassemia Support',
      description: 'Free testing camps and comprehensive patient support for 68+ patients',
      icon: <Activity className="w-10 h-10 text-emerald-500" />,
      color: 'bg-emerald-50',
      accentColor: 'border-emerald-200',
      spotlightColor: 'rgba(34, 197, 94, 0.2)',
      gridClass: 'md:col-span-1'
    },
    {
      title: 'Eye Care',
      description: 'Free eye checkups, cataract screening & operations',
      icon: <Zap className="w-10 h-10 text-blue-500" />,
      color: 'bg-blue-50',
      accentColor: 'border-blue-200',
      spotlightColor: 'rgba(59, 130, 246, 0.2)',
      gridClass: 'md:col-span-1'
    }
  ];

  const impactStats = [
    { 
      label: 'Blood Donation Camps', 
      value: 50, 
      suffix: '+', 
      subtext: 'Annually',
      color: 'from-red-500 to-red-600', 
      duration: 1.5 
    },
    { 
      label: 'Emergencies Supported', 
      value: 9800, 
      suffix: '+', 
      subtext: 'And counting', 
      color: 'from-orange-500 to-red-500', 
      duration: 0.1
    },
    {
      label: 'Eye Checkups', 
      value: 15000, 
      suffix: '+', 
      subtext: 'Completed', 
      color: 'from-emerald-500 to-emerald-600', 
      duration: 0.1
    },
    { label: 'Cancer Awareness', 
      value: 20000, 
      suffix: '+', 
      subtext: 'Women reached', 
      color: 'from-indigo-500 to-indigo-600', 
      duration: 0.1 
    },
  ];

  return (
    <div className="space-y-0 overflow-x-hidden">
      <Hero />

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
              We&apos;re dedicated to creating positive impact through these key initiatives
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
                  className={`h-full min-h-[240px] sm:min-h-[260px] md:min-h-[280px] ${area.title === 'Blood Donation' ? 'lg:min-h-[380px] xl:min-h-[400px] flex flex-col relative' : area.title === 'Cancer Awareness' ? 'flex flex-col relative' : ''}`}
                  spotlightColor={area.spotlightColor}
                >
                  <div className="mb-6">
                    {area.icon}
                  </div>

                  {area.title === 'Blood Donation' ? (
                    <>
                      {/* Earth SVG positioned to the right */}
                      <div className="absolute hidden md:block bottom-72 right-36 scale-150 opacity-100 pointer-events-none">
                        <svg width="120" height="156" viewBox="0 0 330 430" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-800">
                          <g clipPath="url(#clip0_364_2916)">
                            <mask id="mask0_364_2916" style={{maskType:'alpha'}} maskUnits="userSpaceOnUse" x="-72" y="194" width="501" height="307">
                              <rect x="-71.3203" y="194.31" width="500.22" height="306.136" fill="url(#paint0_linear_364_2916)"/>
                            </mask>
                            <g mask="url(#mask0_364_2916)">
                              <path opacity="0.8" d="M56.9363 615.864C55.0738 614.729 58.4661 605.079 66.7467 587.868C75.0273 570.656 87.9158 546.498 104.11 517.81C120.304 489.122 139.235 456.928 159.003 424.468C178.78 391.993 198.693 360.405 216.734 332.844C234.791 305.292 250.345 282.755 261.833 267.507C273.329 252.243 280.353 244.814 282.216 245.949M29.7378 596.282C22.0017 589.736 20.8579 575.662 26.4116 555.477C31.9809 535.301 44.0671 509.704 61.447 481.289C78.8269 452.875 100.91 422.633 125.455 393.617C150.009 364.585 176.155 337.795 201.271 315.927C226.402 294.067 249.614 277.891 268.59 269.051C287.566 260.21 301.634 259.003 309.379 265.533M3.20404 569.554C-7.94814 556.166 -11.2031 536.622 -6.26453 512.873C-1.32593 489.124 11.667 462.003 31.3826 434.237C51.0983 406.471 76.8517 379.038 106.057 354.697C135.262 330.356 166.889 309.975 197.741 295.589C228.609 281.211 257.618 273.321 281.884 272.729C306.142 272.153 324.785 278.878 335.922 292.258M-22.4581 531.044C-33.3277 510.212 -35.1363 485.108 -27.6923 458.27C-20.2483 431.432 -3.81488 403.81 19.9338 378.162C43.698 352.523 73.9446 329.773 107.648 312.187C141.352 294.601 177.334 282.84 211.952 278.025C246.586 273.218 278.641 275.573 304.901 284.824C331.16 294.076 350.709 309.938 361.578 330.77M-42.7743 473.456C-48.2735 446.019 -43.8643 417.09 -29.9902 389.587C-16.1161 362.084 6.72911 336.968 36.2619 316.782C65.7947 296.596 100.962 282.031 138.234 274.554C175.506 267.078 213.569 266.972 248.601 274.224C283.633 281.475 314.391 295.839 337.788 315.865C361.186 335.891 376.404 360.902 381.903 388.34M-43.4928 392.108C-38.0184 362.028 -22.7933 334.282 0.658225 311.651C24.0942 289.012 54.9289 272.285 90.0679 263.137C125.198 254.005 163.382 252.771 200.78 259.593C238.187 266.4 273.487 281.016 303.128 301.955C332.768 322.894 355.742 349.414 369.689 378.867C383.636 408.32 388.11 439.648 382.636 469.728M-5.64197 303.625C21.9477 265.658 66.8567 242.639 119.227 239.655C171.598 236.671 227.12 253.963 273.586 287.711C320.051 321.459 353.668 368.929 367.02 419.638C380.363 470.363 372.376 520.189 344.802 558.164M61.3434 243.313C99.8723 221.089 148.231 219.525 195.775 238.995C243.318 258.464 286.152 297.33 314.846 347.093C343.549 396.841 355.768 453.387 348.805 504.288C341.842 555.189 316.291 596.274 277.762 618.498M127.004 218.562C165.252 210.897 206.413 225.91 241.443 260.321C276.473 294.732 302.483 345.68 313.776 401.996C325.069 458.311 320.687 515.368 301.627 560.606C282.567 605.843 250.368 635.575 212.121 643.24M179.177 214.558C210.013 215.932 238.58 240.045 258.588 281.58C278.595 323.114 288.389 378.698 285.858 436.073C283.303 493.455 268.618 547.933 245.003 587.539C221.388 627.146 190.807 648.635 159.97 647.26M219.804 220.258C239.872 225.037 253.815 251.833 258.582 294.715C263.349 337.596 258.544 393.08 245.211 448.956C231.886 504.817 211.127 556.509 187.519 592.634C163.912 628.758 139.377 646.369 119.318 641.574M253.079 231.088C261.369 234.556 260.504 258.926 250.701 298.845C240.898 338.764 222.957 390.967 200.809 443.955C178.661 496.943 154.135 546.401 132.598 581.426C111.086 616.443 94.3421 634.185 86.0524 630.716M95.4135 634.397C74.2746 626.692 53.7477 615.293 36.0327 601.422M174.386 647.421C141.03 648.174 101.973 637.33 66.0165 617.363C30.0595 597.396 0.23186 569.968 -16.7855 541.263M225.997 640.002C183.579 651.452 124.337 640.019 70.1613 609.935C15.9857 579.851 -25.0361 535.607 -37.7393 493.548M268.893 623.345C246.532 634.886 216.188 638.649 181.886 634.134C147.584 629.619 110.902 617.053 76.7424 598.084C42.5825 579.115 12.5162 554.636 -9.44045 527.89C-31.4057 501.159 -44.2526 473.412 -46.2763 448.33M305.246 599.71C283.394 617.27 249.804 625.088 209.925 621.895C170.045 618.701 126.223 604.684 85.5878 582.119C44.9523 559.554 9.88844 529.765 -13.904 497.602C-37.6965 465.438 -48.8162 432.791 -45.4619 404.96M335.338 570.267C315.677 593.665 280.44 605.799 236.392 604.344C192.336 602.905 142.533 587.979 96.5374 562.437C50.5417 536.895 11.5441 502.511 -12.9669 465.874C-37.4779 429.237 -45.805 392.912 -36.3459 363.869M358.903 536.045C348.313 555.115 329.168 568.969 303.39 576.261C277.596 583.545 246.094 583.99 212.019 577.533C177.944 571.077 142.515 557.97 109.27 539.509C76.0237 521.047 46.1694 497.902 22.6759 472.39C-0.817497 446.879 -17.1082 419.894 -24.5451 394.157C-31.9974 368.412 -30.3341 344.83 -19.7527 325.775M358.903 536.045C331.021 586.254 284.322 623.338 229.096 639.128C173.871 654.919 114.65 648.119 64.425 620.229C14.2154 592.347 -22.8689 545.648 -38.6676 490.438C-54.4577 435.213 -47.6584 375.992 -19.7682 325.766C8.11345 275.557 54.8132 238.473 110.023 222.674C165.248 206.884 224.469 213.683 274.694 241.573C324.904 269.455 361.988 316.155 377.787 371.365C393.577 426.59 386.785 485.835 358.903 536.045ZM375.496 497.951C368.268 520.165 350.965 537.089 325.575 546.786C300.193 556.467 267.772 558.53 232.028 552.707C196.275 546.9 158.648 533.444 123.481 513.916C88.299 494.379 57.002 469.561 33.1726 442.282C9.34323 415.003 -6.06825 386.398 -11.2523 359.744C-16.4518 333.081 -11.2172 309.455 3.81192 291.552M384.572 456.858C381.569 481.722 367.165 501.493 343.257 513.593C319.34 525.71 287.016 529.57 250.541 524.699C214.065 519.828 175.127 506.435 138.829 486.278C102.531 466.122 70.578 440.149 47.1615 411.761C23.7449 383.374 9.93395 353.895 7.57602 327.188C5.2181 300.481 14.3858 277.804 33.8954 262.125M385.427 413.49C387.595 440.355 377.226 462.751 355.893 477.295C334.561 491.84 303.425 497.758 267.164 494.142C230.904 490.526 191.51 477.588 154.918 457.269C118.326 436.949 86.5033 410.339 64.2811 381.48C42.0435 352.611 30.6077 323.053 31.6767 297.256C32.7458 271.459 46.2907 250.827 70.2261 238.458M376.89 368.272C385.366 396.37 380.478 421.16 363.072 438.27C345.666 455.38 316.869 463.692 281.774 461.737C246.695 459.79 207.59 447.682 171.401 427.586C135.211 407.49 104.277 380.704 84.0652 351.948C63.8689 323.2 55.7017 294.362 61.0241 270.542C66.3465 246.722 84.8146 229.451 113.138 221.809M355.905 320.54C372.617 348.772 375.559 375.924 364.065 396.074C352.572 416.224 327.586 427.747 294.573 428.103C261.551 428.474 223.168 417.659 187.815 398.027C152.462 378.396 122.991 351.531 105.85 323.304C88.7084 295.077 85.2729 267.792 96.3016 247.384C107.33 226.976 131.934 215.119 164.733 214.381M303.093 260.404C326.754 278.935 343.997 300.773 351.666 321.895C359.319 343.009 356.871 361.98 344.747 375.273C332.622 388.566 311.668 395.274 285.746 394.175C259.823 393.077 230.707 384.226 203.797 369.283C176.872 354.331 153.982 334.303 139.346 312.879C124.711 291.455 119.328 270.123 124.202 252.803C129.077 235.484 143.871 223.37 165.855 218.713C187.823 214.048 215.491 217.15 243.728 227.438M332.262 340.449C325.001 353.525 308.97 361.041 287.722 361.342C266.459 361.636 241.718 354.687 218.929 342.032C196.125 329.369 177.148 312.04 166.172 293.845C155.181 275.641 153.093 258.084 160.362 244.993C167.623 231.918 183.654 224.402 204.902 224.1C226.165 223.807 250.906 230.755 273.695 243.41C296.483 256.065 315.476 273.402 326.452 291.597C337.428 309.793 339.522 327.374 332.262 340.449ZM309.98 315.895C305.033 324.802 294.128 329.915 279.666 330.114C265.205 330.313 248.348 325.593 232.84 316.982C217.333 308.37 204.406 296.571 196.939 284.175C189.464 271.794 188.038 259.834 192.984 250.926C197.931 242.018 208.837 236.906 223.298 236.707C237.759 236.508 254.617 241.228 270.125 249.839C285.632 258.451 298.558 270.25 306.025 282.646C313.501 295.027 314.927 306.987 309.98 315.895ZM284.245 294.165C279.031 303.553 261.546 303.796 245.187 294.711C228.827 285.626 219.79 270.656 225.003 261.268C230.217 251.88 247.702 251.637 264.061 260.721C280.421 269.806 289.458 284.777 284.245 294.165Z" stroke="currentColor" strokeWidth="0.629955"/>
                              <path d="M96.084 155.412C129.821 166.727 155.729 193.229 169.369 214.373C49.879 214.63 -46.9313 311.472 -47.1378 430.975C-71.4455 421.419 -89.2903 407.817 -100.644 391.238C-112.052 374.579 -116.919 354.897 -115.188 333.25C-111.724 289.946 -81.8495 238.773 -25.0909 188.321C20.271 147.999 62.1569 144.034 96.084 155.412Z" fill="url(#paint1_radial_364_2916)" fillOpacity="0.08" stroke="url(#paint2_radial_364_2916)" strokeWidth="0.522968"/>
                            </g>
                            <path d="M163.815 289.173C168.96 287.532 182.524 283.584 195.618 280.922" stroke="url(#paint3_linear_364_2916)" strokeWidth="0.522968"/>
                            <path opacity="0.6" d="M163.743 289.032C145.537 294.219 120.666 304.679 101.45 315.562C98.5928 309.936 92.5914 296.549 91.4453 288.014" stroke="url(#paint4_linear_364_2916)" strokeWidth="0.629955"/>
                            <path opacity="0.6" d="M131.988 300.584C109.209 309.463 67.2367 334.448 46.0713 353.25" stroke="url(#paint5_linear_364_2916)" strokeWidth="0.629955"/>
                            <path d="M163.45 288.852C160.552 283.745 155.015 270.79 156.05 259.82C157.085 248.849 161.432 243.106 162.726 241.501C143.941 238.551 103.163 236.947 70.9746 248.642" stroke="url(#paint6_linear_364_2916)" strokeWidth="0.629955"/>
                            <path d="M107 416.714C113.591 406.473 136.106 381.182 146.594 369.603C136.483 361.56 125 348.684 120.428 343.179C136.916 330.022 164.082 313.53 175.604 306.929C172.568 303.3 166.025 294.617 163.637 289.305" stroke="url(#paint7_linear_364_2916)" strokeWidth="0.629955"/>
                            <path d="M208.664 423.039C215.773 410.086 229.419 369.035 235.78 350.283C207.668 338.623 187.65 321.055 175.596 306.866" stroke="url(#paint8_linear_364_2916)" strokeWidth="0.629955"/>
                            <path d="M285.525 394.502C259.949 393.085 234.914 384.28 225.594 380.056C228.046 373.322 233.523 357.947 235.811 350.32" stroke="url(#paint9_linear_364_2916)" strokeWidth="0.629955"/>
                            <line x1="163.741" y1="225.905" x2="163.741" y2="288.695" stroke="url(#paint10_linear_364_2916)" strokeWidth="0.581638"/>
                            <ellipse cx="163.449" cy="288.951" rx="3.00038" ry="2.98705" transform="rotate(-90 163.449 288.951)" fill="#EDEDED"/>
                            <ellipse cx="285.522" cy="394.501" rx="3.00038" ry="2.98705" transform="rotate(-90 285.522 394.501)" fill="#EDEDED"/>
                            <ellipse cx="46.072" cy="353.25" rx="3.00038" ry="2.98705" transform="rotate(-90 46.072 353.25)" fill="#EDEDED"/>
                          </g>
                          <defs>
                            <linearGradient id="paint0_linear_364_2916" x1="130.011" y1="159.677" x2="290.2" y2="369.686" gradientUnits="userSpaceOnUse">
                              <stop stopColor="white"/>
                              <stop offset="1" stopColor="white" stopOpacity="0"/>
                            </linearGradient>
                            <radialGradient id="paint1_radial_364_2916" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(63.4043 306.574) rotate(-132.571) scale(103.192 103.372)">
                              <stop stopColor="white"/>
                              <stop offset="1" stopColor="#D9D9D9" stopOpacity="0"/>
                            </radialGradient>
                            <radialGradient id="paint2_radial_364_2916" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(35.3475 279.408) rotate(-113.962) scale(61.4062 126.439)">
                              <stop stopColor="#D9D9D9"/>
                              <stop offset="1" stopColor="#D9D9D9" stopOpacity="0"/>
                            </radialGradient>
                            <linearGradient id="paint3_linear_364_2916" x1="161.952" y1="287.31" x2="200.942" y2="282.386" gradientUnits="userSpaceOnUse">
                              <stop stopColor="white"/>
                              <stop offset="1" stopColor="white" stopOpacity="0"/>
                            </linearGradient>
                            <linearGradient id="paint4_linear_364_2916" x1="176.291" y1="291.992" x2="146.084" y2="317.019" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#EDEDED"/>
                              <stop offset="1" stopColor="white" stopOpacity="0"/>
                            </linearGradient>
                            <linearGradient id="paint5_linear_364_2916" x1="142.094" y1="298.08" x2="49.0046" y2="374.208" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#EDEDED"/>
                              <stop offset="1" stopColor="white" stopOpacity="0"/>
                            </linearGradient>
                            <linearGradient id="paint6_linear_364_2916" x1="163.45" y1="286.878" x2="151.98" y2="260.371" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#EDEDED"/>
                              <stop offset="1" stopColor="white" stopOpacity="0"/>
                            </linearGradient>
                            <linearGradient id="paint7_linear_364_2916" x1="163.939" y1="317.43" x2="120.03" y2="406.478" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#EDEDED"/>
                              <stop offset="1" stopColor="white" stopOpacity="0"/>
                            </linearGradient>
                            <linearGradient id="paint8_linear_364_2916" x1="211.598" y1="358.54" x2="210.244" y2="423.039" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#EDEDED"/>
                              <stop offset="1" stopColor="white" stopOpacity="0"/>
                            </linearGradient>
                            <linearGradient id="paint9_linear_364_2916" x1="252.624" y1="386.02" x2="289.44" y2="398.696" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#EDEDED"/>
                              <stop offset="1" stopColor="white" stopOpacity="0"/>
                            </linearGradient>
                            <linearGradient id="paint10_linear_364_2916" x1="163.45" y1="266.262" x2="163.45" y2="288.695" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#EDEDED"/>
                              <stop offset="1" stopColor="white" stopOpacity="0"/>
                            </linearGradient>
                            <clipPath id="clip0_364_2916">
                              <rect width="330" height="430" fill="white"/>
                            </clipPath>
                          </defs>
                        </svg>
                      </div>

                      <div className="flex-grow">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                          {area.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-lg mb-6">
                          {area.extendedDescription}
                        </p>
                      </div>

                      <div className="mt-auto space-y-6">
                        <div className="hidden md:grid grid-cols-2 gap-4">
                          {area.stats?.map((stat) => (
                            <div key={stat.label} className="text-center p-4 bg-red-50/50 rounded-xl border border-red-200/50">
                              <div className="text-2xl font-bold text-red-600 mb-1">{stat.value}</div>
                              <div className="text-sm text-gray-600">{stat.label}</div>
                            </div>
                          ))}
                        </div>

                        <Link
                          href="/camp"
                          className="hidden md:inline-flex items-center justify-center w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors duration-200 group"
                        >
                          <span>Join Our Next Camp</span>
                          <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                      </div>
                    </>
                  ) : area.title === 'Cancer Awareness' ? (
                    <>
                      {/* Cancer Ribbon SVG positioned to the right */}
                      <div className="absolute hidden md:block bottom-20 right-24 scale-400 opacity-50 pointer-events-none">
                        <svg width="80" height="44" viewBox="0 0 489 267" fill="transparent" xmlns="http://www.w3.org/2000/svg" className="text-purple-800">
                          <path d="M0 0 C161.37 0 322.74 0 489 0 C489 88.11 489 176.22 489 267 C327.63 267 166.26 267 0 267 C0 178.89 0 90.78 0 0 Z " fill="transparent"/>
                          <path d="M0 0 C8.8178217 8.97847027 11.88372616 25.97400988 13 38 C13.16048828 39.50046875 13.16048828 39.50046875 13.32421875 41.03125 C13.91070178 51.35335127 10.42541246 60.43012097 7 70 C6.60554688 71.15757813 6.21109375 72.31515625 5.8046875 73.5078125 C3.18184933 80.82608125 -0.27458202 87.53920598 -4.1418457 94.26611328 C-4.5255835 94.95302246 -4.90932129 95.63993164 -5.3046875 96.34765625 C-5.8303833 97.26043335 -5.8303833 97.26043335 -6.36669922 98.19165039 C-7.18593728 100.53093192 -6.85459567 101.69954434 -6 104 C-4.65413709 105.9670304 -3.22377013 107.87688571 -1.75 109.75 C-1.30962402 110.31146729 -0.86924805 110.87293457 -0.41552734 111.45141602 C1.04732889 113.30827429 2.52203897 115.15514577 4 117 C4.51208008 117.64114746 5.02416016 118.28229492 5.55175781 118.94287109 C9.32867979 123.66110748 13.15102575 128.34041365 17 133 C17.52416504 133.63679687 18.04833008 134.27359375 18.58837891 134.9296875 C33.663667 153.16950892 54.99244076 172.75222027 79 178 C82.65224305 177.6679779 84.32250592 176.0289195 86.8125 173.4375 C87.51117188 172.71175781 88.20984375 171.98601562 88.9296875 171.23828125 C91.38860445 168.57986727 93.78734302 165.87882666 96.15234375 163.13671875 C99.70244217 159.03121382 103.33647254 155.00432072 107 151 C107.58652344 150.34644531 108.17304688 149.69289062 108.77734375 149.01953125 C114.21780898 143.22063537 121.6887515 137.32690849 129.87573242 136.82299805 C132.97615761 136.76839854 136.07613413 136.72342477 139.17700195 136.70483398 C141.16315908 136.68770986 143.14902687 136.64382424 145.13476562 136.59960938 C155.29395892 136.53253497 161.46720307 138.02387055 168.71630859 145.16186523 C169.22242676 145.68594971 169.72854492 146.21003418 170.25 146.75 C170.79865723 147.3056665 171.34731445 147.86133301 171.91259766 148.43383789 C176.69189791 153.40548753 180.826888 158.79708669 184.77832031 164.44238281 C188.49617616 169.67600028 192.65070176 175.02312135 199 176.875 C204.9005458 175.15400747 207.91560676 169.81898221 210.9375 164.75 C213.39645311 156.07134197 212.70458592 148.9552337 208.38671875 141.05859375 C207.08488357 138.96690074 207.08488357 138.96690074 205.33203125 137.41015625 C204 136 204 136 204 133 C222.37593985 132.45864662 222.37593985 132.45864662 230 135 C235.54092966 140.75293044 236.42077444 145.28629389 236.35913086 153.14916992 C236.07074686 163.16538565 232.34186451 169.6322268 225.50390625 176.796875 C213.65112251 187.22584541 197.81162876 185.69939485 183 185 C170.56093548 183.552456 163.66835323 177.41557295 156 168 C155.195625 167.05125 154.39125 166.1025 153.5625 165.125 C152 163 152 163 152 161 C151.34 161 150.68 161 150 161 C148.2734375 159.03125 148.2734375 159.03125 146.375 156.5 C145.74335938 155.6646875 145.11171875 154.829375 144.4609375 153.96875 C143.73777344 152.99421875 143.73777344 152.99421875 143 152 C138.16615326 153.43408383 135.32767396 156.35818123 131.95703125 159.92578125 C130.78868627 161.12722042 129.62005723 162.32838343 128.45117188 163.52929688 C126.63441231 165.41400466 124.82197396 167.30256527 123.01538086 169.19702148 C113.17886603 179.47801802 105.08411759 185.9384114 90.6875 188.3125 C89.72054199 188.47637207 88.75358398 188.64024414 87.75732422 188.80908203 C70.09957693 191.47876194 48.77836312 193.36751332 32.625 184.4375 C31.98216064 184.08743896 31.33932129 183.73737793 30.67700195 183.37670898 C24.53458485 179.9229846 19.24244173 175.69984502 14 171 C13.10152344 170.20980469 12.20304687 169.41960937 11.27734375 168.60546875 C-0.17618593 158.43392472 -10.78238808 147.38819508 -19.87768555 135.05078125 C-22.01926368 132.05749651 -22.01926368 132.05749651 -25 130 C-25.23460937 130.67804688 -25.46921875 131.35609375 -25.7109375 132.0546875 C-27.30034859 135.68625101 -29.40339642 138.86078163 -31.625 142.125 C-32.29486938 143.11632935 -32.29486938 143.11632935 -32.97827148 144.12768555 C-39.44087505 153.64588273 -46.09221553 162.61774846 -54 171 C-54.87785156 171.95712891 -54.87785156 171.95712891 -55.7734375 172.93359375 C-60.94178181 178.38098012 -66.83201319 183.38694962 -73.88671875 186.1171875 C-77.47197304 185.98223439 -77.89755056 185.55676172 -80.359375 183.140625 C-81.50898676 181.86091861 -82.63870417 180.56311737 -83.75 179.25 C-84.32621094 178.60289062 -84.90242188 177.95578125 -85.49609375 177.2890625 C-92 169.92100087 -92 169.92100087 -92 166 C-89.8046875 164.1328125 -89.8046875 164.1328125 -86.875 162.125 C-85.86566406 161.4134375 -84.85632813 160.701875 -83.81640625 159.96875 C-82.42228516 158.99421875 -82.42228516 158.99421875 -81 158 C-75.28937905 153.74502753 -71.26983949 148.63913285 -67 143 C-66.36288086 142.15937012 -66.36288086 142.15937012 -65.71289062 141.30175781 C-50.68196669 123.74023911 -50.68196669 123.74023911 -43.20703125 103.62109375 C-44.14360506 100.52532515 -45.52616799 98.32483927 -47.3125 95.625 C-51.35421455 89.31184569 -54.89260434 82.76028334 -58.375 76.125 C-58.89876221 75.13838379 -59.42252441 74.15176758 -59.9621582 73.13525391 C-68.04474742 57.61784121 -68.61714548 38.34959392 -64.3125 21.375 C-63.60214305 19.22902655 -62.83669507 17.09994057 -62 15 C-61.62617187 14.030625 -61.25234375 13.06125 -60.8671875 12.0625 C-57.78456155 5.03982895 -54.29787205 2.03795811 -47.50390625 -1.18359375 C-34.43066645 -6.20107888 -12.32178914 -7.587211 0 0 Z " fill="white" stroke='purple' transform="translate(190,47)"/>
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
                  ) : (
                    <>
                      <h3 className="text-xl font-bold mb-4 text-gray-900">
                        {area.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {area.description}
                      </p>
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
            <h2 className="text-black font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6 sm:mb-7 md:mb-8">Events & Camps</h2>
            <p className="text-xl text-gray-600">
              Discover our recent activities and join us in upcoming events to be part of our mission to serve the community.
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
                  <div className="h-64 bg-gray-200" />
                  <div className="p-8 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-10 bg-gray-200 rounded" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : error ? (
            <motion.div
              variants={itemVariants}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-red-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">Failed to Load Events</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
                >
                  Refresh Page
                </button>
              </div>
            </motion.div>
          ) : (
            (() => {
              // Combine and prioritize upcoming events first, then past events
              const allEvents = [...upcomingEvents, ...pastEvents].slice(0, 3);
              
              return allEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {allEvents.map((event) => (
                    <motion.div
                      key={event._id}
                      variants={itemVariants}
                    >
                      <EventCard 
                        event={event} 
                        variant={upcomingEvents.some(e => e._id === event._id) ? "upcoming" : "past"} 
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-16"
                >
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <Calendar className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-gray-900">No Events Available</h3>
                    <p className="text-gray-600 mb-6">
                      We don&apos;t have any events to display at the moment. Please check back soon for new announcements.
                    </p>
                  </div>
                </motion.div>
              );
            })()
          )}

          <motion.div
            variants={itemVariants}
            className="text-center mt-16"
          >
            <Link
              href="/camp"
              className="inline-flex items-center justify-center px-8 py-4 bg-red-900 text-white rounded-lg font-semibold shadow-md hover:bg-red-800 transition-all duration-300 group"
            >
              <span>View All Events</span>
              <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
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
            <h2 className="text-4xl font-bold mb-6">The Change We&apos;re Making</h2>
            <p className="text-xl text-white/90">
              With your support, we&apos;ve achieved significant milestones in our mission to transform lives
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
                  <div className="text-xl font-semibold mb-1 text-white">{stat.label}</div>
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
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="py-24 bg-gray-50"
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
              <h2 className="text-4xl font-bold mb-6 text-gray-900">Moments That Matter</h2>
              <p className="text-xl text-gray-600">
                Take a glimpse at the remarkable moments we&apos;ve captured during our journey of service
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mb-16"
            >
              <FeaturedCarousel
                featuredImages={featuredImages}
                onImageClick={(image, index) => {
                  setSelectedImage(image);
                  setSelectedImageIndex(index);
                }}
                aspectRatio="md:aspect-[21/9] aspect-[7/9]"
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="text-center"
            >
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center px-8 py-4 bg-red-900 text-white rounded-lg font-semibold shadow-md hover:bg-red-800 transition-all duration-300 group"
              >
                <span>View Full Gallery</span>
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Call to Action - EventCard Style */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="container mx-auto px-4 py-20 md:py-24"
      >
        <motion.div
          variants={fadeInUpVariants}
          className="max-w-7xl mx-auto"
        >
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
                      <div className="flex items-center text-gray-700 p-6 rounded-lg border border-gray-100 bg-gray-50/50">
                        <Phone className="min-w-8 min-h-8 mr-4 text-[#9B2C2C]" />
                        <span className="text-lg font-medium">{contactSettings.phone}</span>
                      </div>
                    )}
                    {contactSettings?.email && (
                      <div className="flex items-center text-gray-700 p-6 rounded-lg border border-gray-100 bg-gray-50/50">
                        <Mail className="min-w-8 min-h-8 mr-4 text-[#9B2C2C]" />
                        <span className="text-lg font-medium">{contactSettings.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Address Row */}
                  {contactSettings?.address && (
                    <div className="flex items-center text-gray-700 p-6 rounded-lg border border-gray-100 bg-gray-50/50">
                      <MapPin className="min-w-8 min-h-8 mr-4 text-[#9B2C2C]" />
                      <span className="text-lg font-medium">{contactSettings.address}</span>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="mx-8 md:mx-10">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                </div>

                {/* Description Section */}
                <div className="px-8 md:px-10 py-5">
                  <div className="text-gray-600 p-4 rounded-lg border border-gray-100 bg-gray-50/30">
                    <p className="text-base leading-relaxed">
                      Whether you want to donate, volunteer, or partner with us, your support can help transform lives and empower communities. Join our mission to serve those in need.
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
                    <Link
                      href="/contact"
                      className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-[#9B2C2C] to-red-600 text-white font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg text-base border border-red-700/20"
                    >
                      <span>Contact Us</span>
                      <ExternalLink className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                    <Link
                      href="/donations"
                      className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-gray-700 text-white hover:bg-gray-600 font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg text-base border border-gray-600"
                    >
                      <span>Donate Now</span>
                      <Heart className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Google Map Section */}
              <div className="lg:w-2/5 bg-gray-100">
                <div className="h-full min-h-[300px] lg:min-h-full">
                  {contactSettings?.googleMapsUrl ? (
                    <div className="relative w-full h-full lg:h-full">
                      {/* Mobile: aspect ratio container, Desktop: full height */}
                      <div className="lg:absolute lg:inset-0 relative w-full h-0 pb-[100%] lg:h-full lg:pb-0">
                        <iframe
                          src={contactSettings.googleMapsUrl}
                          className="absolute top-0 left-0 w-full h-full border-0"
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Rudhirsetu Location"
                        />
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
            const newIndex = (selectedImageIndex - 1 + featuredImages.length) % featuredImages.length;
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
