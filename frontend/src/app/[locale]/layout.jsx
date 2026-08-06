import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3601";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isEn = locale === "en";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: isEn ? "Consumers Union" : "Tüketiciler Birliği",
      template: isEn ? "%s | Consumers Union" : "%s | Tüketiciler Birliği"
    },
    description: isEn
      ? "Institutional web platform for consumer rights, applications, announcements and contact channels."
      : "Tüketici hakları, başvuru süreçleri, duyurular ve açık iletişim kanalları için kurumsal web platformu.",
    openGraph: {
      title: isEn ? "Consumers Union" : "Tüketiciler Birliği",
      description: isEn
        ? "Accessible web platform for consumer rights and institutional application processes."
        : "Tüketici hakları ve kurumsal başvuru süreçleri için erişilebilir web platformu.",
      url: siteUrl,
      siteName: isEn ? "Consumers Union" : "Tüketiciler Birliği",
      locale: isEn ? "en_US" : "tr_TR",
      type: "website"
    }
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
