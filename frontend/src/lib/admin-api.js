"use client";

import { getClientApiBaseUrl } from "./api";

const API_BASE_URL = getClientApiBaseUrl();

async function parseResponseBody(response) {
  return response.json().catch(() => null);
}

function getErrorMessage(response, data) {
  if (response.status === 401) {
    return "Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.";
  }

  if (response.status === 403) {
    return "Bu işlem için yetkiniz bulunmuyor.";
  }

  return data?.message || "İşlem tamamlanamadı.";
}

async function adminRequest(path, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...options.headers
      }
    });

    const data = await parseResponseBody(response);

    if (!response.ok) {
      throw new Error(getErrorMessage(response, data));
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("API bağlantısı kurulamadı. Backend çalışıyor mu ve CORS ayarları frontend portuyla uyumlu mu kontrol edin.");
    }

    throw error;
  }
}

async function publicRequest(path, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...options.headers
      }
    });

    const data = await parseResponseBody(response);

    if (!response.ok) {
      throw new Error(getErrorMessage(response, data));
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("API bağlantısı kurulamadı. Backend servisinin çalıştığını kontrol edin.");
    }

    throw error;
  }
}

export function listHeroSlides() {
  return adminRequest("/api/admin/hero-slides");
}

export function createHeroSlide(values) {
  return adminRequest("/api/admin/hero-slides", {
    method: "POST",
    body: JSON.stringify(values)
  });
}

export function updateHeroSlide(id, values) {
  return adminRequest(`/api/admin/hero-slides/${id}`, {
    method: "PATCH",
    body: JSON.stringify(values)
  });
}

export function deleteHeroSlide(id) {
  return adminRequest(`/api/admin/hero-slides/${id}`, {
    method: "DELETE"
  });
}

export function listProvinceMapEntries({ locale = "tr" } = {}) {
  const params = new URLSearchParams({ locale });
  return adminRequest(`/api/admin/province-map?${params.toString()}`);
}

export function createProvinceMapEntry(values) {
  return adminRequest("/api/admin/province-map", {
    method: "POST",
    body: JSON.stringify(values)
  });
}

export function updateProvinceMapEntry(id, values) {
  return adminRequest(`/api/admin/province-map/${id}`, {
    method: "PATCH",
    body: JSON.stringify(values)
  });
}

export function deleteProvinceMapEntry(id) {
  return adminRequest(`/api/admin/province-map/${id}`, {
    method: "DELETE"
  });
}

export function translateHeroSlide(values) {
  return adminRequest("/api/admin/hero-slides/translate", {
    method: "POST",
    body: JSON.stringify(values)
  });
}

export function uploadAdminMedia(formData) {
  return adminRequest("/api/admin/media", {
    method: "POST",
    body: formData
  });
}

export function listFormSubmissions({ formType = "", q = "", status = "" } = {}) {
  const params = new URLSearchParams();

  if (formType) params.set("formType", formType);
  if (q) params.set("q", q);
  if (status) params.set("status", status);

  const query = params.toString();
  return adminRequest(`/api/admin/form-submissions${query ? `?${query}` : ""}`);
}

export function updateFormSubmission(id, values) {
  return adminRequest(`/api/admin/form-submissions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(values)
  });
}

export function listContentItems({ type = "", locale = "" } = {}) {
  const params = new URLSearchParams();

  if (type) params.set("type", type);
  if (locale) params.set("locale", locale);

  const query = params.toString();
  return adminRequest(`/api/admin/content${query ? `?${query}` : ""}`);
}

export function createContentItem(values) {
  return adminRequest("/api/admin/content", {
    method: "POST",
    body: JSON.stringify(values)
  });
}

export function updateContentItem(id, values) {
  return adminRequest(`/api/admin/content/${id}`, {
    method: "PATCH",
    body: JSON.stringify(values)
  });
}

export function deleteContentItem(id) {
  return adminRequest(`/api/admin/content/${id}`, {
    method: "DELETE"
  });
}

export function listPublicContent({ locale = "tr", limit = 50 } = {}) {
  const params = new URLSearchParams({
    locale,
    limit: String(limit),
  });

  return publicRequest(`/api/public/content?${params.toString()}`);
}
