"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { AdminAlert } from "@/components/admin/common/admin-alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createHeroSlide, updateHeroSlide, uploadAdminMedia } from "@/lib/admin-api";
import { heroSlideSchema } from "@/lib/form-schemas";
import { HeroImageFields } from "./hero-image-fields";
import { HeroLinkField } from "./hero-link-field";
import { HeroPublishFields } from "./hero-publish-fields";
import { HeroTextFields } from "./hero-text-fields";

function getDefaultValues(item) {
  return {
    titleTr: item?.titleTr || "",
    titleEn: item?.titleEn || "",
    summaryTr: item?.summaryTr || "",
    summaryEn: item?.summaryEn || "",
    ctaLabelTr: item?.ctaLabelTr || "",
    ctaLabelEn: item?.ctaLabelEn || "",
    ctaHref: item?.ctaHref || "",
    mediaId: item?.mediaId || 0,
    mediaMobileId: item?.mediaMobileId || item?.mediaId || 0,
    mediaTabletId: item?.mediaTabletId || item?.mediaId || 0,
    isActive: item?.isActive ?? true,
    sortOrder: item?.sortOrder ?? 0,
  };
}

const EMPTY_PENDING_FILES = {
  mobile: null,
  tablet: null,
  desktop: null,
};

export function HeroFormDialog({ item, itemCount, maxItems, onOpenChange, onSaved, open }) {
  const [submitError, setSubmitError] = useState("");
  const [pendingFiles, setPendingFiles] = useState(EMPTY_PENDING_FILES);
  const isEditMode = Boolean(item?.id);

  const form = useForm({
    resolver: zodResolver(heroSlideSchema),
    defaultValues: getDefaultValues(item),
  });

  const {
    clearErrors,
    control,
    getValues,
    handleSubmit,
    register,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const ctaHref = useWatch({ control, name: "ctaHref" });
  const mediaId = useWatch({ control, name: "mediaId" });
  const mediaMobileId = useWatch({ control, name: "mediaMobileId" });
  const mediaTabletId = useWatch({ control, name: "mediaTabletId" });
  const isLimitReached = useMemo(
    () => !isEditMode && itemCount >= maxItems,
    [isEditMode, itemCount, maxItems],
  );

  function handlePendingFileChange(variantKey, file) {
    setPendingFiles((current) => ({
      ...current,
      [variantKey]: file || null,
    }));
  }

  async function uploadPendingFile(file) {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    return uploadAdminMedia(formData);
  }

  async function onSubmit(values) {
    if (isLimitReached) return;

    try {
      setSubmitError("");
      let payload = { ...values };

      const [mobileUpload, tabletUpload, desktopUpload] = await Promise.all([
        uploadPendingFile(pendingFiles.mobile),
        uploadPendingFile(pendingFiles.tablet),
        uploadPendingFile(pendingFiles.desktop),
      ]);

      if (mobileUpload?.id) payload.mediaMobileId = mobileUpload.id;
      if (tabletUpload?.id) payload.mediaTabletId = tabletUpload.id;
      if (desktopUpload?.id) payload.mediaId = desktopUpload.id;

      let hasMissingImage = false;

      if (!payload.mediaMobileId) {
        setError("mediaMobileId", {
          type: "manual",
          message: "Mobil görseli seçmelisiniz.",
        });
        hasMissingImage = true;
      }

      if (!payload.mediaTabletId) {
        setError("mediaTabletId", {
          type: "manual",
          message: "Tablet görseli seçmelisiniz.",
        });
        hasMissingImage = true;
      }

      if (!payload.mediaId) {
        setError("mediaId", {
          type: "manual",
          message: "Masaüstü görseli seçmelisiniz.",
        });
        hasMissingImage = true;
      }

      if (hasMissingImage) return;

      if (isEditMode) {
        await updateHeroSlide(item.id, payload);
      } else {
        await createHeroSlide(payload);
      }

      onSaved?.();
      onOpenChange(false);
    } catch (error) {
      setSubmitError(error.message || "Hero kaydı kaydedilemedi.");
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-hidden p-0 sm:max-w-5xl">
        <form className="flex max-h-[calc(100dvh-2rem)] flex-col" onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="border-b border-line bg-white px-5 py-4 sm:px-6">
            <DialogTitle>{isEditMode ? "Hero kaydını düzenle" : "Yeni hero kaydı"}</DialogTitle>
            <DialogDescription>
              Hero içeriklerini Türkçe ve İngilizce olarak tek kayıtta yönetin. Mobil, tablet ve masaüstü için ayrı görsel yükleyin. En fazla {maxItems} kayıt eklenebilir.
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto bg-surface/70">
            <div className="grid gap-5 px-5 py-5 sm:px-6">
              <input type="hidden" {...register("mediaId", { valueAsNumber: true })} />
              <input type="hidden" {...register("mediaMobileId", { valueAsNumber: true })} />
              <input type="hidden" {...register("mediaTabletId", { valueAsNumber: true })} />

              {isLimitReached ? (
                <AdminAlert icon={AlertCircle} title="Hero limiti dolu" variant="warning">
                  En fazla {maxItems} hero kaydı eklenebilir. Yeni kayıt açmadan önce mevcut kayıtlardan birini silin.
                </AdminAlert>
              ) : null}

              <HeroImageFields
                clearErrors={clearErrors}
                errors={errors}
                item={item}
                mediaIds={{ mediaId, mediaMobileId, mediaTabletId }}
                onPendingFileChange={handlePendingFileChange}
                setValue={setValue}
              />

              <HeroTextFields
                errors={errors}
                getValues={getValues}
                register={register}
                setValue={setValue}
              />

              <HeroLinkField
                ctaHref={ctaHref}
                error={errors.ctaHref?.message}
                register={register}
                setValue={setValue}
              />

              <HeroPublishFields control={control} errors={errors} register={register} />

              {submitError ? (
                <AdminAlert icon={AlertCircle} title="Kayıt kaydedilemedi" variant="destructive">
                  {submitError}
                </AdminAlert>
              ) : null}
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3 border-t border-line bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="text-sm leading-6 text-muted">
              {isEditMode
                ? "Kaydettiğinizde değişiklikler hero kaydına uygulanır."
                : "Kayıt oluşturulduğunda liste otomatik yenilenir."}
            </div>
            <Button className="w-full sm:w-auto" disabled={isSubmitting || isLimitReached} type="submit">
              {isSubmitting ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : null}
              {isSubmitting ? "Kaydediliyor" : isEditMode ? "Değişiklikleri kaydet" : "Hero kaydını oluştur"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
