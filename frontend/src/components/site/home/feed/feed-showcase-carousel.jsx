"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { A11y, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FeedColumn } from "./feed-column";
import { FeedGrid } from "./feed-grid";

import "swiper/css";

export function FeedShowcaseCarousel({ locale = "tr", sections = [] }) {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!sections.length) return null;

  const showControls = sections.length > 1;

  return (
    <div className="min-w-0">
      <Swiper
        a11y={{ enabled: true }}
        autoHeight
        className="home-feed-swiper min-w-0"
        keyboard={{ enabled: true, onlyInViewport: true }}
        modules={[A11y, Keyboard]}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        slidesPerView={1}
        spaceBetween={24}
        speed={650}
      >
        {sections.map((section) => (
          <SwiperSlide className="h-auto" key={section.id}>
            <FeedColumn
              description={section.description}
              eyebrow={section.eyebrow}
              title={section.title}
              viewAllHref={section.viewAllHref}
              viewAllLabel={section.viewAllLabel}
            >
              <FeedGrid
                category={section.featuredLabel}
                categoryLabel={section.eyebrow}
                ctaLabel={section.readMoreLabel}
                featuredItem={section.featuredItem}
                items={section.items}
                locale={locale}
              />
            </FeedColumn>
          </SwiperSlide>
        ))}
      </Swiper>

      {showControls ? (
        <div className="mt-4 flex items-center justify-end gap-4">
          <div className="flex items-center gap-3">
            <button
              aria-label="Previous feed section"
              className="focus-ring inline-flex size-8 items-center justify-center rounded-full bg-white text-ink/55 shadow-[0_8px_20px_rgba(22,32,51,0.05)] transition hover:text-ink"
              onClick={() => swiperRef.current?.slidePrev()}
              type="button"
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
            </button>
            <button
              aria-label="Next feed section"
              className="focus-ring inline-flex size-8 items-center justify-center rounded-full bg-white text-ink/55 shadow-[0_8px_20px_rgba(22,32,51,0.05)] transition hover:text-ink"
              onClick={() => swiperRef.current?.slideNext()}
              type="button"
            >
              <ChevronRight aria-hidden="true" className="size-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              {String(activeIndex + 1).padStart(2, "0")} / {String(sections.length).padStart(2, "0")}
            </span>
            <div className="relative h-px w-12 bg-line/70">
              <span
                className="absolute inset-y-0 left-0 bg-secondary transition-[width] duration-300 ease-out"
                style={{ width: `${((activeIndex + 1) / sections.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
