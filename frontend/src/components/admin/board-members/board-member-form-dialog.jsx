"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { AdminAlert } from "@/components/admin/common/admin-alert";
import { AdminFormField } from "@/components/admin/common/admin-form-field";
import { AdminSelect } from "@/components/admin/common/admin-select";
import { ImageUploadCropField } from "@/components/admin/common/image-upload-crop-field";
import {
  ResponsiveFormPanel,
  ResponsiveFormPanelHeader,
} from "@/components/admin/common/responsive-form-panel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  createBoardMember,
  updateBoardMember,
  uploadAdminMedia,
} from "@/lib/admin-api";
import { boardMemberSchema } from "@/lib/form-schemas";

function getDefaultValues(item) {
  return {
    fullName: item?.fullName || "",
    roleTr: item?.roleTr || "",
    roleEn: item?.roleEn || "",
    titleTr: item?.titleTr || "",
    titleEn: item?.titleEn || "",
    summaryTr: item?.summaryTr || "",
    summaryEn: item?.summaryEn || "",
    mediaId: item?.mediaId || null,
    categoryId: item?.categoryId || null,
    isActive: item?.isActive ?? true,
    sortOrder: item?.sortOrder ?? 0,
    hasPortrait: Boolean(item?.mediaId && item?.image?.url),
  };
}

