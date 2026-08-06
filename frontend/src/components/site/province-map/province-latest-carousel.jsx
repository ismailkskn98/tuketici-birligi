"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, History } from "lucide-react";
import { A11y, Autoplay, Keyboard, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button } from "@/components/ui/button";
import { ProvinceEntryCard } from "./province-entry-card";

import "swiper/css";
import "swiper/css/pagination";

const AUTOPLAY = {
  delay: 5000,
  disableOnInteraction: false,
  pauseOnMouseEnter: true,
  stopOnLastSlide: false,
  waitForTransition: false,
};

export function ProvinceLatestCarousel({ compact = false, entries, onProvinceOpen, onSearchOpen }) {
  const swiperRef = useRef(null);
  const hasEntries = entries.length > 0;

  function startAutoplay() {
    const swiper = swiperRef.current;
    if (swiper?.autoplay && hasEntries) swiper.autoplay.start();
  }

  function stopAutoplay() {
    swiperRef.current?.autoplay?.stop();
  }

  return (
    <section className="grid min-w-0 gap-4 sm:gap-4.5 md:gap-5 lg:gap-6">
      <div className="flex flex-col gap-2.5 px-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
          <h3 className="text-base font-semibold tracking-normal text-ink sm:text-lg md:text-lg lg:text-xl">Son eklenen bilgilendirmeler</h3>
          <History aria-hidden="true" className="size-3.5 text-muted sm:size-4" />
        </div>

        {compact ? (
          <Button
            className="h-9 self-start rounded-full border-line bg-white px-3.5 text-[13px] font-semibold text-ink/72 shadow-xs hover:border-primary/35 hover:bg-primary-soft/70 sm:h-9 sm:px-4 sm:text-sm md:h-9 lg:h-10 lg:px-5"
            render={
              <Link href="/tuketici-haritasi">
                Tüm kayıtlar
                <ArrowRight aria-hidden="true" className="size-3.5 sm:size-4" />
              </Link>
            }
            variant="outline"
          />
        ) : (
          <Button
            className="h-9 self-start rounded-full border-line bg-white px-3.5 text-[13px] font-semibold text-ink/72 shadow-xs hover:border-primary/35 hover:bg-primary-soft/70 sm:h-9 sm:px-4 sm:text-sm md:h-9 lg:h-10 lg:px-5"
            onClick={onSearchOpen}
            variant="outline"
          >
            Tüm kayıtlar
            <ArrowRight aria-hidden="true" className="size-3.5 sm:size-4" />
          </Button>
        )}
      </div>

      {hasEntries ? (
        <div className="min-w-0 overflow-hidden px-1 py-1" onFocus={stopAutoplay} onMouseEnter={stopAutoplay} onMouseLeave={startAutoplay}>
          <Swiper
            a11y={{ enabled: true }}
            autoplay={entries.length > 1 ? AUTOPLAY : false}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 12 },
              768: { slidesPerView: 2, spaceBetween: 14 },
              1024: { slidesPerView: compact ? 2 : 3, spaceBetween: 14 },
              1280: { slidesPerView: compact ? 3 : 4, spaceBetween: 16 },
              1536: { slidesPerView: compact ? 3 : 4, spaceBetween: 18 },
            }}
            className="province-latest-swiper !overflow-hidden !pb-8 md:!pb-9"
            keyboard={{ enabled: true, onlyInViewport: true }}
            loop={false}
            modules={[A11y, Autoplay, Keyboard, Pagination]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              if (entries.length > 1 && swiper.autoplay && !swiper.autoplay.running) {
                swiper.autoplay.start();
              }
            }}
            rewind={entries.length > 1}
            pagination={{ clickable: true, dynamicBullets: entries.length > 4 }}
            slidesPerView={1}
            spaceBetween={12}
            speed={650}
          >
            {entries.map((entry) => (
              <SwiperSlide className="h-auto" key={entry.id}>
                <ProvinceEntryCard entry={entry} onSelect={onProvinceOpen} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line bg-white p-4 text-sm text-muted sm:rounded-2xl sm:p-5 md:p-6">Harita kayıtları eklendiğinde burada son içerikler görünür.</p>
      )}
    </section>
  );
}
