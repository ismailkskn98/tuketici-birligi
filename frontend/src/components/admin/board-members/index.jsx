"use client";

import { AlertCircle, Plus, UserRoundCheck, UsersRound } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminAlert } from "@/components/admin/common/admin-alert";
import { AdminFormField } from "@/components/admin/common/admin-form-field";
import { AdminPage } from "@/components/admin/common/admin-page";
import { AdminSelect } from "@/components/admin/common/admin-select";
import { AdminStatCard } from "@/components/admin/common/admin-stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteBoardMember, listBoardMembers } from "@/lib/admin-api";
import { BoardMemberFormDialog } from "./board-member-form-dialog";
import { BoardMemberList } from "./board-member-list";

const statusOptions = [
  { label: "Yayında", value: "active" },
  { label: "Pasif", value: "inactive" },
];

export function BoardMembersAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filters, setFilters] = useState({ query: "", status: "" });

  const activeCount = useMemo(
    () => items.filter((item) => item.isActive).length,
    [items],
  );
  const filteredItems = useMemo(() => {
    const query = filters.query.trim().toLocaleLowerCase("tr-TR");

    return items.filter((item) => {
      if (filters.status === "active" && !item.isActive) return false;
      if (filters.status === "inactive" && item.isActive) return false;
      if (!query) return true;

      return `${item.fullName} ${item.titleTr} ${item.titleEn}`
        .toLocaleLowerCase("tr-TR")
        .includes(query);
    });
  }, [filters, items]);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await listBoardMembers();
      setItems(response.items || []);
    } catch (loadError) {
      setError(loadError.message || "Yönetim kurulu kayıtları yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchInitialItems() {
      try {
        const response = await listBoardMembers();
        if (cancelled) return;
        setItems(response.items || []);
        setError("");
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Yönetim kurulu kayıtları yüklenemedi.");
        }
      } finally {
        if (!cancelled) setLoading(false);
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
    const confirmed = window.confirm(
      `"${item.fullName}" kaydını kalıcı olarak silmek istiyor musunuz? Yalnızca public görünümden kaldırmak için kaydı pasif yapabilirsiniz.`,
    );

    if (!confirmed) return;

    try {
      setError("");
      await deleteBoardMember(item.id);
      await loadItems();
    } catch (deleteError) {
      setError(deleteError.message || "Yönetim kurulu kaydı silinemedi.");
    }
  }

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  return (
    <>
      <AdminPage
        actions={
          <Button onClick={handleCreate} type="button">
            <Plus aria-hidden="true" className="size-4" />
            Yeni kurul üyesi
          </Button>
        }
        description="Kurul üyelerinin iki dilli profil metinlerini, portrelerini, yayın durumunu ve sırasını yönetin."
        title="Yönetim Kurulu"
      >
        <div className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminStatCard
              description="Aktif ve pasif tüm kurul kayıtları."
              icon={UsersRound}
              title="Toplam üye"
              value={items.length}
            />
            <AdminStatCard
              description="Public yönetim kurulu sayfasında görünen üyeler."
              icon={UserRoundCheck}
              title="Yayında"
              value={activeCount}
            />
          </div>

          {error ? (
            <AdminAlert icon={AlertCircle} title="İşlem tamamlanamadı" variant="destructive">
              {error}
            </AdminAlert>
          ) : null}

          <section className="grid gap-4 rounded-lg border border-line bg-white p-4 shadow-xs">
            <div className="grid gap-3 md:grid-cols-2">
              <AdminFormField label="Arama">
                <Input
                  onChange={(event) => updateFilter("query", event.target.value)}
                  placeholder="İsim veya mesleki unvan ara"
                  value={filters.query}
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
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <BoardMemberList
                items={filteredItems}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            )}
          </section>
        </div>
      </AdminPage>

      <BoardMemberFormDialog
        item={editingItem}
        key={`${editingItem?.id || "new"}-${dialogOpen ? "open" : "closed"}`}
        onOpenChange={setDialogOpen}
        onSaved={loadItems}
        open={dialogOpen}
      />
    </>
  );
}
