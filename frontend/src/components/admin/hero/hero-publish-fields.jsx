"use client";

import { Eye, EyeOff } from "lucide-react";
import { Controller } from "react-hook-form";
import { AdminFormField } from "@/components/admin/common/admin-form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function HeroPublishFields({ control, errors, register }) {
  return (
    <section className="grid gap-4 rounded-lg border border-line bg-white p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="grid gap-1">
          <h3 className="text-base font-semibold text-ink">Yayın ayarları</h3>
          <p className="text-sm leading-6 text-muted">Sıralama ve görünürlük bilgisini düzenleyin.</p>
        </div>

        <AdminFormField
          className="w-full md:w-44"
          error={errors.sortOrder?.message}
          hint="Küçük sayı önce gösterilir."
          label="Sıra"
        >
          <Input
            {...register("sortOrder", { valueAsNumber: true })}
            aria-invalid={Boolean(errors.sortOrder)}
            min={0}
            type="number"
          />
        </AdminFormField>
      </div>

      <Controller
        control={control}
        name="isActive"
        render={({ field }) => {
          const active = Boolean(field.value);
          const StatusIcon = active ? Eye : EyeOff;

          return (
            <button
              className={cn(
                "focus-ring flex w-full items-center justify-between gap-4 rounded-lg border px-4 py-3 text-left transition",
                active
                  ? "border-secondary/40 bg-secondary-soft/80"
                  : "border-line bg-surface hover:bg-primary-soft/50",
              )}
              onClick={() => field.onChange(!active)}
              type="button"
            >
              <span className="flex min-w-0 items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 grid size-9 shrink-0 place-items-center rounded-md",
                    active ? "bg-white text-secondary-dark" : "bg-white text-muted",
                  )}
                >
                  <StatusIcon aria-hidden="true" className="size-4" />
                </span>
                <span className="grid gap-1">
                  <span className="text-sm font-semibold text-ink">
                    {active ? "Hero yayında" : "Hero pasif"}
                  </span>
                  <span className="text-xs leading-5 text-muted">
                    {active
                      ? "Bu kayıt anasayfa hero carousel alanında gösterilir."
                      : "Kayıt panelde kalır ancak anasayfada görünmez."}
                  </span>
                </span>
              </span>
              <Checkbox checked={active} className="pointer-events-none shrink-0" />
            </button>
          );
        }}
      />
    </section>
  );
}
