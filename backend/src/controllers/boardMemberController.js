"use strict";

const { z } = require("zod");
const pool = require("../db/pool");
const { slugify } = require("../utils/clean");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

const optionalShortText = z.string().trim().max(160).nullable().optional();
const optionalLongText = z.string().trim().max(2000).nullable().optional();
const optionalRelationId = z
  .union([z.coerce.number().int().positive(), z.null()])
  .optional();

const boardMemberSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  roleTr: optionalShortText,
  roleEn: optionalShortText,
  titleTr: optionalShortText,
  titleEn: optionalShortText,
  summaryTr: optionalLongText,
  summaryEn: optionalLongText,
  mediaId: optionalRelationId,
  categoryId: optionalRelationId,
  isActive: z.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional().default(0),
});

const boardMemberCategorySchema = z.object({
  titleTr: z.string().trim().min(2).max(160),
  titleEn: z.string().trim().min(2).max(160),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional().default(0),
});

function normalizeText(value) {
  const normalized = typeof value === "string" ? value.trim() : value;
  return normalized || null;
}

function normalizeBoardMember(values) {
  return {
    ...values,
    roleTr: normalizeText(values.roleTr),
    roleEn: normalizeText(values.roleEn),
    titleTr: normalizeText(values.titleTr),
    titleEn: normalizeText(values.titleEn),
    summaryTr: normalizeText(values.summaryTr),
    summaryEn: normalizeText(values.summaryEn),
    mediaId: values.mediaId || null,
    categoryId: values.categoryId || null,
  };
}

function validateBoardMember(values) {
  if (Boolean(values.roleTr) !== Boolean(values.roleEn)) {
    throw httpError(422, "Yönetim görevi Türkçe ve İngilizce birlikte girilmelidir.");
  }

  if (!values.isActive) return;

  if (!values.titleTr || !values.titleEn) {
    throw httpError(422, "Yayındaki üyeler için iki dilli mesleki unvan zorunludur.");
  }

  if ((values.summaryTr?.length || 0) < 10 || (values.summaryEn?.length || 0) < 10) {
    throw httpError(422, "Yayındaki üyeler için iki dilli kısa özet zorunludur.");
  }

  if (!values.mediaId) {
    throw httpError(422, "Yayındaki üyeler için portre zorunludur.");
  }
}

function mapImage(row) {
  if (!row.media_id || !row.public_url) return null;

  return {
    id: row.media_id,
    url: row.public_url,
    altText: row.alt_text || `${row.full_name} portresi`,
  };
}

function isProfileComplete(row) {
  return Boolean(
    row.title_tr &&
      row.title_en &&
      row.summary_tr &&
      row.summary_en &&
      row.media_id &&
      row.public_url
  );
}

