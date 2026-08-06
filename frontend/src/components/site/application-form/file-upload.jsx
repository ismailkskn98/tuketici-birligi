"use client";

import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_FILES = 8;
const ACCEPT = {
  "application/pdf": [".pdf"],
  "image/avif": [".avif"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FilePreviewItem({ file, onRemove }) {
  const [previewUrl, setPreviewUrl] = useState("");
  const isImage = file.type.startsWith("image/");

  useEffect(() => {
    if (!isImage) return undefined;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file, isImage]);

  return (
    <li className="flex items-center gap-3 rounded-xl border border-line/60 bg-white px-3 py-2.5">
      {isImage && previewUrl ? (
        <img alt="" className="size-11 shrink-0 rounded-lg object-cover" src={previewUrl} />
      ) : (
        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-surface text-muted">
          <FileText aria-hidden="true" className="size-4" />
        </span>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{file.name}</p>
        <p className="text-xs text-muted">{formatFileSize(file.size)}</p>
      </div>

      <button
        aria-label={file.name}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-surface hover:text-ink"
        onClick={onRemove}
        type="button"
      >
        <X aria-hidden="true" className="size-3.5" />
      </button>
    </li>
  );
}

export function ApplicationFileUpload({ files, onChange, t }) {
  const remaining = MAX_FILES - files.length;
  const isFull = remaining <= 0;

  const { getInputProps, getRootProps, isDragActive, isDragReject } = useDropzone({
    accept: ACCEPT,
    disabled: isFull,
    maxFiles: remaining,
    multiple: true,
    onDrop: (acceptedFiles) => {
      if (!acceptedFiles.length) return;
      onChange([...files, ...acceptedFiles].slice(0, MAX_FILES));
    },
  });

  function removeFile(index) {
    onChange(files.filter((_, fileIndex) => fileIndex !== index));
  }

  return (
    <div className="grid gap-3">
      <div
        {...getRootProps()}
        className={cn(
          "cursor-pointer rounded-2xl border border-line/70 bg-surface/40 px-5 py-8 text-center transition",
          isDragActive && !isDragReject && "border-ink/30 bg-surface",
          isDragReject && "border-red-300 bg-red-50/60",
          isFull && "cursor-not-allowed opacity-60",
        )}
      >
        <input {...getInputProps()} />
        <span className="mx-auto mb-3 grid size-10 place-items-center rounded-full border border-line/70 bg-white text-ink">
          <Upload aria-hidden="true" className="size-4" />
        </span>
        <p className="text-sm font-medium text-ink">
          {isFull ? t("fields.filesFull") : isDragActive ? t("fields.filesDrop") : t("fields.filesTitle")}
        </p>
        <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-muted">{t("fields.filesHint")}</p>
      </div>

      {files.length ? (
        <ul className="grid gap-2">
          {files.map((file, index) => (
            <FilePreviewItem file={file} key={`${file.name}-${file.size}-${file.lastModified}-${index}`} onRemove={() => removeFile(index)} />
          ))}
        </ul>
      ) : null}
    </div>
  );
}
