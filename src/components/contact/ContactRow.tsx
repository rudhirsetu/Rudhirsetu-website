import type { ComponentType, ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';

type IconType = ComponentType<{ className?: string }>;

interface ContactRowProps {
  icon: IconType;
  label: string;
  /** Makes the whole row a link (tel:, mailto:, maps). */
  href?: string;
  external?: boolean;
  children: ReactNode;
}

/** Ledger row: icon circle + label + value, hairline below. Never relies on hover to be usable. */
export default function ContactRow({ icon: Icon, label, href, external = false, children }: ContactRowProps) {
  const content = (
    <>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-paper text-red-700 transition-colors group-hover:bg-red-700 group-hover:text-white">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm text-gray-500">{label}</span>
        <span className="block whitespace-pre-line font-display text-lg font-semibold tracking-tight text-gray-900 [overflow-wrap:anywhere] sm:text-xl">
          {children}
        </span>
        {external && <span className="sr-only">(opens in a new tab)</span>}
      </span>
      {href && (
        <ArrowUpRight className="h-5 w-5 shrink-0 text-red-700/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-red-700" />
      )}
    </>
  );

  return (
    <li className="border-b border-red-900/10">
      {href ? (
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="group flex items-center gap-4 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          {content}
        </a>
      ) : (
        <div className="group flex items-center gap-4 py-5">{content}</div>
      )}
    </li>
  );
}
