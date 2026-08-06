import { getLocale, getTranslations } from "next-intl/server";
import { AreasOfAction } from "../areas-of-action";
import { FeedGuidesStrip } from "./feed-guides-strip";
import { FeedColumn } from "./feed-column";
import { FeedItem } from "./feed-item";
import { FeaturedFeedCard } from "./featured-feed-card";

export async function HomeFeed({ announcements = [], guides = [], news = [] }) {
  const t = await getTranslations("HomeFeed");
  const locale = await getLocale();
  const newsItems = news.slice(0, 4).map((item) => ({ ...item, href: `/haberler/${item.slug}` }));
  const announcementItems = announcements.slice(0, 4).map((item) => ({ ...item, href: "/duyurular" }));
  const guideItems = guides.slice(0, 2);
  const featuredNews = newsItems.find((item) => item.is_featured) || newsItems[0] || null;
  const supportingNews = newsItems.filter((item) => item.slug !== featuredNews?.slug).slice(0, 1);
  const featuredAnnouncement = announcementItems.find((item) => item.is_featured) || announcementItems[0] || null;
  const supportingCards = [...supportingNews, featuredAnnouncement].filter(Boolean).slice(0, 2);

  return (
    <section className="gridContainer py-10 md:py-12">
      <div className="grid gap-12 xl:grid-cols-[minmax(0,1.5fr)_20rem] xl:items-start">
        <div className="min-w-0">
          {featuredNews ? (
            <div className="grid gap-6 md:gap-7">
              <FeedColumn
                description={t("newsDescription")}
                eyebrow={t("newsEyebrow")}
                title={t("newsTitle")}
                viewAllHref="/haberler"
                viewAllLabel={t("newsViewAll")}
              >
                <FeaturedFeedCard
                  category={t("featuredLabel")}
                  categoryLabel={t("newsEyebrow")}
                  ctaLabel={t("readMore")}
                  date={featuredNews.published_at}
                  href={featuredNews.href}
                  image={featuredNews.cover_image || featuredNews.image || null}
                  locale={locale}
                  summary={featuredNews.summary}
                  title={featuredNews.title}
                />
              </FeedColumn>

              {supportingCards.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {supportingCards.map((item) => (
                    <FeedItem
                      categoryLabel={item.href === "/duyurular" ? t("announcementsEyebrow") : t("newsEyebrow")}
                      ctaLabel={t("readMore")}
                      date={item.published_at}
                      href={item.href}
                      image={item.cover_image || item.image || null}
                      key={`${item.type || item.slug}-${item.slug}`}
                      locale={locale}
                      summary={item.summary}
                      title={item.title}
                      variant="card"
                    />
                  ))}
                </div>
              ) : null}

              <FeedGuidesStrip
                badgeLabel={t("guidesEyebrow")}
                description={t("guidesDescription")}
                guides={guideItems}
                eyebrow={t("guidesEyebrow")}
                readMoreLabel={t("guidesReadMore")}
                title={t("guidesTitle")}
                viewAllHref="/hak-rehberleri"
                viewAllLabel={t("guidesViewAll")}
              />
            </div>
          ) : (
            <p className="py-5 text-sm text-muted">{t("emptyNews")}</p>
          )}
        </div>

        <div className="xl:pl-2">
          <AreasOfAction />
        </div>
      </div>
    </section>
  );
}
