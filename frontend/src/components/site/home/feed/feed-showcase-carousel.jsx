"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { A11y, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "@/i18n/navigation";
import { FeaturedFeedCard } from "./featured-feed-card";

import "swiper/css";

export function FeedShowcaseCarousel({ description, eyebrow, featuredLabel, items = [], locale = "tr", nextSlideLabel, previousSlideLabel, readMoreLabel, title, viewAllHref, viewAllLabel }) {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!items.length) return null;

  const activeItem = items[activeIndex] || items[0];
  const showControls = items.length > 1;
  const progress = ((activeIndex + 1) / items.length) * 100;

  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-4 border-b border-line/70 pb-6 md:flex-row md:items-end md:justify-between md:gap-10">
        <div className="min-w-0 max-w-2xl">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-secondary">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-secondary" />
            {eyebrow}
          </span>
          <h2 className="mt-3 font-heading text-[1.85rem] font-semibold leading-[1.12] tracking-tight text-ink md:text-[2.35rem]">{title}</h2>
          {description ? <p className="mt-3 max-w-xl text-sm leading-7 text-muted">{description}</p> : null}
        </div>

        <Link
          className="focus-ring inline-flex shrink-0 items-center gap-1.5 self-start text-[12px] font-bold uppercase tracking-[0.12em] text-ink transition hover:text-secondary-dark md:self-end"
          href={viewAllHref}
        >
          {viewAllLabel}
          <ArrowUpRight aria-hidden="true" className="size-3.5" />
        </Link>
      </div>

      <Swiper
        a11y={{ enabled: true }}
        autoHeight
        className="home-feed-swiper mt-7 min-w-0"
        grabCursor={showControls}
        keyboard={{ enabled: true, onlyInViewport: true }}
        modules={[A11y, Keyboard]}
        observeParents
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        rewind={showControls}
        slidesPerView={1}
        spaceBetween={24}
        speed={650}
        watchOverflow
      >
        {items.map((item) => (
          <SwiperSlide className="h-auto" key={item.slug}>
            <FeaturedFeedCard
              category={featuredLabel}
              date={item.published_at}
              href={item.href}
              image={item.cover_image || item.image || null}
              locale={locale}
              summary={item.summary}
              title={item.title}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-6 flex flex-col gap-4 border-t border-line/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Link className="focus-ring inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-ink transition hover:text-secondary-dark" href={activeItem.href}>
          {readMoreLabel}
          <ArrowUpRight aria-hidden="true" className="size-3.5 text-secondary" />
        </Link>

        {showControls ? (
          <div className="flex items-center sm:justify-end">
            <div className="flex items-center gap-3 px-3 py-2">
              <button
                aria-label={previousSlideLabel}
                className="focus-ring inline-flex size-6 items-center justify-center text-muted transition hover:text-ink"
                onClick={() => swiperRef.current?.slidePrev()}
                type="button"
              >
                <ChevronLeft aria-hidden="true" className="size-3.5" />
              </button>

              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold tracking-[0.08em] text-ink">{String(activeIndex + 1).padStart(2, "0")}</span>

                <div className="relative h-px w-10 bg-line sm:w-12">
                  <span className="absolute inset-y-0 left-0 bg-secondary transition-[width] duration-300 ease-out" style={{ width: `${progress}%` }} />
                </div>

                <span className="text-[11px] font-medium tracking-[0.08em] text-muted">{String(items.length).padStart(2, "0")}</span>
              </div>

              <button
                aria-label={nextSlideLabel}
                className="focus-ring inline-flex size-6 items-center justify-center text-muted transition hover:text-ink"
                onClick={() => swiperRef.current?.slideNext()}
                type="button"
              >
                <ChevronRight aria-hidden="true" className="size-3.5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
