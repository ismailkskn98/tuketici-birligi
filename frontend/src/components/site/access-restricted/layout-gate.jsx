"use client";

import { usePathname } from "@/i18n/navigation";

const ALLOWED_ROUTES = new Set(["/", "/sss", "/basvuru-yap", "/iletisim", "/yonetim-kurulu"]);

function normalizePathname(pathname) {
  if (!pathname) return "/";

  const normalizedPath = pathname !== "/" ? pathname.replace(/\/+$/, "") : pathname;
  const pathWithoutLocale = normalizedPath.replace(/^\/(tr|en)(?=\/|$)/, "") || "/";

  return pathWithoutLocale;
}

export function PublicAccessGate({ children, fallback }) {
  const pathname = usePathname();
  const normalizedPath = normalizePathname(pathname);
  const isAllowedRoute = ALLOWED_ROUTES.has(normalizedPath);

  return isAllowedRoute ? children : fallback;
}
