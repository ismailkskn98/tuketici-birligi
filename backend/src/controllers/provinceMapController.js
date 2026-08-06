const { z } = require("zod");
const pool = require("../db/pool");
const { getProvinceName, provinces } = require("../constants/provinces");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

const categoryLabels = {
  news: "Haber",
  announcement: "Duyuru",
  guide: "Rehber",
  activity: "Faaliyet"
};

const entrySchema = z.object({
  locale: z.string().trim().min(2).max(8).default("tr"),
  provinceCode: z.coerce.number().int().min(1).max(81),
  title: z.string().trim().min(2).max(220),
  summary: z.string().trim().max(4000).optional().or(z.literal("")),
  category: z.enum(["news", "announcement", "guide", "activity"]).default("news"),
  contentItemId: z.coerce.number().int().positive().optional().nullable(),
  linkLabel: z.string().trim().max(80).optional().or(z.literal("")),
  linkHref: z.string().trim().max(500).optional().or(z.literal("")),
  eventDate: z.string().optional().nullable(),
  status: z.enum(["draft", "published"]).default("draft"),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0)
});

function contentHref(type, slug) {
  if (!slug) return "";
  if (type === "guide") return `/hak-rehberleri/${slug}`;
  if (type === "news") return `/haberler/${slug}`;
  if (type === "announcement") return "/duyurular";
  return "";
}

function mapRow(row) {
  const generatedHref = contentHref(row.content_type, row.content_slug);
  const linkHref = row.link_href || generatedHref;
  const category = row.category || row.content_type || "news";

  return {
    id: row.id,
    locale: row.locale,
    provinceCode: row.province_code,
    provinceName: row.province_name,
    title: row.title,
    summary: row.summary,
    category,
    categoryLabel: categoryLabels[category] || "İçerik",
    contentItemId: row.content_item_id,
    linkLabel: row.link_label || (category === "guide" ? "Rehbere git" : "Habere git"),
    linkHref,
    eventDate: row.event_date,
    status: row.status,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function ensureContentExists(contentItemId, locale) {
  if (!contentItemId) return null;

  const [rows] = await pool.execute(
    `SELECT id, type, slug, title
     FROM content_items
     WHERE id = ? AND locale = ?
     LIMIT 1`,
    [contentItemId, locale]
  );

  if (!rows[0]) {
    throw httpError(422, "Seçilen içerik bulunamadı.");
  }

  return rows[0];
}

function normalizePayload(values) {
  const provinceName = getProvinceName(values.provinceCode);

  if (!provinceName) {
    throw httpError(422, "Geçerli bir il seçmelisiniz.");
  }

  return {
    ...values,
    provinceName,
    contentItemId: values.contentItemId || null,
    eventDate: values.eventDate || null,
    linkHref: values.linkHref || "",
    linkLabel: values.linkLabel || ""
  };
}

async function readEntries({ locale = "tr", includeDrafts = false } = {}) {
  const params = [locale];
  let where = "WHERE pme.locale = ?";

  if (!includeDrafts) {
    where += " AND pme.status = 'published'";
  }

  const [rows] = await pool.execute(
    `SELECT pme.*, ci.type AS content_type, ci.slug AS content_slug
     FROM province_map_entries pme
     LEFT JOIN content_items ci ON ci.id = pme.content_item_id
     ${where}
     ORDER BY pme.sort_order ASC, pme.event_date DESC, pme.id DESC`,
    params
  );

  return rows.map(mapRow);
}

function buildSummary(entries) {
  const provincesMap = {};
  const categoryCounts = {};

  for (const province of provinces) {
    provincesMap[province.code] = {
      code: province.code,
      name: province.name,
      count: 0,
      entries: []
    };
  }

  for (const entry of entries) {
    provincesMap[entry.provinceCode].count += 1;
    provincesMap[entry.provinceCode].entries.push(entry);
    categoryCounts[entry.category] = (categoryCounts[entry.category] || 0) + 1;
  }

  return {
    provinces: Object.values(provincesMap),
    latestEntries: entries.slice(0, 6),
    stats: {
      totalEntries: entries.length,
      activeProvinceCount: Object.values(provincesMap).filter((province) => province.count > 0).length,
      categoryCounts
    }
  };
}

const getPublicProvinceMap = asyncHandler(async (req, res) => {
  const locale = req.query.locale || "tr";
  const entries = await readEntries({ locale, includeDrafts: false });
  res.json(buildSummary(entries));
});

const listProvinceMapEntries = asyncHandler(async (req, res) => {
  const locale = req.query.locale || "tr";
  const entries = await readEntries({ locale, includeDrafts: true });
  res.json({ items: entries, provinces });
});

const createProvinceMapEntry = asyncHandler(async (req, res) => {
  const values = normalizePayload(entrySchema.parse(req.body));
  await ensureContentExists(values.contentItemId, values.locale);

  const [result] = await pool.execute(
    `INSERT INTO province_map_entries
      (locale, province_code, province_name, title, summary, category, content_item_id,
       link_label, link_href, event_date, status, sort_order, created_by, updated_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      values.locale,
      values.provinceCode,
      values.provinceName,
      values.title,
      values.summary || null,
      values.category,
      values.contentItemId,
      values.linkLabel || null,
      values.linkHref || null,
      values.eventDate,
      values.status,
      values.sortOrder,
      req.user.id,
      req.user.id
    ]
  );

  res.status(201).json({ id: result.insertId });
});

const updateProvinceMapEntry = asyncHandler(async (req, res) => {
  const values = entrySchema.partial().parse(req.body);
  const [currentRows] = await pool.execute(
    "SELECT * FROM province_map_entries WHERE id = ? LIMIT 1",
    [req.params.id]
  );

  if (!currentRows[0]) {
    throw httpError(404, "Harita kaydı bulunamadı.");
  }

  const current = currentRows[0];
  const next = normalizePayload({
    locale: values.locale ?? current.locale,
    provinceCode: values.provinceCode ?? current.province_code,
    title: values.title ?? current.title,
    summary: values.summary ?? current.summary ?? "",
    category: values.category ?? current.category,
    contentItemId: values.contentItemId === undefined ? current.content_item_id : values.contentItemId,
    linkLabel: values.linkLabel ?? current.link_label ?? "",
    linkHref: values.linkHref ?? current.link_href ?? "",
    eventDate: values.eventDate === undefined ? current.event_date : values.eventDate,
    status: values.status ?? current.status,
    sortOrder: values.sortOrder ?? current.sort_order
  });

  await ensureContentExists(next.contentItemId, next.locale);

  await pool.execute(
    `UPDATE province_map_entries
     SET locale = ?, province_code = ?, province_name = ?, title = ?, summary = ?,
         category = ?, content_item_id = ?, link_label = ?, link_href = ?,
         event_date = ?, status = ?, sort_order = ?, updated_by = ?
     WHERE id = ?`,
    [
      next.locale,
      next.provinceCode,
      next.provinceName,
      next.title,
      next.summary || null,
      next.category,
      next.contentItemId,
      next.linkLabel || null,
      next.linkHref || null,
      next.eventDate,
      next.status,
      next.sortOrder,
      req.user.id,
      req.params.id
    ]
  );

  res.json({ ok: true });
});

const deleteProvinceMapEntry = asyncHandler(async (req, res) => {
  await pool.execute("DELETE FROM province_map_entries WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

module.exports = {
  createProvinceMapEntry,
  deleteProvinceMapEntry,
  getPublicProvinceMap,
  listProvinceMapEntries,
  updateProvinceMapEntry
};
