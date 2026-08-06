"use strict";

const { z } = require("zod");
const pool = require("../db/pool");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

const MAX_HERO_SLIDES = 8;
const TRANSLATION_TIMEOUT_MS = 10000;

const heroSlideSchema = z.object({
  titleTr: z.string().trim().min(2).max(220),
  titleEn: z.string().trim().min(2).max(220),
  summaryTr: z.string().trim().max(4000).optional().or(z.literal("")),
  summaryEn: z.string().trim().max(4000).optional().or(z.literal("")),
  ctaLabelTr: z.string().trim().max(80).optional().or(z.literal("")),
  ctaLabelEn: z.string().trim().max(80).optional().or(z.literal("")),
  ctaHref: z.string().trim().max(500).optional().or(z.literal("")),
  mediaId: z.coerce.number().int().positive(),
  mediaMobileId: z.coerce.number().int().positive(),
  mediaTabletId: z.coerce.number().int().positive(),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().min(0).max(999).optional().default(0)
});

const translateSchema = z.object({
  title: z.string().trim().min(1).max(220),
  summary: z.string().trim().max(4000).optional().or(z.literal("")),
  ctaLabel: z.string().trim().max(80).optional().or(z.literal("")),
  sourceLocale: z.enum(["tr", "en"]).default("tr"),
  targetLocale: z.enum(["tr", "en"]).default("en")
});

function mapMediaImage(id, publicUrl, altText) {
  if (!id || !publicUrl) return null;

  return {
    id,
    url: publicUrl,
    altText: altText || null
  };
}

function mapHeroRow(row) {
  return {
    id: row.id,
    titleTr: row.title_tr,
    titleEn: row.title_en,
    summaryTr: row.summary_tr,
    summaryEn: row.summary_en,
    ctaLabelTr: row.cta_label_tr,
    ctaLabelEn: row.cta_label_en,
    ctaHref: row.cta_href,
    mediaId: row.media_id,
    mediaMobileId: row.media_mobile_id,
    mediaTabletId: row.media_tablet_id,
    isActive: Boolean(row.is_active),
    sortOrder: row.sort_order,
    image: mapMediaImage(row.media_id, row.desktop_public_url, row.desktop_alt_text),
    imageMobile: mapMediaImage(row.media_mobile_id, row.mobile_public_url, row.mobile_alt_text),
    imageTablet: mapMediaImage(row.media_tablet_id, row.tablet_public_url, row.tablet_alt_text),
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
    throw httpError(422, "Seçilen görsel bulunamadı.");
  }
}

async function ensureHeroMediaExists({ mediaId, mediaMobileId, mediaTabletId }) {
  await Promise.all([
    ensureMediaExists(mediaId),
    ensureMediaExists(mediaMobileId),
    ensureMediaExists(mediaTabletId)
  ]);
}

async function ensureSlideLimit(ignoreId = null) {
  const params = [];
  let where = "";

  if (ignoreId) {
    where = "WHERE id <> ?";
    params.push(ignoreId);
  }

  const [rows] = await pool.execute(
    `SELECT COUNT(*) AS count
     FROM hero_slides
     ${where}`,
    params
  );

  if (Number(rows[0]?.count || 0) >= MAX_HERO_SLIDES) {
    throw httpError(422, `En fazla ${MAX_HERO_SLIDES} hero kaydı eklenebilir.`);
  }
}

async function translateText(text, sourceLocale, targetLocale) {
  if (!text?.trim()) return "";

  const url =
    "https://api.mymemory.translated.net/get?" +
    new URLSearchParams({
      q: text,
      langpair: `${sourceLocale}|${targetLocale}`
    }).toString();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TRANSLATION_TIMEOUT_MS);

  let response;

  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/json"
      },
      signal: controller.signal
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw httpError(504, "Otomatik çeviri servisi zaman aşımına uğradı.");
    }

    throw httpError(502, "Otomatik çeviri servisine ulaşılamadı.");
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw httpError(502, "Otomatik çeviri servisine ulaşılamadı.");
  }

  const data = await response.json();

  if (data?.responseStatus && Number(data.responseStatus) >= 400) {
    throw httpError(502, data.responseDetails || "Otomatik çeviri sonucu alınamadı.");
  }

  const translatedText = data?.responseData?.translatedText?.trim();

  if (!translatedText) {
    throw httpError(502, "Otomatik çeviri sonucu alınamadı.");
  }

  return translatedText;
}

