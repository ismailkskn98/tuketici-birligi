import { Megaphone } from "lucide-react";
import { Card } from "@/components/common/content-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getContents } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export async function AnnouncementsPageContent({ locale }) {
  const announcements = await getContents({ type: "announcement", locale });

  return (
    <section className="gridContainer bg-white py-14">
      <div>
        <SectionHeading
          eyebrow="Duyurular"
          title="Öne çıkan bilgilendirmeler"
          description="Duyurular tarih sırasına göre listelenir ve admin panelinden yönetilir."
        />
        <div className="mt-8 grid gap-4">
          {announcements.map((item) => (
            <Card className="flex gap-4" key={item.slug}>
              <Megaphone className="mt-1 shrink-0 text-primary-dark" size={24} aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold text-muted">{formatDate(item.published_at)}</p>
                <h2 className="mt-1 text-xl font-bold text-ink">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{item.summary}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
