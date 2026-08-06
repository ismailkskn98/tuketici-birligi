"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { DensityFilterDialog, ProvinceEntriesDialog, ProvinceSearchDialog } from "./province-map-dialogs";
import { ProvinceMapHeader } from "./province-map-header";
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
    <section className={cn("overflow-hidden bg-white", compact ? "py-10 md:py-12" : "py-14 md:py-20")}>
      <div className="mx-auto grid w-full min-w-0 gridContainer">
        <ProvinceMapHeader
          activeProvinceCount={activeProvinceCount}
          categoryCount={categoryCount}
          densityFilter={densityFilter}
          latestCount={latestEntries.length}
          onFilterOpen={() => setFilterOpen(true)}
          onSearchOpen={() => setSearchOpen(true)}
          totalEntries={totalEntries}
        />
        <ProvinceMapStage compact={compact} densityFilter={densityFilter} onProvinceOpen={openProvince} provinceByCode={provinceByCode} />

        <ProvinceLatestCarousel compact={compact} entries={latestEntries} onProvinceOpen={openProvince} onSearchOpen={() => setSearchOpen(true)} />
      </div>

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
