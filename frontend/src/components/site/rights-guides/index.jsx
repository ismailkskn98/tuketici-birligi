import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/common/content-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getContents } from "@/lib/api";

export async function RightsGuidesPageContent({ locale }) {
  const guides = await getContents({ type: "guide", locale });

  return (
    <section className="gridContainer bg-white py-14">
      <div>
        <SectionHeading
          eyebrow="Hak rehberleri"
          title="Tüketicilerin sık ihtiyaç duyduğu konular"
          description="Bu alandaki metinler yayına alınmadan önce kurumun hukuk ve içerik ekipleri tarafından doğrulanmalıdır."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Card key={guide.slug}>
              <Badge>Rehber</Badge>
              <h2 className="mt-4 text-xl font-bold text-ink">{guide.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{guide.summary}</p>
              <Link
                className="focus-ring mt-5 inline-flex items-center gap-2 rounded-[8px] text-sm font-bold text-primary-dark"
                href={`/hak-rehberleri/${guide.slug}`}
              >
                Oku <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export { RightsGuideDetailContent } from "./detail";
