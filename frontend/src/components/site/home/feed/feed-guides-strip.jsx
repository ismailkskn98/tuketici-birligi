import { ArrowUpRight } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Link } from "@/i18n/navigation";
import { FeedGuideCard } from "./feed-guide-card";

export function FeedGuidesStrip({ badgeLabel, description, guides = [], eyebrow, readMoreLabel, title, viewAllHref, viewAllLabel }) {
  if (!guides.length) return null;

  return (
    <Reveal as="section" className="mt-16 md:mt-20" viewport={{ once: true, amount: 0.18 }}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
        <div className="min-w-0 max-w-3xl">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-secondary">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-secondary" />
            {eyebrow}
          </span>
          <h2 className="mt-3 font-heading text-[1.85rem] font-semibold leading-[1.12] tracking-tight text-ink md:text-[2.35rem]">{title}</h2>
        </div>

        <Link
          className="focus-ring inline-flex shrink-0 items-center gap-1.5 self-start text-[12px] font-bold uppercase tracking-[0.12em] text-ink transition hover:text-secondary-dark md:self-end"
          href={viewAllHref}
        >
          {viewAllLabel}
          <ArrowUpRight aria-hidden="true" className="size-3.5" />
        </Link>
      </div>

      <Stagger className="mt-8 grid gap-6 md:grid-cols-2 md:gap-8" stagger={0.08} viewport={{ once: true, amount: 0.2 }}>
        {guides.map((guide) => (
          <StaggerItem key={guide.slug}>
            <FeedGuideCard badgeLabel={badgeLabel} guide={guide} readMoreLabel={readMoreLabel} />
          </StaggerItem>
        ))}
      </Stagger>
    </Reveal>
  );
}
