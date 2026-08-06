import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CutoutCorner } from "@/components/ui/cutout-card";

const FALLBACK_IMAGE = "/ornek-hero.png";

export function GuideCard({ badgeLabel, guide, locale = "tr", readMoreLabel, variant = "default" }) {
  const isFeatured = variant === "featured";
  const image = guide.cover_image || guide.image || FALLBACK_IMAGE;

  return (
    <Link
      className={
        isFeatured
          ? "group relative grid overflow-hidden rounded-[28px] border border-line/80 bg-white shadow-[0_20px_50px_rgba(22,32,51,0.08)] transition duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-soft lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
          : "group relative flex h-full min-h-56 flex-col justify-between overflow-hidden rounded-[24px] border border-line/80 bg-white p-6 shadow-[0_18px_45px_rgba(22,32,51,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-soft"
      }
      href={`/hak-rehberleri/${guide.slug}`}
    >
      <span className="absolute right-0 top-0 rounded-bl-[18px] bg-secondary px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
        {badgeLabel}
        <CutoutCorner className="absolute -bottom-[23px] right-0 -rotate-90 text-secondary" size={24} />
        <CutoutCorner className="absolute -left-[23px] top-0 -rotate-90 text-secondary" size={24} />
      </span>

      {isFeatured ? (
        <>
          <div className="relative min-h-72 overflow-hidden bg-surface">
            <Image
              alt={guide.title}
              className="object-cover transition duration-700 group-hover:scale-[1.03]"
              fill
              sizes="(max-width: 1024px) 100vw, 40rem"
              src={image}
            />
            <div className="absolute inset-0 bg-linear-to-tr from-ink/35 via-transparent to-transparent" />
          </div>

          <div className="flex min-h-full flex-col justify-between p-6 md:p-8">
            <div className="grid gap-4 pr-12">
              {guide.published_at ? (
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  {new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }).format(new Date(guide.published_at))}
                </p>
              ) : null}
              <h3 className="font-heading text-3xl font-semibold leading-tight tracking-tight text-ink md:text-[2.35rem]">
                {guide.title}
              </h3>
              {guide.summary ? <p className="max-w-xl text-sm leading-7 text-muted md:text-[15px]">{guide.summary}</p> : null}
            </div>

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-line/80 pt-4">
              <span className="text-sm font-semibold text-ink">{readMoreLabel}</span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 text-ink/45 transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-secondary"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid gap-3 pr-16">
            <h3 className="font-heading text-xl font-semibold leading-snug tracking-tight text-ink md:text-[1.35rem]">
              {guide.title}
            </h3>
            {guide.summary ? <p className="line-clamp-3 text-sm leading-7 text-muted">{guide.summary}</p> : null}
          </div>

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-line/80 pt-4">
            <span className="text-sm font-semibold text-ink">{readMoreLabel}</span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 text-ink/45 transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-secondary"
            />
          </div>
        </>
      )}
    </Link>
  );
}
