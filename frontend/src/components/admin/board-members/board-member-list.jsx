"use client";

import { Edit3, Trash2, UserRound, UsersRound } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/common/admin-empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function StatusBadge({ isActive, isComplete }) {
  if (!isComplete) {
    return <Badge className="bg-amber-50 text-amber-800">Bilgi bekleniyor</Badge>;
  }

  return (
    <Badge className={isActive ? "bg-primary-soft text-primary-dark" : "bg-surface text-muted"}>
      {isActive ? "Yayında" : "Pasif"}
    </Badge>
  );
}

function Portrait({ item, className }) {
  return (
    <div className={`grid place-items-center overflow-hidden rounded-md bg-surface text-muted ${className || ""}`}>
      {item.image?.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={`${item.fullName} portresi`}
          className="h-full w-full object-cover"
          loading="lazy"
          src={item.image.url}
        />
      ) : (
        <UserRound aria-label="Portre bekleniyor" className="size-6" />
      )}
    </div>
  );
}

export function BoardMemberList({ items, onDelete, onEdit }) {
  if (!items.length) {
    return (
      <div className="p-4">
        <AdminEmptyState
          description="Filtrelere uyan kurul üyesi bulunamadı. Yeni kayıt ekleyebilir veya filtreleri temizleyebilirsiniz."
          icon={UsersRound}
          title="Kurul üyesi bulunamadı"
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
              <TableHead className="w-[96px]">Portre</TableHead>
              <TableHead>Üye</TableHead>
              <TableHead>Görev ve kategori</TableHead>
              <TableHead>Mesleki unvan</TableHead>
              <TableHead className="w-[90px]">Sıra</TableHead>
              <TableHead className="w-[120px]">Durum</TableHead>
              <TableHead className="w-[150px] text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Portrait className="aspect-[4/5] w-14" item={item} />
                </TableCell>
                <TableCell>
                  <div className="grid gap-1">
                    <span className="font-semibold text-ink">{item.fullName}</span>
                    {!item.isComplete ? <span className="text-xs text-amber-700">Portre veya profil metni eksik</span> : null}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="grid gap-1">
                    <span className="text-sm font-medium text-ink">{item.roleTr || "Görev belirtilmedi"}</span>
                    <span className="text-xs text-muted">{item.category?.titleTr || "Genel kurul üyeleri"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="grid gap-1">
                    <span className="text-sm font-medium text-ink">{item.titleTr || "Bekleniyor"}</span>
                    <span className="text-xs text-muted">{item.titleEn || "Pending"}</span>
                  </div>
                </TableCell>
                <TableCell>{item.sortOrder}</TableCell>
                <TableCell>
                  <StatusBadge isActive={item.isActive} isComplete={item.isComplete} />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button aria-label={`${item.fullName} kaydını düzenle`} onClick={() => onEdit(item)} size="icon-sm" variant="outline">
                      <Edit3 aria-hidden="true" className="size-4" />
                    </Button>
                    <Button aria-label={`${item.fullName} kaydını sil`} onClick={() => onDelete(item)} size="icon-sm" variant="outline">
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
          <article className="grid grid-cols-[76px_minmax(0,1fr)] gap-4 rounded-lg border border-line bg-white p-4" key={item.id}>
            <Portrait className="aspect-[4/5] w-[76px]" item={item} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge isActive={item.isActive} isComplete={item.isComplete} />
                <Badge>Sıra {item.sortOrder}</Badge>
              </div>
              <h3 className="mt-2 text-base font-semibold text-ink">{item.fullName}</h3>
              <p className="mt-1 text-sm font-medium text-ink">{item.roleTr || item.titleTr || "Profil bilgisi bekleniyor"}</p>
              <p className="mt-1 text-xs text-muted">{item.category?.titleTr || "Genel kurul üyeleri"}</p>
            </div>
            <div className="col-span-2 flex gap-2">
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
