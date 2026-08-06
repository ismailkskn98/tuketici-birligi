import { RightsGuidesPageContent } from "@/components/site/rights-guides";

export const metadata = {
  title: "Hak Rehberleri",
  description: "Tüketici haklarına ilişkin rehber içerikler ve başvuru yönlendirmeleri."
};

export default async function GuidesPage({ params }) {
  const { locale } = await params;
  return <RightsGuidesPageContent locale={locale} />;
}
