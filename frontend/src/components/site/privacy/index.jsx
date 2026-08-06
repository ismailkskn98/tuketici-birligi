import { SectionHeading } from "@/components/ui/section-heading";

export function PrivacyPageContent() {
  return (
    <section className="gridContainer bg-white py-14">
      <div className="max-w-3xl">
        <SectionHeading
          eyebrow="Yasal"
          title="Gizlilik Politikası"
          description="Bu metin hukuk ve içerik ekibi tarafından hazırlanacak nihai gizlilik politikasıyla değiştirilmelidir."
        />
      </div>
    </section>
  );
}
