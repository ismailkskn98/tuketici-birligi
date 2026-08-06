"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const SECTION_KEYS = [
  "dataController",
  "processedData",
  "purposes",
  "legalBasis",
  "transfer",
  "retention",
  "rights",
  "contact",
];

export function DisclosureContent({ className }) {
  const t = useTranslations("Disclosure");

  return (
    <div className={cn("grid gap-6 text-sm leading-7 text-muted", className)}>
      <p>{t("intro")}</p>

      {SECTION_KEYS.map((key) => (
        <section className="grid gap-2" key={key}>
          <h3 className="font-semibold text-ink">{t(`sections.${key}.title`)}</h3>
          <p className="whitespace-pre-line">{t(`sections.${key}.body`)}</p>
        </section>
      ))}

      <p className="text-xs leading-6 text-muted/80">{t("disclaimer")}</p>
    </div>
  );
}
