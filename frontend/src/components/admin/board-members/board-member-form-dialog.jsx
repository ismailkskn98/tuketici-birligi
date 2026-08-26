"use client";

import { AlertCircle, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { AdminAlert } from "@/components/admin/common/admin-alert";
import { AdminFormField } from "@/components/admin/common/admin-form-field";
import { ImageUploadCropField } from "@/components/admin/common/image-upload-crop-field";
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
import { Textarea } from "@/components/ui/textarea";
import {
  createBoardMember,
  updateBoardMember,
  uploadAdminMedia,
} from "@/lib/admin-api";

function getDefaultValues(item) {
  return {
    fullName: item?.fullName || "",
    titleTr: item?.titleTr || "",
    titleEn: item?.titleEn || "",
    summaryTr: item?.summaryTr || "",
    summaryEn: item?.summaryEn || "",
    mediaId: item?.mediaId || 0,
    categoryId: item?.categoryId || null,
    isActive: item?.isActive ?? true,
    sortOrder: item?.sortOrder ?? 0,
  };
}

export function BoardMemberFormDialog({ item, onOpenChange, onSaved, open }) {
  const [values, setValues] = useState(() => getDefaultValues(item));
  const [pendingFile, setPendingFile] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isEditMode = Boolean(item?.id);

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function validate() {
    if (!values.fullName.trim()) return "Ad ve soyad alanını doldurmalısınız.";
    if (!values.titleTr.trim() || !values.titleEn.trim()) {
      return "Türkçe ve İngilizce mesleki unvanları doldurmalısınız.";
    }
    if (values.summaryTr.trim().length < 10 || values.summaryEn.trim().length < 10) {
      return "Türkçe ve İngilizce özetler en az 10 karakter olmalıdır.";
    }
    if (!values.mediaId && !pendingFile) return "4:5 oranında bir portre seçmelisiniz.";
    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      let mediaId = values.mediaId;

      if (pendingFile) {
        const formData = new FormData();
        formData.append("file", pendingFile);
        const upload = await uploadAdminMedia(formData);
        mediaId = upload.id;
      }

      const payload = {
        ...values,
        mediaId,
        categoryId: values.categoryId || null,
        sortOrder: Number(values.sortOrder || 0),
      };

      if (isEditMode) {
        await updateBoardMember(item.id, payload);
      } else {
        await createBoardMember(payload);
      }

      await onSaved?.();
      onOpenChange(false);
    } catch (submitError) {
      setError(submitError.message || "Yönetim kurulu kaydı kaydedilemedi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-hidden p-0 sm:max-w-5xl">
        <form className="flex max-h-[calc(100dvh-2rem)] flex-col" onSubmit={handleSubmit}>
          <DialogHeader className="border-b border-line bg-white px-5 py-4 sm:px-6">
            <DialogTitle>
              {isEditMode ? "Kurul üyesini düzenle" : "Yeni kurul üyesi"}
            </DialogTitle>
            <DialogDescription>
              Public sayfada kullanılacak portreyi ve kısa iki dilli kurumsal profili yönetin.
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto bg-surface/70">
            <div className="grid gap-5 px-5 py-5 sm:px-6">
              <section className="grid gap-4 rounded-lg border border-line bg-white p-4">
                <ImageUploadCropField
                  aspect={4 / 5}
                  aspectClassName="aspect-[4/5]"
                  cropInstruction="Portreyi 4:5 oranında kadrajlayın. Şeffaf arka plan WebP çıktısında korunur."
                  helperText="PNG, WEBP, JPG veya AVIF yükleyin. Çıktı en fazla 1080 × 1350 px alfa WebP olur."
                  initialPreview={item?.image?.url || ""}
                  label="Portre"
                  maxOutputHeight={1350}
                  maxOutputWidth={1080}
                  onChange={({ file, mediaId }) => {
                    setPendingFile(file);
                    updateField("mediaId", mediaId || values.mediaId);
                  }}
                  outputExtension="webp"
                  outputMimeType="image/webp"
                  outputQuality={0.9}
                  previewLabel={`${values.fullName || "Kurul üyesi"} portresi`}
                  value={values.mediaId}
                />

                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
                  <AdminFormField label="Ad ve soyad">
                    <Input
                      maxLength={160}
                      onChange={(event) => updateField("fullName", event.target.value)}
                      placeholder="Ad Soyad"
                      value={values.fullName}
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
                </div>
              </section>

              <div className="grid gap-5 lg:grid-cols-2">
                <section className="grid gap-4 rounded-lg border border-line bg-white p-4">
                  <div>
                    <p className="text-sm font-bold text-ink">Türkçe profil</p>
                    <p className="mt-1 text-xs leading-5 text-muted">Public Türkçe sayfada gösterilir.</p>
                  </div>
                  <AdminFormField label="Mesleki unvan">
                    <Input
                      maxLength={160}
                      onChange={(event) => updateField("titleTr", event.target.value)}
                      placeholder="Örn. Avukat"
                      value={values.titleTr}
                    />
                  </AdminFormField>
                  <AdminFormField hint={`${values.summaryTr.length}/2000 karakter`} label="Kısa özet">
                    <Textarea
                      className="min-h-36"
                      maxLength={2000}
                      onChange={(event) => updateField("summaryTr", event.target.value)}
                      placeholder="Kısa, doğrulanmış ve kurumsal bir özgeçmiş özeti"
                      value={values.summaryTr}
                    />
                  </AdminFormField>
                </section>

                <section className="grid gap-4 rounded-lg border border-line bg-white p-4">
                  <div>
                    <p className="text-sm font-bold text-ink">İngilizce profil</p>
                    <p className="mt-1 text-xs leading-5 text-muted">Public İngilizce sayfada gösterilir.</p>
                  </div>
                  <AdminFormField label="Professional title">
                    <Input
                      maxLength={160}
                      onChange={(event) => updateField("titleEn", event.target.value)}
                      placeholder="E.g. Attorney"
                      value={values.titleEn}
                    />
                  </AdminFormField>
                  <AdminFormField hint={`${values.summaryEn.length}/2000 characters`} label="Short summary">
                    <Textarea
                      className="min-h-36"
                      maxLength={2000}
                      onChange={(event) => updateField("summaryEn", event.target.value)}
                      placeholder="A concise, verified institutional profile"
                      value={values.summaryEn}
                    />
                  </AdminFormField>
                </section>
              </div>

              <section className="rounded-lg border border-line bg-white p-4">
                <label className="flex items-start gap-3" htmlFor="board-member-active">
                  <Checkbox
                    checked={values.isActive}
                    id="board-member-active"
                    onCheckedChange={(checked) => updateField("isActive", checked === true)}
                  />
                  <span className="grid gap-1">
                    <span className="text-sm font-semibold text-ink">Public sayfada yayınla</span>
                    <span className="text-xs leading-5 text-muted">
                      Pasif kayıtlar admin panelinde korunur, public API ve sayfada gösterilmez.
                    </span>
                  </span>
                </label>
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
              Kategori altyapısı hazırdır; kategori seçimi public tasarıma alınana kadar bu formda gösterilmez.
            </p>
            <Button className="w-full shrink-0 sm:w-auto" disabled={submitting} type="submit">
              {submitting ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : null}
              {submitting
                ? "Kaydediliyor"
                : isEditMode
                  ? "Değişiklikleri kaydet"
                  : "Kurul üyesi oluştur"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
