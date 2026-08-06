import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { SiteNavbar } from "@/components/site/navbar";
import { ApplicationCta } from "@/components/site/application-form";
import { HeaderBrand } from "./brand";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNavDrawer } from "./mobile-nav";
import { SiteSearch } from "./search";
import { SocialLinks } from "./social-links";
import { StickyMainBar } from "./sticky-main-bar";

export async function Header({ settings }) {
  const t = await getTranslations("Header");

  return (
    <header className="contents">
      {/* bu üst taraf şimdilik yorum satırı kalacak */}
      <Reveal className="gridContainer bg-primary-foreground text-white" duration={0.55} viewport={{ once: true, amount: 0.9 }} y={8}>
        <div className="flex min-h-9 items-center justify-end gap-4 py-1.5">
          <SocialLinks settings={settings} />
          <span aria-hidden="true" className="h-3 w-px bg-white/50" />
          <Suspense fallback={<div className="h-4 w-12" />}>
            <LanguageSwitcher />
          </Suspense>
        </div>
      </Reveal>

      <StickyMainBar>
        <Reveal className="gridContainer" delay={0.04} duration={0.6} viewport={{ once: true, amount: 0.9 }} y={10}>
          <div className="grid min-h-[72px] grid-cols-[minmax(0,1fr)_auto] items-center gap-2 md:min-h-[80px] lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-2 xl:min-h-[88px] xl:gap-4 2xl:min-h-[96px] 2xl:gap-6">
            <div className="flex min-w-0 items-center py-2 md:py-2.5 lg:py-2 xl:py-3">
              <HeaderBrand shortName={settings.shortName} tagline={t("tagline")} />
            </div>

            <div className="hidden min-w-0 lg:flex lg:h-full lg:items-stretch lg:justify-center">
              <SiteNavbar />
            </div>

            <div className="flex shrink-0 items-center justify-end gap-1.5 py-2 sm:gap-2 md:py-2.5 lg:gap-1.5 xl:gap-3 xl:py-3">
              <div className="hidden sm:block">
                <SiteSearch />
              </div>

              <div className="hidden md:block">
                <ApplicationCta />
              </div>
              <MobileNavDrawer settings={settings} />
            </div>
          </div>
        </Reveal>
      </StickyMainBar>
    </header>
  );
}
