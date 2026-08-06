const pool = require("./pool");

const statements = [
  `CREATE TABLE IF NOT EXISTS admin_users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'editor') NOT NULL DEFAULT 'editor',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS media_assets (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(120) NOT NULL,
    size_bytes BIGINT UNSIGNED NOT NULL,
    storage_driver VARCHAR(40) NOT NULL,
    path VARCHAR(500) NOT NULL,
    public_url VARCHAR(700) NOT NULL,
    alt_text VARCHAR(255) NULL,
    created_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_media_created_at (created_at),
    CONSTRAINT fk_media_created_by FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS content_categories (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(40) NOT NULL,
    locale VARCHAR(8) NOT NULL DEFAULT 'tr',
    title VARCHAR(190) NOT NULL,
    slug VARCHAR(190) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_category_locale_slug (locale, slug),
    INDEX idx_category_type (type)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS content_items (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    type ENUM('page', 'news', 'announcement', 'guide', 'legal', 'faq') NOT NULL,
    locale VARCHAR(8) NOT NULL DEFAULT 'tr',
    title VARCHAR(220) NOT NULL,
    slug VARCHAR(220) NOT NULL,
    summary TEXT NULL,
    body MEDIUMTEXT NULL,
    status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
    is_featured TINYINT(1) NOT NULL DEFAULT 0,
    published_at DATETIME NULL,
    cover_media_id BIGINT UNSIGNED NULL,
    meta_title VARCHAR(220) NULL,
    meta_description VARCHAR(320) NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_by BIGINT UNSIGNED NULL,
    updated_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_content_locale_slug (locale, slug),
    INDEX idx_content_type_status (type, status),
    INDEX idx_content_published_at (published_at),
    CONSTRAINT fk_content_cover_media FOREIGN KEY (cover_media_id) REFERENCES media_assets(id) ON DELETE SET NULL,
    CONSTRAINT fk_content_created_by FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    CONSTRAINT fk_content_updated_by FOREIGN KEY (updated_by) REFERENCES admin_users(id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS form_submissions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    form_type ENUM('contact', 'pre_application') NOT NULL,
    application_number VARCHAR(30) NULL,
    status ENUM('new', 'in_review', 'resolved', 'spam') NOT NULL DEFAULT 'new',
    subject VARCHAR(220) NOT NULL,
    full_name VARCHAR(160) NOT NULL,
    email VARCHAR(190) NOT NULL,
    phone VARCHAR(40) NULL,
    category VARCHAR(120) NULL,
    message TEXT NOT NULL,
    payload_json LONGTEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_submission_application_number (application_number),
    INDEX idx_submission_type_status (form_type, status),
    INDEX idx_submission_created_at (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS site_settings (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    locale VARCHAR(8) NOT NULL DEFAULT 'tr',
    key_name VARCHAR(120) NOT NULL,
    value LONGTEXT NULL,
    value_type VARCHAR(40) NOT NULL DEFAULT 'string',
    updated_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_settings_locale_key (locale, key_name),
    CONSTRAINT fk_settings_updated_by FOREIGN KEY (updated_by) REFERENCES admin_users(id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS hero_slides (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title_tr VARCHAR(220) NOT NULL,
    title_en VARCHAR(220) NOT NULL,
    summary_tr TEXT NULL,
    summary_en TEXT NULL,
    cta_label_tr VARCHAR(80) NULL,
    cta_label_en VARCHAR(80) NULL,
    cta_href VARCHAR(500) NULL,
    media_id BIGINT UNSIGNED NOT NULL,
    media_mobile_id BIGINT UNSIGNED NOT NULL,
    media_tablet_id BIGINT UNSIGNED NOT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    sort_order INT NOT NULL DEFAULT 0,
    created_by BIGINT UNSIGNED NULL,
    updated_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_hero_sort (sort_order, id),
    INDEX idx_hero_active_sort (is_active, sort_order, id),
    CONSTRAINT fk_hero_media FOREIGN KEY (media_id) REFERENCES media_assets(id) ON DELETE RESTRICT,
    CONSTRAINT fk_hero_media_mobile FOREIGN KEY (media_mobile_id) REFERENCES media_assets(id) ON DELETE RESTRICT,
    CONSTRAINT fk_hero_media_tablet FOREIGN KEY (media_tablet_id) REFERENCES media_assets(id) ON DELETE RESTRICT,
    CONSTRAINT fk_hero_created_by FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    CONSTRAINT fk_hero_updated_by FOREIGN KEY (updated_by) REFERENCES admin_users(id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS province_map_entries (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    locale VARCHAR(8) NOT NULL DEFAULT 'tr',
    province_code TINYINT UNSIGNED NOT NULL,
    province_name VARCHAR(80) NOT NULL,
    title VARCHAR(220) NOT NULL,
    summary TEXT NULL,
    category ENUM('news', 'announcement', 'guide', 'activity') NOT NULL DEFAULT 'news',
    content_item_id BIGINT UNSIGNED NULL,
    link_label VARCHAR(80) NULL,
    link_href VARCHAR(500) NULL,
    event_date DATE NULL,
    status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
    sort_order INT NOT NULL DEFAULT 0,
    created_by BIGINT UNSIGNED NULL,
    updated_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_province_map_public (locale, status, province_code, sort_order, event_date),
    INDEX idx_province_map_admin (updated_at, id),
    CONSTRAINT fk_province_map_content FOREIGN KEY (content_item_id) REFERENCES content_items(id) ON DELETE SET NULL,
    CONSTRAINT fk_province_map_created_by FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    CONSTRAINT fk_province_map_updated_by FOREIGN KEY (updated_by) REFERENCES admin_users(id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    admin_user_id BIGINT UNSIGNED NULL,
    action VARCHAR(120) NOT NULL,
    entity_type VARCHAR(80) NOT NULL,
    entity_id BIGINT UNSIGNED NULL,
    payload_json LONGTEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_entity (entity_type, entity_id),
    CONSTRAINT fk_audit_admin_user FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
];

async function addColumnIfMissing(table, column, definition) {
  const [rows] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?`,
    [table, column]
  );

  if (Number(rows[0]?.total || 0) > 0) return;

  await pool.execute(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
}

