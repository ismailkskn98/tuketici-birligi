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
        <div className="grid min-h-17.5 grid-cols-[1fr_auto] items-stretch gap-6 md:min-h-20 xl:grid-cols-[1fr_auto_1fr] xl:gap-10">
          <div className="flex items-center py-3 md:py-4">
            <HeaderBrand shortName={settings.shortName} tagline={t("tagline")} />
          </div>

          <div className="hidden h-full justify-self-center xl:block">
            <SiteNavbar />
          </div>

          <div className="flex w-full items-center justify-end gap-3 py-4 sm:gap-4 md:py-5">
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
