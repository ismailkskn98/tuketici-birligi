const assert = require("node:assert/strict");
const test = require("node:test");
const migrate = require("../src/db/migrate");
const seed = require("../src/db/seed");
const pool = require("../src/db/pool");

test("migration remains repeatable and creates both board tables defensively", async () => {
  const originalExecute = pool.execute;
  const statements = [];

  pool.execute = async (sql) => {
    statements.push(sql);
    if (sql.includes("IS_NULLABLE")) return [[{ is_nullable: "YES" }]];
    if (sql.includes("information_schema")) return [[{ total: 1 }]];
    return [[]];
  };

  try {
    await migrate();
    await migrate();

    const categoryStatements = statements.filter((sql) =>
      sql.includes("CREATE TABLE IF NOT EXISTS board_member_categories"),
    );
    const memberStatements = statements.filter((sql) =>
      sql.includes("CREATE TABLE IF NOT EXISTS board_members"),
    );

    assert.equal(categoryStatements.length, 2);
    assert.equal(memberStatements.length, 2);
    assert.match(memberStatements[0], /ON DELETE RESTRICT/);
    assert.match(memberStatements[0], /ON DELETE SET NULL/);
    assert.match(memberStatements[0], /role_tr VARCHAR\(160\) NULL/);
  } finally {
    pool.execute = originalExecute;
  }
});

test("board seed creates eleven public-ready records when empty", async () => {
  const originalExecute = pool.execute;
  let mediaId = 100;
  let boardInsertCount = 0;

  const insertedMembers = [];

  pool.execute = async (sql, params = []) => {
    if (sql.includes("FROM board_members")) return [[]];
    if (sql.includes("FROM board_member_categories")) return [[]];
    if (sql.includes("FROM admin_users")) return [[{ id: 1 }]];
    if (sql.includes("FROM media_assets")) return [[]];
    if (sql.includes("INSERT INTO board_member_categories")) {
      return [{ insertId: 8 }];
    }
    if (sql.includes("INSERT INTO media_assets")) {
      mediaId += 1;
      return [{ insertId: mediaId }];
    }
    if (sql.includes("INSERT INTO board_members")) {
      boardInsertCount += 1;
      insertedMembers.push(params);
      return [{ insertId: boardInsertCount }];
    }
    return [[]];
  };

  try {
    await seed.seedBoardMembers();
    assert.equal(seed.boardMembers.length, 11);
    assert.equal(boardInsertCount, 11);
    assert.equal(insertedMembers.filter((params) => params[9] === 1).length, 11);
    assert.equal(insertedMembers.filter((params) => params[9] === 0).length, 0);
    assert.ok(insertedMembers.some((params) =>
      params[0] === "Hasan Oğuz Altınkaynak" &&
      params[3] === "Avukat" &&
      params[5].includes("Exeter Üniversitesi") &&
      Number.isInteger(params[7])
    ));
    assert.ok(insertedMembers.some((params) =>
      params[0] === "Hüseyin Taşer" &&
      params[3] === "Harita ve Kadastro Teknikeri" &&
      params[5].includes("şehir planlama") &&
      Number.isInteger(params[7])
    ));
  } finally {
    pool.execute = originalExecute;
  }
});

test("board seed leaves existing admin-managed records untouched", async () => {
  const originalExecute = pool.execute;
  const statements = [];

  pool.execute = async (sql) => {
    statements.push(sql);
    if (sql.includes("FROM board_members")) return [[{ id: 42 }]];
    if (sql.includes("FROM board_member_categories")) return [[{ id: 8 }]];
    if (sql.includes("FROM seed_versions")) return [[{ version_key: "applied" }]];
    if (sql.includes("FROM admin_users")) return [[{ id: 1 }]];
    return [[]];
  };

  try {
    await seed.seedBoardMembers();
    assert.ok(statements.every((sql) => !sql.includes("INSERT INTO board_members")));
    assert.ok(statements.every((sql) => !sql.includes("UPDATE board_members")));
  } finally {
    pool.execute = originalExecute;
  }
});

