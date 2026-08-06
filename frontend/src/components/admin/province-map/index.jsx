"use client";

import { AlertCircle, MapPinned, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminAlert } from "@/components/admin/common/admin-alert";
import { AdminFormField } from "@/components/admin/common/admin-form-field";
import { AdminPage } from "@/components/admin/common/admin-page";
import { AdminSelect } from "@/components/admin/common/admin-select";
import { AdminStatCard } from "@/components/admin/common/admin-stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  deleteProvinceMapEntry,
  listProvinceMapEntries,
  listPublicContent
} from "@/lib/admin-api";
import { getProvinceOptions } from "@/lib/provinces";
import { ProvinceMapFormDialog } from "./province-map-form-dialog";
import { ProvinceMapList } from "./province-map-list";

const categoryOptions = [
  { label: "Haber", value: "news" },
  { label: "Duyuru", value: "announcement" },
  { label: "Rehber", value: "guide" },
  { label: "Faaliyet", value: "activity" }
];

const statusOptions = [
  { label: "Yayında", value: "published" },
  { label: "Taslak", value: "draft" }
];

export function ProvinceMapAdmin() {
  const [items, setItems] = useState([]);
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    provinceCode: "",
    query: "",
    status: ""
  });

  const provinceOptions = useMemo(
    () => getProvinceOptions(),
    []
  );

  const publishedCount = useMemo(
    () => items.filter((item) => item.status === "published").length,
    [items]
  );
  const activeProvinceCount = useMemo(
    () => new Set(items.filter((item) => item.status === "published").map((item) => item.provinceCode)).size,
    [items]
  );
  const filteredItems = useMemo(() => {
    const query = filters.query.trim().toLocaleLowerCase("tr-TR");

    return items.filter((item) => {
      if (filters.provinceCode && String(item.provinceCode) !== filters.provinceCode) return false;
      if (filters.category && item.category !== filters.category) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (!query) return true;
      return `${item.title} ${item.summary || ""} ${item.provinceName}`
        .toLocaleLowerCase("tr-TR")
        .includes(query);
    });
  }, [filters, items]);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [mapData, contentData] = await Promise.all([
        listProvinceMapEntries(),
        listPublicContent({ locale: "tr", limit: 50 })
      ]);
      setItems(mapData.items || []);
      setContentItems(contentData.items || []);
    } catch (loadError) {
      setError(loadError.message || "Harita kayıtları yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchInitialItems() {
      try {
        const [mapData, contentData] = await Promise.all([
          listProvinceMapEntries(),
          listPublicContent({ locale: "tr", limit: 50 })
        ]);

        if (cancelled) return;

        setItems(mapData.items || []);
        setContentItems(contentData.items || []);
        setError("");
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Harita kayıtları yüklenemedi.");
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

  function handleCreate() {
    setEditingItem(null);
    setDialogOpen(true);
  }

  function handleEdit(item) {
    setEditingItem(item);
    setDialogOpen(true);
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(`"${item.title}" harita kaydını silmek istiyor musunuz?`);

    if (!confirmed) return;

    try {
      await deleteProvinceMapEntry(item.id);
      await loadItems();
    } catch (deleteError) {
      setError(deleteError.message || "Harita kaydı silinemedi.");
    }
  }

  function updateFilter(field, value) {
    setFilters((current) => ({
      ...current,
      [field]: value
    }));
  }

  return (
    <>
      <AdminPage
        actions={
          <Button onClick={handleCreate} type="button">
            <Plus aria-hidden="true" className="size-4" />
            Yeni harita kaydı
          </Button>
        }
        description="İllere bağlı haber, duyuru, rehber ve faaliyet kayıtlarını public Türkiye haritasında yayınlayın."
        title="Harita Yönetimi"
      >
        <div className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-3">
            <AdminStatCard
              description="Taslak ve yayındaki tüm kayıtlar."
              icon={MapPinned}
              title="Toplam kayıt"
              value={items.length}
            />
            <AdminStatCard
              description="Public haritada görünecek kayıtlar."
              icon={MapPinned}
              title="Yayında"
              value={publishedCount}
            />
            <AdminStatCard
              description="Yayında kaydı olan il sayısı."
              icon={MapPinned}
              title="Aktif il"
              value={activeProvinceCount}
            />
          </div>

          {error ? (
            <AdminAlert icon={AlertCircle} title="İşlem tamamlanamadı" variant="destructive">
              {error}
            </AdminAlert>
          ) : null}

          <section className="grid gap-4 rounded-lg border border-line bg-white p-4 shadow-xs">
            <div className="grid gap-3 md:grid-cols-4">
              <AdminFormField label="Arama">
                <Input
                  onChange={(event) => updateFilter("query", event.target.value)}
                  placeholder="Başlık, özet veya il ara"
                  value={filters.query}
                />
              </AdminFormField>
              <AdminFormField label="İl">
                <AdminSelect
                  onChange={(event) => updateFilter("provinceCode", event.target.value)}
                  options={provinceOptions}
                  placeholder="Tüm iller"
                  value={filters.provinceCode}
                />
              </AdminFormField>
              <AdminFormField label="Kategori">
                <AdminSelect
                  onChange={(event) => updateFilter("category", event.target.value)}
                  options={categoryOptions}
                  placeholder="Tüm kategoriler"
                  value={filters.category}
                />
              </AdminFormField>
              <AdminFormField label="Durum">
                <AdminSelect
                  onChange={(event) => updateFilter("status", event.target.value)}
                  options={statusOptions}
                  placeholder="Tüm durumlar"
                  value={filters.status}
                />
              </AdminFormField>
            </div>
          </section>

          <section className="rounded-lg border border-line bg-white shadow-xs">
            {loading ? (
              <div className="grid gap-3 p-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <ProvinceMapList items={filteredItems} onDelete={handleDelete} onEdit={handleEdit} />
            )}
          </section>
        </div>
      </AdminPage>

      <ProvinceMapFormDialog
        contentItems={contentItems}
        item={editingItem}
        key={`${editingItem?.id || "new"}-${dialogOpen ? "open" : "closed"}`}
        onOpenChange={setDialogOpen}
        onSaved={loadItems}
        open={dialogOpen}
      />
    </>
  );
}
