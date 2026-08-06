import { notFound } from "next/navigation";
import { RichText } from "@/components/ui/rich-text";
import { getContentBySlug } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export async function NewsDetailContent({ slug, locale }) {
  const item = await getContentBySlug(slug, locale);

  if (!item || item.type !== "news") notFound();

  return (
    <article className="gridContainer bg-white py-14">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-muted">{formatDate(item.published_at)}</p>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-ink md:text-5xl">{item.title}</h1>
        <p className="mt-6 text-lg leading-8 text-muted">{item.summary}</p>
        <div className="mt-8 border-t border-line pt-8">
          <RichText body={item.body} />
        </div>
      </div>
    </article>
  );
}
