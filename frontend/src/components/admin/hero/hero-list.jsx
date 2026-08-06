"use client";

import { ImageIcon } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/common/admin-empty-state";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HeroListCard, HeroListItem } from "./hero-list-item";

export function HeroList({ items, onDelete, onEdit }) {
  if (!items.length) {
    return (
      <div className="p-4">
        <AdminEmptyState
          description="İlk kaydı eklediğinizde anasayfa carousel alanında kullanabileceğiniz içerikler burada listelenir."
          icon={ImageIcon}
          title="Henüz hero kaydı yok"
        />
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[96px]">Sıra</TableHead>
              <TableHead>Görsel ve içerik</TableHead>
              <TableHead className="w-[140px]">Durum</TableHead>
              <TableHead className="w-[170px] text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <HeroListItem item={item} key={item.id} onDelete={onDelete} onEdit={onEdit} />
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 p-3 md:hidden">
        {items.map((item) => (
          <HeroListCard item={item} key={item.id} onDelete={onDelete} onEdit={onEdit} />
        ))}
      </div>
    </>
  );
}
