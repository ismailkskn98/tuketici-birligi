"use client";

import { CalendarDays } from "lucide-react";
import { CutoutCorner } from "@/components/ui/cutout-card";
import { formatCompactDate } from "./province-map-utils";

export function ProvinceEntryCard({ entry, onSelect }) {
  return (
    <button
      className="group relative flex h-full min-h-44 w-full flex-col justify-between overflow-hidden rounded-[24px] border border-line bg-white p-5 text-left shadow-xs transition duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
      onClick={() => onSelect(entry.provinceCode, entry.provinceName)}
      type="button"
    >
      <span className="absolute right-0 top-0 rounded-bl-[18px] bg-ink px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
        {entry.categoryLabel || "İçerik"}
        <CutoutCorner className="absolute -bottom-[23px] right-0 -rotate-90 text-ink" size={24} />
        <CutoutCorner className="absolute -left-[23px] top-0 -rotate-90 text-ink" size={24} />
      </span>

      <div className="grid gap-3 pr-20">
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary-dark">
          {entry.provinceName}
        </span>
        <h3 className="line-clamp-3 text-base font-semibold leading-snug tracking-normal text-ink">
          {entry.title}
        </h3>
      </div>

      <div className="mt-7 flex items-center justify-between gap-3 border-t border-line pt-3">
        <span className="inline-flex items-center gap-2 text-xs font-medium text-muted">
          <CalendarDays aria-hidden="true" className="size-3.5" />
          {formatCompactDate(entry.eventDate || entry.publishedAt || entry.createdAt) || "Tarih yok"}
        </span>
        <span className="text-xs font-semibold text-ink/60 transition-colors group-hover:text-secondary">
          Detayları gör
        </span>
      </div>
    </button>
  );
}

