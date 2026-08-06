import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const FALLBACK_IMAGE = "/ornek-hero.webp";

export function FeedItem({ categoryLabel, ctaLabel, date, href, image, locale = "tr", summary, title, variant = "list" }) {
  const hasCardLayout = variant === "card";

  const body = (
    <div className={hasCardLayout ? "overflow-hidden rounded-[24px] border border-line/80 bg-white shadow-[0_16px_38px_rgba(22,32,51,0.06)]" : ""}>
      {hasCardLayout ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-surface">
          <Image alt={title} className="object-cover transition duration-700 group-hover:scale-[1.03]" fill sizes="(max-width: 768px) 100vw, 24rem" src={image || FALLBACK_IMAGE} />
          <div className="absolute inset-0 bg-linear-to-t from-ink/20 via-transparent to-transparent" />
        </div>
      ) : null}

      <div className={hasCardLayout ? "p-5" : "flex items-start justify-between gap-4"}>
        <div className="min-w-0">
          {categoryLabel ? <Badge className="rounded-full bg-primary-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-dark">{categoryLabel}</Badge> : null}
          {date ? (
            <time className="mt-3 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted" dateTime={date}>
              {formatDate(date, locale)}
            </time>
          ) : null}
          <h3
            className={
              hasCardLayout
                ? "mt-2 font-heading text-xl font-semibold leading-snug tracking-tight text-ink transition group-hover:text-secondary-dark"
                : "mt-2 font-heading text-lg font-semibold leading-snug tracking-tight text-ink transition group-hover:text-secondary-dark md:text-xl"
            }
          >
            {title}
          </h3>
          {summary ? <p className="mt-2 line-clamp-3 text-sm leading-7 text-muted">{summary}</p> : null}
        </div>

        {!hasCardLayout ? (
          <ArrowUpRight aria-hidden="true" className="mt-1 size-4 shrink-0 text-ink/30 transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-secondary" />
        ) : null}
      </div>

      {hasCardLayout ? (
        <div className="flex items-center justify-between border-t border-line/80 px-5 py-4 text-sm font-semibold text-ink/75 transition group-hover:text-secondary-dark">
          <span>{ctaLabel}</span>
          <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      ) : null}
    </div>
  );

  return hasCardLayout ? (
    <article>
      {href ? (
        <Link className="group block focus-ring rounded-[24px]" href={href}>
          {body}
        </Link>
      ) : (
        body
      )}
    </article>
  ) : (
    <article className="border-b border-line/70 py-5 last:border-b-0 first:pt-1">
      {href ? (
        <Link className="group focus-ring block rounded-lg" href={href}>
          {body}
        </Link>
      ) : (
        body
      )}
    </article>
  );
}
