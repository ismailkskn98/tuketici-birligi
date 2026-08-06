const path = require("path");
const { deleteStoredFile, saveUploadedFile } = require("../helpers/mediaStorage");
const pool = require("../db/pool");
const asyncHandler = require("../utils/asyncHandler");
const { validateImage } = require("../utils/validateImage");
const httpError = require("../utils/httpError");

const listMedia = asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT * FROM media_assets
     ORDER BY created_at DESC, id DESC
     LIMIT 200`
  );

  res.json({ items: rows });
});

const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw httpError(400, "Dosya bulunamadı.");
  }

  const file = await validateImage(req.file);
  const stored = await saveUploadedFile(file, "media");
  const fileName = path.basename(stored.path);

  const [result] = await pool.execute(
    `INSERT INTO media_assets
      (file_name, original_name, mime_type, size_bytes, storage_driver, path, public_url, alt_text, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      fileName,
      file.originalname,
      file.mimetype,
      file.size,
      stored.storageDriver,
      stored.path,
      stored.publicUrl,
      req.body.altText || null,
      req.user.id
    ]
  );

  res.status(201).json({
    id: result.insertId,
    publicUrl: stored.publicUrl
  });
});

const deleteMedia = asyncHandler(async (req, res) => {
  const [rows] = await pool.execute("SELECT * FROM media_assets WHERE id = ? LIMIT 1", [
    req.params.id
  ]);

  if (!rows[0]) {
    throw httpError(404, "Medya bulunamadı.");
  }

  await deleteStoredFile(rows[0]);
  await pool.execute("DELETE FROM media_assets WHERE id = ?", [req.params.id]);

  res.json({ ok: true });
});

module.exports = {
  deleteMedia,
  listMedia,
  uploadMedia
};