test("board seed moves only the founding member out of the board category once", async () => {
  const originalExecute = pool.execute;
  const updates = [];

  pool.execute = async (sql, params = []) => {
    if (sql.includes("FROM board_members")) return [[{ id: 42 }]];
    if (sql.includes("FROM board_member_categories")) {
      return [[{ id: params[0] === "kurucu-uyeler" ? 9 : 8 }]];
    }
    if (sql.includes("FROM seed_versions")) {
      return [
        params[0].includes("company-sources") || params[0].includes("complete-board")
          ? [{ version_key: params[0] }]
          : [],
      ];
    }
    if (sql.includes("FROM admin_users")) return [[{ id: 1 }]];
    if (sql.includes("UPDATE board_members")) {
      updates.push({ sql, params });
      return [{ affectedRows: 1 }];
    }
    return [[]];
  };

  try {
    await seed.seedBoardMembers();
    assert.equal(updates.length, 1);
    assert.deepEqual(updates[0].params, [9, 8]);
    assert.match(updates[0].sql, /full_name = 'Uğuralp Coşkun'/);
    assert.match(updates[0].sql, /role_tr = 'Kurucu Üye'/);
    assert.match(updates[0].sql, /category_id = \?/);
  } finally {
    pool.execute = originalExecute;
  }
});

test("board seed completes the two new profiles and removes temporary role wording once", async () => {
  const originalExecute = pool.execute;
  const memberUpdates = [];

  pool.execute = async (sql, params = []) => {
    if (sql.includes("FROM board_members")) return [[{ id: 42 }]];
    if (sql.includes("FROM board_member_categories")) {
      if (sql.includes("gecici-yonetim-kurulu")) return [[]];
      return [[{ id: params[0] === "kurucu-uyeler" ? 9 : 8 }]];
    }
    if (sql.includes("FROM seed_versions")) {
      return [params[0].includes("complete-board") ? [] : [{ version_key: params[0] }]];
    }
    if (sql.includes("FROM admin_users")) return [[{ id: 1 }]];
    if (sql.includes("FROM media_assets")) return [[{ id: 101 }]];
    if (sql.includes("UPDATE board_members") && sql.includes("WHERE id = ?")) {
      memberUpdates.push({ sql, params });
      return [{ affectedRows: 1 }];
    }
    return [{ affectedRows: 1 }];
  };

  try {
    await seed.seedBoardMembers();

    assert.equal(memberUpdates.length, 4);
    const hasanUpdate = memberUpdates.find((update) => update.params[0] === "Yönetim Kurulu Başkanı");
    const huseyinUpdate = memberUpdates.find((update) => update.params[0] === "Sekreter");
    assert.equal(hasanUpdate.params[3], "Attorney");
    assert.equal(hasanUpdate.params[6], 101);
    assert.equal(huseyinUpdate.params[2], "Harita ve Kadastro Teknikeri");
    assert.match(hasanUpdate.sql, /is_active = 1/);
    assert.ok(memberUpdates.every((update) => !update.params.some((value) =>
      typeof value === "string" && /Geçici|Interim/.test(value)
    )));
  } finally {
    pool.execute = originalExecute;
  }
});

test("hero seed creates media before inserting slides on a clean database", async () => {
  const originalExecute = pool.execute;
  const mediaByUrl = new Map();
  let nextMediaId = 200;
  let heroInsertCount = 0;

  pool.execute = async (sql, params = []) => {
    if (sql.includes("FROM hero_slides")) return [[]];
    if (sql.includes("FROM admin_users")) return [[{ id: 1 }]];

    if (sql.includes("FROM media_assets")) {
      const mediaId = mediaByUrl.get(params[0]);
      return [mediaId ? [{ id: mediaId }] : []];
    }

    if (sql.includes("INSERT INTO media_assets")) {
      nextMediaId += 1;
      mediaByUrl.set(params[4], nextMediaId);
      return [{ insertId: nextMediaId }];
    }

    if (sql.includes("INSERT INTO hero_slides")) {
      heroInsertCount += 1;
      return [{ insertId: heroInsertCount }];
    }

    return [[]];
  };

  try {
    await seed.seedHeroSlides();
    assert.equal(mediaByUrl.size, 3);
    assert.equal(heroInsertCount, 2);
  } finally {
    pool.execute = originalExecute;
  }
});
