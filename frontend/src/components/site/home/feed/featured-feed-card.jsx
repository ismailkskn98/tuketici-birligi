import Image from "next/image";
import { Link } from "@/i18n/navigation";

const FALLBACK_IMAGE = "/ornek-hero.webp";

export function FeaturedFeedCard({ category, date, href, image, locale = "tr", summary, title }) {
  const mediaSrc = image || FALLBACK_IMAGE;

  return (
    <article>
      <Link className="group block focus-ring" href={href}>
        <div className="relative aspect-[2.2/1] overflow-hidden rounded-xl bg-surface sm:aspect-[2.35/1] lg:aspect-[2.15/1] lg:rounded-2xl xl:aspect-[2.25/1] 2xl:aspect-[2.35/1]">
          <Image alt={title} className="object-cover transition duration-700 group-hover:scale-[1.02]" fill sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 55vw, 48rem" src={mediaSrc} />

          {category ? (
            <span className="absolute left-3 top-3 rounded-sm bg-secondary px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white lg:left-4 lg:top-4 lg:px-2.5">{category}</span>
          ) : null}
        </div>

        <div className="mt-4 grid gap-4 sm:mt-5 sm:gap-5 md:grid-cols-[auto_minmax(0,1fr)] md:gap-6 lg:mt-4 lg:gap-4 xl:mt-5 xl:gap-6 2xl:gap-7">
          <div className="shrink-0 md:min-w-12 lg:min-w-11 xl:min-w-14 2xl:min-w-15">
            {date ? (
              <>
                <p className="font-heading text-[2rem] font-semibold leading-none tracking-tight text-primary-dark/45 md:text-[2.25rem] lg:text-[1.9rem] xl:text-[2.35rem] 2xl:text-[2.7rem]">
                  {new Date(date).toLocaleString(locale === "tr" ? "tr-TR" : "en-GB", {
                    day: "2-digit",
                  })}
                </p>
                <time className="mt-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-muted lg:mt-1" dateTime={date}>
                  {new Date(date).toLocaleString(locale === "tr" ? "tr-TR" : "en-GB", {
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </>
            ) : null}
          </div>

          <div className="min-w-0">
            <h3 className="font-heading text-[1.2rem] font-semibold leading-snug tracking-tight text-ink transition group-hover:text-secondary-dark sm:text-[1.35rem] lg:text-[1.2rem] xl:text-[1.4rem] 2xl:text-[1.55rem]">
              {title}
            </h3>
            {summary ? (
              <p className="mt-2 max-w-xl text-sm font-light leading-6 text-muted sm:mt-3 sm:leading-7 lg:mt-2 lg:text-[13px] lg:leading-6 xl:mt-3 xl:text-sm xl:leading-7">{summary}</p>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
