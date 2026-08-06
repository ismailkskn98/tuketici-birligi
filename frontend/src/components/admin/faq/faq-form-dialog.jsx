"use client";

import { AlertCircle, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { AdminAlert } from "@/components/admin/common/admin-alert";
import { AdminFormField } from "@/components/admin/common/admin-form-field";
import { AdminSelect } from "@/components/admin/common/admin-select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createContentItem, updateContentItem } from "@/lib/admin-api";

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
  const [values, setValues] = useState(() => getDefaultValues(item));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isEditMode = Boolean(item?.id);

  function updateField(field, value) {
    setValues((current) => ({
      ...current,
      [field]: value
    }));
  }

  function validate() {
    if (!values.title.trim()) return "Soru başlığı yazmalısınız.";
    if (!values.summary.trim()) return "Kategori etiketi yazmalısınız.";
    if (!values.body.trim()) return "Cevap metni yazmalısınız.";
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
      setSubmitting(true);
      setError("");

      if (isEditMode) {
        await updateContentItem(item.id, payload);
      } else {
        await createContentItem(payload);
      }

      onSaved?.();
      onOpenChange(false);
    } catch (submitError) {
      setError(submitError.message || "SSS kaydı kaydedilemedi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-hidden p-0 sm:max-w-3xl">
        <form className="flex max-h-[calc(100dvh-2rem)] flex-col" onSubmit={handleSubmit}>
          <DialogHeader className="border-b border-line bg-white px-5 py-4 sm:px-6">
            <DialogTitle>{isEditMode ? "SSS kaydını düzenle" : "Yeni SSS kaydı"}</DialogTitle>
            <DialogDescription>Soru, kategori etiketi ve cevap metnini public SSS sayfasında yayınlayın.</DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto bg-surface/70">
            <div className="grid gap-5 px-5 py-5 sm:px-6">
              <section className="grid gap-4 rounded-lg border border-line bg-white p-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <AdminFormField label="Dil">
                    <AdminSelect
                      onChange={(event) => updateField("locale", event.target.value)}
                      options={localeOptions}
                      value={values.locale}
                    />
                  </AdminFormField>
                  <AdminFormField label="Durum">
                    <AdminSelect
                      onChange={(event) => updateField("status", event.target.value)}
                      options={statusOptions}
                      value={values.status}
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
                </div>

                <AdminFormField label="Soru">
                  <Input
                    onChange={(event) => updateField("title", event.target.value)}
                    placeholder="Örn. Başvuru için ücret ödenir mi?"
                    value={values.title}
                  />
                </AdminFormField>

                <AdminFormField hint="Public sayfada filtre etiketi olarak kullanılır." label="Kategori etiketi">
                  <Input
                    onChange={(event) => updateField("summary", event.target.value)}
                    placeholder="Örn. Başvuru"
                    value={values.summary}
                  />
                </AdminFormField>

                <AdminFormField label="Cevap">
                  <Textarea
                    className="min-h-36"
                    onChange={(event) => updateField("body", event.target.value)}
                    placeholder="Kısa, net ve kurum diline uygun cevap yazın."
                    value={values.body}
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
            <p className="text-sm leading-6 text-muted">Yayındaki kayıtlar public SSS sayfasında görünür.</p>
            <Button className="w-full sm:w-auto" disabled={submitting} type="submit">
              {submitting ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : null}
              {submitting ? "Kaydediliyor" : isEditMode ? "Değişiklikleri kaydet" : "SSS kaydı oluştur"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
