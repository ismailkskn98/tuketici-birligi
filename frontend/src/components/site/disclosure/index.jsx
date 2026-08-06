import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/section-heading";
import { DisclosureContent } from "./content";

export async function DisclosurePageContent() {
  const t = await getTranslations("Disclosure");

  return (
    <section className="gridContainer bg-white py-14 md:py-20">
      <div className="mx-auto grid w-full max-w-3xl gap-8">
        <SectionHeading description={t("pageDescription")} eyebrow={t("eyebrow")} title={t("title")} />
        <DisclosureContent />
      </div>
    </section>
  );
}
