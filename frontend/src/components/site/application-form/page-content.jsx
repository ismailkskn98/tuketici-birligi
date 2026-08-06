"use client";

import { useTranslations } from "next-intl";
import { ApplicationForm } from "./application-form";

export function ApplicationPageContent() {
  const t = useTranslations("ApplicationForm");

  return (
    <section className="gridContainer bg-white py-14 md:py-20">
      <div className="mx-auto grid w-full max-w-3xl gap-8">
        <div className="max-w-2xl">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-ink md:text-5xl">{t("pageTitle")}</h1>
          <p className="mt-4 text-base leading-7 text-muted">{t("pageDescription")}</p>
        </div>
        <ApplicationForm />
      </div>
    </section>
  );
}
