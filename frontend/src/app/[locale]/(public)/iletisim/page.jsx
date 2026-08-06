import { ContactPageContent } from "@/components/site/contact";

export const metadata = {
  title: "İletişim",
  description: "Tüketici Birliği telefon, e-posta, adres, harita ve iletişim formu.",
};

export default async function ContactPage({ params }) {
  const { locale } = await params;
  return <ContactPageContent locale={locale} />;
}
