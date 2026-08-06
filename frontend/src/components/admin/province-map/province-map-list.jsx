"use client";

import { Edit3, MapPin, Trash2 } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/common/admin-empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

function StatusBadge({ status }) {
  const published = status === "published";

  return (
    <Badge className={published ? "bg-primary-soft text-primary-dark" : "bg-surface text-muted"}>
      {published ? "Yayında" : "Taslak"}
    </Badge>
  );
}

export function ProvinceMapList({ items, onDelete, onEdit }) {
  if (!items.length) {
    return (
      <div className="p-4">
        <AdminEmptyState
          description="İl bazlı haber, duyuru, rehber ve faaliyet kayıtları eklendiğinde harita üzerinde görünür."
          icon={MapPin}
          title="Henüz harita kaydı yok"
        />
      </div>
    );
  }

  return (
    <>
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[160px]">İl</TableHead>
              <TableHead>İçerik</TableHead>
              <TableHead className="w-[130px]">Kategori</TableHead>
              <TableHead className="w-[120px]">Durum</TableHead>
              <TableHead className="w-[140px]">Tarih</TableHead>
              <TableHead className="w-[150px] text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-semibold text-ink">{item.provinceName}</TableCell>
                <TableCell>
                  <div className="grid gap-1">
                    <span className="font-semibold text-ink">{item.title}</span>
                    {item.summary ? (
                      <span className="line-clamp-2 text-sm leading-5 text-muted">{item.summary}</span>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge>{item.categoryLabel || item.category}</Badge>
                </TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell>{item.eventDate ? formatDate(item.eventDate) : "-"}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button aria-label="Düzenle" onClick={() => onEdit(item)} size="icon-sm" variant="outline">
                      <Edit3 aria-hidden="true" className="size-4" />
                    </Button>
                    <Button aria-label="Sil" onClick={() => onDelete(item)} size="icon-sm" variant="outline">
                      <Trash2 aria-hidden="true" className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 p-3 lg:hidden">
        {items.map((item) => (
          <article className="grid gap-3 rounded-lg border border-line bg-white p-4" key={item.id}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-primary-soft text-primary-dark">{item.provinceName}</Badge>
              <Badge>{item.categoryLabel || item.category}</Badge>
              <StatusBadge status={item.status} />
            </div>
            <div className="grid gap-1">
              <h3 className="text-base font-semibold text-ink">{item.title}</h3>
              {item.summary ? <p className="text-sm leading-6 text-muted">{item.summary}</p> : null}
              <p className="text-xs font-medium text-muted">
                {item.eventDate ? formatDate(item.eventDate) : "Tarih yok"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => onEdit(item)} size="sm" variant="outline">
                <Edit3 aria-hidden="true" className="size-4" />
                Düzenle
              </Button>
              <Button className="flex-1" onClick={() => onDelete(item)} size="sm" variant="outline">
                <Trash2 aria-hidden="true" className="size-4" />
                Sil
              </Button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

