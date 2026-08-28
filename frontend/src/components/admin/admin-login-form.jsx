"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AdminFormField } from "@/components/admin/common/admin-form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { adminLoginSchema } from "@/lib/form-schemas";

export function AdminLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    clearErrors,
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(adminLoginSchema),
  });

  async function onSubmit(values) {
    clearErrors("root");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3402"}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(values),
        },
      );

      if (!response.ok) {
        throw new Error(response.status === 401 ? "E-posta veya şifre hatalı." : "Giriş işlemi tamamlanamadı.");
      }

      toast.add({
        title: "Giriş başarılı",
        description: "Yönetim paneline yönlendiriliyorsunuz.",
        type: "success",
      });
      router.replace("/admin");
      router.refresh();
    } catch (error) {
      const message = error instanceof TypeError
        ? "Sunucuya bağlanılamadı. Lütfen kısa süre sonra yeniden deneyin."
        : error.message || "Giriş işlemi tamamlanamadı.";

      setError("root", { message });
      toast.add({ title: "Giriş yapılamadı", description: message, type: "error", priority: "high" });
    }
  }

  return (
    <form className="grid gap-5" noValidate onSubmit={handleSubmit(onSubmit)}>
      <AdminFormField error={errors.email?.message} label="E-posta">
        <Input
          aria-invalid={Boolean(errors.email)}
          autoComplete="email"
          autoFocus
          className="h-11 bg-white"
          placeholder="ornek@kurum.org"
          type="email"
          {...register("email")}
        />
      </AdminFormField>
      <AdminFormField error={errors.password?.message} label="Şifre">
        <div className="relative">
          <Input
            aria-invalid={Boolean(errors.password)}
            autoComplete="current-password"
            className="h-11 bg-white pr-11"
            placeholder="Şifrenizi girin"
            type={showPassword ? "text" : "password"}
            {...register("password")}
          />
          <Button
            aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
            className="absolute right-1.5 top-1.5 text-muted"
            onClick={() => setShowPassword((current) => !current)}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </Button>
        </div>
      </AdminFormField>

      {errors.root?.message ? (
        <p className="rounded-md border border-destructive/20 bg-destructive/[0.04] px-3 py-2.5 text-sm leading-5 text-destructive" role="alert">
          {errors.root.message}
        </p>
      ) : null}

      <Button className="group h-11 w-full bg-primary hover:bg-primary/90" disabled={isSubmitting} type="submit">
        {isSubmitting ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <LockKeyhole aria-hidden="true" />}
        {isSubmitting ? "Giriş yapılıyor" : "Giriş yap"}
        {!isSubmitting ? <ArrowRight aria-hidden="true" className="ml-auto transition-transform group-hover:translate-x-0.5" /> : null}
      </Button>

      <p className="text-center text-xs leading-5 text-muted">
        Bu alan yalnızca kurum tarafından yetkilendirilen kullanıcılar içindir.
      </p>
    </form>
  );
}
