"use client";

import Cropper from "react-easy-crop";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, LoaderCircle, RotateCcw, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCroppedImageFile } from "@/lib/crop-image";
import { cn } from "@/lib/utils";

export function ImageUploadCropField({
  aspect = 16 / 9,
  aspectClassName = "aspect-video",
  error,
  helperText,
  initialPreview = "",
  label = "Görsel",
  maxOutputHeight,
  maxOutputWidth,
  onChange,
  onRemove,
  outputExtension = "jpg",
  outputMimeType = "image/jpeg",
  outputQuality = 0.92,
  previewLabel,
  cropInstruction = "Carousel oranı için kadrajı seçin.",
  value,
}) {
  const [sourceImage, setSourceImage] = useState("");
  const [sourceFileName, setSourceFileName] = useState("image");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState("");
  const [previewRemoved, setPreviewRemoved] = useState(false);
  const [cropError, setCropError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(
    () => () => {
      if (sourceImage.startsWith("blob:")) {
        URL.revokeObjectURL(sourceImage);
      }
      if (localPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    },
    [sourceImage, localPreviewUrl],
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (!file) return;

      if (sourceImage.startsWith("blob:")) {
        URL.revokeObjectURL(sourceImage);
      }

      setCropError("");
      setPreviewRemoved(false);
      setSourceFileName(file.name.replace(/\.[^.]+$/, "") || "image");
      setSourceImage(URL.createObjectURL(file));
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    },
    [sourceImage],
  );

  const { getInputProps, getRootProps, isDragActive, open } = useDropzone({
    accept: {
      "image/avif": [".avif"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    multiple: false,
    noClick: true,
    noKeyboard: true,
    onDrop,
  });

  async function applyCrop() {
    if (!sourceImage || !croppedAreaPixels) {
      setCropError("Önce görsel üzerinde kırpma alanını belirleyin.");
      return;
    }

    try {
      setProcessing(true);
      setCropError("");

      const file = await getCroppedImageFile(
        sourceImage,
        croppedAreaPixels,
        `${sourceFileName}.${outputExtension}`,
        {
          mimeType: outputMimeType,
          quality: outputQuality,
          maxWidth: maxOutputWidth,
          maxHeight: maxOutputHeight,
        },
      );
      const nextPreviewUrl = URL.createObjectURL(file);

      if (localPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(localPreviewUrl);
      }
      if (sourceImage.startsWith("blob:")) {
        URL.revokeObjectURL(sourceImage);
      }

      setLocalPreviewUrl(nextPreviewUrl);
      setPreviewRemoved(false);
      setSourceImage("");
      onChange?.({ file, imageUrl: nextPreviewUrl, mediaId: value || 0 });
    } catch (applyError) {
      setCropError(applyError.message || "Görsel kırpılamadı.");
    } finally {
      setProcessing(false);
    }
  }

  function clearDraft() {
    if (sourceImage.startsWith("blob:")) {
      URL.revokeObjectURL(sourceImage);
    }
    setSourceImage("");
    setCropError("");
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  }

  function removePreview() {
    if (sourceImage.startsWith("blob:")) {
      URL.revokeObjectURL(sourceImage);
    }
    if (localPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(localPreviewUrl);
    }

    setSourceImage("");
    setLocalPreviewUrl("");
    setPreviewRemoved(true);
    setCropError("");
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    onRemove?.();
  }

  const previewUrl = localPreviewUrl || (previewRemoved ? "" : initialPreview);
  const hasPreview = Boolean(previewUrl);
  const isCropping = Boolean(sourceImage);
  const resolvedPreviewLabel = previewLabel || "Önizleme hazır";

  const resolvedHelperText = useMemo(() => {
    if (helperText) return helperText;
    if (value || previewUrl) {
      return "Kırpılmış görsel önizlemede görünüyor. Kaydettiğinizde seçili görsel kullanılacak.";
    }
    return "JPG, PNG, WEBP veya AVIF yükleyin. Görsel kayıttan önce kırpılır.";
  }, [helperText, previewUrl, value]);

  return (
    <div className="grid gap-2 text-sm font-medium text-ink">
      {label ? <span>{label}</span> : null}
      <input {...getInputProps()} />

      {!hasPreview && !isCropping ? (
        <div
          {...getRootProps()}
          className={cn(
            "grid min-h-36 place-items-center rounded-lg border border-dashed bg-white p-4 text-center transition",
            isDragActive
              ? "border-primary-dark bg-primary-soft"
              : "border-line hover:border-primary-dark hover:bg-primary-soft/50",
          )}
        >
          <div className="flex max-w-sm flex-col items-center gap-2">
            <div className="grid size-9 place-items-center rounded-md bg-primary-soft text-primary-dark">
              <ImagePlus aria-hidden="true" className="size-5" />
            </div>
            <div className="grid gap-1">
              <p className="font-semibold text-ink">Görseli sürükleyip bırakın</p>
              <p className="text-xs font-normal leading-5 text-muted">veya dosya seçerek kırpma adımına geçin.</p>
            </div>
            <Button onClick={open} size="sm" type="button" variant="outline">
              <UploadCloud aria-hidden="true" className="size-4" />
              Görsel seç
            </Button>
          </div>
        </div>
      ) : null}

      {hasPreview && !isCropping ? (
        <div className="rounded-lg border border-line bg-white p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className={cn("w-full max-w-[360px] overflow-hidden rounded-md border border-line bg-surface sm:w-72", aspectClassName)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={previewLabel || "Görsel önizlemesi"} className="h-full w-full object-cover" src={previewUrl} />
            </div>
            <div className="grid min-w-0 flex-1 gap-2">
              <p className="text-sm font-semibold text-ink">{resolvedPreviewLabel}</p>
              <p className="text-xs font-normal leading-5 text-muted">
                Görsel kaydetme sırasında yüklenecek. Oranı kontrol edip gerekirse değiştirebilirsiniz.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button onClick={open} size="sm" type="button" variant="outline">
                  <UploadCloud aria-hidden="true" className="size-4" />
                  Görseli değiştir
                </Button>
                {onRemove ? (
                  <Button className="text-destructive hover:text-destructive" onClick={removePreview} size="sm" type="button" variant="ghost">
                    <Trash2 aria-hidden="true" className="size-4" />
                    Görseli kaldır
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isCropping ? (
        <div className="grid gap-4 rounded-lg border border-line bg-white p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-ink">Görseli kırp</p>
              <p className="mt-1 text-xs font-normal leading-5 text-muted">{cropInstruction}</p>
            </div>
            <Button disabled={processing} onClick={open} size="sm" type="button" variant="outline">
              Başka görsel seç
            </Button>
          </div>

          <div className={cn("relative max-h-[320px] overflow-hidden rounded-md bg-ink/10", aspectClassName)}>
            <Cropper
              aspect={aspect}
              crop={crop}
              image={sourceImage}
              zoom={zoom}
              onCropChange={setCrop}
              onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
              onZoomChange={setZoom}
            />
          </div>

          <label className="grid gap-2 text-sm font-medium text-ink">
            <span>Yakınlaştırma</span>
            <input
              className="w-full accent-primary-dark"
              max={3}
              min={1}
              onChange={(event) => setZoom(Number(event.target.value))}
              step={0.1}
              type="range"
              value={zoom}
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <Button disabled={processing} onClick={applyCrop} size="sm" type="button">
              {processing ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : null}
              {processing ? "Hazırlanıyor" : "Kırp ve önizle"}
            </Button>
            <Button disabled={processing} onClick={clearDraft} size="sm" type="button" variant="ghost">
              <RotateCcw aria-hidden="true" className="size-4" />
              Vazgeç
            </Button>
          </div>
        </div>
      ) : null}

      <span className="text-xs font-normal leading-5 text-muted">{resolvedHelperText}</span>
      {error || cropError ? (
        <span className="text-xs font-semibold leading-5 text-destructive">{error || cropError}</span>
      ) : null}
    </div>
  );
}
