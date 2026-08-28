"use client";

import { AlertCircle, Edit3, HelpCircle, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminAlert } from "@/components/admin/common/admin-alert";
import { AdminConfirmDialog } from "@/components/admin/common/admin-confirm-dialog";
import { AdminEmptyState } from "@/components/admin/common/admin-empty-state";
import { AdminFormField } from "@/components/admin/common/admin-form-field";
import { AdminPage } from "@/components/admin/common/admin-page";
import { AdminSelect } from "@/components/admin/common/admin-select";
import { AdminStatCard } from "@/components/admin/common/admin-stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { deleteContentItem, listContentItems } from "@/lib/admin-api";
import { FaqFormDialog } from "./faq-form-dialog";

const localeOptions = [
  { label: "Türkçe", value: "tr" },
  { label: "English", value: "en" }
];

const statusOptions = [
  { label: "Yayında", value: "published" },
  { label: "Taslak", value: "draft" }
];

function StatusBadge({ status }) {
  const published = status === "published";

  return (
    <Badge className={published ? "bg-primary-soft text-primary-dark" : "bg-surface text-muted"}>
      {published ? "Yayında" : "Taslak"}
    </Badge>
  );
}

export function FaqAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filters, setFilters] = useState({
    locale: "",
    query: "",
    status: ""
  });

  const publishedCount = useMemo(
    () => items.filter((item) => item.status === "published").length,
    [items]
  );
  const categoryCount = useMemo(
    () => new Set(items.map((item) => item.summary).filter(Boolean)).size,
    [items]
  );
  const filteredItems = useMemo(() => {
    const query = filters.query.trim().toLocaleLowerCase("tr-TR");

    return items.filter((item) => {
      if (filters.locale && item.locale !== filters.locale) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (!query) return true;
      return `${item.title} ${item.summary || ""} ${item.body || ""}`
        .toLocaleLowerCase("tr-TR")
        .includes(query);
    });
  }, [filters, items]);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await listContentItems({ type: "faq" });
      setItems(data.items || []);
    } catch (loadError) {
      setError(loadError.message || "SSS kayıtları yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchInitialItems() {
      try {
        const data = await listContentItems({ type: "faq" });

        if (cancelled) return;

        setItems(data.items || []);
        setError("");
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "SSS kayıtları yüklenemedi.");
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

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteContentItem(deleteTarget.id);
      await loadItems();
      toast.add({
        title: "SSS kaydı silindi",
        description: `${deleteTarget.title} kaydı kalıcı olarak kaldırıldı.`,
        type: "success",
      });
      setDeleteTarget(null);
    } catch (deleteError) {
      const message = deleteError.message || "SSS kaydı silinemedi.";
      toast.add({ title: "SSS kaydı silinemedi", description: message, type: "error", priority: "high" });
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
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
            Yeni SSS
          </Button>
        }
        description="Public sık sorulan sorular sayfasındaki soru-cevap kayıtlarını dil, kategori etiketi ve sıralama ile yönetin."
        title="SSS Yönetimi"
      >
        <div className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-3">
            <AdminStatCard description="Tüm Türkçe ve İngilizce SSS kayıtları." icon={HelpCircle} title="Toplam kayıt" value={items.length} />
            <AdminStatCard description="Public sayfada görünecek kayıtlar." icon={HelpCircle} title="Yayında" value={publishedCount} />
            <AdminStatCard description="Kullanılan filtre etiketi sayısı." icon={HelpCircle} title="Kategori" value={categoryCount} />
          </div>

          {error ? (
            <AdminAlert icon={AlertCircle} title="İşlem tamamlanamadı" variant="destructive">
              {error}
            </AdminAlert>
          ) : null}

          <section className="grid gap-4 rounded-lg border border-line bg-white p-4 shadow-xs">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem_12rem]">
              <AdminFormField label="Arama">
                <div className="relative">
                  <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                  <Input
                    className="pl-9"
                    onChange={(event) => updateFilter("query", event.target.value)}
                    placeholder="Soru, kategori veya cevap ara"
                    value={filters.query}
                  />
                </div>
              </AdminFormField>
              <AdminFormField label="Dil">
                <AdminSelect
                  onChange={(event) => updateFilter("locale", event.target.value)}
                  options={localeOptions}
                  placeholder="Tüm diller"
                  value={filters.locale}
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
            ) : filteredItems.length ? (
              <>
                <div className="hidden lg:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Soru</TableHead>
                        <TableHead className="w-[130px]">Kategori</TableHead>
                        <TableHead className="w-[100px]">Dil</TableHead>
                        <TableHead className="w-[120px]">Durum</TableHead>
                        <TableHead className="w-[90px]">Sıra</TableHead>
                        <TableHead className="w-[150px] text-right">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="grid gap-1">
                              <span className="font-semibold text-ink">{item.title}</span>
                              {item.body ? <span className="line-clamp-2 text-sm leading-5 text-muted">{item.body}</span> : null}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge>{item.summary || "-"}</Badge>
                          </TableCell>
                          <TableCell>{item.locale.toUpperCase()}</TableCell>
                          <TableCell>
                            <StatusBadge status={item.status} />
                          </TableCell>
                          <TableCell>{item.sortOrder}</TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button aria-label="Düzenle" onClick={() => handleEdit(item)} size="icon-sm" variant="outline">
                                <Edit3 aria-hidden="true" className="size-4" />
                              </Button>
                              <Button aria-label="Sil" onClick={() => setDeleteTarget(item)} size="icon-sm" variant="outline">
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
                  {filteredItems.map((item) => (
                    <article className="grid gap-3 rounded-lg border border-line bg-white p-4" key={item.id}>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge>{item.summary || "-"}</Badge>
                        <Badge className="bg-primary-soft text-primary-dark">{item.locale.toUpperCase()}</Badge>
                        <StatusBadge status={item.status} />
                      </div>
                      <div className="grid gap-1">
                        <h3 className="text-base font-semibold text-ink">{item.title}</h3>
                        {item.body ? <p className="line-clamp-3 text-sm leading-6 text-muted">{item.body}</p> : null}
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1" onClick={() => handleEdit(item)} size="sm" variant="outline">
                          <Edit3 aria-hidden="true" className="size-4" />
                          Düzenle
                        </Button>
                        <Button className="flex-1" onClick={() => setDeleteTarget(item)} size="sm" variant="outline">
                          <Trash2 aria-hidden="true" className="size-4" />
                          Sil
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-4">
                <AdminEmptyState
                  description="SSS kayıtları eklendiğinde public sık sorulan sorular sayfasında kategori filtresiyle listelenir."
                  icon={HelpCircle}
                  title="SSS kaydı bulunamadı"
                />
              </div>
            )}
          </section>
        </div>
      </AdminPage>

      <FaqFormDialog
        item={editingItem}
        key={`${editingItem?.id || "new"}-${dialogOpen ? "open" : "closed"}`}
        onOpenChange={setDialogOpen}
        onSaved={loadItems}
        open={dialogOpen}
      />

      <AdminConfirmDialog
        confirmLabel="SSS kaydını sil"
        description={deleteTarget ? `“${deleteTarget.title}” SSS kaydı kalıcı olarak silinecek.` : ""}
        onConfirm={confirmDelete}
        onOpenChange={(nextOpen) => !nextOpen && setDeleteTarget(null)}
        open={Boolean(deleteTarget)}
        pending={deleting}
        title="SSS kaydı silinsin mi?"
      />
    </>
  );
}
