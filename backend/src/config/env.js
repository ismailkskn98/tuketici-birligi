const path = require("path");
const dotenv = require("dotenv");

const nodeEnv = process.env.NODE_ENV || "development";
const envFilePath = path.resolve(__dirname, `../../.env.${nodeEnv}`);

dotenv.config({ path: envFilePath });

const defaultFrontendUrl = process.env.FRONTEND_URL || "http://localhost:3601";

function numberValue(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function booleanValue(value, fallback = false) {
  if (value === undefined || value === "") return fallback;
  return value === "true";
}

function listValue(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const env = {
  nodeEnv,
  envFilePath,
  port: numberValue(process.env.PORT, 3402),
  frontendUrl: defaultFrontendUrl,
  corsOrigins: listValue(process.env.CORS_ORIGINS || defaultFrontendUrl),
  apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3402",
  adminResetUrl: process.env.ADMIN_RESET_URL || "http://localhost:3601/admin/reset-password",
  db: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: numberValue(process.env.DB_PORT, 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    name: process.env.DB_NAME || "tuketiciler_birligi",
    connectionLimit: numberValue(process.env.DB_CONNECTION_LIMIT, 10)
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || "development-change-me",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    cookieName: process.env.JWT_COOKIE_NAME || "tb_admin_token"
  },
  upload: {
    driver: process.env.UPLOAD_DRIVER || "local",
    maxFileMb: numberValue(process.env.UPLOAD_MAX_FILE_MB, 10),
    localDir: process.env.LOCAL_UPLOAD_DIR || "uploads",
    s3: {
      endpoint: process.env.S3_ENDPOINT || "",
      region: process.env.S3_REGION || "",
      bucket: process.env.S3_BUCKET || "",
      accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
      cdnUrl: process.env.S3_CDN_URL || "",
      forcePathStyle: booleanValue(process.env.S3_FORCE_PATH_STYLE, false)
    }
  },
  smtp: {
    host: process.env.SMTP_HOST || "",
    port: numberValue(process.env.SMTP_PORT, 587),
    secure: booleanValue(process.env.SMTP_SECURE, false),
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
    from: process.env.EMAIL_FROM || "",
    adminNotificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL || ""
  },
  seed: {
    adminEmail: process.env.SEED_ADMIN_EMAIL || "admin@tuketiciler.local",
    adminPassword: process.env.SEED_ADMIN_PASSWORD || "Admin123!",
    editorEmail: process.env.SEED_EDITOR_EMAIL || "editor@tuketiciler.local",
    editorPassword: process.env.SEED_EDITOR_PASSWORD || "Editor123!"
  }
};

module.exports = env;
