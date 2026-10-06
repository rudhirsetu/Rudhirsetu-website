'use client';

import type { ComponentType, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import PreloadLink from '../PreloadLink';

type IconType = ComponentType<{ className?: string }>;

/**
 * Shared reveal animation for items inside a staggered section.
 * Transform-only on purpose: fading (opacity) containers that hold rounded,
 * clipped images forces Firefox to re-render them offscreen every frame while
 * scrolling, which caused heavy jank on /camp. A slide alone stays on the compositor.
 */
export const sectionItemVariants = {
  hidden: { y: 30 },
  visible: {
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/** The script-font accent word used inside headings ("Our key *focus*"). */
export const Accent = ({ children, className = 'text-red-700' }: { children: ReactNode; className?: string }) => (
  <span className={`font-script font-normal tracking-normal ${className}`}>{children}</span>
);

/** Small pill label that sits above a section heading. Pass `center` inside centred layouts. */
export const Eyebrow = ({
  icon: Icon,
  children,
  dark = false,
  center = false,
}: {
  icon?: IconType;
  children: ReactNode;
  dark?: boolean;
  center?: boolean;
}) => (
  <span
    className={`mb-6 inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${
      center ? 'self-center' : 'self-start'
    } ${
      dark ? 'border border-white/20 bg-white/10 text-white' : 'bg-red-100 text-red-900'
    }`}
  >
    {Icon && <Icon className="h-4 w-4" />}
    {children}
  </span>
);

/** Text link with a sliding arrow, used as a section-level action. */
export const SectionLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <PreloadLink
    href={href}
    priority="medium"
    className="group inline-flex items-center gap-2 font-semibold text-red-700 hover:text-red-800"
  >
    <span className="border-b border-red-700/30 pb-0.5 transition-colors group-hover:border-red-800">{children}</span>
    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
  </PreloadLink>
);

/** Left-aligned editorial section header: eyebrow + title on the left, description + action on the right. */
export const SectionHeader = ({
  icon,
  eyebrow,
  title,
  description,
  action,
  as: Heading = 'h2',
}: {
  icon?: IconType;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  as?: 'h1' | 'h2';
}) => (
  <motion.div
    variants={sectionItemVariants}
    className="mb-12 flex flex-col gap-6 sm:mb-16 lg:flex-row lg:items-end lg:justify-between lg:gap-16"
  >
    <div className="max-w-2xl">
      <Eyebrow icon={icon}>{eyebrow}</Eyebrow>
      <Heading className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
        {title}
      </Heading>
    </div>
    {(description || action) && (
      <div className="flex flex-col items-start gap-5 lg:max-w-md lg:pb-2">
        {description && <p className="text-lg leading-relaxed text-gray-600">{description}</p>}
        {action}
      </div>
    )}
  </motion.div>
);
