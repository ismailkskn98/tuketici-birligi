import { FeedItem } from "./feed-item";
import { FeaturedFeedCard } from "./featured-feed-card";

export function FeedGrid({ category, categoryLabel, ctaLabel, featuredItem, items, locale = "tr" }) {
  if (!featuredItem && !items.length) {
    return null;
  }

  const secondaryItems = items.filter((item) => item.slug !== featuredItem?.slug).slice(0, 2);

  return (
    <div className="grid gap-5">
      {featuredItem ? (
        <FeaturedFeedCard
          category={category}
          categoryLabel={categoryLabel}
          ctaLabel={ctaLabel}
          date={featuredItem.published_at}
          href={featuredItem.href}
          image={featuredItem.cover_image || featuredItem.image || null}
          locale={locale}
          summary={featuredItem.summary}
          title={featuredItem.title}
        />
      ) : null}

      {secondaryItems.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {secondaryItems.map((item) => (
            <FeedItem
              categoryLabel={categoryLabel}
              ctaLabel={ctaLabel}
              date={item.published_at}
              href={item.href}
              image={item.cover_image || item.image || null}
              key={item.slug}
              locale={locale}
              summary={item.summary}
              title={item.title}
              variant="card"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
