const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const env = require("../config/env");
const pool = require("../db/pool");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1)
});

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: env.nodeEnv === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}

const login = asyncHandler(async (req, res) => {
  const values = loginSchema.parse(req.body);
  const [rows] = await pool.execute(
    "SELECT * FROM admin_users WHERE email = ? AND is_active = 1 LIMIT 1",
    [values.email]
  );

  const user = rows[0];

  if (!user) {
    throw httpError(401, "E-posta veya şifre hatalı.");
  }

  const matches = await bcrypt.compare(values.password, user.password_hash);

  if (!matches) {
    throw httpError(401, "E-posta veya şifre hatalı.");
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role
    },
    env.auth.jwtSecret,
    { expiresIn: env.auth.expiresIn }
  );

  res.cookie(env.auth.cookieName, token, cookieOptions());
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie(env.auth.cookieName, cookieOptions());
  res.json({ ok: true });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

module.exports = {
  login,
  logout,
  me
};

