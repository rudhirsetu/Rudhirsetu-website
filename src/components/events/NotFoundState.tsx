import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Eyebrow } from '../ui/Section';
import { btnPrimary, btnSecondary, focusRing } from './styles';

interface NotFoundAction {
  href: string;
  label: string;
}

interface NotFoundStateProps {
  eyebrow: string;
  title: ReactNode;
  message: ReactNode;
  primary: NotFoundAction;
  secondary?: NotFoundAction;
  /** Optional row of quieter text links shown under the buttons. */
  links?: NotFoundAction[];
}

/** Friendly 404 / missing-content state: lost-drop illustration, short message, two ways out. */
export default function NotFoundState({
  eyebrow,
  title,
  message,
  primary,
  secondary,
  links,
}: NotFoundStateProps) {
  return (
    <section className="flex min-h-[80vh] supports-[height:100svh]:min-h-[85svh] items-center bg-white px-4 pb-20 pt-32 sm:px-6 sm:pb-24 sm:pt-36 lg:px-8 lg:pb-32">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <img
          src="/images/illustrations/not-found.webp"
          alt=""
          aria-hidden="true"
          width={530}
          height={720}
          className="mb-8 h-48 w-auto sm:h-60"
        />
        <Eyebrow center>{eyebrow}</Eyebrow>
        <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">{message}</p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link href={primary.href} className={btnPrimary}>
            {primary.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          {secondary && (
            <Link href={secondary.href} className={btnSecondary}>
              {secondary.label}
            </Link>
          )}
        </div>

        {links && links.length > 0 && (
          <nav
            aria-label="Helpful links"
            className="mt-12 flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-red-900/10 pt-6 text-sm"
          >
            <span className="text-gray-500">Or try</span>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-semibold text-red-700 underline decoration-red-700/30 underline-offset-4 transition-colors hover:text-red-800 hover:decoration-red-800 ${focusRing}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
