"use client";

import { AdminFormField } from "@/components/admin/common/admin-form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HeroTranslateButton } from "./hero-translate-button";

export function HeroTextFields({ errors, getValues, register, setValue }) {
  return (
    <section className="grid gap-5 rounded-lg border border-line bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid gap-1">
          <h3 className="text-base font-semibold text-ink">Metin içerikleri</h3>
          <p className="text-sm leading-6 text-muted">
            Türkçe alanları doldurun, isterseniz İngilizce karşılıkları otomatik oluşturun.
          </p>
        </div>
        <HeroTranslateButton getValues={getValues} setValue={setValue} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="grid gap-4">
          <AdminFormField error={errors.titleTr?.message} label="Başlık (TR)">
            <Input
              {...register("titleTr")}
              aria-invalid={Boolean(errors.titleTr)}
              placeholder="Örn. Tüketici haklarınızı birlikte güçlendiriyoruz"
            />
          </AdminFormField>
          <AdminFormField error={errors.summaryTr?.message} label="Özet (TR)">
            <Textarea
              {...register("summaryTr")}
              aria-invalid={Boolean(errors.summaryTr)}
              className="min-h-32 resize-y"
              placeholder="Kısa, açıklayıcı ve kullanıcıyı yönlendiren bir özet yazın."
            />
          </AdminFormField>
          <AdminFormField error={errors.ctaLabelTr?.message} label="Buton metni (TR)">
            <Input
              {...register("ctaLabelTr")}
              aria-invalid={Boolean(errors.ctaLabelTr)}
              placeholder="Detayları incele"
            />
          </AdminFormField>
        </div>

        <div className="grid gap-4">
          <AdminFormField error={errors.titleEn?.message} label="Title (EN)">
            <Input
              {...register("titleEn")}
              aria-invalid={Boolean(errors.titleEn)}
              placeholder="E.g. We strengthen your consumer rights together"
            />
          </AdminFormField>
          <AdminFormField error={errors.summaryEn?.message} label="Summary (EN)">
            <Textarea
              {...register("summaryEn")}
              aria-invalid={Boolean(errors.summaryEn)}
              className="min-h-32 resize-y"
              placeholder="Write a short summary that supports the action."
            />
          </AdminFormField>
          <AdminFormField error={errors.ctaLabelEn?.message} label="Button label (EN)">
            <Input
              {...register("ctaLabelEn")}
              aria-invalid={Boolean(errors.ctaLabelEn)}
              placeholder="Review details"
            />
          </AdminFormField>
        </div>
      </div>
    </section>
  );
}
