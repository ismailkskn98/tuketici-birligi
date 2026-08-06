import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { StaticCard } from "@/components/common/content-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getSiteSettings } from "@/lib/api";

export async function ContactPageContent({ locale }) {
  const settings = await getSiteSettings(locale);
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(settings.mapQuery || settings.address)}&output=embed`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Tüketiciler Birliği İletişim",
    about: settings.organizationName,
    email: settings.email,
    telephone: settings.phone,
    address: settings.address
  };

  const channels = [
    { icon: Phone, label: "Telefon", value: settings.phone },
    { icon: Mail, label: "E-posta", value: settings.email },
    { icon: MapPin, label: "Adres", value: settings.address },
    { icon: Clock, label: "Çalışma Saatleri", value: settings.workingHours }
  ];

  return (
    <section className="gridContainer bg-white py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div>
        <SectionHeading
          eyebrow="İletişim"
          title="Kurumla iletişime geçmek için tüm kanallar"
          description="Telefon, e-posta, adres, çalışma saatleri, harita ve iletişim formu bu sayfada açık şekilde sunulur."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {channels.map((item) => (
            <StaticCard key={item.label}>
              <item.icon className="text-primary-dark" size={24} aria-hidden="true" />
              <h2 className="mt-4 text-sm font-bold uppercase tracking-[0.08em] text-muted">
                {item.label}
              </h2>
              <p className="mt-2 text-base font-semibold leading-6 text-ink">{item.value}</p>
            </StaticCard>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <StaticCard>
            <h2 className="text-2xl font-bold text-ink">İletişim Formu</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Genel soru, öneri ve iletişim talepleri için kısa form.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </StaticCard>

          <StaticCard className="overflow-hidden p-0">
            <iframe
              className="h-[520px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={mapUrl}
              title="Tüketiciler Birliği harita konumu"
            />
          </StaticCard>
        </div>
      </div>
    </section>
  );
}
