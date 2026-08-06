import { NewsPageContent } from "@/components/site/news";

export const metadata = {
  title: "Haberler",
  description: "Tüketiciler Birliği haberleri ve faaliyet duyuruları."
};

export default async function NewsPage({ params }) {
  const { locale } = await params;
  return <NewsPageContent locale={locale} />;
}
