"use client";

import { Monitor, Smartphone, Tablet } from "lucide-react";
import { ImageUploadCropField } from "@/components/admin/common/image-upload-crop-field";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const HERO_IMAGE_VARIANTS = [
  {
    key: "mobile",
    fieldName: "mediaMobileId",
    title: "Mobil görsel",
    badge: "Mobil",
    ratioLabel: "16:15",
    description: "Telefon ekranlarında görünür. Dikey kadraja yakın, 16:15 oranında kırpın.",
    helperText: "Mobil carousel alanı 16:15 oranındadır. Önemli içeriği kadrajın ortasında tutun.",
    previewLabel: "16:15 mobil önizleme hazır",
    aspect: 16 / 15,
    aspectClassName: "aspect-16/15",
    icon: Smartphone,
    initialPreviewKey: "imageMobile",
  },
  {
    key: "tablet",
    fieldName: "mediaTabletId",
    title: "Tablet görsel",
    badge: "Tablet",
    ratioLabel: "16:9",
    description: "Tablet ve orta boy ekranlarda görünür. Klasik 16:9 yatay oran kullanın.",
    helperText: "Tablet carousel alanı 16:9 (aspect-video) oranındadır.",
    previewLabel: "16:9 tablet önizleme hazır",
    aspect: 16 / 9,
    aspectClassName: "aspect-video",
    icon: Tablet,
    initialPreviewKey: "imageTablet",
  },
  {
    key: "desktop",
    fieldName: "mediaId",
    title: "Masaüstü görsel",
    badge: "Masaüstü",
    ratioLabel: "16:6",
    description: "Geniş masaüstü ekranlarda görünür. Daha yatay, panoramik 16:6 oranında kırpın.",
    helperText: "Masaüstü carousel alanı 16:6 oranındadır. Metin sol tarafta kalacağı için sağ tarafı görsel için boş bırakabilirsiniz.",
    previewLabel: "16:6 masaüstü önizleme hazır",
    aspect: 16 / 6,
    aspectClassName: "aspect-16/6",
    icon: Monitor,
    initialPreviewKey: "image",
  },
];

function VariantHeader({ variant }) {
  const Icon = variant.icon;

  return (
    <div className="flex items-start gap-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary-dark">
        <Icon aria-hidden="true" className="size-5" />
      </div>
      <div className="min-w-0 flex-1 grid gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-sm font-semibold text-ink">{variant.title}</h4>
          <Badge className="bg-surface text-muted">{variant.badge}</Badge>
          <Badge>{variant.ratioLabel}</Badge>
        </div>
        <p className="text-xs font-normal leading-5 text-muted">{variant.description}</p>
      </div>
    </div>
  );
}

export function HeroImageFields({
  clearErrors,
  errors,
  item,
  mediaIds,
  onPendingFileChange,
  setValue,
}) {
  return (
    <section className="grid gap-4 rounded-lg border border-line bg-white p-4">
      <div className="grid gap-1">
        <h3 className="text-base font-semibold text-ink">Hero görselleri</h3>
        <p className="text-sm leading-6 text-muted">
          Her cihaz boyutu için ayrı görsel yükleyin. Kırpma oranları ana sayfa carousel ölçüleriyle aynıdır.
          Upload işlemi kayıt sırasında yapılır.
        </p>
      </div>

      <div className="grid gap-4">
        {HERO_IMAGE_VARIANTS.map((variant) => {
          const mediaId = mediaIds[variant.fieldName] || 0;
          const initialPreview =
            item?.[variant.initialPreviewKey]?.url ||
            (variant.key !== "desktop" ? item?.image?.url : "") ||
            "";

          return (
            <div
              key={variant.key}
              className={cn("grid gap-3 rounded-lg border border-line bg-surface/40 p-3 sm:p-4")}
            >
              <VariantHeader variant={variant} />

              <ImageUploadCropField
                aspect={variant.aspect}
                aspectClassName={variant.aspectClassName}
                error={errors[variant.fieldName]?.message}
                helperText={variant.helperText}
                initialPreview={initialPreview}
                label=""
                previewLabel={variant.previewLabel}
                value={mediaId}
                onChange={({ file, mediaId: nextMediaId }) => {
                  onPendingFileChange(variant.key, file);
                  setValue(variant.fieldName, nextMediaId || mediaId || 0, {
                    shouldDirty: true,
                    shouldValidate: false,
                  });
                  clearErrors(variant.fieldName);
                }}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
