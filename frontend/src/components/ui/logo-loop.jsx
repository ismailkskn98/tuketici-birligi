import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Infinite logo strip — CSS marquee (globals.css).
 * No client hooks; safe as a Server Component when imported from server parents.
 */
function LogoItem({ item }) {
  if (item.src) {
    return (
      <div className="group flex h-11 shrink-0 items-center justify-center px-8 sm:px-9 md:h-12 md:px-9 lg:px-8 xl:px-9 2xl:h-14 2xl:px-12">
        <Image
          src={item.src}
          alt={item.alt || ""}
          width={140}
          height={48}
          className="h-7 w-auto max-w-24 object-contain sm:h-8 sm:max-w-28 md:h-8 md:max-w-28 lg:h-8 lg:max-w-26 xl:h-9 xl:max-w-30 2xl:h-10 2xl:max-w-35"
        />
      </div>
    );
  }

  return (
    <div className="flex h-11 shrink-0 items-center px-4 md:h-12 2xl:h-14">
      <span className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-weecomi-dark-gray/70">{item.label || item.alt}</span>
    </div>
  );
}

function LogoGroup({ logos, ariaHidden = false }) {
  const items = [...logos, ...logos];

  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden || undefined}>
      {items.map((item, index) => (
        <LogoItem key={`${item.alt || item.label}-${index}`} item={item} />
      ))}
    </div>
  );
}

export default function LogoLoop({ logos = [], className, pauseOnHover = false, fade = true, "aria-label": ariaLabel }) {
  if (!logos.length) return null;

  return (
    <div className={cn("overflow-hidden w-full", fade && "marquee-fade", className)} aria-label={ariaLabel}>
      <div className={cn("marquee-track flex w-max items-center", pauseOnHover && "marquee-track-pause-hover")}>
        <LogoGroup logos={logos} />
        <LogoGroup logos={logos} ariaHidden />
      </div>
    </div>
  );
}
