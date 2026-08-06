import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { SocialLinks } from "@/components/site/header/social-links";

export function FooterBrand({ orgName, settings, t, year }) {
  return (
    <div className="flex flex-col items-center gap-7 py-10 md:gap-8 md:py-14 lg:py-16">
      <Link aria-label={t("brandHome")} className="focus-ring group flex max-w-full flex-col items-center gap-4 rounded-2xl px-2 sm:flex-row sm:gap-5" href="/">
        <Image
          alt=""
          className="pointer-events-none size-16 shrink-0 select-none object-contain drop-shadow-[0_12px_22px_rgba(22,32,51,0.10)] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04] sm:size-20 md:size-24"
          draggable={false}
          height={96}
          src="/logo.svg"
          width={96}
        />
        <span className="max-w-[15ch] text-center font-heading text-[clamp(2rem,6vw,4.4rem)] font-semibold leading-[0.98] tracking-normal text-secondary transition-colors duration-300 group-hover:text-secondary-dark sm:max-w-none sm:text-left">
          {settings.shortName || orgName}
        </span>
      </Link>

      <div className="grid justify-items-center gap-5">
        <p className="max-w-2xl text-center text-xs leading-relaxed text-muted md:text-[13px]">
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
            className="gap-3 rounded-full border border-line/80 bg-white/80 px-4 py-2 shadow-[0_14px_34px_rgba(22,32,51,0.07)] backdrop-blur-sm transition duration-200 hover:border-primary-dark/25"
            iconClassName="size-4.5"
            settings={settings}
            tone="dark"
          />
        </div>
      </div>
    </div>
  );
}
