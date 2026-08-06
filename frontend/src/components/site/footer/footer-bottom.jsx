import { Suspense } from "react";
import { LanguageSwitcher } from "@/components/site/header/language-switcher";
import { FooterLink } from "./footer-link";

export function FooterBottom({ t }) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 py-3.5 text-[11px] text-muted sm:flex-row sm:gap-5 sm:py-4 sm:text-xs md:gap-6">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-4">
        <FooterLink className="text-[11px] sm:text-xs" href="/gizlilik">
          {t("privacy")}
        </FooterLink>
        <FooterLink className="text-[11px] sm:text-xs" href="/aydinlatma-metni">
          {t("disclosure")}
        </FooterLink>
        <FooterLink className="text-[11px] sm:text-xs" href="/kvkk">
          {t("kvkk")}
        </FooterLink>
      </div>

      <Suspense fallback={<div aria-hidden="true" className="h-4 w-12" />}>
        <LanguageSwitcher />
      </Suspense>
    </div>
  );
}

