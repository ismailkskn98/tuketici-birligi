"use strict";

const { z } = require("zod");
const pool = require("../db/pool");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

const boardMemberSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  titleTr: z.string().trim().min(2).max(160),
  titleEn: z.string().trim().min(2).max(160),
  summaryTr: z.string().trim().min(10).max(2000),
  summaryEn: z.string().trim().min(10).max(2000),
  mediaId: z.coerce.number().int().positive(),
  categoryId: z.coerce.number().int().positive().optional().nullable(),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional().default(0)
});

function mapImage(row) {
  if (!row.media_id || !row.public_url) return null;

  return {
    id: row.media_id,
    url: row.public_url,
    altText: row.alt_text || `${row.full_name} portresi`
  };
}

function mapAdminRow(row) {
  return {
    id: row.id,
    fullName: row.full_name,
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
          titleEn: row.category_title_en
        }
      : null,
    isActive: Boolean(row.is_active),
    sortOrder: row.sort_order,
    image: mapImage(row),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function ensureMediaExists(mediaId) {
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

const ADMIN_LIST_SELECT = `
  SELECT
    bm.*,
    media.public_url,
    media.alt_text,
    category.title_tr AS category_title_tr,
    category.title_en AS category_title_en
  FROM board_members bm
  JOIN media_assets media ON media.id = bm.media_id
  LEFT JOIN board_member_categories category ON category.id = bm.category_id
`;

const getPublicBoardMembers = asyncHandler(async (req, res) => {
  const locale = z.enum(["tr", "en"]).catch("tr").parse(req.query.locale);
  const titleColumn = locale === "en" ? "title_en" : "title_tr";
  const summaryColumn = locale === "en" ? "summary_en" : "summary_tr";
  const [rows] = await pool.execute(
    `SELECT
       bm.id,
       bm.full_name,
       bm.${titleColumn} AS professional_title,
       bm.${summaryColumn} AS summary,
       bm.media_id,
       bm.sort_order,
       media.public_url,
       media.alt_text
     FROM board_members bm
     JOIN media_assets media ON media.id = bm.media_id
     WHERE bm.is_active = 1
       AND media.public_url IS NOT NULL
       AND media.public_url <> ''
     ORDER BY bm.sort_order ASC, bm.id ASC`
  );

  res.json({
    items: rows.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      professionalTitle: row.professional_title,
      summary: row.summary,
      image: mapImage(row),
      sortOrder: row.sort_order
    }))
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
  const values = boardMemberSchema.parse(req.body);
  await ensureRelations(values);

  const [result] = await pool.execute(
    `INSERT INTO board_members
      (full_name, title_tr, title_en, summary_tr, summary_en, media_id, category_id,
       is_active, sort_order, created_by, updated_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      values.fullName,
      values.titleTr,
      values.titleEn,
      values.summaryTr,
      values.summaryEn,
      values.mediaId,
      values.categoryId || null,
      values.isActive ? 1 : 0,
      values.sortOrder,
      req.user.id,
      req.user.id
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
  const next = {
    fullName: values.fullName ?? current.full_name,
    titleTr: values.titleTr ?? current.title_tr,
    titleEn: values.titleEn ?? current.title_en,
    summaryTr: values.summaryTr ?? current.summary_tr,
    summaryEn: values.summaryEn ?? current.summary_en,
    mediaId: values.mediaId ?? current.media_id,
    categoryId:
      values.categoryId === undefined ? current.category_id : values.categoryId,
    isActive:
      values.isActive === undefined ? current.is_active : values.isActive ? 1 : 0,
    sortOrder: values.sortOrder ?? current.sort_order
  };

  await ensureRelations(next);

  await pool.execute(
    `UPDATE board_members
     SET full_name = ?, title_tr = ?, title_en = ?, summary_tr = ?, summary_en = ?,
         media_id = ?, category_id = ?, is_active = ?, sort_order = ?, updated_by = ?
     WHERE id = ?`,
    [
      next.fullName,
      next.titleTr,
      next.titleEn,
      next.summaryTr,
      next.summaryEn,
      next.mediaId,
      next.categoryId || null,
      next.isActive,
      next.sortOrder,
      req.user.id,
      req.params.id
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

module.exports = {
  createBoardMember,
  deleteBoardMember,
  getPublicBoardMembers,
  listBoardMembers,
  updateBoardMember
};
