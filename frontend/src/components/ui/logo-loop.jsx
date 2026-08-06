import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Infinite logo strip — CSS marquee (globals.css).
 * No client hooks; safe as a Server Component when imported from server parents.
 */
function LogoItem({ item }) {
  if (item.src) {
    return (
      <div className="group flex h-12 shrink-0 items-center justify-center px-12 md:h-14">
        <Image src={item.src} alt={item.alt || ""} width={140} height={48} className="h-8 w-auto max-w-30 object-contain md:h-10 md:max-w-35" />
      </div>
    );
  }

  return (
    <div className="flex h-12 shrink-0 items-center px-4 md:h-14">
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
      <div className={cn("w-full marquee-track flex items-center", pauseOnHover && "marquee-track-pause-hover")}>
        <LogoGroup logos={logos} />
        <LogoGroup logos={logos} ariaHidden />
      </div>
    </div>
  );
}
