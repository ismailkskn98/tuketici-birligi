"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Controller, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { CustomButton } from "@/components/common/custom-button";
import { Field, inputClassName } from "@/components/ui/field";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { getClientApiBaseUrl } from "@/lib/api";
import { APPLICATION_CATEGORIES, createApplicationSchema } from "@/lib/form-schemas";
import { cn } from "@/lib/utils";
import { ApplicationFileUpload } from "./file-upload";

const KvkkDialog = dynamic(
  () => import("./kvkk-dialog").then((mod) => ({ default: mod.KvkkDialog })),
  { ssr: false },
);

function FormSection({ index, title, children }) {
  return (
    <section className="grid gap-5">
      <div className="flex items-center gap-3">
        <span className="grid size-7 place-items-center rounded-full bg-ink text-xs font-semibold text-white">
          {index}
        </span>
        <h3 className="text-base font-semibold tracking-tight text-ink">{title}</h3>
      </div>
      {children}
    </section>
  );
}

export function ApplicationForm({ className }) {
  const t = useTranslations("ApplicationForm");
  const [status, setStatus] = useState("idle");
  const [applicationNumber, setApplicationNumber] = useState("");
  const [files, setFiles] = useState([]);
  const [kvkkOpen, setKvkkOpen] = useState(false);

  const schema = useMemo(
    () =>
      createApplicationSchema({
        fullName: t("errors.fullName"),
        phone: t("errors.phone"),
        email: t("errors.email"),
        category: t("errors.category"),
        companyName: t("errors.companyName"),
        message: t("errors.message"),
        privacy: t("errors.privacy"),
        contact: t("errors.contact"),
      }),
    [t],
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      category: "",
      companyName: "",
      purchaseDate: "",
      productName: "",
      requestedAmount: "",
      message: "",
      privacyConsent: false,
      contactConsent: false,
      website: "",
    },
  });

  async function onSubmit(values) {
    setStatus("idle");
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        formData.append(key, value ? "true" : "false");
        return;
      }

      formData.append(key, String(value ?? ""));
    });

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch(`${getClientApiBaseUrl()}/api/public/pre-applications`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setStatus("error");
      return;
    }

    reset();
    setFiles([]);
    setApplicationNumber(data?.applicationNumber || "");
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className={cn("grid gap-4 rounded-2xl border border-line/60 bg-surface/60 px-5 py-8 text-center sm:px-8", className)}>
        <p className="text-lg font-semibold text-ink">{t("successTitle")}</p>
        <p className="text-sm leading-6 text-muted">{t("successText")}</p>
        {applicationNumber ? (
          <div className="mx-auto mt-2 grid max-w-sm gap-1 rounded-xl bg-white px-5 py-4">
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted">{t("applicationNo")}</span>
            <strong className="font-heading text-xl tracking-wide text-ink">{applicationNumber}</strong>
          </div>
        ) : null}
        <div className="mt-2">
          <CustomButton
            onClick={() => {
              setStatus("idle");
              setApplicationNumber("");
            }}
            type="button"
            variant="outline"
          >
            {t("newApplication")}
          </CustomButton>
        </div>
      </div>
    );
  }

  return (
    <form className={cn("grid gap-8", className)} onSubmit={handleSubmit(onSubmit)}>
      <input {...register("website")} autoComplete="off" className="hidden" tabIndex={-1} type="text" />

      <FormSection index="1" title={t("sections.personal")}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field error={errors.fullName?.message} label={`${t("fields.fullName")} *`}>
            <input autoComplete="name" className={inputClassName()} {...register("fullName")} />
          </Field>
          <Field error={errors.phone?.message} label={`${t("fields.phone")} *`}>
            <input autoComplete="tel" className={inputClassName()} {...register("phone")} />
          </Field>
          <div className="md:col-span-2">
            <Field error={errors.email?.message} label={`${t("fields.email")} *`}>
              <input autoComplete="email" className={inputClassName()} type="email" {...register("email")} />
            </Field>
          </div>
        </div>
      </FormSection>

      <FormSection index="2" title={t("sections.details")}>
        <div className="grid gap-4 md:grid-cols-2">
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Field error={errors.category?.message} label={`${t("fields.category")} *`}>
                <NativeSelect className="h-11" onChange={field.onChange} value={field.value}>
                  <NativeSelectOption value="">{t("fields.categoryPlaceholder")}</NativeSelectOption>
                  {APPLICATION_CATEGORIES.map((category) => (
                    <NativeSelectOption key={category} value={category}>
                      {t(`categories.${category}`)}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>
            )}
          />
          <Field error={errors.companyName?.message} label={`${t("fields.companyName")} *`}>
            <input className={inputClassName()} {...register("companyName")} />
          </Field>
          <Field label={t("fields.purchaseDate")}>
            <input className={inputClassName()} type="date" {...register("purchaseDate")} />
          </Field>
          <Field label={t("fields.productName")}>
            <input className={inputClassName()} {...register("productName")} />
          </Field>
          <Field label={t("fields.requestedAmount")}>
            <input className={inputClassName()} inputMode="decimal" {...register("requestedAmount")} />
          </Field>
          <div className="md:col-span-2">
            <Field error={errors.message?.message} label={`${t("fields.message")} *`}>
              <textarea
                className={inputClassName("min-h-40 resize-y")}
                placeholder={t("fields.messagePlaceholder")}
                {...register("message")}
              />
            </Field>
          </div>
        </div>
      </FormSection>

      <FormSection index="3" title={t("sections.files")}>
        <ApplicationFileUpload files={files} onChange={setFiles} t={t} />
      </FormSection>

      <FormSection index="4" title={t("sections.consents")}>
        <div className="grid gap-3">
          <div className="flex items-start gap-3 text-sm leading-6 text-muted">
            <input className="mt-1 size-4 accent-primary-dark" type="checkbox" {...register("privacyConsent")} />
            <p>
              {t("fields.privacyBefore") ? `${t("fields.privacyBefore")} ` : null}
              <button
                className="font-medium text-ink underline decoration-line underline-offset-4 transition hover:text-secondary-dark"
                onClick={() => setKvkkOpen(true)}
                type="button"
              >
                {t("fields.privacyLink")}
              </button>
              {t("fields.privacyAfter") ? ` ${t("fields.privacyAfter")}` : null}
            </p>
          </div>
          {errors.privacyConsent ? <p className="text-xs font-semibold text-red-700">{errors.privacyConsent.message}</p> : null}

          <label className="flex items-start gap-3 text-sm leading-6 text-muted">
            <input className="mt-1 size-4 accent-primary-dark" type="checkbox" {...register("contactConsent")} />
            <span>{t("fields.contact")}</span>
          </label>
          {errors.contactConsent ? <p className="text-xs font-semibold text-red-700">{errors.contactConsent.message}</p> : null}
        </div>
      </FormSection>

      <KvkkDialog onOpenChange={setKvkkOpen} open={kvkkOpen} />

      <div className="flex flex-wrap items-center gap-3">
        <CustomButton disabled={isSubmitting} type="submit">
          <Send aria-hidden="true" size={18} />
          {isSubmitting ? t("submitting") : t("submit")}
        </CustomButton>
        {status === "error" ? <p className="text-sm font-semibold text-red-700">{t("error")}</p> : null}
      </div>
    </form>
  );
}
