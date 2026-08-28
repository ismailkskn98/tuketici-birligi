"use client";

import {
  Edit3,
  Eye,
  EyeOff,
  LoaderCircle,
  Trash2,
  UserRound,
  UsersRound,
} from "lucide-react";
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
    return (
      <Badge className="gap-1.5 bg-amber-50 text-amber-800">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-amber-500" />
        Bilgi bekleniyor
      </Badge>
    );
  }

  return (
    <Badge className={`gap-1.5 ${isActive ? "bg-emerald-50 text-emerald-700" : "bg-surface text-muted"}`}>
      <span aria-hidden="true" className={`size-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-line"}`} />
      {isActive ? "Yayında" : "Askıda"}
    </Badge>
  );
}

function Portrait({ item, className }) {
  return (
    <div className={`grid place-items-center overflow-hidden rounded-md border border-line bg-surface text-muted ${className || ""}`}>
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

function getStatusAction(item) {
  if (item.isActive) {
    return { icon: EyeOff, label: "Askıya al" };
  }

  if (item.isComplete) {
    return { icon: Eye, label: "Yayına al" };
  }

  return { icon: Edit3, label: "Yayın bilgilerini tamamla" };
}

export function BoardMemberList({ items, onDelete, onEdit, onToggleStatus, updatingId }) {
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

  function handleStatusAction(item) {
    if (!item.isActive && !item.isComplete) {
      onEdit(item);
      return;
    }

    onToggleStatus(item);
  }

  return (
    <>
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[76px]">Portre</TableHead>
              <TableHead>Üye</TableHead>
              <TableHead>Görev ve kategori</TableHead>
              <TableHead>Mesleki unvan</TableHead>
              <TableHead className="w-[132px]">Görüntülenme</TableHead>
              <TableHead className="w-[128px]">Durum</TableHead>
              <TableHead className="w-[260px] text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const statusAction = getStatusAction(item);
              const StatusIcon = statusAction.icon;
              const isUpdating = updatingId === item.id;

              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <Portrait className="aspect-[4/5] w-12" item={item} />
                  </TableCell>
                  <TableCell>
                    <div className="grid gap-1">
                      <span className="font-medium text-ink">{item.fullName}</span>
                      {!item.isComplete ? <span className="text-xs text-amber-700">Portre veya profil metni eksik</span> : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="grid gap-1">
                      <span className="text-sm text-ink">{item.roleTr || "Görev belirtilmedi"}</span>
                      <span className="text-xs text-muted">{item.category?.titleTr || "Genel kurul üyeleri"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="grid gap-1">
                      <span className="text-sm text-ink">{item.titleTr || "Bekleniyor"}</span>
                      <span className="text-xs text-muted">{item.titleEn || "Pending"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm tabular-nums text-muted">Sıra {item.sortOrder}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge isActive={item.isActive} isComplete={item.isComplete} />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button disabled={isUpdating} onClick={() => handleStatusAction(item)} size="sm" variant="ghost">
                        {isUpdating ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <StatusIcon aria-hidden="true" className="size-4" />}
                        {statusAction.label}
                      </Button>
                      <Button aria-label={`${item.fullName} kaydını düzenle`} onClick={() => onEdit(item)} size="icon-sm" variant="ghost">
                        <Edit3 aria-hidden="true" className="size-4" />
                      </Button>
                      <Button aria-label={`${item.fullName} kaydını sil`} className="text-destructive hover:text-destructive" onClick={() => onDelete(item)} size="icon-sm" variant="ghost">
                        <Trash2 aria-hidden="true" className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="divide-y divide-line lg:hidden">
        {items.map((item) => {
          const statusAction = getStatusAction(item);
          const StatusIcon = statusAction.icon;
          const isUpdating = updatingId === item.id;

          return (
            <article className="grid grid-cols-[68px_minmax(0,1fr)] gap-4 bg-white p-4" key={item.id}>
              <Portrait className="aspect-[4/5] w-[68px]" item={item} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge isActive={item.isActive} isComplete={item.isComplete} />
                  <span className="text-xs tabular-nums text-muted">Sıra {item.sortOrder}</span>
                </div>
                <h3 className="mt-2 truncate text-base font-semibold tracking-[-0.02em] text-ink">{item.fullName}</h3>
                <p className="mt-1 text-sm text-ink">{item.roleTr || item.titleTr || "Profil bilgisi bekleniyor"}</p>
                <p className="mt-1 text-xs text-muted">{item.category?.titleTr || "Genel kurul üyeleri"}</p>
              </div>
              <div className="col-span-2 grid gap-2">
                <Button className="w-full" disabled={isUpdating} onClick={() => handleStatusAction(item)} size="sm" variant="outline">
                  {isUpdating ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <StatusIcon aria-hidden="true" className="size-4" />}
                  {statusAction.label}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={() => onEdit(item)} size="sm" variant="outline">
                    <Edit3 aria-hidden="true" className="size-4" />
                    Düzenle
                  </Button>
                  <Button className="text-destructive hover:text-destructive" onClick={() => onDelete(item)} size="sm" variant="outline">
                    <Trash2 aria-hidden="true" className="size-4" />
                    Sil
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
