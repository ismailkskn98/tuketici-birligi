"use client";

import { useState } from "react";
import { AdminFormField } from "@/components/admin/common/admin-form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminLoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3402"}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password")
        })
      }
    );

    setLoading(false);

    if (!response.ok) {
      setError("E-posta veya şifre hatalı.");
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <form className="grid gap-4 rounded-lg border border-line bg-white p-6 shadow-soft" onSubmit={onSubmit}>
      <AdminFormField label="E-posta">
        <Input name="email" type="email" autoComplete="email" required />
      </AdminFormField>
      <AdminFormField label="Şifre">
        <Input
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </AdminFormField>
      {error ? <p className="text-sm font-semibold text-red-700">{error}</p> : null}
      <Button disabled={loading} type="submit">
        {loading ? "Giriş yapılıyor" : "Giriş Yap"}
      </Button>
    </form>
  );
}
