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

test("board seed creates nine public-ready and two pending records when empty", async () => {
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
    assert.equal(insertedMembers.filter((params) => params[9] === 1).length, 9);
    assert.equal(insertedMembers.filter((params) => params[9] === 0).length, 2);
    assert.ok(insertedMembers.some((params) => params[0] === "Hasan Oğuz Altınkaynak" && params[7] === null));
    assert.ok(insertedMembers.some((params) => params[0] === "Hüseyin Taşer" && params[7] === null));
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
    assert.equal(statements.length, 4);
    assert.ok(statements.every((sql) => !sql.includes("INSERT INTO board_members")));
    assert.ok(statements.every((sql) => !sql.includes("UPDATE board_members")));
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
