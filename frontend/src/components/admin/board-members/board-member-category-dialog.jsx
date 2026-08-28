"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Edit3, FolderTree, LoaderCircle, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AdminAlert } from "@/components/admin/common/admin-alert";
import { AdminConfirmDialog } from "@/components/admin/common/admin-confirm-dialog";
import { AdminFormField } from "@/components/admin/common/admin-form-field";
import {
  ResponsiveFormPanel,
  ResponsiveFormPanelHeader,
} from "@/components/admin/common/responsive-form-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import {
  createBoardMemberCategory,
  deleteBoardMemberCategory,
  updateBoardMemberCategory,
} from "@/lib/admin-api";
import { boardMemberCategorySchema } from "@/lib/form-schemas";

const emptyValues = {
  titleTr: "",
  titleEn: "",
  sortOrder: 0,
  isActive: true,
};

export function BoardMemberCategoryDialog({ categories, onChanged, onOpenChange, open }) {
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const form = useForm({
    defaultValues: emptyValues,
    resolver: zodResolver(boardMemberCategorySchema),
  });
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  function resetForm() {
    setEditingId(null);
    setSubmitError("");
    reset(emptyValues);
  }

  function editCategory(category) {
    setEditingId(category.id);
    setSubmitError("");
    reset({
      titleTr: category.titleTr,
      titleEn: category.titleEn,
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    });
  }

  async function onSubmit(values) {
    try {
      setSubmitError("");

      if (editingId) {
        await updateBoardMemberCategory(editingId, values);
      } else {
        await createBoardMemberCategory(values);
      }

      await onChanged?.();
      toast.add({
        title: editingId ? "Kategori güncellendi" : "Kategori eklendi",
        description: `${values.titleTr} başarıyla ${editingId ? "güncellendi" : "oluşturuldu"}.`,
        type: "success",
      });
      resetForm();
    } catch (error) {
      const message = error.message || "Kategori kaydedilemedi.";
      setSubmitError(message);
      toast.add({ title: "Kategori kaydedilemedi", description: message, type: "error", priority: "high" });
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      setSubmitError("");
      await deleteBoardMemberCategory(deleteTarget.id);
      if (editingId === deleteTarget.id) resetForm();
      await onChanged?.();
      toast.add({
        title: "Kategori silindi",
        description: `${deleteTarget.titleTr} kategorisi kaldırıldı.`,
        type: "success",
      });
      setDeleteTarget(null);
    } catch (error) {
      const message = error.message || "Kategori silinemedi.";
      setSubmitError(message);
      toast.add({ title: "Kategori silinemedi", description: message, type: "error", priority: "high" });
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  function handleOpenChange(nextOpen) {
    if (isSubmitting || deleting) return;
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  }

  return (
    <>
      <ResponsiveFormPanel
        description="Kurul gruplarını, public görünürlüğünü ve sırasını yönetin."
        drawerClassName="max-h-[calc(100dvh-0.5rem)] overflow-hidden"
        onOpenChange={handleOpenChange}
        open={open}
        panelClassName="max-w-[62rem]"
        title="Kurul kategorileri"
      >
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <ResponsiveFormPanelHeader
            description="Kategoriler public sayfadaki sekmeleri ve bölüm sırasını belirler. Üyeyi kategoriye üye formundan bağlayabilirsiniz."
            title="Kurul kategorileri"
          />

          <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-surface/60 p-4 sm:p-6">
            <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)]">
              <form className="grid content-start gap-4 rounded-lg border border-line bg-white p-4 sm:p-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {editingId ? "Kategoriyi düzenle" : "Yeni kategori"}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted">Türkçe ve İngilizce başlıkları birlikte yönetin.</p>
                  </div>
                  {editingId ? (
                    <Button onClick={resetForm} size="sm" type="button" variant="ghost">
                      <Plus aria-hidden="true" className="size-4" />
                      Yeni
                    </Button>
                  ) : null}
                </div>

                <AdminFormField error={errors.titleTr?.message} label="Türkçe ad">
                  <Input
                    aria-invalid={Boolean(errors.titleTr)}
                    maxLength={160}
                    placeholder="Örn. Yönetim Kurulu"
                    {...register("titleTr")}
                  />
                </AdminFormField>
                <AdminFormField error={errors.titleEn?.message} label="İngilizce ad">
                  <Input
                    aria-invalid={Boolean(errors.titleEn)}
                    maxLength={160}
                    placeholder="E.g. Board of Directors"
                    {...register("titleEn")}
                  />
                </AdminFormField>
                <AdminFormField
                  error={errors.sortOrder?.message}
                  hint="Küçük değer önce gösterilir."
                  label="Görüntülenme sırası"
                >
                  <Input
                    aria-invalid={Boolean(errors.sortOrder)}
                    inputMode="numeric"
                    max="9999"
                    min="0"
                    type="number"
                    {...register("sortOrder")}
                  />
                </AdminFormField>
                <Controller
                  control={control}
                  name="isActive"
                  render={({ field }) => (
                    <label className="flex cursor-pointer items-start gap-3" htmlFor="board-category-active">
                      <Checkbox
                        checked={field.value}
                        id="board-category-active"
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                      />
                      <span className="grid gap-1">
                        <span className="text-sm font-semibold text-ink">Public sekmelerde göster</span>
                        <span className="text-xs leading-5 text-muted">
                          Pasif kategorideki üyeler korunur ve genel grupta gösterilir.
                        </span>
                      </span>
                    </label>
                  )}
                />

                <Button disabled={isSubmitting} type="submit">
                  {isSubmitting ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : null}
                  {isSubmitting ? "Kaydediliyor" : editingId ? "Değişiklikleri kaydet" : "Kategori ekle"}
                </Button>
              </form>

              <section className="grid content-start gap-3" aria-labelledby="board-category-list-title">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink" id="board-category-list-title">Mevcut kategoriler</p>
                    <p className="mt-1 text-xs text-muted">Üye sayısı, durum ve sıra bilgisi</p>
                  </div>
                  <Badge className="bg-white text-muted">{categories.length} kategori</Badge>
                </div>

                {categories.length ? (
                  <div className="overflow-hidden rounded-lg border border-line bg-white">
                    {categories.map((category) => (
                      <article className="flex items-start justify-between gap-4 border-b border-line p-4 last:border-b-0" key={category.id}>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-ink">{category.titleTr}</p>
                            <Badge className={category.isActive ? "bg-primary-soft text-primary-dark" : "bg-surface text-muted"}>
                              {category.isActive ? "Aktif" : "Pasif"}
                            </Badge>
                          </div>
                          <p className="mt-1 truncate text-sm text-muted">{category.titleEn}</p>
                          <p className="mt-2 text-xs text-muted">
                            {category.memberCount} üye · Görüntülenme sırası {category.sortOrder}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <Button aria-label={`${category.titleTr} kategorisini düzenle`} onClick={() => editCategory(category)} size="icon-sm" type="button" variant="ghost">
                            <Edit3 aria-hidden="true" className="size-4" />
                          </Button>
                          <Button aria-label={`${category.titleTr} kategorisini sil`} className="text-destructive hover:text-destructive" onClick={() => setDeleteTarget(category)} size="icon-sm" type="button" variant="ghost">
                            <Trash2 aria-hidden="true" className="size-4" />
                          </Button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="grid place-items-center rounded-lg border border-dashed border-line bg-white px-5 py-12 text-center">
                    <FolderTree aria-hidden="true" className="size-6 text-muted" />
                    <p className="mt-3 text-sm font-medium text-ink">Henüz kategori eklenmedi</p>
                    <p className="mt-1 max-w-sm text-xs leading-5 text-muted">Üyeler public sayfada tek genel grup olarak gösterilir.</p>
                  </div>
                )}
              </section>
            </div>

            {submitError ? (
              <AdminAlert icon={AlertCircle} title="İşlem tamamlanamadı" variant="destructive">
                {submitError}
              </AdminAlert>
            ) : null}
          </div>
        </div>
      </ResponsiveFormPanel>

      <AdminConfirmDialog
        confirmLabel="Kategoriyi sil"
        description={deleteTarget ? `“${deleteTarget.titleTr}” kategorisi kalıcı olarak silinecek. Bu kategorideki üyeler korunur ve kategorisiz duruma geçer.` : ""}
        onConfirm={confirmDelete}
        onOpenChange={(nextOpen) => !nextOpen && setDeleteTarget(null)}
        open={Boolean(deleteTarget)}
        pending={deleting}
        title="Kategori silinsin mi?"
      />
    </>
  );
}
