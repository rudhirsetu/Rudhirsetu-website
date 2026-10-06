'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import CountUp from './CountUp';
import HeroShader from './HeroShader';
import { IMPACT, IMPACT_LABELS } from '../lib/impact';

interface HeroProps {
  startAnimations?: boolean;
}

// Static data lives outside the component so it isn't re-allocated on every render
// (Hero re-renders when the intro finishes and `startAnimations` flips).
const impactStats = [
  { label: IMPACT_LABELS.campsPerYear, value: IMPACT.campsPerYear, suffix: '+' },
  { label: IMPACT_LABELS.emergenciesSupported, value: IMPACT.emergenciesSupported, suffix: '+' },
  { label: IMPACT_LABELS.eyeCheckups, value: IMPACT.eyeCheckups, suffix: '+' },
  { label: IMPACT_LABELS.womenReached, value: IMPACT.womenReached, suffix: '+' },
];

/** Stagger index for the CSS `hero-rise` entrance (globals.css). */
const rise = (i: number) => ({ '--i': i }) as CSSProperties;

const Hero = ({ startAnimations = true }: HeroProps) => {
  return (
    <div className="bg-white p-2 sm:p-3">
      <div className="relative overflow-hidden rounded-[1.75rem] sm:rounded-[2.5rem] bg-red-950 min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-1.5rem)] supports-[height:100svh]:min-h-[calc(100svh-1rem)] sm:supports-[height:100svh]:min-h-[calc(100svh-1.5rem)] flex">
        {/* Animated silk background (WebGL, with a CSS gradient fallback) */}
        <HeroShader className="z-0" />
        <div aria-hidden="true" className="absolute inset-0 z-0 bg-gradient-to-t from-red-950/60 via-transparent to-transparent" />

        {/* Content */}
        {/* Entrance is CSS (`hero-rise`), so the text paints on the first frame without waiting for JS. */}
        <div
          className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-12 pt-32 sm:pt-36 pb-6 sm:pb-8 flex flex-col"
        >
          <div className="flex-1 flex flex-col justify-center">
            <div className="hero-rise" style={rise(0)}>
              <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20 text-white text-sm font-medium">
                <Heart className="text-red-200 w-4 h-4 fill-red-200/40" />
                Transforming lives since 2010
              </span>
            </div>

            <h1
              style={rise(1)}
              className="hero-rise mt-8 font-display font-bold tracking-tight text-white leading-[1.08] text-[clamp(2.6rem,6.2vw,5.75rem)]"
            >
              Transforming <span className="font-script font-normal tracking-normal text-red-100">Lives,</span>
              <br />
              <span className="font-script font-normal tracking-normal text-red-100">Empowering</span> Communities
            </h1>

            <div
              style={rise(2)}
              className="hero-rise mt-8 sm:mt-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8"
            >
              <p className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-xl">
                We are a non-profit organization that provides free healthcare services to the community.
              </p>

              <div className="flex flex-col min-[420px]:flex-row gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 h-[52px] px-7 bg-white text-red-900 rounded-md font-semibold hover:bg-red-100 transition-colors group"
                >
                  Get Involved
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/donations"
                  className="inline-flex items-center justify-center gap-2 h-[52px] px-7 border border-white/40 text-white rounded-md font-semibold hover:bg-white/10 transition-colors"
                >
                  Donate Now
                  <Heart className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <dl
            style={rise(3)}
            className="hero-rise mt-14 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 border-t border-white/15"
          >
            {impactStats.map((stat, index) => (
              <div
                key={stat.label}
                className={`pt-5 pb-2 sm:pt-6 ${index % 2 === 1 ? 'pl-5 sm:pl-8 border-l border-white/15' : ''} ${index === 2 ? 'lg:pl-8 lg:border-l lg:border-white/15' : ''} ${index > 1 ? 'max-lg:border-t max-lg:border-white/15' : ''}`}
              >
                <dd className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white tabular-nums">
                  <CountUp
                    from={0}
                    to={stat.value}
                    duration={1}
                    delay={0.1 * index + 0.8}
                    separator=","
                    startWhen={startAnimations}
                  />
                  {stat.suffix}
                </dd>
                <dt className="mt-1 text-sm sm:text-base text-white/70">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Hero;
