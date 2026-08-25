import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export default async function manifest() {
  const locale = routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    name: t("siteName"),
    short_name: t("shortName"),
    description: t("manifestDescription"),
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1A3863",
    lang: locale,
    icons: [
      {
        src: "/main-logo-yazisiz.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/main-logo-yazisiz.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/main-logo-yazisiz.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/main-logo-yazisiz.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
