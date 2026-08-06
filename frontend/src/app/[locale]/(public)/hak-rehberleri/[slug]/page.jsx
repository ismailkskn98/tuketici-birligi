import { RightsGuideDetailContent } from "@/components/site/rights-guides";
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

export default async function GuideDetailPage({ params }) {
  const { slug, locale } = await params;
  return <RightsGuideDetailContent slug={slug} locale={locale} />;
}
