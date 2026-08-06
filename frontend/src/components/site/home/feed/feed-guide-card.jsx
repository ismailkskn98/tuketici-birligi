import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function FeedGuideCard({ badgeLabel, guide, readMoreLabel }) {
  return (
    <Link
      className="group flex h-full min-h-48 flex-col justify-between rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(22,32,51,0.05)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(22,32,51,0.08)]"
      href={`/hak-rehberleri/${guide.slug}`}
    >
      <div className="grid gap-3">
        <span className="inline-flex w-fit items-center rounded-full bg-secondary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-secondary">
          {badgeLabel}
        </span>
        <h3 className="font-heading text-xl font-semibold leading-snug tracking-tight text-ink transition group-hover:text-secondary-dark">
          {guide.title}
        </h3>
        {guide.summary ? <p className="text-sm leading-7 text-muted">{guide.summary}</p> : null}
      </div>

      <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink/72 transition group-hover:text-secondary-dark">
        <span>{readMoreLabel}</span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>
    </Link>
  );
}
