import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";

const FALLBACK_IMAGE = "/ornek-hero.png";

export function FeaturedFeedCard({ category, categoryLabel, ctaLabel, date, href, image, locale = "tr", summary, title }) {
  const mediaSrc = image || FALLBACK_IMAGE;

  return (
    <article className="overflow-hidden rounded-[28px] bg-white">
      <Link className="group block focus-ring" href={href}>
        <div className="relative aspect-[16/10] overflow-hidden bg-surface md:aspect-[16/8.6]">
          <Image alt={title} className="object-cover transition duration-700 group-hover:scale-[1.03]" fill sizes="(max-width: 1024px) 100vw, 44rem" src={mediaSrc} />
          <div className="absolute inset-0 bg-linear-to-t from-ink/55 via-ink/10 to-transparent" />

          <div className="absolute left-5 top-5 flex flex-wrap items-center gap-3">
            {categoryLabel ? <Badge className="rounded-full bg-white/96 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink">{categoryLabel}</Badge> : null}
            {category ? <span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">{category}</span> : null}
          </div>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-[auto_minmax(0,1fr)] md:gap-6 md:p-6">
          <div className="shrink-0 md:min-w-18">
            {date ? (
              <>
                <p className="font-heading text-3xl font-semibold leading-none tracking-tight text-secondary md:text-4xl">
                  {new Date(date).toLocaleString(locale === "tr" ? "tr-TR" : "en-GB", {
                    day: "2-digit",
                  })}
                </p>
                <time className="mt-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted" dateTime={date}>
                  {new Date(date).toLocaleString(locale === "tr" ? "tr-TR" : "en-GB", {
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </>
            ) : null}
          </div>

          <div className="min-w-0">
            <h3 className="font-heading text-[1.65rem] font-semibold leading-tight tracking-tight text-ink transition group-hover:text-secondary-dark md:text-[1.95rem]">{title}</h3>
            {summary ? <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{summary}</p> : null}

            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink/75 transition group-hover:text-secondary-dark">
              <span>{ctaLabel}</span>
              <ArrowUpRight aria-hidden="true" className="size-4 transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
