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
    theme_color: "#870b18",
    lang: locale,
    icons: [
      {
        src: "/logo.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
