import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/section-heading";
import { getContents } from "@/lib/api";
import { FaqBrowser } from "./faq-browser";

export async function FaqPageContent({ locale }) {
  const t = await getTranslations("Faq");
  const items = await getContents({ type: "faq", locale });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items
      .filter((item) => item.title && item.body)
      .map((item) => ({
        "@type": "Question",
        name: item.title,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.body,
        },
      })),
  };

  return (
    <section className="relative gridContainer overflow-hidden bg-surface/40 py-14 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center">
        <SectionHeading
          className="mx-auto flex flex-col items-center text-center"
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <div className="mt-10 w-full md:mt-12">
          <FaqBrowser
            allLabel={t("all")}
            categoriesLabel={t("categoriesLabel")}
            clearSearchLabel={t("clearSearch")}
            copiedLabel={t("copied")}
            copyLinkLabel={t("copyLink")}
            emptyText={t("empty")}
            items={items}
            searchPlaceholder={t("searchPlaceholder")}
          />
        </div>
      </div>
    </section>
  );
}
