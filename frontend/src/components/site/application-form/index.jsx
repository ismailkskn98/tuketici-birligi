"use client";

import { useTranslations } from "next-intl";
import { ExpandableScreen, ExpandableScreenContent, ExpandableScreenTrigger } from "@/components/ui/expandable-screen";
import { ApplicationForm } from "./application-form";

export function ApplicationCta() {
  const t = useTranslations("Header");
  const tForm = useTranslations("ApplicationForm");

  return (
    <ExpandableScreen contentRadius="20px" layoutId="application-form-screen">
      <ExpandableScreenTrigger>
        <button className="focus-ring cursor-pointer inline-flex rounded-full bg-secondary px-5 py-2.5 font-sans text-sm font-semibold text-white transition hover:bg-secondary-dark" type="button">
          {t("cta")}
        </button>
      </ExpandableScreenTrigger>

      <ExpandableScreenContent className="application-form-scroll bg-white" closeButtonClassName="bg-surface text-ink hover:bg-line">
        <div className="mx-auto grid w-full max-w-3xl gap-6 px-5 py-16 sm:px-8 md:py-20">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-ink md:text-4xl">{tForm("overlayTitle")}</h2>
            <p className="mt-3 text-sm leading-7 text-muted md:text-base">{tForm("overlayDescription")}</p>
          </div>
          <ApplicationForm />
        </div>
      </ExpandableScreenContent>
    </ExpandableScreen>
  );
}

export { ApplicationForm };
export { ApplicationPageContent } from "./page-content";
