import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3601";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("title"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    keywords: t("keywords"),
    icons: {
      icon: "/logo.ico",
      shortcut: "/logo.ico",
      apple: "/logo.png",
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: siteUrl,
      siteName: t("siteName"),
      locale: locale === "en" ? "en_US" : "tr_TR",
      type: "website",
      images: [{ url: "/logo.png", alt: t("siteName") }],
    },
    twitter: {
      card: "summary",
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: ["/logo.png"],
    },
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html className={fontVariables} lang={locale}>
      <body className="font-sans antialiased">
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
