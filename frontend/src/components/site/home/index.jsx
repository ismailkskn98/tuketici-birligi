import { getTranslations } from "next-intl/server";
import { getContents, getHomeData, getProvinceMap } from "@/lib/api";
import { ProvinceMapSection } from "@/components/site/province-map";
import { HomeHero } from "./hero";
import { HomeFaq } from "./faq";
import { HomeLogoCarousel } from "./logo-carousel";
import { HomeHighlights } from "./highlights";
import { HomeFeed } from "./feed";

export { HomeHero } from "./hero";
export { HomeFaq } from "./faq";
export { HomeLogoCarousel } from "./logo-carousel";
export { HomeHighlights } from "./highlights";
export { HomeFeed } from "./feed";

export function buildHeroSlides({ news, announcements, guides }, tHero) {
  const categoryMap = {
    news: tHero("categoryNews"),
    announcement: tHero("categoryAnnouncement"),
    guide: tHero("categoryGuide"),
  };

  const hrefMap = {
    news: (slug) => `/haberler/${slug}`,
    announcement: () => "/duyurular",
    guide: (slug) => `/hak-rehberleri/${slug}`,
  };

  const pooled = [
    ...news.slice(0, 2).map((item) => ({ ...item, type: "news" })),
    ...announcements.slice(0, 1).map((item) => ({ ...item, type: "announcement" })),
    ...guides.slice(0, 1).map((item) => ({ ...item, type: "guide" })),
  ].slice(0, 3);

  return pooled.map((item) => ({
    id: item.id || item.slug,
    slug: item.slug,
    title: item.title,
    summary: item.summary,
    ctaLabel: tHero("readMore"),
    date: item.published_at,
    category: categoryMap[item.type],
    href: hrefMap[item.type](item.slug),
    image: item.cover_image || item.image || null,
    imageMobile: item.cover_image || item.image || null,
    imageTablet: item.cover_image || item.image || null,
    imageDesktop: item.cover_image || item.image || null,
  }));
}

/**
 * Full home composition — keeps the route page thin.
 */
export async function HomePageContent({ locale }) {
  const tHero = await getTranslations("Hero");
  const { guides, heroSlides, news, announcements } = await getHomeData(locale);
  const faqs = await getContents({ type: "faq", locale });
  const provinceMap = await getProvinceMap(locale);
  const slides = heroSlides?.length
    ? heroSlides.map((slide) => ({
        id: slide.id,
        title: slide.title,
        summary: slide.summary,
        ctaLabel: slide.ctaLabel,
        href: slide.href,
        image: slide.imageDesktop || slide.image || null,
        imageMobile: slide.imageMobile || slide.image || null,
        imageTablet: slide.imageTablet || slide.image || null,
        imageDesktop: slide.imageDesktop || slide.image || null,
        category: null,
        date: null,
      }))
    : buildHeroSlides({ news, announcements, guides }, tHero);

  return (
    <>
      <section>
        <HomeHero slides={slides} />
      </section>

      <HomeLogoCarousel />

      <section className="bg-white pt-8 sm:pt-10 md:pt-12 lg:pt-14 2xl:pt-16 pb-12 sm:pb-14 md:pb-16 lg:pb-18 2xl:pb-20">
        <div className="flex flex-col gap-12 sm:gap-14 md:gap-16 lg:gap-[4.5rem] xl:gap-20 2xl:gap-24">
          <HomeHighlights />
          <HomeFeed announcements={announcements} guides={guides} news={news} />
          <ProvinceMapSection compact data={provinceMap} />
          <HomeFaq items={faqs} />
        </div>
      </section>
    </>
  );
}