export function BoardMemberFormDialog({ categories, item, onOpenChange, onSaved, open }) {
  const [pendingFile, setPendingFile] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const isEditMode = Boolean(item?.id);
  const form = useForm({
    defaultValues: getDefaultValues(item),
    resolver: zodResolver(boardMemberSchema),
  });
  const {
    clearErrors,
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = form;
  const fullName = useWatch({ control, name: "fullName" });
  const isActive = useWatch({ control, name: "isActive" });
  const mediaId = useWatch({ control, name: "mediaId" });
  const summaryTr = useWatch({ control, name: "summaryTr" }) || "";
  const summaryEn = useWatch({ control, name: "summaryEn" }) || "";

  function handlePortraitChange({ file }) {
    setPendingFile(file || null);
    setValue("hasPortrait", Boolean(file), { shouldDirty: true, shouldValidate: true });
    clearErrors("mediaId");
  }

  function handlePortraitRemove() {
    setPendingFile(null);
    setValue("mediaId", null, { shouldDirty: true });
    setValue("hasPortrait", false, { shouldDirty: true, shouldValidate: true });
  }

  async function onSubmit(values) {
    try {
      setSubmitError("");
      let nextMediaId = values.mediaId;

      if (pendingFile) {
        const formData = new FormData();
        formData.append("file", pendingFile);
        const upload = await uploadAdminMedia(formData);
        nextMediaId = upload.id;
      }

      const payload = { ...values };
      delete payload.hasPortrait;
      payload.mediaId = nextMediaId || null;
      payload.categoryId = values.categoryId || null;

      if (isEditMode) {
        await updateBoardMember(item.id, payload);
      } else {
        await createBoardMember(payload);
      }

      await onSaved?.();
      toast.add({
        title: isEditMode ? "Kurul üyesi güncellendi" : "Kurul üyesi eklendi",
        description: `${values.fullName} kaydı başarıyla ${isEditMode ? "güncellendi" : "oluşturuldu"}.`,
        type: "success",
      });
      onOpenChange(false);
    } catch (error) {
      const message = error.message || "Yönetim kurulu kaydı kaydedilemedi.";
      setSubmitError(message);
      toast.add({ title: "Kayıt kaydedilemedi", description: message, type: "error", priority: "high" });
    }
  }

  function handleOpenChange(nextOpen) {
    if (!isSubmitting) onOpenChange(nextOpen);
  }

  return (
    <ResponsiveFormPanel
      description="Portreyi, iki dilli profil metnini, kategoriyi ve yayın durumunu yönetin."
      drawerClassName="max-h-[calc(100dvh-0.5rem)] overflow-hidden"
      onOpenChange={handleOpenChange}
      open={open}
      panelClassName="max-w-[68rem]"
      title={isEditMode ? "Kurul üyesini düzenle" : "Yeni kurul üyesi"}
    >
      <form className="flex min-h-0 min-w-0 flex-1 flex-col" onSubmit={handleSubmit(onSubmit)}>
        <ResponsiveFormPanelHeader
          description="Portreyi, iki dilli profil metnini, kategoriyi ve yayın durumunu tek kayıtta yönetin."
          title={isEditMode ? "Kurul üyesini düzenle" : "Yeni kurul üyesi"}
        />

        <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-surface/60">
          <div className="grid min-w-0 gap-5 px-4 py-5 sm:px-7 sm:py-6">
            <section className="grid min-w-0 gap-5 rounded-lg border border-line bg-white p-4 sm:p-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
              <ImageUploadCropField
                aspect={4 / 5}
                aspectClassName="aspect-[4/5]"
                compactPreview
                cropInstruction="Portreyi 4:5 oranında kadrajlayın. Şeffaf arka plan WebP çıktısında korunur."
                error={errors.mediaId?.message}
                helperText="PNG, WEBP, JPG veya AVIF yükleyin. Çıktı en fazla 1080 × 1350 px WebP olur."
                initialPreview={item?.image?.url || ""}
                label={isActive ? "Portre" : "Portre (yayına almadan önce zorunlu)"}
                maxOutputHeight={1350}
                maxOutputWidth={1080}
                onChange={handlePortraitChange}
                onRemove={handlePortraitRemove}
                outputExtension="webp"
                outputMimeType="image/webp"
                outputQuality={0.9}
                previewLabel={`${fullName || "Kurul üyesi"} portresi`}
                value={mediaId}
              />

              <div className="grid min-w-0 content-start gap-4">
                <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_12rem]">
                  <AdminFormField error={errors.fullName?.message} label="Ad ve soyad">
                    <Input
                      aria-invalid={Boolean(errors.fullName)}
                      autoComplete="name"
                      maxLength={160}
                      placeholder="Ad Soyad"
                      {...register("fullName")}
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
                </div>

                <AdminFormField
                  error={errors.categoryId?.message}
                  hint="Üye public sayfada seçilen kurul başlığı altında yer alır."
                  label="Kategori"
                >
                  <AdminSelect
                    aria-invalid={Boolean(errors.categoryId)}
                    options={categories.map((category) => ({
                      label: `${category.titleTr}${category.isActive ? "" : " (pasif)"}`,
                      value: String(category.id),
                    }))}
                    placeholder="Genel kurul üyeleri"
                    {...register("categoryId", {
                      setValueAs: (value) => (value ? Number(value) : null),
                    })}
                  />
                </AdminFormField>
              </div>
            </section>

            <div className="grid gap-5 lg:grid-cols-2">
              <section className="grid content-start gap-4 rounded-lg border border-line bg-white p-4 sm:p-5">
                <div className="border-b border-line pb-3">
                  <p className="text-sm font-semibold text-ink">Türkçe profil</p>
                  <p className="mt-1 text-xs leading-5 text-muted">Türkçe public sayfada gösterilir.</p>
                </div>
                <AdminFormField error={errors.titleTr?.message} label="Mesleki unvan">
                  <Input
                    aria-invalid={Boolean(errors.titleTr)}
                    maxLength={160}
                    placeholder="Örn. Avukat"
                    {...register("titleTr")}
                  />
                </AdminFormField>
                <AdminFormField
                  error={errors.roleTr?.message}
                  hint="Örn. Başkan Yardımcısı"
                  label="Yönetim görevi"
                >
                  <Input
                    aria-invalid={Boolean(errors.roleTr)}
                    maxLength={160}
                    placeholder="Varsa resmî görev unvanı"
                    {...register("roleTr")}
                  />
                </AdminFormField>
                <AdminFormField
                  error={errors.summaryTr?.message}
                  hint={`${summaryTr.length}/2000 karakter`}
                  label="Kısa özet"
                >
                  <Textarea
                    aria-invalid={Boolean(errors.summaryTr)}
                    className="min-h-36 resize-y"
                    maxLength={2000}
                    placeholder="Kısa, doğrulanmış ve kurumsal bir özgeçmiş özeti"
                    {...register("summaryTr")}
                  />
                </AdminFormField>
              </section>

              <section className="grid content-start gap-4 rounded-lg border border-line bg-white p-4 sm:p-5">
                <div className="border-b border-line pb-3">
                  <p className="text-sm font-semibold text-ink">İngilizce profil</p>
                  <p className="mt-1 text-xs leading-5 text-muted">İngilizce public sayfada gösterilir.</p>
                </div>
                <AdminFormField error={errors.titleEn?.message} label="Professional title">
                  <Input
                    aria-invalid={Boolean(errors.titleEn)}
                    maxLength={160}
                    placeholder="E.g. Attorney"
                    {...register("titleEn")}
                  />
                </AdminFormField>
                <AdminFormField
                  error={errors.roleEn?.message}
                  hint="E.g. Vice Chair"
                  label="Board role"
                >
                  <Input
                    aria-invalid={Boolean(errors.roleEn)}
                    maxLength={160}
                    placeholder="Official role, if applicable"
                    {...register("roleEn")}
                  />
                </AdminFormField>
                <AdminFormField
                  error={errors.summaryEn?.message}
                  hint={`${summaryEn.length}/2000 characters`}
                  label="Short summary"
                >
                  <Textarea
                    aria-invalid={Boolean(errors.summaryEn)}
                    className="min-h-36 resize-y"
                    maxLength={2000}
                    placeholder="A concise, verified institutional profile"
                    {...register("summaryEn")}
                  />
                </AdminFormField>
              </section>
            </div>

            <section className="rounded-lg border border-line bg-white p-4 sm:p-5">
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <label className="flex cursor-pointer items-start gap-3" htmlFor="board-member-active">
                    <Checkbox
                      checked={field.value}
                      id="board-member-active"
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                    />
                    <span className="grid gap-1">
                      <span className="text-sm font-semibold text-ink">Public sayfada yayınla</span>
                      <span className="text-xs leading-5 text-muted">
                        Kapalı kayıtlar admin panelinde korunur, public API ve sayfada gösterilmez.
                      </span>
                    </span>
                  </label>
                )}
              />
            </section>

            {submitError ? (
              <AdminAlert icon={AlertCircle} title="Kayıt kaydedilemedi" variant="destructive">
                {submitError}
              </AdminAlert>
            ) : null}
          </div>
        </div>

        <div className="mt-auto flex flex-col-reverse gap-3 border-t border-line bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <p className="text-xs leading-5 text-muted sm:max-w-xl">
            Eksik profili pasif kaydedebilirsiniz. Yayın için portre ve iki dilli profil zorunludur.
          </p>
          <div className="flex shrink-0 gap-2">
            <Button className="flex-1 sm:flex-none" disabled={isSubmitting} onClick={() => handleOpenChange(false)} variant="outline">
              Vazgeç
            </Button>
            <Button className="flex-1 sm:flex-none" disabled={isSubmitting} type="submit">
              {isSubmitting ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : null}
              {isSubmitting ? "Kaydediliyor" : isEditMode ? "Değişiklikleri kaydet" : "Üye ekle"}
            </Button>
          </div>
        </div>
      </form>
    </ResponsiveFormPanel>
  );
}
