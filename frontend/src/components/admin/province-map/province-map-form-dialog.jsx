"use client";

import { AlertCircle, LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { AdminAlert } from "@/components/admin/common/admin-alert";
import { AdminFormField } from "@/components/admin/common/admin-form-field";
import { AdminSelect } from "@/components/admin/common/admin-select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProvinceMapEntry, updateProvinceMapEntry } from "@/lib/admin-api";
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
  const [values, setValues] = useState(() => getDefaultValues(item));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
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

  function updateField(field, value) {
    setValues((current) => ({
      ...current,
      [field]: value
    }));
  }

  function validate() {
    if (!values.provinceCode) return "İl seçmelisiniz.";
    if (!values.title.trim()) return "Başlık yazmalısınız.";
    if (!values.contentItemId && !values.linkHref.trim()) {
      return "Bağlı içerik seçin veya manuel link girin.";
    }
    if (values.linkHref && !values.linkHref.startsWith("/") && !values.linkHref.startsWith("http")) {
      return "Manuel link / ile başlayan site içi yol veya http ile başlayan tam adres olmalı.";
    }
    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      ...values,
      provinceCode: Number(values.provinceCode),
      contentItemId: values.contentItemId ? Number(values.contentItemId) : null,
      sortOrder: Number(values.sortOrder || 0)
    };

    try {
      setSubmitting(true);
      setError("");

      if (isEditMode) {
        await updateProvinceMapEntry(item.id, payload);
      } else {
        await createProvinceMapEntry(payload);
      }

      onSaved?.();
      onOpenChange(false);
    } catch (submitError) {
      setError(submitError.message || "Harita kaydı kaydedilemedi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-hidden p-0 sm:max-w-4xl">
        <form className="flex max-h-[calc(100dvh-2rem)] flex-col" onSubmit={handleSubmit}>
          <DialogHeader className="border-b border-line bg-white px-5 py-4 sm:px-6">
            <DialogTitle>{isEditMode ? "Harita kaydını düzenle" : "Yeni harita kaydı"}</DialogTitle>
            <DialogDescription>
              İle bağlı haber, duyuru, rehber veya faaliyet kaydını harita üzerinde yayınlayın.
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto bg-surface/70">
            <div className="grid gap-5 px-5 py-5 sm:px-6">
              <section className="grid gap-4 rounded-lg border border-line bg-white p-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <AdminFormField label="İl">
                    <AdminSelect
                      onChange={(event) => updateField("provinceCode", event.target.value)}
                      options={provinceOptions}
                      placeholder="İl seçin"
                      value={values.provinceCode}
                    />
                  </AdminFormField>
                  <AdminFormField label="Kategori">
                    <AdminSelect
                      onChange={(event) => updateField("category", event.target.value)}
                      options={categories}
                      value={values.category}
                    />
                  </AdminFormField>
                  <AdminFormField label="Durum">
                    <AdminSelect
                      onChange={(event) => updateField("status", event.target.value)}
                      options={statuses}
                      value={values.status}
                    />
                  </AdminFormField>
                </div>

                <AdminFormField label="Başlık">
                  <Input
                    onChange={(event) => updateField("title", event.target.value)}
                    placeholder="Örn. Ankara tüketici bilgilendirme çalışması"
                    value={values.title}
                  />
                </AdminFormField>

                <AdminFormField label="Özet">
                  <Textarea
                    onChange={(event) => updateField("summary", event.target.value)}
                    placeholder="Harita modalında görünecek kısa açıklama"
                    value={values.summary}
                  />
                </AdminFormField>
              </section>

              <section className="grid gap-4 rounded-lg border border-line bg-white p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <AdminFormField
                    hint="Mevcut haber/duyuru/rehber seçilirse link otomatik üretilebilir."
                    label="Bağlı içerik"
                  >
                    <AdminSelect
                      onChange={(event) => updateField("contentItemId", event.target.value)}
                      options={contentOptions}
                      placeholder="Bağlı içerik yok"
                      value={values.contentItemId}
                    />
                  </AdminFormField>
                  <AdminFormField hint="Örn. Habere git, Rehbere git" label="Link metni">
                    <Input
                      onChange={(event) => updateField("linkLabel", event.target.value)}
                      placeholder="İçeriğe git"
                      value={values.linkLabel}
                    />
                  </AdminFormField>
                </div>

                <AdminFormField
                  hint="Bağlı içerik seçmediğiniz durumlarda /haberler/... gibi manuel link girin."
                  label="Manuel link"
                >
                  <Input
                    onChange={(event) => updateField("linkHref", event.target.value)}
                    placeholder="/haberler/ornek-haber"
                    value={values.linkHref}
                  />
                </AdminFormField>
              </section>

              <section className="grid gap-4 rounded-lg border border-line bg-white p-4 md:grid-cols-2">
                <AdminFormField label="Tarih">
                  <Input
                    onChange={(event) => updateField("eventDate", event.target.value)}
                    type="date"
                    value={values.eventDate}
                  />
                </AdminFormField>
                <AdminFormField hint="Küçük sayı daha önce listelenir." label="Sıra">
                  <Input
                    min="0"
                    onChange={(event) => updateField("sortOrder", event.target.value)}
                    type="number"
                    value={values.sortOrder}
                  />
                </AdminFormField>
              </section>

              {error ? (
                <AdminAlert icon={AlertCircle} title="Kayıt kaydedilemedi" variant="destructive">
                  {error}
                </AdminAlert>
              ) : null}
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3 border-t border-line bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm leading-6 text-muted">
              Yayındaki kayıtlar public haritada il seçildiğinde görünür.
            </p>
            <Button className="w-full sm:w-auto" disabled={submitting} type="submit">
              {submitting ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : null}
              {submitting ? "Kaydediliyor" : isEditMode ? "Değişiklikleri kaydet" : "Harita kaydı oluştur"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
