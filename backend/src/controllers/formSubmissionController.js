const { z } = require("zod");
const pool = require("../db/pool");
const asyncHandler = require("../utils/asyncHandler");
const { parseJson } = require("../utils/clean");
const httpError = require("../utils/httpError");

const updateSchema = z.object({
  status: z.enum(["new", "in_review", "resolved", "spam"])
});

function mapSubmission(row) {
  return {
    id: row.id,
    formType: row.form_type,
    applicationNumber: row.application_number,
    status: row.status,
    subject: row.subject,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    category: row.category,
    message: row.message,
    payload: parseJson(row.payload_json, {}),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

const listSubmissions = asyncHandler(async (req, res) => {
  const query = String(req.query.q || "").trim();
  const status = String(req.query.status || "").trim();
  const formType = String(req.query.formType || "").trim();
  const params = [];
  const where = [];

  if (query) {
    where.push(
      "(application_number LIKE ? OR full_name LIKE ? OR email LIKE ? OR subject LIKE ? OR category LIKE ?)"
    );
    const like = `%${query}%`;
    params.push(like, like, like, like, like);
  }

  if (status) {
    where.push("status = ?");
    params.push(status);
  }

  if (formType) {
    where.push("form_type = ?");
    params.push(formType);
  }

  const sql = `
    SELECT * FROM form_submissions
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY created_at DESC, id DESC
    LIMIT 200
  `;

  const [rows] = await pool.execute(sql, params);
  res.json({ items: rows.map(mapSubmission) });
});

const updateSubmission = asyncHandler(async (req, res) => {
  const values = updateSchema.parse(req.body);
  const [result] = await pool.execute("UPDATE form_submissions SET status = ? WHERE id = ?", [
    values.status,
    req.params.id
  ]);

  if (!result.affectedRows) {
    throw httpError(404, "Form kaydı bulunamadı.");
  }

  res.json({ ok: true });
});

module.exports = {
  listSubmissions,
  updateSubmission
};
