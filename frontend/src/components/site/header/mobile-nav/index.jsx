"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { Menu as MenuIcon, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Drawer, DrawerClose, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { navigationMenu } from "@/lib/navigation";
import { LanguageSwitcher } from "../language-switcher";
import { SiteSearch } from "../search";
import { SocialLinks } from "../social-links";
import { MobileSection } from "./mobile-section";

export function MobileNavDrawer({ settings }) {
  const t = useTranslations("Header");
  const tSearch = useTranslations("Search");
  const shortName = settings?.shortName || "Tüketici Birliği";
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  function openSearchFromMenu() {
    setMenuOpen(false);
    setSearchOpen(true);
  }

  return (
    <>
      <Drawer onOpenChange={setMenuOpen} open={menuOpen} swipeDirection="right">
        <DrawerTrigger aria-label={t("openMenu")} className="focus-ring inline-flex size-9 items-center justify-center rounded-full text-ink transition hover:bg-surface sm:size-10 lg:hidden">
          <MenuIcon aria-hidden="true" size={22} strokeWidth={1.75} />
        </DrawerTrigger>

        <DrawerContent className="border-0 bg-white shadow-none data-[swipe-direction=right]:rounded-none data-[swipe-direction=right]:border-0 data-[swipe-axis=x]:w-full data-[swipe-axis=x]:max-w-none data-[swipe-axis=x]:[--drawer-content-width:100%] sm:data-[swipe-axis=x]:[--drawer-content-width:100%]">
          <DrawerTitle className="sr-only">{t("mobileNav")}</DrawerTitle>

          <div className="flex h-dvh flex-col bg-white">
            <div className="flex shrink-0 items-center justify-between gap-3 px-5 py-4">
              <DrawerClose nativeButton={false} render={<Link className="focus-ring flex min-w-0 items-center gap-2 rounded-lg" href="/" />}>
                <Image alt="" className="size-11 shrink-0 rounded-xl object-contain" height={44} src="/logo.svg" width={44} />
                <span className="truncate font-heading text-sm font-medium tracking-tight text-[#870b18]">{shortName}</span>
              </DrawerClose>

              <div className="flex items-center gap-1">
                <button
                  aria-label={tSearch("trigger")}
                  className="focus-ring inline-flex size-10 items-center justify-center rounded-full text-ink/70 transition hover:bg-surface hover:text-ink sm:hidden"
                  onClick={openSearchFromMenu}
                  type="button"
                >
                  <Search aria-hidden="true" className="size-4.5" strokeWidth={1.75} />
                </button>
                <DrawerClose aria-label={t("closeMenu")} className="focus-ring inline-flex size-10 items-center justify-center rounded-full text-ink transition hover:bg-surface">
                  <X aria-hidden="true" size={22} strokeWidth={1.6} />
                </DrawerClose>
              </div>
            </div>

            <div className="relative min-h-0 flex-1">
              <nav aria-label={t("mobileNav")} className="h-full overflow-y-auto px-5 pb-10">
                {navigationMenu.map((entry) => (
                  <MobileSection entry={entry} key={entry.item} />
                ))}
              </nav>
              <ProgressiveBlur blurLevels={[0.4, 1, 2, 4]} className="h-8" height="2rem" position="bottom" />
            </div>

            <div className="grid shrink-0 gap-4 border-t border-line/70 px-5 py-4">
              <DrawerClose
                nativeButton={false}
                render={
                  <Link
                    className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full bg-secondary px-5 font-sans text-sm font-semibold text-white transition hover:bg-secondary-dark"
                    href="/basvuru-yap"
                  />
                }
              >
                {t("cta")}
              </DrawerClose>

              <div className="flex items-center justify-between gap-3">
                <SocialLinks iconClassName="size-4" settings={settings || {}} tone="dark" />
                <Suspense fallback={<div className="h-4 w-12" />}>
                  <LanguageSwitcher />
                </Suspense>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <SiteSearch className="sm:hidden" onOpenChange={setSearchOpen} open={searchOpen} showTrigger={false} />
    </>
  );
}
