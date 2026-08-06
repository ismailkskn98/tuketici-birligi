import { CheckCircle2 } from "lucide-react";
import { StaticCard } from "@/components/common/content-card";
import { SectionHeading } from "@/components/ui/section-heading";

const SECTIONS = [
  "Kurum tanıtımı ve tarihçe",
  "Misyon, vizyon ve çalışma ilkeleri",
  "Yönetim / ekip bilgileri",
  "Yasal metin ve kurumsal belgeler"
];

export function CorporatePageContent() {
  return (
    <section className="gridContainer bg-white py-14">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading
          eyebrow="Kurumsal"
          title="Kurum kimliği için net, sade ve özgün içerik alanı"
          description="Bu sayfa kurumun gerçek tanıtım metni, tarihçesi, çalışma ilkeleri, ekip bilgisi ve yasal dayanakları girildiğinde güncellenecek şekilde hazırlanmıştır."
        />
        <div className="grid gap-4">
          {SECTIONS.map((item) => (
            <StaticCard className="flex gap-3" key={item}>
              <CheckCircle2 className="mt-0.5 shrink-0 text-secondary-dark" size={22} aria-hidden="true" />
              <div>
                <h2 className="font-bold text-ink">{item}</h2>
                <p className="mt-1 text-sm leading-6 text-muted">
                  İçerik ekibi tarafından hazırlanacak özgün metinler için ayrılmış bölüm.
                </p>
              </div>
            </StaticCard>
          ))}
        </div>
      </div>
    </section>
  );
}
