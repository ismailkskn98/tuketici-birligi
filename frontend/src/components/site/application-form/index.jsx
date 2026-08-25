"use client";

import { useCallback } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { ExpandableScreen, ExpandableScreenContent, ExpandableScreenTrigger } from "@/components/ui/expandable-screen";

// Ağır form modülünü ilk yüklemede bundle dışına al; kasmayı azaltır.
const ApplicationFormLazy = dynamic(
  () => import("./application-form").then((mod) => ({ default: mod.ApplicationForm })),
  {
    ssr: false,
    loading: () => <ApplicationFormFallback />,
  },
);

let applicationFormPromise = null;
function preloadApplicationForm() {
  if (!applicationFormPromise) {
    applicationFormPromise = import("./application-form");
  }
}

function ApplicationFormFallback() {
  return (
    <div className="grid gap-6" aria-hidden="true">
      <div className="grid gap-4">
        <div className="h-11 rounded-xl bg-surface" />
        <div className="h-11 rounded-xl bg-surface" />
        <div className="h-11 rounded-xl bg-surface" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-11 rounded-xl bg-surface" />
        <div className="h-11 rounded-xl bg-surface" />
      </div>
      <div className="h-32 rounded-2xl bg-surface" />
    </div>
  );
}

export function ApplicationCta() {
  const t = useTranslations("Header");
  const tForm = useTranslations("ApplicationForm");

  const handlePreload = useCallback(() => {
    preloadApplicationForm();
  }, []);

  return (
    <ExpandableScreen contentRadius="20px" layoutId="application-form-screen">
      <ExpandableScreenTrigger>
        <button
          className="focus-ring inline-flex h-8 cursor-pointer items-center rounded-full bg-secondary px-3 font-sans text-[11px] font-semibold leading-none text-white transition hover:bg-secondary-dark lg:h-8 lg:px-3 lg:text-[11px] xl:h-9 xl:px-3.5 xl:text-xs 2xl:h-10 2xl:px-4 2xl:text-[13px]"
          onFocus={handlePreload}
          onMouseEnter={handlePreload}
          onPointerEnter={handlePreload}
          type="button"
        >
          {t("cta")}
        </button>
      </ExpandableScreenTrigger>

      <ExpandableScreenContent className="application-form-scroll bg-white" closeButtonClassName="bg-surface text-ink hover:bg-line">
        <div className="mx-auto grid w-full max-w-3xl gap-6 px-5 py-16 sm:px-8 md:py-20">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-ink md:text-4xl">{tForm("overlayTitle")}</h2>
            <p className="mt-3 text-sm leading-7 text-muted md:text-base">{tForm("overlayDescription")}</p>
          </div>
          <ApplicationFormLazy />
        </div>
      </ExpandableScreenContent>
    </ExpandableScreen>
  );
}

export { ApplicationForm } from "./application-form";
export { ApplicationPageContent } from "./page-content";
