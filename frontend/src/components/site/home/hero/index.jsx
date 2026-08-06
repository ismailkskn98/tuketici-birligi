import { getTranslations } from "next-intl/server";
import { HeroCarousel } from "./hero-carousel";

/**
 * Server entry for home hero: resolves i18n labels, then hands off to client carousel.
 */
export async function HomeHero({ slides }) {
  if (!slides?.length) return null;

  const t = await getTranslations("Hero");

  return (
    <HeroCarousel
      labels={{
        readMore: t("readMore"),
        prevSlide: t("prevSlide"),
        nextSlide: t("nextSlide"),
      }}
      slides={slides}
    />
  );
}
