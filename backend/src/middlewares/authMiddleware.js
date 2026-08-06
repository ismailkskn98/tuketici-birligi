const jwt = require("jsonwebtoken");
const env = require("../config/env");
const pool = require("../db/pool");
const httpError = require("../utils/httpError");

function readToken(req) {
  const cookieToken = req.cookies?.[env.auth.cookieName];
  if (cookieToken) return cookieToken;

  const header = req.get("authorization") || "";
  if (header.startsWith("Bearer ")) {
    return header.slice(7);
  }

  return "";
}

async function requireAuth(req, res, next) {
  try {
    const token = readToken(req);

    if (!token) {
      throw httpError(401, "Oturum gerekli.");
    }

    const payload = jwt.verify(token, env.auth.jwtSecret);
    const [rows] = await pool.execute(
      "SELECT id, name, email, role, is_active FROM admin_users WHERE id = ? LIMIT 1",
      [payload.sub]
    );

    const user = rows[0];

    if (!user || !user.is_active) {
      throw httpError(401, "Geçersiz oturum.");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error.status ? error : httpError(401, "Geçersiz oturum."));
  }
}

function requireRole(roles) {
  return function roleGuard(req, res, next) {
    if (!roles.includes(req.user?.role)) {
      return next(httpError(403, "Bu işlem için yetkiniz yok."));
    }

    return next();
  };
}

module.exports = {
  requireAuth,
  requireRole
};

