const bcrypt = require("bcryptjs");
const { z } = require("zod");
const pool = require("../db/pool");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

const createUserSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(190),
  password: z.string().min(8).max(120),
  role: z.enum(["super_admin", "editor"]).default("editor")
});

const updateUserSchema = z.object({
  name: z.string().trim().min(2).max(160).optional(),
  email: z.string().trim().email().max(190).optional(),
  password: z.string().min(8).max(120).optional(),
  role: z.enum(["super_admin", "editor"]).optional(),
  isActive: z.boolean().optional()
});

function mapUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at
  };
}

const listUsers = asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(
    "SELECT id, name, email, role, is_active, created_at FROM admin_users ORDER BY created_at DESC"
  );

  res.json({ items: rows.map(mapUser) });
});

const createUser = asyncHandler(async (req, res) => {
  const values = createUserSchema.parse(req.body);
  const passwordHash = await bcrypt.hash(values.password, 12);
  const [result] = await pool.execute(
    `INSERT INTO admin_users (name, email, password_hash, role)
     VALUES (?, ?, ?, ?)`,
    [values.name, values.email, passwordHash, values.role]
  );

  res.status(201).json({ id: result.insertId });
});

const updateUser = asyncHandler(async (req, res) => {
  const values = updateUserSchema.parse(req.body);
  const [rows] = await pool.execute("SELECT * FROM admin_users WHERE id = ? LIMIT 1", [
    req.params.id
  ]);

  if (!rows[0]) {
    throw httpError(404, "Kullanıcı bulunamadı.");
  }

  const current = rows[0];
  const passwordHash = values.password
    ? await bcrypt.hash(values.password, 12)
    : current.password_hash;

  await pool.execute(
    `UPDATE admin_users
     SET name = ?, email = ?, password_hash = ?, role = ?, is_active = ?
     WHERE id = ?`,
    [
      values.name || current.name,
      values.email || current.email,
      passwordHash,
      values.role || current.role,
      values.isActive === undefined ? current.is_active : values.isActive ? 1 : 0,
      req.params.id
    ]
  );

  res.json({ ok: true });
});

module.exports = {
  createUser,
  listUsers,
  updateUser
};

