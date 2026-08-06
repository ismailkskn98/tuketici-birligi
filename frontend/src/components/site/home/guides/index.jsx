import { getLocale, getTranslations } from "next-intl/server";
import { GuideCard } from "./guide-card";
import { GuidesHeader } from "./guides-header";

export async function HomeGuides({ guides = [] }) {
  const t = await getTranslations("HomeGuides");
  const locale = await getLocale();
  const items = guides.slice(0, 4);
  const featuredGuide = items.find((item) => item.is_featured) || items[0] || null;
  const secondaryGuides = items.filter((item) => item.slug !== featuredGuide?.slug).slice(0, 3);

  return (
    <section aria-labelledby="home-guides-title" className="gridContainer border-t border-line/80 py-10 md:py-12">
      <div className="grid gap-8 md:gap-10">
        <div id="home-guides-title">
          <GuidesHeader description={t("description")} eyebrow={t("eyebrow")} title={t("title")} viewAllHref="/hak-rehberleri" viewAllLabel={t("viewAll")} />
        </div>

        {items.length ? (
          <div className="grid gap-5">
            {featuredGuide ? (
              <GuideCard
                badgeLabel={t("badge")}
                guide={featuredGuide}
                locale={locale}
                readMoreLabel={t("readMore")}
                variant="featured"
              />
            ) : null}

            {secondaryGuides.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {secondaryGuides.map((guide) => (
                  <GuideCard
                    badgeLabel={t("badge")}
                    guide={guide}
                    key={guide.slug}
                    locale={locale}
                    readMoreLabel={t("readMore")}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-muted">{t("empty")}</p>
        )}
      </div>
    </section>
  );
}
