"use client";

import { motion } from "motion/react";
import { useRef } from "react";
import { A11y, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

const indicatorSpring = {
  type: "spring",
  stiffness: 440,
  damping: 38,
  mass: 0.7,
};

export function BoardCategoryNavigation({
  activeId,
  categoryLabel,
  navigationLabel,
  onSelect,
  reduceMotion,
  tabs,
}) {
  const swiperRef = useRef(null);
  const transition = reduceMotion ? { duration: 0 } : indicatorSpring;

  return (
    <>
      <div className="min-w-0 lg:hidden">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a93a2]">
          {categoryLabel}
        </p>

        <div className="mt-3 min-w-0 border-b border-[#e4e8ed]">
          <div aria-label={navigationLabel} role="tablist">
            <Swiper
              a11y={{ enabled: true }}
              className="board-category-swiper !overflow-hidden"
              keyboard={{ enabled: true, onlyInViewport: true }}
              modules={[A11y, Keyboard]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              slidesOffsetAfter={24}
              slidesPerView="auto"
              spaceBetween={28}
              speed={reduceMotion ? 0 : 520}
              watchOverflow
            >
              {tabs.map((tab, index) => {
                const isActive = tab.id === activeId;

                return (
                  <SwiperSlide className="!w-auto" key={tab.id}>
                    <button
                      aria-controls="board-member-panel"
                      aria-selected={isActive}
                      className={`relative flex min-h-11 items-center pb-3 pt-2 text-left text-[13px] tracking-[-0.01em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-4 ${
                        isActive
                          ? "font-semibold text-[#14213d]"
                          : "font-medium text-[#8a93a2] hover:text-[#4f5b6d]"
                      }`}
                      id={`board-tab-mobile-${tab.id}`}
                      onClick={() => {
                        onSelect(tab.id);
                        swiperRef.current?.slideTo(index);
                      }}
                      role="tab"
                      type="button"
                    >
                      <span className="whitespace-nowrap">{tab.title}</span>
                      {isActive ? (
                        <motion.span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-x-0 bottom-[-1px] h-0.5 bg-[#14213d]"
                          layoutId="board-category-mobile-indicator"
                          transition={transition}
                        />
                      ) : null}
                    </button>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a93a2]">
          {categoryLabel}
        </p>

        <motion.div
          aria-label={navigationLabel}
          className="mt-5 border-l border-[#dfe3e8]"
          layoutScroll
          role="tablist"
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeId;

            return (
              <button
                aria-controls="board-member-panel"
                aria-selected={isActive}
                className={`relative flex w-full items-center py-3.5 pl-4 pr-2 text-left text-sm transition-colors duration-200 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-inset ${
                  isActive
                    ? "font-semibold text-[#14213d]"
                    : "font-medium text-[#8a93a2] hover:text-[#39465d]"
                }`}
                id={`board-tab-desktop-${tab.id}`}
                key={tab.id}
                onClick={() => onSelect(tab.id)}
                role="tab"
                type="button"
              >
                {isActive ? (
                  <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-px top-0 h-full w-0.5 bg-[#14213d]"
                    layoutId="board-category-desktop-indicator"
                    transition={transition}
                  />
                ) : null}
                <span>{tab.title}</span>
              </button>
            );
          })}
        </motion.div>
      </div>
    </>
  );
}
