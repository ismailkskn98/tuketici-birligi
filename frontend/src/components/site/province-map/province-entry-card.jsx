"use client";

import { CalendarDays } from "lucide-react";
import { CutoutCorner } from "@/components/ui/cutout-card";
import { formatCompactDate } from "./province-map-utils";

export function ProvinceEntryCard({ entry, onSelect }) {
  return (
    <button
      className="group relative flex h-full min-h-36 w-full flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white p-4 text-left shadow-xs transition duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft sm:min-h-40 sm:p-4.5 md:min-h-36 md:rounded-[20px] md:p-4 lg:min-h-40 lg:p-5 xl:rounded-[22px] 2xl:min-h-44 2xl:rounded-[24px] 2xl:p-5"
      onClick={() => onSelect(entry.provinceCode, entry.provinceName)}
      type="button"
    >
      <span className="absolute right-0 top-0 rounded-bl-[14px] bg-ink px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white sm:rounded-bl-[16px] sm:px-3 sm:py-1.5 sm:text-[10px] 2xl:rounded-bl-[18px] 2xl:px-3.5 2xl:py-2">
        {entry.categoryLabel || "İçerik"}
        <CutoutCorner className="absolute -bottom-[23px] right-0 -rotate-90 text-ink" size={24} />
        <CutoutCorner className="absolute -left-[23px] top-0 -rotate-90 text-ink" size={24} />
      </span>

      <div className="grid gap-2 pr-16 sm:gap-2.5 sm:pr-18 md:gap-2 md:pr-16 lg:gap-3 lg:pr-20">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary-dark sm:text-[11px] sm:tracking-[0.16em]">{entry.provinceName}</span>
        <h3 className="line-clamp-3 text-[15px] font-semibold leading-snug tracking-normal text-ink sm:text-base md:text-[15px] lg:text-base">{entry.title}</h3>
      </div>

      <div className="mt-5 flex items-center justify-between gap-2 border-t border-line pt-2.5 sm:mt-6 sm:gap-3 sm:pt-3 md:mt-5 lg:mt-6 2xl:mt-7">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted sm:gap-2 sm:text-xs">
          <CalendarDays aria-hidden="true" className="size-3.5" />
          {formatCompactDate(entry.eventDate || entry.publishedAt || entry.createdAt) || "Tarih yok"}
        </span>
        <span className="text-[11px] font-semibold text-ink/60 transition-colors group-hover:text-secondary sm:text-xs">Detayları gör</span>
      </div>
    </button>
  );
}
