const { z } = require("zod");
const pool = require("../db/pool");
const asyncHandler = require("../utils/asyncHandler");
const { slugify } = require("../utils/clean");
const httpError = require("../utils/httpError");

const contentSchema = z.object({
  type: z.enum(["page", "news", "announcement", "guide", "legal", "faq"]),
  locale: z.string().trim().min(2).max(8).default("tr"),
  title: z.string().trim().min(2).max(220),
  slug: z.string().trim().max(220).optional().or(z.literal("")),
  summary: z.string().trim().max(4000).optional().or(z.literal("")),
  body: z.string().trim().max(500000).optional().or(z.literal("")),
  status: z.enum(["draft", "published"]).default("draft"),
  isFeatured: z.boolean().optional().default(false),
  publishedAt: z.string().optional().nullable(),
  metaTitle: z.string().trim().max(220).optional().or(z.literal("")),
  metaDescription: z.string().trim().max(320).optional().or(z.literal("")),
  sortOrder: z.number().int().optional().default(0)
});

function mapRow(row) {
  return {
    id: row.id,
    type: row.type,
    locale: row.locale,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    body: row.body,
    status: row.status,
    isFeatured: Boolean(row.is_featured),
    publishedAt: row.published_at,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    sortOrder: row.sort_order
  };
}

const listContent = asyncHandler(async (req, res) => {
  const params = [];
  const where = [];

  if (req.query.type) {
    contentSchema.shape.type.parse(req.query.type);
    where.push("type = ?");
    params.push(req.query.type);
  }

  if (req.query.locale) {
    contentSchema.shape.locale.parse(req.query.locale);
    where.push("locale = ?");
    params.push(req.query.locale);
  }

  const [rows] = await pool.execute(
    `SELECT * FROM content_items
     ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
     ORDER BY updated_at DESC, id DESC
     LIMIT 200`,
    params
  );

  res.json({ items: rows.map(mapRow) });
});

const createContent = asyncHandler(async (req, res) => {
  const values = contentSchema.parse(req.body);
  const slug = values.slug ? slugify(values.slug) : slugify(values.title);

  const [result] = await pool.execute(
    `INSERT INTO content_items
      (type, locale, title, slug, summary, body, status, is_featured, published_at,
       meta_title, meta_description, sort_order, created_by, updated_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      values.type,
      values.locale,
      values.title,
      slug,
      values.summary || null,
      values.body || null,
      values.status,
      values.isFeatured ? 1 : 0,
      values.status === "published" ? values.publishedAt || new Date() : values.publishedAt || null,
      values.metaTitle || values.title,
      values.metaDescription || values.summary || null,
      values.sortOrder,
      req.user.id,
      req.user.id
    ]
  );

  res.status(201).json({ id: result.insertId });
});

const updateContent = asyncHandler(async (req, res) => {
  const values = contentSchema.partial().parse(req.body);

  const [currentRows] = await pool.execute("SELECT * FROM content_items WHERE id = ? LIMIT 1", [
    req.params.id
  ]);

  if (!currentRows[0]) {
    throw httpError(404, "İçerik bulunamadı.");
  }

  const current = currentRows[0];
  const next = {
    type: values.type || current.type,
    locale: values.locale || current.locale,
    title: values.title || current.title,
    slug: values.slug ? slugify(values.slug) : current.slug,
    summary: values.summary ?? current.summary,
    body: values.body ?? current.body,
    status: values.status || current.status,
    isFeatured:
      values.isFeatured === undefined ? current.is_featured : values.isFeatured ? 1 : 0,
    publishedAt:
      values.publishedAt !== undefined
        ? values.publishedAt
        : current.published_at,
    metaTitle: values.metaTitle ?? current.meta_title,
    metaDescription: values.metaDescription ?? current.meta_description,
    sortOrder: values.sortOrder ?? current.sort_order
  };

  await pool.execute(
    `UPDATE content_items
     SET type = ?, locale = ?, title = ?, slug = ?, summary = ?, body = ?, status = ?,
         is_featured = ?, published_at = ?, meta_title = ?, meta_description = ?,
         sort_order = ?, updated_by = ?
     WHERE id = ?`,
    [
      next.type,
      next.locale,
      next.title,
      next.slug,
      next.summary,
      next.body,
      next.status,
      next.isFeatured,
      next.publishedAt,
      next.metaTitle,
      next.metaDescription,
      next.sortOrder,
      req.user.id,
      req.params.id
    ]
  );

  res.json({ ok: true });
});

const deleteContent = asyncHandler(async (req, res) => {
  await pool.execute("DELETE FROM content_items WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

module.exports = {
  createContent,
  deleteContent,
  listContent,
  updateContent
};
