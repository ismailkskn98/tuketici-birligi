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
          <div className="grid min-h-[88px] grid-cols-[1fr_auto] items-stretch gap-6 md:min-h-[96px] xl:grid-cols-[1fr_auto_1fr] xl:gap-10">
            <div className="flex items-center py-4 md:py-5">
              <HeaderBrand shortName={settings.shortName} tagline={t("tagline")} />
            </div>

            <div className="hidden h-full justify-self-center xl:block">
              <SiteNavbar />
            </div>

            <div className="flex items-center justify-self-end gap-3 py-4 sm:gap-4 md:py-5">
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
