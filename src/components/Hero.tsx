'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ChevronRight } from 'lucide-react';
import CountUp from './CountUp';
import Iridescence from './Iridescence';

interface HeroProps {
  startAnimations?: boolean;
}

const impactStats = [
  { label: 'Blood Camps', value: 50, suffix: '+', duration: 0.5 },
  { label: 'Lives Impacted', value: 9800, suffix: '+', duration: 0.1 },
  { label: 'Eye Checkups', value: 15000, suffix: '+', duration: 0.1 },
  { label: 'Women Reached', value: 20000, suffix: '+', duration: 0.1 },
];

// Pacifico script accent used on the word "Lives"
const script = { fontFamily: 'var(--font-pacifico), Pacifico, cursive', fontWeight: 'normal' as const };

const whiteBtn =
  'inline-flex items-center justify-center gap-2 bg-white text-[#9B2C2C] rounded-lg font-semibold shadow-xl hover:bg-[#FECACA] hover:shadow-2xl transition-all duration-300 group';
const ghostBtn =
  'inline-flex items-center justify-center gap-2 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 backdrop-blur-sm transition-all duration-300 group';

const StatValue = ({ stat }: { stat: (typeof impactStats)[number] }) => (
  <>
    <CountUp from={0} to={stat.value} duration={stat.duration} separator="," className="text-white" />
    {stat.suffix}
  </>
);

const Hero = ({ startAnimations = true }: HeroProps) => {
  // Direct (non-variant) reveal. The animate target is ALWAYS the visible state,
  // so the hero can never get stuck hidden — important because framer-motion
  // *variant* animations are unreliable on older Safari and would otherwise
  // leave the whole hero at opacity:0. `startAnimations` only nudges the timing.
  const reveal = (i: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      delay: (startAnimations ? 0.15 : 0) + i * 0.09,
    },
  });

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-16 md:pt-0">
      {/* Shared WebGL background — mounted once for both layouts */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Iridescence
          color={[1, 0.1, 0.1]}
          mouseReact={false}
          amplitude={1}
          speed={0.9}
          className="absolute inset-0 bg-red-900"
        />
        {/* subtle vignette to keep text legible over the animation */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(120% 80% at 50% 40%, transparent 40%, rgba(0,0,0,0.28))' }}
        />
      </div>

      {/* ===================== DESKTOP ===================== */}
      <div className="relative z-10 hidden md:flex container mx-auto px-6 py-16 min-h-[85vh] flex-col items-center justify-center text-center">
        <motion.span
          {...reveal(0)}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/25 shadow-lg"
        >
          <Heart className="text-red-300 w-4 h-4 animate-pulse" />
          <span className="text-white/90 text-sm font-medium tracking-wide">Transforming Lives Since 2010</span>
        </motion.span>

        <motion.h1
          {...reveal(1)}
          className="text-white font-extrabold tracking-tight leading-[1.04] mt-7 text-6xl lg:text-7xl"
        >
          Transforming <span style={script} className="text-[1.08em] align-baseline">Lives</span>
          <br />
          Empowering Communities
        </motion.h1>

        <motion.div {...reveal(2)} className="w-16 h-px bg-white/40 my-7" />

        <motion.p {...reveal(3)} className="text-white/85 text-lg lg:text-xl max-w-2xl -mt-1">
          A non-profit providing free healthcare to the community — blood, sight &amp; cancer care since 2010.
        </motion.p>

        <motion.div {...reveal(4)} className="flex gap-4 mt-8">
          <Link href="/contact" className={`${whiteBtn} px-8 py-3.5`}>
            <span>Get Involved</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <Link href="/donations" className={`${ghostBtn} px-8 py-3.5`}>
            <span>Donate Now</span>
            <Heart className="w-5 h-5 group-hover:text-red-300 group-hover:scale-110 transition-all duration-300" />
          </Link>
        </motion.div>

        {/* S1 — hairline stat row */}
        <motion.div
          {...reveal(5)}
          className="grid grid-cols-4 gap-px bg-white/15 rounded-2xl overflow-hidden mt-10 w-full max-w-3xl backdrop-blur-sm"
        >
          {impactStats.map((stat) => (
            <div key={stat.label} className="bg-white/[0.06] px-5 py-4">
              <div className="text-white text-3xl font-bold">
                <StatValue stat={stat} />
              </div>
              <div className="text-white/70 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ===================== MOBILE ===================== */}
      <div className="relative z-10 flex md:hidden w-full flex-col items-center px-6 py-12 text-center">
        <motion.span
          {...reveal(0)}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/25 shadow-lg"
        >
          <Heart className="text-red-300 w-4 h-4 animate-pulse" />
          <span className="text-white/90 text-[13px] font-medium tracking-wide">Transforming Lives Since 2010</span>
        </motion.span>

        <motion.h1
          {...reveal(1)}
          className="text-white font-extrabold tracking-tight leading-[1.1] mt-8 text-[2.5rem]"
        >
          Transforming <span style={script} className="text-[1.08em]">Lives</span>
          <br />
          Empowering Communities
        </motion.h1>

        <motion.p {...reveal(2)} className="text-white/85 text-base leading-relaxed mt-6 max-w-sm">
          A non-profit providing free healthcare to the community — blood, sight &amp; cancer care.
        </motion.p>

        <motion.div {...reveal(3)} className="flex flex-col gap-3 mt-8 w-full max-w-sm">
          <Link href="/contact" className={`${whiteBtn} w-full py-4 text-base`}>
            <span>Get Involved</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <Link href="/donations" className={`${ghostBtn} w-full py-4 text-base`}>
            <span>Donate Now</span>
            <Heart className="w-5 h-5 group-hover:text-red-300 transition-all duration-300" />
          </Link>
        </motion.div>

        {/* Mobile stats — full 2×2 cards */}
        <motion.div {...reveal(4)} className="grid grid-cols-2 gap-3 mt-10 w-full max-w-sm">
          {impactStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/[0.08] border border-white/20 rounded-2xl px-4 py-5 backdrop-blur-sm"
            >
              <div className="text-white text-3xl font-bold whitespace-nowrap">
                <StatValue stat={stat} />
              </div>
              <div className="text-white/75 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
