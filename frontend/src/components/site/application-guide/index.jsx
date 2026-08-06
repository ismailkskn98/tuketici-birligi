import { ClipboardCheck, FileText, Send, UserCheck } from "lucide-react";
import { ApplicationForm } from "@/components/site/application-form";
import { StaticCard } from "@/components/common/content-card";
import { SectionHeading } from "@/components/ui/section-heading";

const STEPS = [
  {
    icon: ClipboardCheck,
    title: "Konu ve belgeleri netleştirin",
    text: "Fatura, sözleşme, servis fişi, ekran görüntüsü veya yazışma gibi belgeleri hazırlayın."
  },
  {
    icon: UserCheck,
    title: "Karşı tarafla çözüm deneyin",
    text: "Mümkünse satıcı veya hizmet sağlayıcıya yazılı başvurunuzu iletin."
  },
  {
    icon: FileText,
    title: "Ön başvuru formunu doldurun",
    text: "Olayı, tarihleri, talebinizi ve iletişim bilgilerinizi açık şekilde paylaşın."
  },
  {
    icon: Send,
    title: "Ekip dönüşünü bekleyin",
    text: "Başvurular admin panelinde takip edilir ve uygun iletişim kanalıyla dönüş yapılır."
  }
];

export function ApplicationGuidePageContent() {
  return (
    <section className="gridContainer bg-white py-14">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading
            eyebrow="Başvuru rehberi"
            title="Ön başvuru sürecini sade ve anlaşılır hale getirin"
            description="Bu sayfa tüketicinin hangi bilgi ve belgelerle başvuracağını anlatır. Nihai prosedür metinleri kurum ekibi tarafından doğrulanmalıdır."
          />
          <div className="mt-8 grid gap-4">
            {STEPS.map((step) => (
              <StaticCard className="flex gap-4" key={step.title}>
                <step.icon className="mt-1 shrink-0 text-primary-dark" size={24} aria-hidden="true" />
                <div>
                  <h2 className="font-bold text-ink">{step.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-muted">{step.text}</p>
                </div>
              </StaticCard>
            ))}
          </div>
        </div>

        <StaticCard className="h-fit">
          <h2 className="text-2xl font-bold text-ink">Tüketici Başvuru Formu</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Bu form resmi başvuru yerine geçmeyebilir; kurumun yönlendirme ve ön değerlendirme
            süreci için tasarlanmıştır.
          </p>
          <div className="mt-6">
            <ApplicationForm />
          </div>
        </StaticCard>
      </div>
    </section>
  );
}
