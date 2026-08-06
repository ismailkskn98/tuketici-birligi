import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { FaqBrowser } from "@/components/site/faq/faq-browser";

export async function HomeFaq({ items = [] }) {
  const t = await getTranslations("HomeFaq");
  const faqItems = items.slice(0, 6);

  return (
    <section aria-labelledby="home-faq-title" className="gridContainer">
      <Reveal className="grid gap-6 md:gap-7 lg:gap-8 2xl:gap-10" viewport={{ once: true, amount: 0.18 }}>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-6">
          <div id="home-faq-title" className="max-w-2xl">
            <SectionHeading
              className="[&_h2]:text-balance [&_h2]:text-2xl [&_h2]:leading-[1.08] [&_h2]:md:text-3xl [&_h2]:lg:text-[2rem] [&_h2]:xl:text-4xl [&_h2]:2xl:text-5xl [&_p]:mt-3 [&_p]:max-w-xl [&_p]:text-sm [&_p]:leading-6 [&_p]:sm:mt-3.5 [&_p]:md:mt-4 [&_p]:md:text-[15px] [&_p]:md:leading-7 [&_p]:2xl:text-base"
              eyebrow={t("eyebrow")}
              title={t("title")}
              description={t("description")}
            />
          </div>

          <div className="md:shrink-0">
            <Link
              href="/sss"
              className="focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white shadow-xs transition hover:bg-ink/90 md:min-h-11 md:px-5"
            >
              {t("viewAll")}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>

        <FaqBrowser
          accordion
          allLabel={t("all")}
          categoriesLabel={t("categoriesLabel")}
          clearSearchLabel={t("clearSearch")}
          copiedLabel={t("copied")}
          copyLinkLabel={t("copyLink")}
          emptyText={t("empty")}
          hideAnswerLabel={t("hideAnswer")}
          items={faqItems}
          searchPlaceholder={t("searchPlaceholder")}
          showAnswerLabel={t("showAnswer")}
        />
      </Reveal>
    </section>
  );
}
