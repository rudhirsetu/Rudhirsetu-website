'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

type CopyStatus = 'idle' | 'copied' | 'failed';

/**
 * Copy text with a graceful fallback chain:
 * 1. Async Clipboard API (secure contexts only)
 * 2. Hidden textarea + execCommand('copy') (older browsers, http, iOS in-app browsers)
 */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Permission denied or unsupported: fall through to the legacy path.
  }

  try {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('aria-hidden', 'true');
    textarea.setAttribute('tabindex', '-1');
    // 16px stops iOS Safari from zooming when the textarea is focused.
    Object.assign(textarea.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '1px',
      height: '1px',
      padding: '0',
      border: '0',
      opacity: '0',
      fontSize: '16px',
    });
    document.body.appendChild(textarea);
    textarea.focus({ preventScroll: true });
    textarea.select();
    // iOS Safari ignores select() on its own, it needs an explicit range.
    textarea.setSelectionRange(0, text.length);
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);
    previouslyFocused?.focus?.({ preventScroll: true });
    return copied;
  } catch {
    return false;
  }
}

/** Highlight an element's text so the visitor can copy it by hand if automatic copy is blocked. */
function selectContents(element: HTMLElement | null) {
  if (!element) return;
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  range.selectNodeContents(element);
  selection.removeAllRanges();
  selection.addRange(range);
}

interface DetailRowProps {
  label: string;
  value: string;
  /** Render for the dark maroon surface. */
  dark?: boolean;
}

/** One ledger row of payment details: label, value exactly as provided, and a copy button. */
export default function DetailRow({ label, value, dark = false }: DetailRowProps) {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const valueRef = useRef<HTMLParagraphElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleCopy = async () => {
    const ok = await copyToClipboard(value);
    if (!ok) selectContents(valueRef.current);
    setStatus(ok ? 'copied' : 'failed');
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus('idle'), ok ? 2000 : 4000);
  };

  const idle = dark
    ? 'border-white/25 text-white hover:bg-white/10'
    : 'border-red-900/15 text-gray-900 hover:bg-paper';
  const done = dark
    ? 'border-white bg-white text-red-900'
    : 'border-red-700 bg-red-700 text-white';

  return (
    <li className={`flex items-center justify-between gap-4 border-b py-4 ${dark ? 'border-white/15' : 'border-red-900/10'}`}>
      <div className="min-w-0">
        <p className={`text-sm ${dark ? 'text-white/60' : 'text-gray-500'}`}>{label}</p>
        <p
          ref={valueRef}
          className={`mt-0.5 font-display text-xl font-semibold tracking-tight tabular-nums [overflow-wrap:anywhere] ${
            dark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {value}
        </p>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy ${label}`}
        className={`inline-flex h-10 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
          dark ? 'focus-visible:outline-white' : 'focus-visible:outline-red-600'
        } ${status === 'copied' ? done : idle}`}
      >
        {status === 'copied' ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
        <span aria-hidden="true">
          {status === 'copied' ? 'Copied' : status === 'failed' ? 'Copy manually' : 'Copy'}
        </span>
      </button>

      <span role="status" aria-live="polite" className="sr-only">
        {status === 'copied' && `${label} copied to clipboard`}
        {status === 'failed' && `Could not copy automatically. ${label} is selected, copy it manually.`}
      </span>
    </li>
  );
}
