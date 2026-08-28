"use client";

import { AlertCircle, Edit3, LoaderCircle, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { AdminAlert } from "@/components/admin/common/admin-alert";
import { AdminFormField } from "@/components/admin/common/admin-form-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  createBoardMemberCategory,
  deleteBoardMemberCategory,
  updateBoardMemberCategory,
} from "@/lib/admin-api";

const emptyValues = {
  id: null,
  titleTr: "",
  titleEn: "",
  sortOrder: 0,
  isActive: true,
};

export function BoardMemberCategoryDialog({
  categories,
  onChanged,
  onOpenChange,
  open,
}) {
  const [values, setValues] = useState(emptyValues);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function resetForm() {
    setValues(emptyValues);
    setError("");
  }

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function editCategory(category) {
    setValues({
      id: category.id,
      titleTr: category.titleTr,
      titleEn: category.titleEn,
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    });
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!values.titleTr.trim() || !values.titleEn.trim()) {
      setError("Türkçe ve İngilizce kategori adlarını doldurmalısınız.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const payload = {
        titleTr: values.titleTr,
        titleEn: values.titleEn,
        sortOrder: Number(values.sortOrder || 0),
        isActive: values.isActive,
      };

      if (values.id) {
        await updateBoardMemberCategory(values.id, payload);
      } else {
        await createBoardMemberCategory(payload);
      }

      await onChanged?.();
      resetForm();
    } catch (submitError) {
      setError(submitError.message || "Kategori kaydedilemedi.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(category) {
    const confirmed = window.confirm(
      `"${category.titleTr}" kategorisini silmek istiyor musunuz? Bu kategorideki üyeler korunur ve kategorisiz duruma geçer.`,
    );

    if (!confirmed) return;

    try {
      setError("");
      await deleteBoardMemberCategory(category.id);
      if (values.id === category.id) resetForm();
      await onChanged?.();
    } catch (deleteError) {
      setError(deleteError.message || "Kategori silinemedi.");
    }
  }

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (!nextOpen) resetForm();
        onOpenChange(nextOpen);
      }}
      open={open}
    >
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Kurul kategorileri</DialogTitle>
          <DialogDescription>
            Kategoriler public sayfadaki bölüm sırasını belirler. Pasif kategoriler üyeleri silmeden public gruplamadan kaldırır.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <form className="grid content-start gap-4 rounded-lg border border-line p-4" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-ink">
                {values.id ? "Kategoriyi düzenle" : "Yeni kategori"}
              </p>
              {values.id ? (
                <Button onClick={resetForm} size="sm" type="button" variant="ghost">
                  <Plus aria-hidden="true" className="size-4" />
                  Yeni
                </Button>
              ) : null}
            </div>

            <AdminFormField label="Türkçe ad">
              <Input
                maxLength={160}
                onChange={(event) => updateField("titleTr", event.target.value)}
                placeholder="Örn. Geçici Yönetim Kurulu"
                value={values.titleTr}
              />
            </AdminFormField>
            <AdminFormField label="İngilizce ad">
              <Input
                maxLength={160}
                onChange={(event) => updateField("titleEn", event.target.value)}
                placeholder="E.g. Interim Board of Directors"
                value={values.titleEn}
              />
            </AdminFormField>
            <AdminFormField hint="Küçük sayı önce görünür." label="Sıra">
              <Input
                max="9999"
                min="0"
                onChange={(event) => updateField("sortOrder", event.target.value)}
                type="number"
                value={values.sortOrder}
              />
            </AdminFormField>
            <label className="flex items-start gap-3" htmlFor="board-category-active">
              <Checkbox
                checked={values.isActive}
                id="board-category-active"
                onCheckedChange={(checked) => updateField("isActive", checked === true)}
              />
              <span className="grid gap-1">
                <span className="text-sm font-semibold text-ink">Public gruplamada göster</span>
                <span className="text-xs leading-5 text-muted">Pasif kategorinin üyeleri genel kurul üyesi grubunda gösterilir.</span>
              </span>
            </label>

            <Button disabled={submitting} type="submit">
              {submitting ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : null}
              {submitting ? "Kaydediliyor" : values.id ? "Değişiklikleri kaydet" : "Kategori ekle"}
            </Button>
          </form>

          <section className="grid content-start gap-3">
            <p className="text-sm font-bold text-ink">Mevcut kategoriler</p>
            {categories.length ? (
              categories.map((category) => (
                <article className="flex items-start justify-between gap-4 rounded-lg border border-line p-4" key={category.id}>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-ink">{category.titleTr}</p>
                      <Badge variant="outline">{category.memberCount} üye</Badge>
                      <Badge className={category.isActive ? "bg-primary-soft text-primary-dark" : "bg-surface text-muted"}>
                        {category.isActive ? "Aktif" : "Pasif"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted">{category.titleEn}</p>
                    <p className="mt-2 text-xs text-muted">Sıra {category.sortOrder}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button aria-label={`${category.titleTr} kategorisini düzenle`} onClick={() => editCategory(category)} size="icon-sm" type="button" variant="outline">
                      <Edit3 aria-hidden="true" className="size-4" />
                    </Button>
                    <Button aria-label={`${category.titleTr} kategorisini sil`} onClick={() => handleDelete(category)} size="icon-sm" type="button" variant="outline">
                      <Trash2 aria-hidden="true" className="size-4" />
                    </Button>
                  </div>
                </article>
              ))
            ) : (
              <p className="rounded-lg border border-dashed border-line p-5 text-sm leading-6 text-muted">
                Henüz kategori eklenmedi. Üyeler public sayfada tek genel grup olarak gösterilir.
              </p>
            )}
          </section>
        </div>

        {error ? (
          <AdminAlert icon={AlertCircle} title="İşlem tamamlanamadı" variant="destructive">
            {error}
          </AdminAlert>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
