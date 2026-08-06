import { ArrowUpRight, MessageCircleQuestion } from "lucide-react";
import { Link } from "@/i18n/navigation";

function FooterCtaLink({ children, href, variant = "primary" }) {
  const baseClassName = "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition duration-200";
  const variantClassName =
    variant === "secondary"
      ? "border border-line/80 bg-white/70 text-ink shadow-[0_10px_24px_rgba(22,32,51,0.05)] hover:-translate-y-0.5 hover:border-primary-dark/30 hover:text-primary-dark"
      : "bg-secondary text-white shadow-[0_14px_32px_rgba(135,11,24,0.18)] hover:-translate-y-0.5 hover:bg-secondary-dark";

  return (
    <Link className={`${baseClassName} ${variantClassName}`} href={href}>
      {children}
      <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={1.9} />
    </Link>
  );
}

export function FooterCta({ t }) {
  return (
    <section aria-labelledby="footer-cta-title" className="relative gridContainer">
      <div className="py-8 md:py-10">
        <div className="relative overflow-hidden rounded-none border-y border-line/80 bg-white/62 px-5 py-6 shadow-[0_18px_48px_rgba(22,32,51,0.07)] backdrop-blur-sm md:px-7 lg:px-9">
          <div aria-hidden="true" className="absolute inset-0 footer-cta-sheen opacity-70" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex max-w-3xl gap-4">
              <span className="mt-0.5 inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-primary-dark/15 bg-primary-soft text-primary-dark shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                <MessageCircleQuestion aria-hidden="true" className="size-5" strokeWidth={1.8} />
              </span>
              <div>
                <h2 id="footer-cta-title" className="font-heading text-xl font-semibold leading-tight text-ink md:text-2xl">
                  {t("ctaTitle")}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">{t("ctaText")}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
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
