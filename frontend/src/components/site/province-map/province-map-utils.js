import { provinces as provinceList } from "@/lib/provinces";

export const PROVINCE_MAP_COLORS = {
  high: "#870b18",
  medium: "#9fb8f4",
  empty: "#dbe3ef",
  hover: "#f4cf62",
};

export const DENSITY_FILTERS = [
  { id: "all", label: "Tümü" },
  { id: "high", label: "Yoğun içerik" },
  { id: "medium", label: "Orta düzey" },
  { id: "empty", label: "Kayıt bulunmuyor" },
];

export const emptyProvinceData = {
  count: 0,
  entries: [],
};

export function formatCount(value) {
  return Number(value || 0).toLocaleString("tr-TR");
}

export function formatCompactDate(dateValue, locale = "tr") {
  if (!dateValue) return "";

  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateValue));
}

export function getProvinceColor(count) {
  if (count >= 3) return PROVINCE_MAP_COLORS.high;
  if (count >= 1) return PROVINCE_MAP_COLORS.medium;
  return PROVINCE_MAP_COLORS.empty;
}

export function matchesDensityFilter(count, filterId) {
  if (filterId === "all") return true;
  if (filterId === "high") return count >= 3;
  if (filterId === "medium") return count >= 1 && count < 3;
  if (filterId === "empty") return count === 0;
  return true;
}

export function normalizeProvinceMap(data) {
  const provinceDataByCode = new Map(
    (data?.provinces || []).map((province) => [
      Number(province.code),
      {
        ...province,
        code: Number(province.code),
        name: province.name,
        count: province.count || province.entries?.length || 0,
        entries: province.entries || [],
      },
    ]),
  );

  return provinceList.map((province) => {
    const apiProvince = provinceDataByCode.get(province.code);

    return {
      ...province,
      ...apiProvince,
      name: apiProvince?.name || province.name,
      count: apiProvince?.count || 0,
      entries: apiProvince?.entries || [],
    };
  });
}

export function getProvinceMapCategoryCount(provinces) {
  const categories = new Set();

  provinces.forEach((province) => {
    province.entries.forEach((entry) => {
      const category = entry.categoryLabel || entry.category;
      if (category) categories.add(category);
    });
  });

  return categories.size;
}
