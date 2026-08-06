import { getTranslations } from "next-intl/server";
import { SiteNavbar } from "@/components/site/navbar";
import { ApplicationCta } from "@/components/site/application-form";
import { HeaderBrand } from "./brand";
import { MobileNavDrawer } from "./mobile-nav";
import { SiteSearch } from "./search";
import { HeaderChrome2 } from "./header-chrome2";

/**
 * Public site header used by the current marketing layout.
 */
export async function Header2({ settings }) {
  const t = await getTranslations("Header");

  return (
    <header className="contents">
      <HeaderChrome2>
        <div className="grid min-h-14 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:min-h-15 sm:gap-3 md:min-h-16 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-2 xl:min-h-[4.5rem] xl:gap-4 2xl:min-h-20 2xl:gap-6">
          <div className="flex min-w-0 items-center py-2 sm:py-2.5 lg:py-2 xl:py-3">
            <HeaderBrand shortName={settings.shortName} tagline={t("tagline")} />
          </div>

          <div className="hidden min-w-0 lg:flex lg:h-full lg:items-stretch lg:justify-center">
            <SiteNavbar />
          </div>

          <div className="flex shrink-0 items-center justify-end gap-1.5 py-2 sm:gap-2 sm:py-2.5 lg:gap-1.5 xl:gap-3 xl:py-3">
            <div className="hidden sm:block">
              <SiteSearch />
            </div>

            <div className="hidden md:block">
              <ApplicationCta />
            </div>
            <MobileNavDrawer settings={settings} />
          </div>
        </div>
      </HeaderChrome2>
    </header>
  );
}
