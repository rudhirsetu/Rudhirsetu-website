'use client';

import { useSyncExternalStore } from 'react';
import { Smartphone } from 'lucide-react';

const subscribe = () => () => {};

/** True on phones and tablets, where a upi:// link can open an installed UPI app. */
const isTouchDevice = () => {
  const ua = navigator.userAgent;
  const mobileUa = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  // iPadOS reports itself as a Mac, so look for touch support too.
  const iPadOs = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  const coarsePointer = typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
  return mobileUa || iPadOs || coarsePointer;
};

/**
 * UPI deep link button. It only appears on touch devices (a upi:// link does nothing on desktop).
 * useSyncExternalStore renders `false` on the server and during hydration, so there is no mismatch.
 */
export default function UpiPayButton({ href }: { href: string }) {
  const show = useSyncExternalStore(subscribe, isTouchDevice, () => false);
  if (!show) return null;

  return (
    <div className="mt-6">
      <a
        href={href}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-6 py-3.5 font-semibold text-red-900 transition-colors hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <Smartphone className="h-4 w-4" aria-hidden="true" />
        Pay with your UPI app
      </a>
      <p className="mt-3 text-center text-sm text-white/60">Opens your UPI app with our UPI ID filled in.</p>
    </div>
  );
}
