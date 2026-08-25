import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function FeedGuideCard({ badgeLabel, guide, readMoreLabel }) {
  return (
    <Link
      className="group flex h-full min-h-44 flex-col rounded-2xl border border-line/70 bg-white p-5 shadow-[0_1px_0_rgba(26,33,62,0.02),0_12px_36px_-24px_rgba(26,33,62,0.10)] transition duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:border-line hover:shadow-[0_2px_0_rgba(26,33,62,0.03),0_20px_44px_-24px_rgba(26,33,62,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/60 sm:min-h-48 sm:p-6 md:min-h-44 md:p-5 lg:min-h-48 lg:p-6 xl:min-h-52 xl:p-7"
      href={`/hak-rehberleri/${guide.slug}`}
    >
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-line/70 bg-surface/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/70">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-secondary" />
        {badgeLabel}
      </span>

      <div className="mt-4 grid gap-2.5">
        <h3 className="text-balance font-heading text-[1.05rem] font-semibold leading-snug tracking-tight text-ink transition-colors duration-300 group-hover:text-ink md:text-[1.05rem] lg:text-[1.15rem] xl:text-[1.2rem]">
          {guide.title}
        </h3>
        {guide.summary ? (
          <p className="text-[13.5px] leading-6 text-muted md:text-[13px] md:leading-5 lg:text-sm lg:leading-6 xl:leading-7">
            {guide.summary}
          </p>
        ) : null}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line/60 pt-4">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">
          Konu rehberi
        </span>
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink transition-colors duration-300 group-hover:text-secondary-dark">
          {readMoreLabel}
          <ArrowUpRight
            aria-hidden="true"
            className="size-3.5 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
