import { AnnouncementsPageContent } from "@/components/site/announcements";

export const metadata = {
  title: "Duyurular",
  description: "Tüketici Birliği güncel duyuruları.",
};

export default async function AnnouncementsPage({ params }) {
  const { locale } = await params;
  return <AnnouncementsPageContent locale={locale} />;
}
