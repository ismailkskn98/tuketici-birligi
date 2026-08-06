"use client";

import { useEffect, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import { Filter, Search } from "lucide-react";
import { useInView, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { cn } from "@/lib/utils";
import { DENSITY_FILTERS, PROVINCE_MAP_COLORS } from "./province-map-utils";

function AnimatedCount({ value }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.6, once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setDisplayValue(value);
  }, [inView, value]);

  return (
    <span ref={ref}>
      <NumberFlow
        animated={!reduceMotion}
        locales="tr-TR"
        opacityTiming={{ duration: 450, easing: "ease-out" }}
        spinTiming={{ duration: 1200, easing: "ease-out" }}
        transformTiming={{ duration: 1200, easing: "ease-out" }}
        value={reduceMotion ? value : displayValue}
      />
    </span>
  );
}

function HeaderMetric({ label, value }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap sm:gap-2">
      <strong className="font-heading text-xl font-semibold leading-none tracking-normal text-ink sm:text-2xl md:text-[1.55rem] lg:text-[1.7rem] xl:text-[1.85rem] 2xl:text-[1.9rem]">
        <AnimatedCount value={value} />
      </strong>
      <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted sm:text-[11px] sm:tracking-[0.12em]">{label}</span>
    </span>
  );
}

function LegendItem({ color, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] font-medium text-muted sm:gap-2 sm:text-xs">
      <span className="size-1.5 rounded-full sm:size-2" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

export function ProvinceMapLegend({ className }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3.5 gap-y-2 sm:gap-x-4 md:gap-x-5", className)}>
      <LegendItem color={PROVINCE_MAP_COLORS.high} label="Yoğun içerik" />
      <LegendItem color={PROVINCE_MAP_COLORS.medium} label="Orta düzey" />
      <LegendItem color={PROVINCE_MAP_COLORS.empty} label="Kayıt bulunmuyor" />
    </div>
  );
}

export function ProvinceMapHeader({ activeProvinceCount, categoryCount, densityFilter, latestCount, onFilterOpen, onSearchOpen, totalEntries }) {
  const activeFilter = DENSITY_FILTERS.find((filter) => filter.id === densityFilter);

  return (
    <header className="grid gap-5 sm:gap-6 md:gap-6 lg:gap-7 2xl:gap-8">
      <div className="max-w-3xl">
        <SectionEyebrow>İl bazlı içerik ağı</SectionEyebrow>
        <h2 className="mt-3 max-w-3xl text-balance font-heading text-2xl font-semibold leading-[1.08] tracking-normal text-ink sm:mt-3.5 sm:text-[1.85rem] md:mt-4 md:text-3xl lg:text-[2.15rem] xl:text-4xl 2xl:text-5xl">
          Türkiye Tüketici Bilgilendirme Haritası
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:mt-3.5 sm:text-[15px] sm:leading-6 md:mt-4 md:text-[15px] md:leading-7 lg:text-base lg:leading-7">
          İllere göre yayınlanan haber, duyuru ve tüketici rehberlerini tek bakışta görünür kılan interaktif bir bilgilendirme alanı.
        </p>
      </div>

      <div className="grid gap-3 sm:gap-3.5 md:gap-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 sm:gap-x-5 sm:gap-y-3 md:gap-x-5 lg:gap-x-6">
          <HeaderMetric label="yayında" value={totalEntries} />
          <span aria-hidden="true" className="hidden h-5 w-px bg-line sm:block md:h-6 lg:h-7" />
          <HeaderMetric label="ilde içerik" value={activeProvinceCount} />
          <span aria-hidden="true" className="hidden h-5 w-px bg-line sm:block md:h-6 lg:h-7" />
          <HeaderMetric label="içerik türü" value={categoryCount} />
          <span aria-hidden="true" className="hidden h-5 w-px bg-line sm:block md:h-6 lg:h-7" />
          <HeaderMetric label="son kayıt" value={latestCount} />
        </div>

        <div className="flex flex-col gap-3 border-t border-line/80 pt-3 sm:pt-3.5 md:flex-row md:items-center md:justify-between md:gap-4 md:pt-4">
          <ProvinceMapLegend className="hidden md:flex" />

          <div className="flex w-full items-center gap-2 sm:w-auto sm:justify-end md:ml-auto">
            <Button
              className="h-8 min-w-0 flex-1 rounded-full border-line bg-white px-2.5 text-xs font-semibold text-secondary shadow-xs hover:border-secondary/25 hover:bg-secondary/6 hover:text-secondary sm:h-8 sm:flex-none sm:px-3.5 sm:text-[13px] md:h-9 md:px-3.5 lg:h-10 lg:px-4 lg:text-sm"
              onClick={onFilterOpen}
              variant="outline"
            >
              <Filter aria-hidden="true" className="size-3.5 lg:size-4" />
              {activeFilter?.label || "Tümü"}
            </Button>
            <Button
              className="h-8 min-w-0 flex-1 rounded-full bg-secondary px-2.5 text-xs font-semibold text-white shadow-xs hover:bg-secondary/92 sm:h-8 sm:flex-none sm:px-3.5 sm:text-[13px] md:h-9 md:px-4 lg:h-10 lg:px-5 lg:text-sm"
              onClick={onSearchOpen}
            >
              <Search aria-hidden="true" className="size-3.5 lg:size-4" />
              İl ara
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
