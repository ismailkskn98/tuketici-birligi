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
  waitForTransition: false
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
    <section className="grid min-w-0 gap-5 md:gap-6">
      <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold tracking-normal text-ink md:text-xl">
            Son eklenen bilgilendirmeler
          </h3>
          <History aria-hidden="true" className="size-4 text-muted" />
        </div>

        {compact ? (
          <Button
            className="h-10 self-start rounded-full border-line bg-white px-5 text-sm font-semibold text-ink/72 shadow-xs hover:border-primary/35 hover:bg-primary-soft/70"
            render={
              <Link href="/tuketici-haritasi">
                Tüm kayıtlar
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            }
            variant="outline"
          />
        ) : (
          <Button
            className="h-10 self-start rounded-full border-line bg-white px-5 text-sm font-semibold text-ink/72 shadow-xs hover:border-primary/35 hover:bg-primary-soft/70"
            onClick={onSearchOpen}
            variant="outline"
          >
            Tüm kayıtlar
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        )}
      </div>

      {hasEntries ? (
        <div className="min-w-0 overflow-hidden px-1 py-1" onFocus={stopAutoplay} onMouseEnter={stopAutoplay} onMouseLeave={startAutoplay}>
          <Swiper
            a11y={{ enabled: true }}
            autoplay={entries.length > 1 ? AUTOPLAY : false}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: compact ? 2 : 3 },
              1280: { slidesPerView: compact ? 3 : 4 }
            }}
            className="province-latest-swiper !overflow-hidden !pb-9"
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
            spaceBetween={16}
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
        <p className="rounded-2xl border border-dashed border-line bg-white p-6 text-sm text-muted">
          Harita kayıtları eklendiğinde burada son içerikler görünür.
        </p>
      )}
    </section>
  );
}
