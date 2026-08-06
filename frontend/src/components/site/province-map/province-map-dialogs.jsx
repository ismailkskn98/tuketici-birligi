"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { ResponsiveModal, ResponsiveModalHeader } from "@/components/ui/responsive-modal";
import { cn, formatDate } from "@/lib/utils";
import { DENSITY_FILTERS } from "./province-map-utils";

const densityMeta = {
  all: { color: "bg-secondary" },
  high: { color: "bg-primary-dark" },
  medium: { color: "bg-primary" },
  empty: { color: "bg-line" },
};

function ProvinceEmptyState({ description, title }) {
  return (
    <div className="grid min-h-36 place-items-center px-6 py-10 text-center sm:px-7">
      <div className="grid max-w-sm gap-1.5">
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="text-sm leading-6 text-muted">{description}</p>
      </div>
    </div>
  );
}

function ProvinceSearchRow({ isActive, onHover, onSelect, province }) {
  return (
    <button
      className={cn(
        "grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 py-4 text-left transition sm:px-7",
        isActive ? "bg-surface" : "bg-transparent hover:bg-surface/80",
      )}
      onClick={onSelect}
      onFocus={onHover}
      onMouseEnter={onHover}
      type="button"
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-ink">{province.name}</span>
        <span className="mt-1 block truncate text-xs text-muted">
          {province.count > 0 ? "Yayındaki kayıtları görüntüle" : "Henüz yayınlanmış kayıt yok"}
        </span>
      </span>
      <span
        className={cn(
          "whitespace-nowrap text-xs font-medium tabular-nums",
          province.count > 0 ? "text-primary-dark" : "text-muted",
        )}
      >
        {province.count} kayıt
      </span>
    </button>
  );
}

function ProvinceFilterOption({ active, option, onSelect }) {
  const meta = densityMeta[option.id] || densityMeta.all;

  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 px-6 py-3.5 text-left transition sm:px-7",
        active ? "bg-surface" : "bg-transparent hover:bg-surface/80",
      )}
      onClick={onSelect}
      type="button"
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", meta.color)} />
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{option.label}</span>
      <span
        className={cn(
          "size-1.5 shrink-0 rounded-full transition",
          active ? "bg-ink" : "bg-transparent ring-1 ring-line",
        )}
      />
    </button>
  );
}

function ProvinceEntryListItem({ entry }) {
  return (
    <article className="grid gap-3 px-6 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-6 sm:px-7">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <Badge className="bg-surface font-medium text-ink">{entry.categoryLabel || "İçerik"}</Badge>
          {entry.eventDate ? <span className="text-xs text-muted">{formatDate(entry.eventDate)}</span> : null}
        </div>
        <h3 className="text-[0.95rem] font-semibold tracking-tight text-ink">{entry.title}</h3>
        {entry.summary ? <p className="mt-1.5 text-sm leading-6 text-muted">{entry.summary}</p> : null}
      </div>
      {entry.linkHref ? (
        <Button
          className="justify-self-start sm:justify-self-end"
          render={
            <Link href={entry.linkHref}>
              {entry.linkLabel || "İçeriğe git"}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          }
          size="sm"
          variant="outline"
        />
      ) : null}
    </article>
  );
}

export function ProvinceEntriesDialog({ onOpenChange, open, province }) {
  const entries = province?.entries || [];
  const provinceName = province?.name || "İl seçimi";

  return (
    <ResponsiveModal
      dialogClassName="max-h-[calc(100dvh-2rem)] gap-0 overflow-hidden rounded-2xl border border-line/50 bg-white p-0 shadow-soft ring-0 sm:max-w-2xl"
      drawerClassName="bg-white"
      onOpenChange={onOpenChange}
      open={open}
      title={provinceName}
    >
      <ResponsiveModalHeader
        description={
          entries.length
            ? `${entries.length} tüketici bilgilendirme kaydı listeleniyor.`
            : "Bu il için henüz yayınlanmış kayıt bulunmuyor."
        }
        title={provinceName}
      />

      {entries.length ? (
        <div className="relative">
          <div className="site-search-scroll max-h-[min(32rem,62dvh)] divide-y divide-line/50 overflow-y-auto">
            {entries.map((entry) => (
              <ProvinceEntryListItem entry={entry} key={entry.id} />
            ))}
          </div>
          <ProgressiveBlur blurLevels={[0.4, 1, 2, 4]} className="h-8" height="2rem" position="bottom" />
        </div>
      ) : (
        <ProvinceEmptyState
          description="Admin panelinden bu il için haber, duyuru, rehber veya faaliyet kaydı eklendiğinde burada listelenecek."
          title="Henüz yayınlanmış içerik yok"
        />
      )}
    </ResponsiveModal>
  );
}

