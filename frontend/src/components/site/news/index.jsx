import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/common/content-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getContents } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export async function NewsPageContent({ locale }) {
  const news = await getContents({ type: "news", locale });

  return (
    <section className="gridContainer bg-white py-14">
      <div>
        <SectionHeading eyebrow="Haberler" title="Kurum haberleri ve faaliyetler" />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {news.map((item) => (
            <Card key={item.slug}>
              <p className="text-xs font-semibold text-muted">{formatDate(item.published_at)}</p>
              <h2 className="mt-2 text-xl font-bold text-ink">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{item.summary}</p>
              <Link
                className="focus-ring mt-5 inline-flex items-center gap-2 rounded-[8px] text-sm font-bold text-primary-dark"
                href={`/haberler/${item.slug}`}
              >
                Haberi oku <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export { NewsDetailContent } from "./detail";
