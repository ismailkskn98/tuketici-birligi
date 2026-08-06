import { setRequestLocale } from "next-intl/server";
import { HomePageContent } from "@/components/site/home";

export default async function HomePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomePageContent locale={locale} />;
}
