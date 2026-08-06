"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { DisclosureContent } from "@/components/site/disclosure/content";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

export function KvkkDialog({ onOpenChange, open }) {
  const t = useTranslations("Disclosure");
  const tSearch = useTranslations("Search");

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-400 flex items-center justify-center p-4 sm:p-6" role="presentation">
      <button
        aria-label={tSearch("close")}
        className="absolute inset-0 bg-black/25"
        onClick={() => onOpenChange(false)}
        type="button"
      />

      <div
        aria-describedby="kvkk-dialog-description"
        aria-labelledby="kvkk-dialog-title"
        aria-modal="true"
        className="relative z-10 grid max-h-[min(40rem,calc(100dvh-2rem))] w-full max-w-2xl overflow-hidden rounded-2xl border border-line/50 bg-white shadow-soft"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-6 sm:px-7">
          <div className="grid gap-2">
            <h2 className="text-lg font-semibold tracking-tight text-ink" id="kvkk-dialog-title">
              {t("title")}
            </h2>
            <p className="text-sm leading-6 text-muted" id="kvkk-dialog-description">
              {t("dialogDescription")}
            </p>
          </div>

          <button
            aria-label={tSearch("close")}
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-ink transition hover:bg-surface"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="relative">
          <div className="application-form-scroll max-h-[min(26rem,58dvh)] overflow-y-auto px-6 pb-8 sm:px-7">
            <DisclosureContent />
          </div>
          <ProgressiveBlur blurLevels={[0.4, 1, 2, 4]} className="h-8" height="2rem" position="bottom" />
        </div>
      </div>
    </div>,
    document.body,
  );
}