function mapAdminRow(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    roleTr: row.role_tr,
    roleEn: row.role_en,
    titleTr: row.title_tr,
    titleEn: row.title_en,
    summaryTr: row.summary_tr,
    summaryEn: row.summary_en,
    mediaId: row.media_id,
    categoryId: row.category_id,
    category: row.category_id
      ? {
          id: row.category_id,
          titleTr: row.category_title_tr,
          titleEn: row.category_title_en,
          isActive: Boolean(row.category_is_active),
        }
      : null,
    isActive: Boolean(row.is_active),
    isComplete: isProfileComplete(row),
    sortOrder: row.sort_order,
    image: mapImage(row),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapCategoryRow(row) {
  return {
    id: row.id,
    titleTr: row.title_tr,
    titleEn: row.title_en,
    slug: row.slug,
    sortOrder: row.sort_order,
    isActive: Boolean(row.is_active),
    memberCount: Number(row.member_count || 0),
  };
}

async function ensureMediaExists(mediaId) {
  if (!mediaId) return;

  const [rows] = await pool.execute(
    `SELECT id
     FROM media_assets
     WHERE id = ?
     LIMIT 1`,
    [mediaId]
  );

  if (!rows[0]) {
    throw httpError(422, "Seçilen portre bulunamadı.");
  }
}

async function ensureCategoryExists(categoryId) {
  if (!categoryId) return;

  const [rows] = await pool.execute(
    `SELECT id
     FROM board_member_categories
     WHERE id = ?
     LIMIT 1`,
    [categoryId]
  );

  if (!rows[0]) {
    throw httpError(422, "Seçilen yönetim kurulu kategorisi bulunamadı.");
  }
}

async function ensureRelations({ mediaId, categoryId }) {
  await Promise.all([ensureMediaExists(mediaId), ensureCategoryExists(categoryId)]);
}

async function createUniqueCategorySlug(title) {
  const baseSlug = slugify(title) || "kurul-kategorisi";
  let suffix = 1;
  let candidate = baseSlug;

  while (true) {
    const [rows] = await pool.execute(
      `SELECT id
       FROM board_member_categories
       WHERE slug = ?
       LIMIT 1`,
      [candidate]
    );

    if (!rows[0]) return candidate;
    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }
}

const ADMIN_LIST_SELECT = `
  SELECT
    bm.*,
    media.public_url,
    media.alt_text,
    category.title_tr AS category_title_tr,
    category.title_en AS category_title_en,
    category.is_active AS category_is_active
  FROM board_members bm
  LEFT JOIN media_assets media ON media.id = bm.media_id
  LEFT JOIN board_member_categories category ON category.id = bm.category_id
`;

const getPublicBoardMembers = asyncHandler(async (req, res) => {
  const locale = z.enum(["tr", "en"]).catch("tr").parse(req.query.locale);
  const roleColumn = locale === "en" ? "role_en" : "role_tr";
  const titleColumn = locale === "en" ? "title_en" : "title_tr";
  const summaryColumn = locale === "en" ? "summary_en" : "summary_tr";
  const categoryTitleColumn = locale === "en" ? "title_en" : "title_tr";
  const [rows] = await pool.execute(
    `SELECT
       bm.id,
       bm.full_name,
       bm.${roleColumn} AS board_role,
       bm.${titleColumn} AS professional_title,
       bm.${summaryColumn} AS summary,
       bm.media_id,
       bm.sort_order,
       media.public_url,
       media.alt_text,
       category.id AS category_id,
       category.${categoryTitleColumn} AS category_title,
       category.slug AS category_slug,
       category.sort_order AS category_sort_order
     FROM board_members bm
     JOIN media_assets media ON media.id = bm.media_id
     LEFT JOIN board_member_categories category
       ON category.id = bm.category_id AND category.is_active = 1
     WHERE bm.is_active = 1
       AND bm.${titleColumn} IS NOT NULL
       AND bm.${titleColumn} <> ''
       AND bm.${summaryColumn} IS NOT NULL
       AND bm.${summaryColumn} <> ''
       AND media.public_url IS NOT NULL
       AND media.public_url <> ''
     ORDER BY
       CASE WHEN category.id IS NULL THEN 1 ELSE 0 END ASC,
       category.sort_order ASC,
       bm.sort_order ASC,
       bm.id ASC`
  );

  res.json({
    items: rows.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      boardRole: row.board_role,
      professionalTitle: row.professional_title,
      summary: row.summary,
      category: row.category_id
        ? {
            id: row.category_id,
            title: row.category_title,
            slug: row.category_slug,
            sortOrder: row.category_sort_order,
          }
        : null,
      image: mapImage(row),
      sortOrder: row.sort_order,
    })),
  });
});

const listBoardMembers = asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(
    `${ADMIN_LIST_SELECT}
     ORDER BY bm.sort_order ASC, bm.id ASC`
  );

  res.json({ items: rows.map(mapAdminRow) });
});

