'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

/** 1 … 4 5 6 … 12 */
const getPageItems = (page: number, total: number): Array<number | 'gap-start' | 'gap-end'> => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items: Array<number | 'gap-start' | 'gap-end'> = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);
  if (start > 2) items.push('gap-start');
  for (let p = start; p <= end; p++) items.push(p);
  if (end < total - 1) items.push('gap-end');
  items.push(total);
  return items;
};

const circle =
  'flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2';

export const Pagination = ({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Gallery pages"
      className="mt-12 flex items-center justify-between gap-4 border-t border-red-900/10 pt-6 sm:mt-16"
    >
      <p className="text-sm tabular-nums text-gray-500">
        Page <span className="font-semibold text-gray-900">{page}</span> of {totalPages}
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className={`${circle} border border-red-900/15 text-red-800 hover:border-red-700 hover:bg-red-700 hover:text-white disabled:pointer-events-none disabled:opacity-40`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <ol className="hidden items-center gap-1.5 sm:flex">
          {getPageItems(page, totalPages).map((item) =>
            typeof item === 'number' ? (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => onChange(item)}
                  aria-label={`Page ${item}`}
                  aria-current={item === page ? 'page' : undefined}
                  className={`${circle} ${
                    item === page
                      ? 'bg-red-700 text-white'
                      : 'text-gray-700 hover:bg-paper hover:text-red-700'
                  }`}
                >
                  {item}
                </button>
              </li>
            ) : (
              <li key={item} aria-hidden="true" className="w-6 text-center text-gray-400">
                …
              </li>
            ),
          )}
        </ol>

        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
          className={`${circle} border border-red-900/15 text-red-800 hover:border-red-700 hover:bg-red-700 hover:text-white disabled:pointer-events-none disabled:opacity-40`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </nav>
  );
};
