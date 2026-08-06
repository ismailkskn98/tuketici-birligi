import { ArrowUpRight } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Link } from "@/i18n/navigation";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { FeedGuideCard } from "./feed-guide-card";

export function FeedGuidesStrip({ badgeLabel, description, guides = [], eyebrow, readMoreLabel, title, viewAllHref, viewAllLabel }) {
  if (!guides.length) return null;

  return (
    <Reveal as="section" className="mt-10 sm:mt-12 md:mt-14 lg:mt-16 2xl:mt-18" viewport={{ once: true, amount: 0.18 }}>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-6 lg:gap-8 xl:gap-10">
        <div className="min-w-0 max-w-3xl">
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <h2 className="mt-3 font-heading text-[1.65rem] font-semibold leading-[1.12] tracking-tight text-ink sm:mt-3.5 sm:text-[1.85rem] md:mt-4 md:text-[1.9rem] lg:text-[1.85rem] xl:text-[2.15rem] 2xl:text-[2.35rem]">{title}</h2>
        </div>

        <Link
          className="focus-ring inline-flex shrink-0 items-center gap-1.5 self-start text-[11px] font-bold uppercase tracking-[0.12em] text-ink transition hover:text-secondary-dark md:self-end md:text-[12px]"
          href={viewAllHref}
        >
          {viewAllLabel}
          <ArrowUpRight aria-hidden="true" className="size-3.5" />
        </Link>
      </div>

      <Stagger className="mt-6 grid gap-4 sm:mt-7 sm:gap-5 md:mt-7 md:grid-cols-2 md:gap-5 lg:mt-8 lg:gap-6 xl:gap-7 2xl:gap-8" stagger={0.08} viewport={{ once: true, amount: 0.2 }}>
        {guides.map((guide) => (
          <StaggerItem key={guide.slug}>
            <FeedGuideCard badgeLabel={badgeLabel} guide={guide} readMoreLabel={readMoreLabel} />
          </StaggerItem>
        ))}
      </Stagger>
    </Reveal>
  );
}