const HERO_LIST_SELECT = `
  SELECT
    hs.*,
    desktop.public_url AS desktop_public_url,
    desktop.alt_text AS desktop_alt_text,
    mobile.public_url AS mobile_public_url,
    mobile.alt_text AS mobile_alt_text,
    tablet.public_url AS tablet_public_url,
    tablet.alt_text AS tablet_alt_text
  FROM hero_slides hs
  JOIN media_assets desktop ON desktop.id = hs.media_id
  LEFT JOIN media_assets mobile ON mobile.id = hs.media_mobile_id
  LEFT JOIN media_assets tablet ON tablet.id = hs.media_tablet_id
`;

const listHeroSlides = asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(
    `${HERO_LIST_SELECT}
     ORDER BY hs.sort_order ASC, hs.id ASC`
  );

  res.json({
    items: rows.map(mapHeroRow),
    maxItems: MAX_HERO_SLIDES
  });
});

const createHeroSlide = asyncHandler(async (req, res) => {
  const values = heroSlideSchema.parse(req.body);

  await ensureSlideLimit();
  await ensureHeroMediaExists(values);

  const [result] = await pool.execute(
    `INSERT INTO hero_slides
      (title_tr, title_en, summary_tr, summary_en, cta_label_tr, cta_label_en,
       cta_href, media_id, media_mobile_id, media_tablet_id, is_active, sort_order,
       created_by, updated_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      values.titleTr,
      values.titleEn,
      values.summaryTr || null,
      values.summaryEn || null,
      values.ctaLabelTr || null,
      values.ctaLabelEn || null,
      values.ctaHref || null,
      values.mediaId,
      values.mediaMobileId,
      values.mediaTabletId,
      values.isActive ? 1 : 0,
      values.sortOrder,
      req.user.id,
      req.user.id
    ]
  );

  res.status(201).json({ id: result.insertId });
});

const updateHeroSlide = asyncHandler(async (req, res) => {
  const values = heroSlideSchema.partial().parse(req.body);
  const [rows] = await pool.execute(
    `SELECT *
     FROM hero_slides
     WHERE id = ?
     LIMIT 1`,
    [req.params.id]
  );

  if (!rows[0]) {
    throw httpError(404, "Hero kaydı bulunamadı.");
  }

  const current = rows[0];

  const next = {
    titleTr: values.titleTr ?? current.title_tr,
    titleEn: values.titleEn ?? current.title_en,
    summaryTr: values.summaryTr ?? current.summary_tr,
    summaryEn: values.summaryEn ?? current.summary_en,
    ctaLabelTr: values.ctaLabelTr ?? current.cta_label_tr,
    ctaLabelEn: values.ctaLabelEn ?? current.cta_label_en,
    ctaHref: values.ctaHref ?? current.cta_href,
    mediaId: values.mediaId ?? current.media_id,
    mediaMobileId: values.mediaMobileId ?? current.media_mobile_id ?? current.media_id,
    mediaTabletId: values.mediaTabletId ?? current.media_tablet_id ?? current.media_id,
    isActive:
      values.isActive === undefined ? current.is_active : values.isActive ? 1 : 0,
    sortOrder: values.sortOrder ?? current.sort_order
  };

  await ensureHeroMediaExists(next);

  await pool.execute(
    `UPDATE hero_slides
     SET title_tr = ?, title_en = ?, summary_tr = ?, summary_en = ?, cta_label_tr = ?,
         cta_label_en = ?, cta_href = ?, media_id = ?, media_mobile_id = ?, media_tablet_id = ?,
         is_active = ?, sort_order = ?, updated_by = ?
     WHERE id = ?`,
    [
      next.titleTr,
      next.titleEn,
      next.summaryTr || null,
      next.summaryEn || null,
      next.ctaLabelTr || null,
      next.ctaLabelEn || null,
      next.ctaHref || null,
      next.mediaId,
      next.mediaMobileId,
      next.mediaTabletId,
      next.isActive,
      next.sortOrder,
      req.user.id,
      req.params.id
    ]
  );

  res.json({ ok: true });
});

const deleteHeroSlide = asyncHandler(async (req, res) => {
  await pool.execute("DELETE FROM hero_slides WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

const translateHeroSlide = asyncHandler(async (req, res) => {
  const values = translateSchema.parse(req.body);

  if (values.sourceLocale === values.targetLocale) {
    throw httpError(422, "Kaynak ve hedef dil aynı olamaz.");
  }

  const [title, summary, ctaLabel] = await Promise.all([
    translateText(values.title, values.sourceLocale, values.targetLocale),
    translateText(values.summary || "", values.sourceLocale, values.targetLocale),
    translateText(values.ctaLabel || "", values.sourceLocale, values.targetLocale)
  ]);

  res.json({
    title,
    summary,
    ctaLabel
  });
});

module.exports = {
  MAX_HERO_SLIDES,
  createHeroSlide,
  deleteHeroSlide,
  listHeroSlides,
  translateHeroSlide,
  updateHeroSlide
};
