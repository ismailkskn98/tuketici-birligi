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
    <div className={`pointer-events-auto flex flex-col items-center gap-2.5 rounded-tl-xl md:rounded-l-xl bg-white py-2.5 pl-2.5 pr-1.5 sm:gap-3 ${className}`}>
      <CornerShape className="absolute -top-3.5 -rotate-90 left-auto right-0 h-3.5 w-3.5 text-white" />
      <CornerShape className="absolute bottom-0 md:-bottom-3.5 top-auto -rotate-90 md:-rotate-180 -left-3.5 right-auto md:left-auto md:right-0 h-3.5 w-3.5 text-white" />
      <button
        type="button"
        aria-label={`${activeIndex + 1} / ${total}`}
        className="focus-ring font-sans text-[10px] font-medium tracking-[0.2em] text-ink/85 transition-colors hover:text-ink"
        onClick={() => onSelect?.(0)}
      >
        . {padIndex(activeIndex + 1)} .
      </button>

      <div className="relative h-16 w-px bg-black/25 sm:h-24 md:h-28">
        <span aria-hidden="true" className="absolute inset-x-0 top-0 w-px bg-black transition-[height] duration-300 ease-out" style={{ height: `${progress}%` }} />
      </div>

      <button
        type="button"
        aria-label={`${total} / ${total}`}
        className="focus-ring font-sans text-[10px] font-medium tracking-[0.2em] text-ink/45 transition-colors hover:text-ink"
        onClick={() => onSelect?.(total - 1)}
      >
        . {padIndex(total)} .
      </button>
    </div>
  );
}
