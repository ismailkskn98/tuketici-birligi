const assert = require("node:assert/strict");
const test = require("node:test");
const boardMemberController = require("../src/controllers/boardMemberController");
const pool = require("../src/db/pool");

function callHandler(handler, req) {
  return new Promise((resolve, reject) => {
    const response = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        resolve({ payload, statusCode: this.statusCode });
      },
    };

    handler(req, response, (error) => {
      if (error) reject(error);
    });
  });
}

test("public board member endpoint localizes and limits its response contract", async () => {
  const originalExecute = pool.execute;
  let executedSql = "";

  pool.execute = async (sql) => {
    executedSql = sql;
    return [[{
      id: 7,
      full_name: "Test Member",
      professional_title: "Civil Engineer",
      summary: "A concise institutional profile.",
      media_id: 13,
      sort_order: 20,
      public_url: "/yonetim-kurulu/test-member.webp",
      alt_text: "Test Member portrait",
    }]];
  };

  try {
    const result = await callHandler(boardMemberController.getPublicBoardMembers, {
      query: { locale: "en" },
    });

    assert.equal(result.statusCode, 200);
    assert.deepEqual(result.payload, {
      items: [{
        id: 7,
        fullName: "Test Member",
        professionalTitle: "Civil Engineer",
        summary: "A concise institutional profile.",
        image: {
          id: 13,
          url: "/yonetim-kurulu/test-member.webp",
          altText: "Test Member portrait",
        },
        sortOrder: 20,
      }],
    });
    assert.match(executedSql, /bm\.title_en AS professional_title/);
    assert.match(executedSql, /bm\.summary_en AS summary/);
    assert.match(executedSql, /WHERE bm\.is_active = 1/);
    assert.match(executedSql, /ORDER BY bm\.sort_order ASC, bm\.id ASC/);
  } finally {
    pool.execute = originalExecute;
  }
});

test("admin create rejects a missing portrait before insert", async () => {
  const originalExecute = pool.execute;

  pool.execute = async () => [[]];

  try {
    await assert.rejects(
      callHandler(boardMemberController.createBoardMember, {
        body: {
          fullName: "Test Member",
          titleTr: "Yönetici",
          titleEn: "Executive",
          summaryTr: "Doğrulanmış kısa kurumsal profil metni.",
          summaryEn: "A concise and verified institutional profile.",
          mediaId: 999,
          categoryId: null,
          isActive: true,
          sortOrder: 10,
        },
        user: { id: 1 },
      }),
      (error) => error.status === 422 && error.message === "Seçilen portre bulunamadı.",
    );
  } finally {
    pool.execute = originalExecute;
  }
});

test("admin create stores bilingual content and publication settings", async () => {
  const originalExecute = pool.execute;
  const calls = [];

  pool.execute = async (sql, params) => {
    calls.push({ params, sql });
    if (sql.includes("FROM media_assets")) return [[{ id: 21 }]];
    if (sql.includes("INSERT INTO board_members")) return [{ insertId: 31 }];
    return [[]];
  };

  try {
    const result = await callHandler(boardMemberController.createBoardMember, {
      body: {
        fullName: "Test Member",
        titleTr: "Yönetici",
        titleEn: "Executive",
        summaryTr: "Doğrulanmış kısa kurumsal profil metni.",
        summaryEn: "A concise and verified institutional profile.",
        mediaId: 21,
        categoryId: null,
        isActive: false,
        sortOrder: 40,
      },
      user: { id: 5 },
    });
    const insertCall = calls.find((call) => call.sql.includes("INSERT INTO board_members"));

    assert.deepEqual(result, { payload: { id: 31 }, statusCode: 201 });
    assert.ok(insertCall);
    assert.deepEqual(insertCall.params.slice(0, 9), [
      "Test Member",
      "Yönetici",
      "Executive",
      "Doğrulanmış kısa kurumsal profil metni.",
      "A concise and verified institutional profile.",
      21,
      null,
      0,
      40,
    ]);
    assert.deepEqual(insertCall.params.slice(9), [5, 5]);
  } finally {
    pool.execute = originalExecute;
  }
});

test("admin update preserves omitted category and changes order and visibility", async () => {
  const originalExecute = pool.execute;
  const calls = [];

  pool.execute = async (sql, params) => {
    calls.push({ params, sql });
    if (sql.includes("FROM board_members")) {
      return [[{
        id: 11,
        full_name: "Test Member",
        title_tr: "Yönetici",
        title_en: "Executive",
        summary_tr: "Doğrulanmış kısa kurumsal profil metni.",
        summary_en: "A concise and verified institutional profile.",
        media_id: 21,
        category_id: null,
        is_active: 1,
        sort_order: 10,
      }]];
    }
    if (sql.includes("FROM media_assets")) return [[{ id: 21 }]];
    if (sql.includes("UPDATE board_members")) return [{ affectedRows: 1 }];
    return [[]];
  };

  try {
    const result = await callHandler(boardMemberController.updateBoardMember, {
      body: { isActive: false, sortOrder: 80 },
      params: { id: "11" },
      user: { id: 5 },
    });
    const updateCall = calls.find((call) => call.sql.includes("UPDATE board_members"));

    assert.deepEqual(result, { payload: { ok: true }, statusCode: 200 });
    assert.ok(updateCall);
    assert.equal(updateCall.params[6], null);
    assert.equal(updateCall.params[7], 0);
    assert.equal(updateCall.params[8], 80);
    assert.equal(updateCall.params[9], 5);
  } finally {
    pool.execute = originalExecute;
  }
});

test("admin delete reports success only when a record is removed", async () => {
  const originalExecute = pool.execute;
  pool.execute = async () => [{ affectedRows: 1 }];

  try {
    const result = await callHandler(boardMemberController.deleteBoardMember, {
      params: { id: "11" },
    });

    assert.deepEqual(result, { payload: { ok: true }, statusCode: 200 });
  } finally {
    pool.execute = originalExecute;
  }
});
