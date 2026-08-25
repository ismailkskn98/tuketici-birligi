import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { SocialLinks } from "@/components/site/header/social-links";

export function FooterBrand({ orgName, settings, t, year }) {
  return (
    <div className="flex flex-col items-center gap-5 py-8 sm:gap-6 sm:py-9 md:gap-6 md:py-10 lg:py-12 2xl:gap-8 2xl:py-14">
      <Link aria-label={t("brandHome")} className="focus-ring group flex max-w-full flex-col items-center gap-3 rounded-2xl px-2 sm:flex-row sm:gap-4 md:gap-5" href="/">
        <Image
          alt=""
          className="pointer-events-none size-14 shrink-0 select-none object-contain drop-shadow-[0_12px_22px_rgba(26,33,62,0.12)] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04] sm:size-16 md:size-18 lg:size-20 2xl:size-24"
          draggable={false}
          height={96}
          src="/main-logo-yazisiz.svg"
          width={96}
        />
        <span className="max-w-[15ch] text-center font-heading text-[clamp(1.75rem,5.2vw,2.75rem)] font-semibold leading-[0.98] tracking-normal text-ink transition-colors duration-300 group-hover:text-primary sm:max-w-none sm:text-left md:text-[clamp(2rem,4vw,3.25rem)] xl:text-[clamp(2.35rem,3.8vw,3.75rem)] 2xl:text-[clamp(2.75rem,3.5vw,4.4rem)]">
          {settings.shortName || orgName}
        </span>
      </Link>

      <div className="grid justify-items-center gap-4 sm:gap-5">
        <p className="max-w-2xl text-center text-[11px] leading-relaxed text-muted sm:text-xs md:text-[13px]">
          <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            © {year} {orgName}. {t("rights")}
            <span aria-hidden="true" className="text-line">
              /
            </span>
            <a className="focus-ring group inline-flex w-fit items-center gap-1.5 rounded-sm transition" href="https://markaforce.com" rel="noopener noreferrer" target="_blank">
              <Image alt="" className="h-auto w-4 grayscale group-hover:grayscale-0" height={15} src="/markaforce.png" width={16} />
              <span className="group-hover:text-black">MarkaForce</span>
            </a>
          </span>
          {settings.description ? <span className="mt-1 block line-clamp-2 text-muted/80">{settings.description}</span> : null}
        </p>

        <div aria-label={t("socialLabel")}>
          <SocialLinks
            className="gap-2.5 rounded-full border border-line/80 bg-white/80 px-3.5 py-1.5 shadow-[0_14px_34px_rgba(22,32,51,0.07)] backdrop-blur-sm transition duration-200 hover:border-primary-dark/25 sm:gap-3 sm:px-4 sm:py-2"
            iconClassName="size-4 sm:size-4.5"
            settings={settings}
            tone="dark"
          />
        </div>
      </div>
    </div>
  );
}
