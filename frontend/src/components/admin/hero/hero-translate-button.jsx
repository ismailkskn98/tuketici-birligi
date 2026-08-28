"use client";

import { Languages, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { translateHeroSlide } from "@/lib/admin-api";

export function HeroTranslateButton({ getValues, setValue }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTranslate() {
    const title = getValues("titleTr");
    const summary = getValues("summaryTr");
    const ctaLabel = getValues("ctaLabelTr");

    if (!title?.trim()) {
      setError("Önce Türkçe başlığı doldurun.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const translated = await translateHeroSlide({
        title,
        summary,
        ctaLabel,
        sourceLocale: "tr",
        targetLocale: "en"
      });

      setValue("titleEn", translated.title, { shouldDirty: true, shouldValidate: true });
      setValue("summaryEn", translated.summary || "", {
        shouldDirty: true,
        shouldValidate: true
      });
      setValue("ctaLabelEn", translated.ctaLabel || "", {
        shouldDirty: true,
        shouldValidate: true
      });
      toast.add({
        title: "Çeviri tamamlandı",
        description: "İngilizce hero alanları otomatik çeviriyle güncellendi.",
        type: "success",
      });
    } catch (translateError) {
      const message = translateError.message || "Otomatik çeviri yapılamadı.";
      setError(message);
      toast.add({ title: "Çeviri yapılamadı", description: message, type: "error", priority: "high" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-2">
      <Button className="w-full sm:w-auto" disabled={loading} onClick={handleTranslate} type="button" variant="outline">
        {loading ? (
          <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          <Languages aria-hidden="true" className="size-4" />
        )}
        {loading ? "Çevriliyor" : "TR -> EN çevir"}
      </Button>
      {error ? <p className="text-xs font-semibold text-red-700">{error}</p> : null}
    </div>
  );
}
