import { NewsDetailContent } from "@/components/site/news";
import { getContentBySlug } from "@/lib/api";

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const item = await getContentBySlug(slug, locale);

  if (!item) return {};

  return {
    title: item.title,
    description: item.summary
  };
}

export default async function NewsDetailPage({ params }) {
  const { slug, locale } = await params;
  return <NewsDetailContent slug={slug} locale={locale} />;
}
