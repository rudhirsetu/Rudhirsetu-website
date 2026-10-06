'use client';

export interface CategoryOption {
  id: string;
  label: string;
  count: number;
}

export const CategoryFilter = ({
  options,
  selected,
  onChange,
}: {
  options: CategoryOption[];
  selected: string;
  onChange: (id: string) => void;
}) => (
  <div role="group" aria-label="Filter photos by category" className="flex flex-wrap gap-2">
    {options.map((option) => {
      const isActive = option.id === selected;
      return (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          aria-pressed={isActive}
          className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 ${
            isActive
              ? 'border-red-700 bg-red-700 text-white'
              : 'border-red-900/15 bg-white text-gray-700 hover:border-red-700/40 hover:text-red-700'
          }`}
        >
          {option.label}
          <span className={`ml-2 text-xs tabular-nums ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
            {option.count}
          </span>
        </button>
      );
    })}
  </div>
);
