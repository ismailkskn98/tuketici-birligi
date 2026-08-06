"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CustomButton } from "@/components/common/custom-button";
import { Field, inputClassName } from "@/components/ui/field";
import { contactSchema } from "@/lib/form-schemas";
import { getClientApiBaseUrl } from "@/lib/api";

export function ContactForm() {
  const [status, setStatus] = useState("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      privacy: false,
      companyName: ""
    }
  });

  async function onSubmit(values) {
    setStatus("idle");
    const response = await fetch(`${getClientApiBaseUrl()}/api/public/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    reset();
    setStatus("success");
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("companyName")}
        autoComplete="off"
        className="hidden"
        tabIndex={-1}
        type="text"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Field error={errors.fullName?.message} label="Ad Soyad">
          <input className={inputClassName()} {...register("fullName")} autoComplete="name" />
        </Field>
        <Field error={errors.email?.message} label="E-posta">
          <input className={inputClassName()} {...register("email")} autoComplete="email" type="email" />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field error={errors.phone?.message} label="Telefon">
          <input className={inputClassName()} {...register("phone")} autoComplete="tel" />
        </Field>
        <Field error={errors.subject?.message} label="Konu">
          <input className={inputClassName()} {...register("subject")} />
        </Field>
      </div>

      <Field error={errors.message?.message} label="Mesajınız">
        <textarea className={inputClassName("min-h-32 resize-y")} {...register("message")} />
      </Field>

      <label className="flex items-start gap-3 text-sm leading-6 text-muted">
        <input className="mt-1 size-4 accent-primary-dark" type="checkbox" {...register("privacy")} />
        <span>Kişisel verilerimin iletişim talebim kapsamında işlenmesine ilişkin aydınlatma metnini okudum.</span>
      </label>
      {errors.privacy ? (
        <p className="text-xs font-semibold text-red-700">{errors.privacy.message}</p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <CustomButton disabled={isSubmitting} type="submit">
          <Send size={18} aria-hidden="true" />
          {isSubmitting ? "Gönderiliyor" : "Mesaj Gönder"}
        </CustomButton>
        {status === "success" ? (
          <p className="text-sm font-semibold text-secondary-dark">Mesajınız alındı.</p>
        ) : null}
        {status === "error" ? (
          <p className="text-sm font-semibold text-red-700">Mesaj gönderilemedi. Lütfen tekrar deneyin.</p>
        ) : null}
      </div>
    </form>
  );
}
