import {
  fallbackContents,
  fallbackSettings,
  getFallbackContent,
  getFallbackHeroSlides,
  getFallbackProvinceMap
} from "./fallback-data";

const apiBaseUrl =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:3402";

async function request(path, options = {}) {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      next: options.next,
      cache: options.cache || "no-store"
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  } catch {
    return null;
  }
}

export async function getSiteSettings(locale = "tr") {
  const data = await request(`/api/public/site-settings?locale=${locale}`);
  return data?.settings || fallbackSettings;
}

export async function getHomeData(locale = "tr") {
  const data = await request(`/api/public/home?locale=${locale}`);

  if (data) return data;

  return {
    settings: fallbackSettings,
    heroSlides: getFallbackHeroSlides(locale),
    guides: getFallbackContent("guide", locale),
    news: getFallbackContent("news", locale),
    announcements: getFallbackContent("announcement", locale)
  };
}

export async function getContents({ type, locale = "tr", page = 1 } = {}) {
  const params = new URLSearchParams({ locale, page: String(page) });

  if (type) params.set("type", type);

  const data = await request(`/api/public/content?${params.toString()}`);
  return data?.items || (type ? getFallbackContent(type, locale) : fallbackContents);
}

export async function getContentBySlug(slug, locale = "tr") {
  const data = await request(`/api/public/content/${slug}?locale=${locale}`);

  if (data?.item) return data.item;

  return fallbackContents.find(
    (content) => content.slug === slug && content.locale === locale
  );
}

export async function getProvinceMap(locale = "tr") {
  const data = await request(`/api/public/province-map?locale=${locale}`);
  return data || getFallbackProvinceMap();
}

export function getClientApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3402";
}
