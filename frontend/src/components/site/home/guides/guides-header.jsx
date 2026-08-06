import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export function GuidesHeader({ description, eyebrow, title, viewAllHref, viewAllLabel }) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        <h2 className="mt-3 text-balance font-heading text-3xl font-semibold leading-[1.08] tracking-tight text-ink sm:mt-3.5 md:mt-4 md:text-5xl">{title}</h2>
        {description ? <p className="mt-3 max-w-xl text-base leading-7 text-muted sm:mt-3.5 md:mt-4">{description}</p> : null}
      </div>

      <Link
        className="focus-ring inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white shadow-xs transition hover:bg-ink/90"
        href={viewAllHref}
      >
        {viewAllLabel}
        <ArrowUpRight aria-hidden="true" className="size-4" />
      </Link>
    </div>
  );
}
