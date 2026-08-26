"use client";

import { useRef } from "react";
import NumberFlow, { continuous } from "@number-flow/react";
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
  const digits = String(value).length;
  const displayValue = inView ? value : 0;

  return (
    <span
      ref={ref}
      className="inline-grid justify-items-start tabular-nums [grid-template-areas:'stack']"
    >
      <span aria-hidden className="invisible [grid-area:stack]">
        {value}
      </span>
      <NumberFlow
        animated={!reduceMotion}
        className="[grid-area:stack]"
        format={{ useGrouping: false, minimumIntegerDigits: digits }}
        isolate
        locales="tr-TR"
        opacityTiming={{ duration: 900, easing: "ease-out" }}
        plugins={[continuous]}
        spinTiming={{ duration: 1400, easing: "ease-out" }}
        style={{ fontVariantNumeric: "tabular-nums" }}
        transformTiming={{ duration: 1400, easing: "ease-out" }}
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
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted sm:text-[11px] sm:tracking-[0.12em]">{label}</span>
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
    <div className={cn("flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-5 md:gap-x-6", className)}>
      <LegendItem color={PROVINCE_MAP_COLORS.high} label="Yoğun içerik" />
      <LegendItem color={PROVINCE_MAP_COLORS.medium} label="Orta düzey" />
      <LegendItem color={PROVINCE_MAP_COLORS.empty} label="Kayıt bulunmuyor" />
    </div>
  );
}

export function ProvinceMapHeader({ activeProvinceCount, categoryCount, densityFilter, latestCount, onFilterOpen, onSearchOpen, totalEntries }) {
  const activeFilter = DENSITY_FILTERS.find((filter) => filter.id === densityFilter);

  return (
    <header className="grid gap-5 sm:gap-6 md:gap-7 2xl:gap-8">
      <div className="max-w-3xl">
        <SectionEyebrow>İl bazlı içerik ağı</SectionEyebrow>
        <h2 className="mt-3 max-w-3xl text-balance font-heading text-2xl font-semibold leading-[1.08] tracking-normal text-ink sm:mt-3.5 sm:text-[1.85rem] md:mt-4 md:text-3xl lg:text-[2.15rem] xl:text-4xl 2xl:text-5xl">
          Türkiye Tüketici Bilgilendirme Haritası
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:mt-3.5 sm:text-[15px] sm:leading-6 md:mt-4 md:text-[15px] md:leading-7 lg:text-base lg:leading-7">
          İllere göre yayınlanan haber, duyuru ve tüketici rehberlerini tek bakışta görünür kılan interaktif bir bilgilendirme alanı.
        </p>
      </div>

      <div className="flex flex-col gap-4 border-t border-line/70 pt-4 md:flex-row md:items-center md:justify-between md:gap-6 md:pt-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 sm:gap-x-5 md:gap-x-6 lg:gap-x-7">
          <HeaderMetric label="yayında" value={totalEntries} />
          <span aria-hidden="true" className="hidden h-5 w-px bg-line sm:block md:h-6 lg:h-7" />
          <HeaderMetric label="ilde içerik" value={activeProvinceCount} />
          <span aria-hidden="true" className="hidden h-5 w-px bg-line sm:block md:h-6 lg:h-7" />
          <HeaderMetric label="içerik türü" value={categoryCount} />
          <span aria-hidden="true" className="hidden h-5 w-px bg-line sm:block md:h-6 lg:h-7" />
          <HeaderMetric label="son kayıt" value={latestCount} />
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto md:shrink-0">
          <Button
            className="h-9 min-w-0 flex-1 rounded-full border-line bg-white px-3 text-xs font-semibold text-ink shadow-xs hover:border-ink/25 hover:bg-surface sm:h-9 sm:flex-none sm:px-3.5 sm:text-[13px] lg:h-10 lg:px-4 lg:text-sm"
            onClick={onFilterOpen}
            variant="outline"
          >
            <Filter aria-hidden="true" className="size-3.5 lg:size-4" />
            {activeFilter?.label || "Tümü"}
          </Button>
          <Button
            className="h-9 min-w-0 flex-1 rounded-full bg-secondary px-3 text-xs font-semibold text-white shadow-xs hover:bg-secondary-dark sm:h-9 sm:flex-none sm:px-3.5 sm:text-[13px] lg:h-10 lg:px-5 lg:text-sm"
            onClick={onSearchOpen}
          >
            <Search aria-hidden="true" className="size-3.5 lg:size-4" />
            İl ara
          </Button>
        </div>
      </div>
    </header>
  );
}
