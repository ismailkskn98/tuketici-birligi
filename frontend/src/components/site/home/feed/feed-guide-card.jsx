import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function FeedGuideCard({ badgeLabel, guide, readMoreLabel }) {
  return (
    <Link
      className="group flex h-full min-h-44 flex-col justify-between rounded-xl bg-white p-5 shadow-[0_12px_36px_rgba(22,32,51,0.04)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(22,32,51,0.07)] sm:min-h-48 sm:rounded-2xl sm:p-6 md:min-h-44 md:p-5 lg:min-h-48 lg:p-6 xl:min-h-52 xl:p-7 2xl:p-8"
      href={`/hak-rehberleri/${guide.slug}`}
    >
      <div className="grid gap-2.5 sm:gap-3 md:gap-2.5 lg:gap-3">
        <span className="inline-flex w-fit items-center text-[10px] font-bold uppercase tracking-[0.16em] text-secondary">{badgeLabel}</span>
        <h3 className="font-heading text-lg font-semibold leading-snug tracking-tight text-ink transition group-hover:text-secondary-dark md:text-[1.05rem] lg:text-lg xl:text-xl">{guide.title}</h3>
        {guide.summary ? <p className="text-sm font-light leading-6 text-muted md:text-[13px] md:leading-5 lg:text-sm lg:leading-6 xl:leading-7">{guide.summary}</p> : null}
      </div>

      <div className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-ink transition group-hover:text-secondary-dark sm:mt-7 md:mt-6 md:text-[11px] lg:mt-7 xl:mt-8 xl:text-[12px]">
        <span>{readMoreLabel}</span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-3.5 text-secondary transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>
    </Link>
  );
}
