"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, LoaderCircle } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { AdminAlert } from "@/components/admin/common/admin-alert";
import { AdminFormField } from "@/components/admin/common/admin-form-field";
import { AdminSelect } from "@/components/admin/common/admin-select";
import {
  ResponsiveFormPanel,
  ResponsiveFormPanelHeader,
} from "@/components/admin/common/responsive-form-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { createProvinceMapEntry, updateProvinceMapEntry } from "@/lib/admin-api";
import { provinceMapAdminSchema } from "@/lib/form-schemas";
import { getProvinceOptions } from "@/lib/provinces";

const categories = [
  { label: "Haber", value: "news" },
  { label: "Duyuru", value: "announcement" },
  { label: "Rehber", value: "guide" },
  { label: "Faaliyet", value: "activity" }
];

const statuses = [
  { label: "Yayında", value: "published" },
  { label: "Taslak", value: "draft" }
];

function toDateInputValue(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function getDefaultValues(item) {
  return {
    locale: item?.locale || "tr",
    provinceCode: item?.provinceCode ? String(item.provinceCode) : "",
    category: item?.category || "news",
    title: item?.title || "",
    summary: item?.summary || "",
    contentItemId: item?.contentItemId ? String(item.contentItemId) : "",
    linkLabel: item?.linkLabel || "",
    linkHref: item?.linkHref || "",
    eventDate: toDateInputValue(item?.eventDate),
    status: item?.status || "published",
    sortOrder: item?.sortOrder ?? 0
  };
}

export function ProvinceMapFormDialog({ contentItems = [], item, onOpenChange, onSaved, open }) {
  const provinceOptions = useMemo(() => getProvinceOptions(), []);
  const contentOptions = useMemo(
    () => [
      ...contentItems
        .filter((content) => ["news", "announcement", "guide"].includes(content.type))
        .map((content) => ({
          label: `${content.title} (${content.type})`,
          value: String(content.id)
        }))
    ],
    [contentItems]
  );
  const isEditMode = Boolean(item?.id);
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: getDefaultValues(item),
    resolver: zodResolver(provinceMapAdminSchema),
  });

  async function onSubmit(values) {

    const payload = {
      ...values,
      provinceCode: Number(values.provinceCode),
      contentItemId: values.contentItemId || null,
      sortOrder: Number(values.sortOrder || 0)
    };

    try {
      if (isEditMode) {
        await updateProvinceMapEntry(item.id, payload);
      } else {
        await createProvinceMapEntry(payload);
      }

      await onSaved?.();
      toast.add({
        title: isEditMode ? "Harita kaydı güncellendi" : "Harita kaydı eklendi",
        description: `${values.title} başarıyla ${isEditMode ? "güncellendi" : "oluşturuldu"}.`,
        type: "success",
      });
      onOpenChange(false);
    } catch (submitError) {
      const message = submitError.message || "Harita kaydı kaydedilemedi.";
      setError("root", { message });
      toast.add({ title: "Harita kaydı kaydedilemedi", description: message, type: "error", priority: "high" });
    }
  }

  function handleOpenChange(nextOpen) {
    if (!isSubmitting) onOpenChange(nextOpen);
  }

  return (
    <ResponsiveFormPanel
      description="İle bağlı yayın ve faaliyet kaydını yönetin."
      onOpenChange={handleOpenChange}
      open={open}
      panelClassName="max-w-[56rem]"
      title={isEditMode ? "Harita kaydını düzenle" : "Yeni harita kaydı"}
    >
        <form className="flex min-h-0 min-w-0 flex-1 flex-col" onSubmit={handleSubmit(onSubmit)}>
          <ResponsiveFormPanelHeader
            description="İle bağlı haber, duyuru, rehber veya faaliyet kaydını harita üzerinde yayınlayın."
            title={isEditMode ? "Harita kaydını düzenle" : "Yeni harita kaydı"}
          />

          <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-surface/70">
            <div className="grid min-w-0 gap-5 px-4 py-5 sm:px-6">
              <input type="hidden" {...register("locale")} />
              <section className="grid gap-4 rounded-lg border border-line bg-white p-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <AdminFormField error={errors.provinceCode?.message} label="İl">
                    <AdminSelect
                      aria-invalid={Boolean(errors.provinceCode)}
                      options={provinceOptions}
                      placeholder="İl seçin"
                      {...register("provinceCode")}
                    />
                  </AdminFormField>
                  <AdminFormField error={errors.category?.message} label="Kategori">
                    <AdminSelect
                      aria-invalid={Boolean(errors.category)}
                      options={categories}
                      {...register("category")}
                    />
                  </AdminFormField>
                  <AdminFormField error={errors.status?.message} label="Durum">
                    <AdminSelect
                      aria-invalid={Boolean(errors.status)}
                      options={statuses}
                      {...register("status")}
                    />
                  </AdminFormField>
                </div>

                <AdminFormField error={errors.title?.message} label="Başlık">
                  <Input
                    aria-invalid={Boolean(errors.title)}
                    placeholder="Örn. Ankara tüketici bilgilendirme çalışması"
                    {...register("title")}
                  />
                </AdminFormField>

                <AdminFormField error={errors.summary?.message} label="Özet">
                  <Textarea
                    aria-invalid={Boolean(errors.summary)}
                    placeholder="Harita modalında görünecek kısa açıklama"
                    {...register("summary")}
                  />
                </AdminFormField>
              </section>

              <section className="grid gap-4 rounded-lg border border-line bg-white p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <AdminFormField
                    error={errors.contentItemId?.message}
                    hint="Mevcut haber/duyuru/rehber seçilirse link otomatik üretilebilir."
                    label="Bağlı içerik"
                  >
                    <AdminSelect
                      aria-invalid={Boolean(errors.contentItemId)}
                      options={contentOptions}
                      placeholder="Bağlı içerik yok"
                      {...register("contentItemId")}
                    />
                  </AdminFormField>
                  <AdminFormField error={errors.linkLabel?.message} hint="Örn. Habere git, Rehbere git" label="Link metni">
                    <Input
                      aria-invalid={Boolean(errors.linkLabel)}
                      placeholder="İçeriğe git"
                      {...register("linkLabel")}
                    />
                  </AdminFormField>
                </div>

                <AdminFormField
                  error={errors.linkHref?.message}
                  hint="Bağlı içerik seçmediğiniz durumlarda /haberler/... gibi manuel link girin."
                  label="Manuel link"
                >
                  <Input
                    aria-invalid={Boolean(errors.linkHref)}
                    placeholder="/haberler/ornek-haber"
                    {...register("linkHref")}
                  />
                </AdminFormField>
              </section>

              <section className="grid gap-4 rounded-lg border border-line bg-white p-4 md:grid-cols-2">
                <AdminFormField error={errors.eventDate?.message} label="Tarih">
                  <Input
                    aria-invalid={Boolean(errors.eventDate)}
                    type="date"
                    {...register("eventDate")}
                  />
                </AdminFormField>
                <AdminFormField error={errors.sortOrder?.message} hint="Küçük sayı daha önce listelenir." label="Sıra">
                  <Input
                    aria-invalid={Boolean(errors.sortOrder)}
                    min="0"
                    type="number"
                    {...register("sortOrder")}
                  />
                </AdminFormField>
              </section>

              {errors.root?.message ? (
                <AdminAlert icon={AlertCircle} title="Kayıt kaydedilemedi" variant="destructive">
                  {errors.root.message}
                </AdminAlert>
              ) : null}
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3 border-t border-line bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm leading-6 text-muted">
              Yayındaki kayıtlar public haritada il seçildiğinde görünür.
            </p>
            <Button className="w-full sm:w-auto" disabled={isSubmitting} type="submit">
              {isSubmitting ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : null}
              {isSubmitting ? "Kaydediliyor" : isEditMode ? "Değişiklikleri kaydet" : "Harita kaydı oluştur"}
            </Button>
          </div>
        </form>
    </ResponsiveFormPanel>
  );
}
