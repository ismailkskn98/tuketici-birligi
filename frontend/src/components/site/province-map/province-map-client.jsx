"use client";

import { useMemo, useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { DensityFilterDialog, ProvinceEntriesDialog, ProvinceSearchDialog } from "./province-map-dialogs";
import { ProvinceMapHeader, ProvinceMapLegend } from "./province-map-header";
import { ProvinceLatestCarousel } from "./province-latest-carousel";
import { ProvinceMapStage } from "./province-map-stage";
import { emptyProvinceData, getProvinceMapCategoryCount, normalizeProvinceMap } from "./province-map-utils";

export function ProvinceMapClient({ compact = false, data }) {
  const provinces = useMemo(() => normalizeProvinceMap(data), [data]);
  const provinceByCode = useMemo(() => new Map(provinces.map((province) => [province.code, province])), [provinces]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [densityFilter, setDensityFilter] = useState("all");

  const stats = data?.stats || {};
  const latestEntries = data?.latestEntries || [];
  const totalEntries = stats.totalEntries || 0;
  const activeProvinceCount = stats.activeProvinceCount || 0;
  const categoryCount = useMemo(() => getProvinceMapCategoryCount(provinces), [provinces]);

  function openProvince(code, fallbackName = "") {
    const province = provinceByCode.get(Number(code)) || {
      ...emptyProvinceData,
      code: Number(code),
      name: fallbackName,
    };
    setSelectedProvince(province);
  }

  return (
    <section className={cn("overflow-hidden bg-white", compact ? "py-0" : "py-10 sm:py-12 md:py-14 lg:py-16 2xl:py-20")}>
      <Reveal className="mx-auto grid w-full min-w-0 gridContainer gap-5 sm:gap-6 md:gap-8 lg:gap-9 2xl:gap-10" viewport={{ once: true, amount: 0.14 }}>
        <ProvinceMapHeader
          activeProvinceCount={activeProvinceCount}
          categoryCount={categoryCount}
          densityFilter={densityFilter}
          latestCount={latestEntries.length}
          onFilterOpen={() => setFilterOpen(true)}
          onSearchOpen={() => setSearchOpen(true)}
          totalEntries={totalEntries}
        />

        <div className="grid gap-3 sm:gap-4 md:gap-0">
          <ProvinceMapStage compact={compact} densityFilter={densityFilter} onProvinceOpen={openProvince} provinceByCode={provinceByCode} />
          <ProvinceMapLegend className="justify-center px-1 md:hidden" />
        </div>

        <ProvinceLatestCarousel compact={compact} entries={latestEntries} onProvinceOpen={openProvince} onSearchOpen={() => setSearchOpen(true)} />
      </Reveal>

      <ProvinceEntriesDialog
        onOpenChange={(open) => {
          if (!open) setSelectedProvince(null);
        }}
        open={Boolean(selectedProvince)}
        province={selectedProvince}
      />

      <ProvinceSearchDialog
        onOpenChange={setSearchOpen}
        onSelect={(province) => {
          setSearchOpen(false);
          openProvince(province.code, province.name);
        }}
        open={searchOpen}
        provinces={provinces}
      />

      <DensityFilterDialog
        densityFilter={densityFilter}
        onOpenChange={setFilterOpen}
        onSelect={(nextFilter) => {
          setDensityFilter(nextFilter);
          setFilterOpen(false);
        }}
        open={filterOpen}
      />
    </section>
  );
}
