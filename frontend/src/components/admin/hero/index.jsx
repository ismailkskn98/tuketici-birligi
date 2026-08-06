"use client";

import { AlertCircle, ImageIcon, Layers3, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminAlert } from "@/components/admin/common/admin-alert";
import { AdminPage } from "@/components/admin/common/admin-page";
import { AdminStatCard } from "@/components/admin/common/admin-stat-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteHeroSlide, listHeroSlides } from "@/lib/admin-api";
import { HeroFormDialog } from "./hero-form-dialog";
import { HeroList } from "./hero-list";

export function HeroAdmin() {
  const [items, setItems] = useState([]);
  const [maxItems, setMaxItems] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const activeItemCount = useMemo(
    () => items.filter((item) => item.isActive).length,
    [items],
  );

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await listHeroSlides();
      setItems(data.items || []);
      setMaxItems(data.maxItems || 8);
    } catch (loadError) {
      setError(loadError.message || "Hero kayıtları yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchInitialItems() {
      try {
        const data = await listHeroSlides();

        if (cancelled) return;

        setItems(data.items || []);
        setMaxItems(data.maxItems || 8);
        setError("");
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Hero kayıtları yüklenemedi.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchInitialItems();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDelete(item) {
    const confirmed = window.confirm(`"${item.titleTr}" hero kaydını silmek istiyor musunuz?`);

    if (!confirmed) return;

    try {
      await deleteHeroSlide(item.id);
      await loadItems();
    } catch (deleteError) {
      setError(deleteError.message || "Hero kaydı silinemedi.");
    }
  }

  function handleCreate() {
    setEditingItem(null);
    setDialogOpen(true);
  }

  function handleEdit(item) {
    setEditingItem(item);
    setDialogOpen(true);
  }

  return (
    <>
      <AdminPage
        actions={
          <Button disabled={items.length >= maxItems} onClick={handleCreate} type="button">
            <Plus aria-hidden="true" className="size-4" />
            Yeni hero kaydı
          </Button>
        }
        description="Ana sayfa carousel içeriklerini tek panelden yönetin. Metinler Türkçe ve İngilizce tutulur; mobil (16:15), tablet (16:9) ve masaüstü (16:6) için ayrı görseller yüklenir."
        title="Hero Yönetimi"
      >
        <div className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-3">
            <AdminStatCard
              description={`En fazla ${maxItems} kayıt eklenebilir.`}
              icon={Layers3}
              title="Toplam kayıt"
              value={`${items.length} / ${maxItems}`}
            />
            <AdminStatCard
              description="Anasayfa carousel alanında gösterilir."
              icon={ImageIcon}
              title="Aktif kayıt"
              value={activeItemCount}
            />
            <AdminStatCard
              description="Her kayıtta mobil, tablet ve masaüstü görseli bulunur."
              icon={ImageIcon}
              title="Görsel seti"
              value="3 oran"
            />
          </div>

          {error ? (
            <AdminAlert icon={AlertCircle} title="İşlem tamamlanamadı" variant="destructive">
              {error}
            </AdminAlert>
          ) : null}

          <section className="rounded-lg border border-line bg-white shadow-xs">
            {loading ? (
              <div className="grid gap-3 p-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <HeroList items={items} onDelete={handleDelete} onEdit={handleEdit} />
            )}
          </section>
        </div>
      </AdminPage>

      <HeroFormDialog
        key={`${editingItem?.id || "new"}-${dialogOpen ? "open" : "closed"}`}
        item={editingItem}
        itemCount={items.length}
        maxItems={maxItems}
        onOpenChange={setDialogOpen}
        onSaved={loadItems}
        open={dialogOpen}
      />
    </>
  );
}
