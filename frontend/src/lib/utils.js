import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const DATE_LOCALES = {
  tr: "tr-TR",
  en: "en-GB",
};

export function formatDate(dateValue, locale = "tr") {
  if (!dateValue) return "";

  const resolved = DATE_LOCALES[locale] || locale;

  return new Intl.DateTimeFormat(resolved, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateValue));
}

export function absoluteUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3601";
  return new URL(path, base).toString();
}
