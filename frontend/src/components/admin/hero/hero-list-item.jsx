/* eslint-disable @next/next/no-img-element */
"use client";

import { Monitor, Pencil, Smartphone, Tablet, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

function StatusBadge({ active }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        active ? "bg-emerald-50 text-emerald-700" : "bg-surface text-muted",
      )}
    >
      {active ? "Aktif" : "Pasif"}
    </span>
  );
}

function HeroImage({ item, className }) {
  const previewUrl = item.image?.url || item.imageTablet?.url || item.imageMobile?.url;

  return (
    <div className={cn("overflow-hidden rounded-md border border-line bg-surface", className)}>
      {previewUrl ? (
        <img alt="" className="aspect-video h-full w-full object-cover" src={previewUrl} />
      ) : (
        <div className="grid aspect-video place-items-center text-xs text-muted">Görsel yok</div>
      )}
    </div>
  );
}

function HeroDeviceBadges({ item }) {
  const devices = [
    { key: "mobile", label: "Mobil", Icon: Smartphone, ready: Boolean(item.imageMobile?.url || item.image?.url) },
    { key: "tablet", label: "Tablet", Icon: Tablet, ready: Boolean(item.imageTablet?.url || item.image?.url) },
    { key: "desktop", label: "Masaüstü", Icon: Monitor, ready: Boolean(item.image?.url) },
  ];

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {devices.map(({ key, label, Icon, ready }) => (
        <span
          key={key}
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
            ready ? "bg-primary-soft text-primary" : "bg-surface text-muted",
          )}
          title={label}
        >
          <Icon aria-hidden="true" className="size-3" />
          {label}
        </span>
      ))}
    </div>
  );
}

function HeroSummary({ item }) {
  return (
    <div className="min-w-0">
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary-dark">Türkçe</p>
          <h3 className="mt-1 truncate text-sm font-semibold text-ink">{item.titleTr}</h3>
          {item.summaryTr ? <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{item.summaryTr}</p> : null}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary-dark">English</p>
          <h3 className="mt-1 truncate text-sm font-semibold text-ink">{item.titleEn}</h3>
          {item.summaryEn ? <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{item.summaryEn}</p> : null}
        </div>
      </div>
      {item.ctaHref ? (
        <p className="mt-2 truncate text-xs text-muted">
          CTA: <span className="font-medium text-ink">{item.ctaHref}</span>
        </p>
      ) : null}
      <HeroDeviceBadges item={item} />
    </div>
  );
}

function HeroActions({ item, onDelete, onEdit, compact = false }) {
  return (
    <div className={cn("flex gap-2", compact ? "justify-start" : "justify-end")}>
      <Button onClick={() => onEdit(item)} size={compact ? "sm" : "icon-sm"} type="button" variant="outline">
        <Pencil aria-hidden="true" className="size-4" />
        {compact ? "Düzenle" : <span className="sr-only">Düzenle</span>}
      </Button>
      <Button onClick={() => onDelete(item)} size={compact ? "sm" : "icon-sm"} type="button" variant="ghost">
        <Trash2 aria-hidden="true" className="size-4" />
        {compact ? "Sil" : <span className="sr-only">Sil</span>}
      </Button>
    </div>
  );
}

export function HeroListItem({ item, onDelete, onEdit }) {
  return (
    <TableRow>
      <TableCell>
        <div className="grid size-10 place-items-center rounded-md bg-surface text-sm font-bold text-ink">
          {item.sortOrder}
        </div>
      </TableCell>
      <TableCell>
        <div className="grid min-w-[28rem] grid-cols-[112px_minmax(0,1fr)] gap-4">
          <HeroImage className="h-[64px]" item={item} />
          <HeroSummary item={item} />
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge active={item.isActive} />
      </TableCell>
      <TableCell>
        <HeroActions item={item} onDelete={onDelete} onEdit={onEdit} />
      </TableCell>
    </TableRow>
  );
}

export function HeroListCard({ item, onDelete, onEdit }) {
  return (
    <article className="grid gap-3 rounded-lg border border-line bg-white p-3 shadow-xs">
      <HeroImage item={item} />
      <div className="flex items-center justify-between gap-3">
        <div className="grid size-10 place-items-center rounded-md bg-surface text-sm font-bold text-ink">
          {item.sortOrder}
        </div>
        <StatusBadge active={item.isActive} />
      </div>
      <HeroSummary item={item} />
      <HeroActions compact item={item} onDelete={onDelete} onEdit={onEdit} />
    </article>
  );
}
