'use client';

import { useEffect, useLayoutEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

// Reuse formatters: building an Intl.NumberFormat on every animation frame is slow.
const groupedFormatter = new Intl.NumberFormat("en-US", {
  useGrouping: true,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const plainFormatter = new Intl.NumberFormat("en-US", {
  useGrouping: false,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const formatNumber = (value: number, separator: string) => {
  const rounded = Math.round(value) || 0; // `|| 0` avoids "-0"
  if (!separator) return plainFormatter.format(rounded);
  return groupedFormatter.format(rounded).replace(/,/g, separator);
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Animated number. The server (and no-JS / crawlers / reduced-motion users)
 * always gets the final value, already formatted, so there is no empty span
 * and no layout shift. When JS runs and motion is allowed, the number resets
 * to `from` and springs to the end value once it scrolls into view.
 */
export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  startWhen = true,
  separator = "",
  onStart,
  onEnd,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? to : from);

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);

  const springValue = useSpring(motionValue, {
    damping,
    stiffness,
  });

  const isInView = useInView(ref, { once: true, margin: "0px" });

  const startValue = direction === "down" ? to : from;
  const endValue = direction === "down" ? from : to;

  // Before the animation runs, show the start value (unless motion is reduced,
  // in which case the server-rendered final value is simply kept).
  useLayoutEffect(() => {
    if (ref.current && !prefersReducedMotion()) {
      ref.current.textContent = formatNumber(startValue, separator);
    }
  }, [startValue, separator]);

  useEffect(() => {
    if (!isInView || !startWhen) return;

    onStart?.();

    if (prefersReducedMotion()) {
      // No counting: keep the final value and report completion straight away.
      if (ref.current) ref.current.textContent = formatNumber(endValue, separator);
      onEnd?.();
      return;
    }

    const timeoutId = setTimeout(() => {
      motionValue.set(endValue);
    }, delay * 1000);

    const durationTimeoutId = setTimeout(() => {
      onEnd?.();
    }, delay * 1000 + duration * 1000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(durationTimeoutId);
    };
  }, [isInView, startWhen, motionValue, endValue, separator, delay, onStart, onEnd, duration]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = formatNumber(latest, separator);
      }
    });

    return () => unsubscribe();
  }, [springValue, separator]);

  return (
    <span className={`tabular-nums ${className}`.trim()} ref={ref} suppressHydrationWarning>
      {formatNumber(endValue, separator)}
    </span>
  );
}