const createBoardMember = asyncHandler(async (req, res) => {
  const values = normalizeBoardMember(boardMemberSchema.parse(req.body));
  validateBoardMember(values);
  await ensureRelations(values);

  const [result] = await pool.execute(
    `INSERT INTO board_members
      (full_name, role_tr, role_en, title_tr, title_en, summary_tr, summary_en,
       media_id, category_id, is_active, sort_order, created_by, updated_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      values.fullName,
      values.roleTr,
      values.roleEn,
      values.titleTr,
      values.titleEn,
      values.summaryTr,
      values.summaryEn,
      values.mediaId,
      values.categoryId,
      values.isActive ? 1 : 0,
      values.sortOrder,
      req.user.id,
      req.user.id,
    ]
  );

  res.status(201).json({ id: result.insertId });
});

const updateBoardMember = asyncHandler(async (req, res) => {
  const values = boardMemberSchema.partial().parse(req.body);
  const [rows] = await pool.execute(
    `SELECT *
     FROM board_members
     WHERE id = ?
     LIMIT 1`,
    [req.params.id]
  );

  if (!rows[0]) {
    throw httpError(404, "Yönetim kurulu üyesi bulunamadı.");
  }

  const current = rows[0];
  const next = normalizeBoardMember({
    fullName: values.fullName ?? current.full_name,
    roleTr: values.roleTr === undefined ? current.role_tr : values.roleTr,
    roleEn: values.roleEn === undefined ? current.role_en : values.roleEn,
    titleTr: values.titleTr === undefined ? current.title_tr : values.titleTr,
    titleEn: values.titleEn === undefined ? current.title_en : values.titleEn,
    summaryTr: values.summaryTr === undefined ? current.summary_tr : values.summaryTr,
    summaryEn: values.summaryEn === undefined ? current.summary_en : values.summaryEn,
    mediaId: values.mediaId === undefined ? current.media_id : values.mediaId,
    categoryId:
      values.categoryId === undefined ? current.category_id : values.categoryId,
    isActive:
      values.isActive === undefined ? Boolean(current.is_active) : values.isActive,
    sortOrder: values.sortOrder ?? current.sort_order,
  });

  validateBoardMember(next);
  await ensureRelations(next);

  await pool.execute(
    `UPDATE board_members
     SET full_name = ?, role_tr = ?, role_en = ?, title_tr = ?, title_en = ?,
         summary_tr = ?, summary_en = ?, media_id = ?, category_id = ?,
         is_active = ?, sort_order = ?, updated_by = ?
     WHERE id = ?`,
    [
      next.fullName,
      next.roleTr,
      next.roleEn,
      next.titleTr,
      next.titleEn,
      next.summaryTr,
      next.summaryEn,
      next.mediaId,
      next.categoryId,
      next.isActive ? 1 : 0,
      next.sortOrder,
      req.user.id,
      req.params.id,
    ]
  );

  res.json({ ok: true });
});

const deleteBoardMember = asyncHandler(async (req, res) => {
  const [result] = await pool.execute(
    "DELETE FROM board_members WHERE id = ?",
    [req.params.id]
  );

  if (!result.affectedRows) {
    throw httpError(404, "Yönetim kurulu üyesi bulunamadı.");
  }

  res.json({ ok: true });
});

const listBoardMemberCategories = asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT
       category.*,
       COUNT(member.id) AS member_count
     FROM board_member_categories category
     LEFT JOIN board_members member ON member.category_id = category.id
     GROUP BY category.id
     ORDER BY category.sort_order ASC, category.id ASC`
  );

  res.json({ items: rows.map(mapCategoryRow) });
});

const createBoardMemberCategory = asyncHandler(async (req, res) => {
  const values = boardMemberCategorySchema.parse(req.body);
  const slug = await createUniqueCategorySlug(values.titleTr);
  const [result] = await pool.execute(
    `INSERT INTO board_member_categories
      (title_tr, title_en, slug, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?)`,
    [
      values.titleTr,
      values.titleEn,
      slug,
      values.sortOrder,
      values.isActive ? 1 : 0,
    ]
  );

  res.status(201).json({ id: result.insertId });
});

const updateBoardMemberCategory = asyncHandler(async (req, res) => {
  const values = boardMemberCategorySchema.partial().parse(req.body);
  const [rows] = await pool.execute(
    `SELECT *
     FROM board_member_categories
     WHERE id = ?
     LIMIT 1`,
    [req.params.id]
  );

  if (!rows[0]) {
    throw httpError(404, "Yönetim kurulu kategorisi bulunamadı.");
  }

  const current = rows[0];
  await pool.execute(
    `UPDATE board_member_categories
     SET title_tr = ?, title_en = ?, sort_order = ?, is_active = ?
     WHERE id = ?`,
    [
      values.titleTr ?? current.title_tr,
      values.titleEn ?? current.title_en,
      values.sortOrder ?? current.sort_order,
      values.isActive === undefined
        ? current.is_active
        : values.isActive
          ? 1
          : 0,
      req.params.id,
    ]
  );

  res.json({ ok: true });
});

const deleteBoardMemberCategory = asyncHandler(async (req, res) => {
  const [result] = await pool.execute(
    "DELETE FROM board_member_categories WHERE id = ?",
    [req.params.id]
  );

  if (!result.affectedRows) {
    throw httpError(404, "Yönetim kurulu kategorisi bulunamadı.");
  }

  res.json({ ok: true });
});

module.exports = {
  createBoardMember,
  createBoardMemberCategory,
  deleteBoardMember,
  deleteBoardMemberCategory,
  getPublicBoardMembers,
  listBoardMemberCategories,
  listBoardMembers,
  updateBoardMember,
  updateBoardMemberCategory,
};
