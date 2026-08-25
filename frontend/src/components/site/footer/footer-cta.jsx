import { ArrowUpRight, MessageCircleQuestion } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

function FooterCtaLink({ children, href, variant = "primary" }) {
  return (
    <Link
      className={cn(
        "focus-ring inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold transition duration-200 sm:w-auto sm:min-h-10 sm:px-4 sm:text-sm md:min-h-9 md:px-3.5 md:text-[13px] lg:min-h-10 lg:px-4 lg:text-sm 2xl:min-h-11",
        variant === "secondary"
          ? "border border-line/80 bg-white/70 text-ink shadow-[0_10px_24px_rgba(17,17,17,0.05)] hover:-translate-y-0.5 hover:border-ink/20 hover:text-ink"
          : "bg-secondary text-white shadow-[0_14px_32px_rgba(236,99,22,0.22)] hover:-translate-y-0.5 hover:bg-secondary-dark",
      )}
      href={href}
    >
      {children}
      <ArrowUpRight aria-hidden="true" className="size-3.5 md:size-3.5 2xl:size-4" strokeWidth={1.9} />
    </Link>
  );
}

export function FooterCta({ t }) {
  return (
    <section aria-labelledby="footer-cta-title" className="relative gridContainer">
      <div className="py-5 sm:py-6 md:py-7 lg:py-8 2xl:py-10">
        <div className="relative overflow-hidden rounded-2xl border border-line/80 bg-white px-4 py-5 shadow-[0_18px_48px_rgba(22,32,51,0.07)] sm:rounded-none sm:border-x-0 sm:border-y sm:px-5 sm:py-5 md:px-6 md:py-5 lg:px-7 xl:px-8 2xl:px-9 2xl:py-6">
          <div aria-hidden="true" className="absolute inset-0 footer-cta-sheen opacity-70" />
          <div className="relative flex flex-col items-stretch gap-4 sm:gap-5 md:flex-row md:items-center md:justify-between md:gap-5 lg:gap-8 xl:gap-10">
            <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:gap-3.5 sm:text-left md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line/70 bg-surface text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:mt-0.5 sm:size-10 md:size-9 lg:size-10 2xl:size-11">
                <MessageCircleQuestion aria-hidden="true" className="size-4.5 md:size-4 lg:size-5" strokeWidth={1.8} />
              </span>
              <div className="min-w-0">
                <h2 id="footer-cta-title" className="font-heading text-lg font-semibold leading-snug text-ink sm:text-xl md:text-lg lg:text-xl xl:text-[1.35rem] 2xl:text-2xl 2xl:leading-tight">
                  {t("ctaTitle")}
                </h2>
                <p className="mt-1.5 max-w-2xl text-[13px] leading-6 text-muted sm:mt-2 sm:text-sm sm:leading-6 md:mt-1.5 md:text-[13px] md:leading-5 lg:mt-2 lg:text-sm lg:leading-6 xl:leading-7">{t("ctaText")}</p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:justify-center md:shrink-0 md:justify-end">
              <FooterCtaLink href="/basvuru-yap">{t("ctaPrimary")}</FooterCtaLink>
              <FooterCtaLink href="/iletisim" variant="secondary">
                {t("ctaSecondary")}
              </FooterCtaLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