async function addUniqueIndexIfMissing(table, indexName, column) {
  const [rows] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM information_schema.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND INDEX_NAME = ?`,
    [table, indexName]
  );

  if (Number(rows[0]?.total || 0) > 0) return;

  await pool.execute(`ALTER TABLE \`${table}\` ADD UNIQUE KEY \`${indexName}\` (\`${column}\`)`);
}

async function addForeignKeyIfMissing(table, constraintName, column, refTable, refColumn, onDelete) {
  const [rows] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM information_schema.TABLE_CONSTRAINTS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND CONSTRAINT_NAME = ?
       AND CONSTRAINT_TYPE = 'FOREIGN KEY'`,
    [table, constraintName]
  );

  if (Number(rows[0]?.total || 0) > 0) return;

  await pool.execute(
    `ALTER TABLE \`${table}\`
     ADD CONSTRAINT \`${constraintName}\`
     FOREIGN KEY (\`${column}\`) REFERENCES \`${refTable}\`(\`${refColumn}\`)
     ON DELETE ${onDelete}`
  );
}

async function backfillHeroResponsiveMedia() {
  await pool.execute(
    `UPDATE hero_slides
     SET media_mobile_id = media_id
     WHERE media_mobile_id IS NULL`
  );
  await pool.execute(
    `UPDATE hero_slides
     SET media_tablet_id = media_id
     WHERE media_tablet_id IS NULL`
  );
}

async function migrate() {
  for (const statement of statements) {
    await pool.execute(statement);
  }

  await addColumnIfMissing(
    "form_submissions",
    "application_number",
    "VARCHAR(30) NULL AFTER form_type"
  );
  await addUniqueIndexIfMissing(
    "form_submissions",
    "uq_submission_application_number",
    "application_number"
  );

  await addColumnIfMissing(
    "hero_slides",
    "media_mobile_id",
    "BIGINT UNSIGNED NULL AFTER media_id"
  );
  await addColumnIfMissing(
    "hero_slides",
    "media_tablet_id",
    "BIGINT UNSIGNED NULL AFTER media_mobile_id"
  );
  await backfillHeroResponsiveMedia();
  await addForeignKeyIfMissing(
    "hero_slides",
    "fk_hero_media_mobile",
    "media_mobile_id",
    "media_assets",
    "id",
    "RESTRICT"
  );
  await addForeignKeyIfMissing(
    "hero_slides",
    "fk_hero_media_tablet",
    "media_tablet_id",
    "media_assets",
    "id",
    "RESTRICT"
  );
}

if (require.main === module) {
  migrate()
    .then(async () => {
      console.log("Migration tamamlandı.");
      await pool.end();
    })
    .catch(async (error) => {
      console.error(error);
      await pool.end();
      process.exit(1);
    });
}

module.exports = migrate;
