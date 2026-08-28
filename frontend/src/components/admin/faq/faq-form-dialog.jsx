"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, LoaderCircle } from "lucide-react";
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
import { createContentItem, updateContentItem } from "@/lib/admin-api";
import { faqAdminSchema } from "@/lib/form-schemas";

const localeOptions = [
  { label: "Türkçe", value: "tr" },
  { label: "English", value: "en" }
];

const statusOptions = [
  { label: "Yayında", value: "published" },
  { label: "Taslak", value: "draft" }
];

function getDefaultValues(item) {
  return {
    locale: item?.locale || "tr",
    title: item?.title || "",
    summary: item?.summary || "",
    body: item?.body || "",
    status: item?.status || "published",
    sortOrder: item?.sortOrder ?? 0
  };
}

export function FaqFormDialog({ item, onOpenChange, onSaved, open }) {
  const isEditMode = Boolean(item?.id);
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: getDefaultValues(item),
    resolver: zodResolver(faqAdminSchema),
  });

  async function onSubmit(values) {

    const payload = {
      type: "faq",
      locale: values.locale,
      title: values.title,
      summary: values.summary,
      body: values.body,
      status: values.status,
      isFeatured: false,
      sortOrder: Number(values.sortOrder || 0),
      metaTitle: values.title,
      metaDescription: values.body.slice(0, 300)
    };

    try {
      if (isEditMode) {
        await updateContentItem(item.id, payload);
      } else {
        await createContentItem(payload);
      }

      await onSaved?.();
      toast.add({
        title: isEditMode ? "SSS kaydı güncellendi" : "SSS kaydı eklendi",
        description: `${values.title} başarıyla ${isEditMode ? "güncellendi" : "oluşturuldu"}.`,
        type: "success",
      });
      onOpenChange(false);
    } catch (submitError) {
      const message = submitError.message || "SSS kaydı kaydedilemedi.";
      setError("root", { message });
      toast.add({ title: "SSS kaydedilemedi", description: message, type: "error", priority: "high" });
    }
  }

  function handleOpenChange(nextOpen) {
    if (!isSubmitting) onOpenChange(nextOpen);
  }

  return (
    <ResponsiveFormPanel
      description="Soru, kategori etiketi ve cevap metnini yönetin."
      onOpenChange={handleOpenChange}
      open={open}
      panelClassName="max-w-[48rem]"
      title={isEditMode ? "SSS kaydını düzenle" : "Yeni SSS kaydı"}
    >
        <form className="flex min-h-0 min-w-0 flex-1 flex-col" onSubmit={handleSubmit(onSubmit)}>
          <ResponsiveFormPanelHeader
            description="Soru, kategori etiketi ve cevap metnini public SSS sayfasında yayınlayın."
            title={isEditMode ? "SSS kaydını düzenle" : "Yeni SSS kaydı"}
          />

          <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-surface/70">
            <div className="grid min-w-0 gap-5 px-4 py-5 sm:px-6">
              <section className="grid gap-4 rounded-lg border border-line bg-white p-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <AdminFormField error={errors.locale?.message} label="Dil">
                    <AdminSelect
                      aria-invalid={Boolean(errors.locale)}
                      options={localeOptions}
                      {...register("locale")}
                    />
                  </AdminFormField>
                  <AdminFormField error={errors.status?.message} label="Durum">
                    <AdminSelect
                      aria-invalid={Boolean(errors.status)}
                      options={statusOptions}
                      {...register("status")}
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
                </div>

                <AdminFormField error={errors.title?.message} label="Soru">
                  <Input
                    aria-invalid={Boolean(errors.title)}
                    placeholder="Örn. Başvuru için ücret ödenir mi?"
                    {...register("title")}
                  />
                </AdminFormField>

                <AdminFormField error={errors.summary?.message} hint="Public sayfada filtre etiketi olarak kullanılır." label="Kategori etiketi">
                  <Input
                    aria-invalid={Boolean(errors.summary)}
                    placeholder="Örn. Başvuru"
                    {...register("summary")}
                  />
                </AdminFormField>

                <AdminFormField error={errors.body?.message} label="Cevap">
                  <Textarea
                    aria-invalid={Boolean(errors.body)}
                    className="min-h-36"
                    placeholder="Kısa, net ve kurum diline uygun cevap yazın."
                    {...register("body")}
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
            <p className="text-sm leading-6 text-muted">Yayındaki kayıtlar public SSS sayfasında görünür.</p>
            <Button className="w-full sm:w-auto" disabled={isSubmitting} type="submit">
              {isSubmitting ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : null}
              {isSubmitting ? "Kaydediliyor" : isEditMode ? "Değişiklikleri kaydet" : "SSS kaydı oluştur"}
            </Button>
          </div>
        </form>
    </ResponsiveFormPanel>
  );
}
