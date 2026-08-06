import { FaqPageContent } from "@/components/site/faq";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isEnglish = locale === "en";

  return {
    title: isEnglish ? "Frequently Asked Questions" : "Sıkça Sorulan Sorular",
    description: isEnglish
      ? "Frequently asked questions about consumer applications and communication processes."
      : "Tüketici başvuruları ve iletişim süreçleri hakkında sıkça sorulan sorular."
  };
}

export default async function FaqPage({ params }) {
  const { locale } = await params;
  return <FaqPageContent locale={locale} />;
}
