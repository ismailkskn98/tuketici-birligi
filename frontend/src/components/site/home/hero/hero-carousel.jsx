"use client";

import { useRef, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { A11y, Autoplay, EffectFade, Keyboard, Parallax } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FadeIn } from "@/components/motion/reveal";
import { HeroContent } from "./hero-content";
import { HeroSidePagination } from "./hero-side-pagination";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/parallax";
import CornerShape from "@/components/common/cornerShape";

const AUTOPLAY = {
  enabled: true,
  delay: 5000,
  disableOnInteraction: false,
  pauseOnMouseEnter: false,
  waitForTransition: false,
  stopOnLastSlide: false,
};

export function HeroCarousel({ slides, labels }) {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const items = slides?.length ? slides : [];

  if (!items.length) return null;

  const showChrome = items.length > 1;
  const progress = ((activeIndex + 1) / items.length) * 100;

  function restartAutoplay() {
    const swiper = swiperRef.current;
    if (!swiper?.autoplay || !showChrome) return;
    swiper.autoplay.stop();
    swiper.autoplay.start();
  }

  function goTo(index) {
    swiperRef.current?.slideTo(index);
    restartAutoplay();
  }

  function slidePrev() {
    swiperRef.current?.slidePrev();
    restartAutoplay();
  }

  function slideNext() {
    swiperRef.current?.slideNext();
    restartAutoplay();
  }

  return (
    <section data-hero-root className="relative gridContainer z-1 h-full bg-white">
      <FadeIn
        className="2xl:fluid relative overflow-hidden rounded-2xl bg-white 2xl:mx-12 aspect-16/15 sm:aspect-video lg:aspect-16/6"
        delay={0.06}
        duration={0.7}
        viewport={{ once: true, amount: 0.35 }}
      >
        <Swiper
          modules={[A11y, Autoplay, EffectFade, Keyboard, Parallax]}
          a11y={{ enabled: true }}
          autoplay={showChrome ? AUTOPLAY : false}
          className="home-hero-swiper h-full min-h-0 w-full rounded-2xl"
          effect="fade"
          fadeEffect={{ crossFade: true }}
          keyboard={{ enabled: true, onlyInViewport: true, pageUpDown: true }}
          loop={false}
          rewind={showChrome}
          parallax
          speed={800}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            if (showChrome && swiper.autoplay && !swiper.autoplay.running) {
              swiper.autoplay.start();
            }
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
          }}
        >
          {items.map((slide, index) => (
            <SwiperSlide key={slide.id || slide.slug} className="h-full rounded-2xl">
              <HeroContent labels={labels} priority={index === 0} slide={slide} />
            </SwiperSlide>
          ))}
        </Swiper>

        {showChrome ? (
          <>
            <HeroSidePagination activeIndex={activeIndex} total={items.length} onSelect={goTo} className="absolute top-auto bottom-0 md:bottom-auto md:top-1/2 right-0 z-30 md:-translate-y-1/2" />

            <article className="pointer-events-auto absolute inset-x-4 bottom-4 z-30 hidden md:flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-3 text-ink sm:inset-x-auto sm:right-0 sm:bottom-0 sm:justify-start sm:gap-4 sm:rounded-tl-xl sm:rounded-tr-none sm:rounded-br-none sm:rounded-bl-none sm:px-2.5 sm:pt-3.5 sm:pb-2 sm:pr-1.5 sm:pl-2.5">
              <CornerShape className="absolute hidden -top-3.5 -rotate-90 left-auto right-0 w-3.5 h-3.5 text-white sm:block" />
              <CornerShape className="absolute hidden bottom-0 top-auto -rotate-90 -left-3.5 w-3.5 h-3.5 text-white sm:block" />
              <button
                type="button"
                aria-label={labels.prevSlide}
                className="focus-ring inline-flex items-center gap-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-ink/75 transition-colors hover:text-ink sm:text-[11px]"
                onClick={slidePrev}
              >
                <HiChevronLeft aria-hidden="true" className="size-3.5 shrink-0" />
                {labels.prevSlide}
              </button>

              <div aria-hidden="true" className="relative h-px min-w-8 flex-1 bg-black/20 sm:w-16 sm:min-w-0 sm:flex-none md:w-20">
                <span className="absolute inset-y-0 left-0 bg-black transition-[width] duration-300 ease-out" style={{ width: `${progress}%` }} />
              </div>

              <button
                type="button"
                aria-label={labels.nextSlide}
                className="focus-ring inline-flex items-center gap-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-ink/75 transition-colors hover:text-ink sm:text-[11px]"
                onClick={slideNext}
              >
                {labels.nextSlide}
                <HiChevronRight aria-hidden="true" className="size-3.5 shrink-0" />
              </button>
            </article>
          </>
        ) : null}
      </FadeIn>
    </section>
  );
}
