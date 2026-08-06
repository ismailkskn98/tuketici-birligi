"use client";

import Image from "next/image";
import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

function LocaleFlagButton({ active, alt, flagSrc, label, onClick }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-label={label}
            aria-current={active ? "true" : undefined}
            className={cn("inline-flex cursor-pointer items-center transition-opacity duration-200", active ? "opacity-100" : "opacity-45 hover:opacity-80")}
            onClick={onClick}
          />
        }
      >
        <Image alt={alt} className="min-h-2.75 min-w-4 rounded-[1px] object-cover" height={11} src={flagSrc} width={16} />
      </TooltipTrigger>
      <TooltipContent className="rounded-md bg-white! px-2.5 py-1 text-[9px] text-ink!">{label}</TooltipContent>
    </Tooltip>
  );
}

export function LanguageSwitcher({ className }) {
  const t = useTranslations("LanguageSwitcher");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const query = Object.fromEntries(searchParams.entries());

  function switchLocale(nextLocale) {
    if (nextLocale === locale) return;

    startTransition(() => {
      router.replace({ pathname, query }, { locale: nextLocale, scroll: false });
    });
  }

  return (
    <TooltipProvider>
      <div aria-label={t("label")} className={cn("flex items-center gap-2", isPending && "pointer-events-none opacity-70", className)}>
        <LocaleFlagButton active={locale === "tr"} alt={t("turkish")} flagSrc="https://flagcdn.com/24x18/tr.png" label={t("turkish")} onClick={() => switchLocale("tr")} />
        <span aria-hidden="true" className="h-2.5 w-px bg-ink/20" />
        <LocaleFlagButton active={locale === "en"} alt={t("english")} flagSrc="https://flagcdn.com/24x18/us.png" label={t("english")} onClick={() => switchLocale("en")} />
      </div>
    </TooltipProvider>
  );
}
