import { BoardMembersPageContent } from "@/components/site/board-members";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isEnglish = locale === "en";

  return {
    title: isEnglish ? "Board of Directors" : "Yönetim Kurulu",
    description: isEnglish
      ? "Meet the members of the Consumers Association Board of Directors and their professional backgrounds."
      : "Tüketiciler Birliği Yönetim Kurulu üyelerini ve mesleki birikimlerini tanıyın."
  };
}

export default async function BoardMembersPage({ params }) {
  const { locale } = await params;
  return <BoardMembersPageContent locale={locale} />;
}
