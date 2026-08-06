"use client";

import { useEffect, useRef, useState } from "react";
import { Filter, Search } from "lucide-react";
import { useInView, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { DENSITY_FILTERS, PROVINCE_MAP_COLORS, formatCount } from "./province-map-utils";

function AnimatedCount({ value }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.6, once: true });
  const shouldAnimate = !reduceMotion && value > 0;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView || !shouldAnimate) return undefined;

    let animationFrame = 0;
    const duration = 700;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick);
      }
    }

    animationFrame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrame);
  }, [inView, shouldAnimate, value]);

  return <span ref={ref}>{formatCount(shouldAnimate ? displayValue : value)}</span>;
}

function HeaderMetric({ label, value }) {
  return (
    <span className="inline-flex items-baseline gap-2 whitespace-nowrap">
      <strong className="font-heading text-2xl font-semibold leading-none tracking-normal text-ink md:text-[1.9rem]">
        <AnimatedCount value={value} />
      </strong>
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</span>
    </span>
  );
}

function LegendItem({ color, label }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-xs font-medium text-muted">
      <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

export function ProvinceMapHeader({ activeProvinceCount, categoryCount, densityFilter, latestCount, onFilterOpen, onSearchOpen, totalEntries }) {
  const activeFilter = DENSITY_FILTERS.find((filter) => filter.id === densityFilter);

  return (
    <header className="grid gap-7 lg:gap-8">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-[11px] font-medium text-muted shadow-[0_6px_18px_rgba(22,32,51,0.04)]">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-secondary" />
          İl bazlı içerik ağı
        </span>
        <h2 className="mt-4 max-w-3xl text-balance font-heading text-3xl font-semibold leading-[1.08] tracking-normal text-ink md:text-5xl">Türkiye Tüketici Bilgilendirme Haritası</h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted">İllere göre yayınlanan haber, duyuru ve tüketici rehberlerini tek bakışta görünür kılan interaktif bir bilgilendirme alanı.</p>
      </div>

      <div className="grid gap-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <HeaderMetric label="yayında" value={totalEntries} />
          <span aria-hidden="true" className="hidden h-7 w-px bg-line md:block" />
          <HeaderMetric label="ilde içerik" value={activeProvinceCount} />
          <span aria-hidden="true" className="hidden h-7 w-px bg-line md:block" />
          <HeaderMetric label="içerik türü" value={categoryCount} />
          <span aria-hidden="true" className="hidden h-7 w-px bg-line md:block" />
          <HeaderMetric label="son kayıt" value={latestCount} />
        </div>

        <div className="flex flex-col gap-3 border-t border-line/80 pt-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <LegendItem color={PROVINCE_MAP_COLORS.high} label="Yoğun içerik" />
            <LegendItem color={PROVINCE_MAP_COLORS.medium} label="Orta düzey" />
            <LegendItem color={PROVINCE_MAP_COLORS.empty} label="Kayıt bulunmuyor" />
          </div>

          <div className="flex flex-col gap-2 min-[420px]:flex-row md:justify-end">
            <Button
              className="h-10 justify-start rounded-full border-line bg-white px-4 text-sm font-semibold text-secondary shadow-xs hover:border-secondary/25 hover:bg-secondary/6 hover:text-secondary md:justify-center"
              onClick={onFilterOpen}
              variant="outline"
            >
              <Filter aria-hidden="true" className="size-4" />
              {activeFilter?.label || "Tümü"}
            </Button>
            <Button className="h-10 justify-start rounded-full bg-secondary px-5 text-sm font-semibold text-white shadow-xs hover:bg-secondary/92 md:justify-center" onClick={onSearchOpen}>
              <Search aria-hidden="true" className="size-4" />
              İl ara
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
