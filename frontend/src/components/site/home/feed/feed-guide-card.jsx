import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function FeedGuideCard({ badgeLabel, guide, readMoreLabel }) {
  return (
    <Link
      className="group flex h-full min-h-52 flex-col justify-between rounded-2xl bg-white p-7 shadow-[0_12px_36px_rgba(22,32,51,0.04)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(22,32,51,0.07)] md:p-8"
      href={`/hak-rehberleri/${guide.slug}`}
    >
      <div className="grid gap-3">
        <span className="inline-flex w-fit items-center text-[10px] font-bold uppercase tracking-[0.16em] text-secondary">{badgeLabel}</span>
        <h3 className="font-heading text-xl font-semibold leading-snug tracking-tight text-ink transition group-hover:text-secondary-dark">{guide.title}</h3>
        {guide.summary ? <p className="text-sm font-light leading-7 text-muted">{guide.summary}</p> : null}
      </div>

      <div className="mt-8 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-ink transition group-hover:text-secondary-dark">
        <span>{readMoreLabel}</span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-3.5 text-secondary transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>
    </Link>
  );
}
