"use client";

import CornerShape from "@/components/common/cornerShape";

function padIndex(value) {
  return String(value).padStart(2, "0");
}

/**
 * Vertical pagination — vertically centered on the right edge.
 */
export function HeroSidePagination({ activeIndex, total, onSelect, className = "" }) {
  if (total < 2) return null;

  const progress = ((activeIndex + 1) / total) * 100;

  return (
    <div
      className={`pointer-events-auto flex flex-col items-center gap-1.5 rounded-tl-lg bg-white py-1.5 pl-1.5 pr-1 sm:gap-2.5 sm:rounded-tl-xl sm:py-2.5 sm:pl-2.5 sm:pr-1.5 md:gap-3 md:rounded-l-xl ${className}`}
    >
      <CornerShape className="absolute -top-2.5 -rotate-90 left-auto right-0 h-2.5 w-2.5 text-white sm:-top-3.5 sm:h-3.5 sm:w-3.5" />
      <CornerShape className="absolute bottom-0 top-auto -rotate-90 -left-2.5 right-auto h-2.5 w-2.5 text-white sm:-left-3.5 sm:h-3.5 sm:w-3.5 md:-bottom-3.5 md:-rotate-180 md:left-auto md:right-0" />
      <button
        type="button"
        aria-label={`${activeIndex + 1} / ${total}`}
        className="focus-ring font-sans text-[8px] font-medium tracking-[0.14em] text-ink/85 transition-colors hover:text-ink sm:text-[10px] sm:tracking-[0.2em]"
        onClick={() => onSelect?.(0)}
      >
        . {padIndex(activeIndex + 1)} .
      </button>

      <div className="relative h-10 w-px bg-black/25 sm:h-16 md:h-24 lg:h-28">
        <span aria-hidden="true" className="absolute inset-x-0 top-0 w-px bg-black transition-[height] duration-300 ease-out" style={{ height: `${progress}%` }} />
      </div>

      <button
        type="button"
        aria-label={`${total} / ${total}`}
        className="focus-ring font-sans text-[8px] font-medium tracking-[0.14em] text-ink/45 transition-colors hover:text-ink sm:text-[10px] sm:tracking-[0.2em]"
        onClick={() => onSelect?.(total - 1)}
      >
        . {padIndex(total)} .
      </button>
    </div>
  );
}
