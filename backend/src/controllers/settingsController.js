const { z } = require("zod");
const pool = require("../db/pool");
const asyncHandler = require("../utils/asyncHandler");
const { parseJson } = require("../utils/clean");

const settingSchema = z.object({
  locale: z.string().trim().min(2).max(8).default("tr"),
  settings: z.record(z.union([z.string(), z.number(), z.boolean(), z.object({}).passthrough()]))
});

function normalizeValue(value) {
  if (typeof value === "object") {
    return {
      value: JSON.stringify(value),
      valueType: "json"
    };
  }

  return {
    value: String(value),
    valueType: "string"
  };
}

const listSettings = asyncHandler(async (req, res) => {
  const locale = req.query.locale || "tr";
  const [rows] = await pool.execute(
    "SELECT key_name, value, value_type FROM site_settings WHERE locale = ? ORDER BY key_name ASC",
    [locale]
  );

  const settings = rows.reduce((result, row) => {
    result[row.key_name] =
      row.value_type === "json" ? parseJson(row.value, {}) : row.value;
    return result;
  }, {});

  res.json({ settings });
});

const updateSettings = asyncHandler(async (req, res) => {
  const values = settingSchema.parse(req.body);

  for (const [keyName, rawValue] of Object.entries(values.settings)) {
    const { value, valueType } = normalizeValue(rawValue);
    await pool.execute(
      `INSERT INTO site_settings (locale, key_name, value, value_type, updated_by)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE value = VALUES(value), value_type = VALUES(value_type), updated_by = VALUES(updated_by)`,
      [values.locale, keyName, value, valueType, req.user.id]
    );
  }

  res.json({ ok: true });
});

module.exports = {
  listSettings,
  updateSettings
};

