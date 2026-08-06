import { Suspense } from "react";
import { LanguageSwitcher } from "@/components/site/header/language-switcher";
import { FooterLink } from "./footer-link";

export function FooterBottom({ t }) {
  return (
    <div className="flex flex-col items-center justify-between gap-4 py-4 text-xs text-muted sm:flex-row sm:gap-6">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <FooterLink className="text-xs" href="/gizlilik">
          {t("privacy")}
        </FooterLink>
        <FooterLink className="text-xs" href="/aydinlatma-metni">
          {t("disclosure")}
        </FooterLink>
        <FooterLink className="text-xs" href="/kvkk">
          {t("kvkk")}
        </FooterLink>
      </div>

      <Suspense fallback={<div aria-hidden="true" className="h-4 w-12" />}>
        <LanguageSwitcher />
      </Suspense>
    </div>
  );
}

