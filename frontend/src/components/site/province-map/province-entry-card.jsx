"use client";

import { ArrowUpRight, CalendarDays } from "lucide-react";
import { formatCompactDate } from "./province-map-utils";

export function ProvinceEntryCard({ entry, onSelect }) {
  return (
    <button
      className="group relative flex h-full min-h-40 w-full flex-col justify-between rounded-2xl border border-line/70 bg-white p-5 text-left shadow-[0_1px_0_rgba(26,33,62,0.02),0_12px_36px_-24px_rgba(26,33,62,0.10)] transition duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:border-line hover:shadow-[0_2px_0_rgba(26,33,62,0.03),0_20px_44px_-24px_rgba(26,33,62,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/60 sm:p-5 md:p-5 lg:p-6"
      onClick={() => onSelect(entry.provinceCode, entry.provinceName)}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line/70 bg-surface/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/70">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-secondary" />
          {entry.categoryLabel || "İçerik"}
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-3.5 text-ink/40 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-secondary"
        />
      </div>

      <div className="mt-4 grid gap-2">
        <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-muted">
          {entry.provinceName}
        </span>
        <h3 className="line-clamp-3 text-[15px] font-semibold leading-snug tracking-tight text-ink sm:text-[15.5px] lg:text-base">
          {entry.title}
        </h3>
      </div>

      <div className="mt-5 flex items-center justify-between gap-2 border-t border-line/60 pt-3 sm:mt-6 sm:pt-3.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted sm:gap-2 sm:text-xs">
          <CalendarDays aria-hidden="true" className="size-3.5" />
          {formatCompactDate(entry.eventDate || entry.publishedAt || entry.createdAt) || "Tarih yok"}
        </span>
        <span className="text-[11px] font-semibold text-ink transition-colors duration-300 group-hover:text-secondary-dark sm:text-[12px]">
          Detayları gör
        </span>
      </div>
    </button>
  );
}