export function ProvinceSearchDialog({ onOpenChange, onSelect, open, provinces }) {
  const [query, setQuery] = useState("");
  const [hoveredCode, setHoveredCode] = useState(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("tr-TR");
    if (!normalized) return provinces;

    return provinces.filter((province) => province.name.toLocaleLowerCase("tr-TR").includes(normalized));
  }, [provinces, query]);

  function selectProvince(province) {
    setQuery("");
    setHoveredCode(null);
    onSelect(province);
  }

  return (
    <ResponsiveModal
      dialogClassName="max-h-[calc(100dvh-2rem)] gap-0 overflow-hidden rounded-2xl border border-line/50 bg-white p-0 shadow-soft ring-0 sm:max-w-[34rem]"
      drawerClassName="bg-white"
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setQuery("");
          setHoveredCode(null);
        }
        onOpenChange(nextOpen);
      }}
      open={open}
      title="İl ara"
    >
      <ResponsiveModalHeader description="Yayındaki kayıtları il adına göre filtreleyin." title="İl ara" />

      <div className="px-6 pb-3 sm:px-7">
        <label className="flex h-12 items-center gap-3 rounded-xl bg-surface px-3.5">
          <Search aria-hidden="true" className="size-4 shrink-0 text-muted" />
          <input
            autoFocus
            className="h-full w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && filtered[0]) {
                event.preventDefault();
                selectProvince(filtered[0]);
              }
            }}
            placeholder="İl adına göre arayın"
            value={query}
          />
        </label>
      </div>

      <div className="relative">
        <div className="site-search-scroll max-h-[min(28rem,54dvh)] divide-y divide-line/40 overflow-y-auto">
          {filtered.length ? (
            filtered.map((province) => (
              <ProvinceSearchRow
                isActive={hoveredCode === province.code}
                key={province.code}
                onHover={() => setHoveredCode(province.code)}
                onSelect={() => selectProvince(province)}
                province={province}
              />
            ))
          ) : (
            <ProvinceEmptyState
              description="Farklı bir il adı deneyin ya da listedeki şehirlerden birini seçin."
              title="Eşleşen il bulunamadı"
            />
          )}
        </div>
        {filtered.length ? <ProgressiveBlur blurLevels={[0.4, 1, 2, 4]} className="h-8" height="2rem" position="bottom" /> : null}
      </div>
    </ResponsiveModal>
  );
}

export function DensityFilterDialog({ densityFilter, onOpenChange, onSelect, open }) {
  return (
    <ResponsiveModal
      dialogClassName="gap-0 overflow-hidden rounded-2xl border border-line/50 bg-white p-0 shadow-soft ring-0 sm:max-w-[22rem]"
      drawerClassName="bg-white"
      onOpenChange={onOpenChange}
      open={open}
      title="Yoğunluk filtresi"
    >
      <ResponsiveModalHeader description="Haritada vurgulanacak içerik seviyesini seçin." title="Yoğunluk filtresi" />

      <div className="divide-y divide-line/40 pb-2">
        {DENSITY_FILTERS.map((option) => (
          <ProvinceFilterOption
            active={densityFilter === option.id}
            key={option.id}
            onSelect={() => onSelect(option.id)}
            option={option}
          />
        ))}
      </div>
    </ResponsiveModal>
  );
}
