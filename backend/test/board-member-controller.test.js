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
      board_role: "Interim Treasurer",
      professional_title: "Civil Engineer",
      summary: "A concise institutional profile.",
      media_id: 13,
      sort_order: 20,
      public_url: "/yonetim-kurulu/test-member.webp",
      alt_text: "Test Member portrait",
      category_id: 4,
      category_title: "Interim Board of Directors",
      category_slug: "interim-board",
      category_sort_order: 10,
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
        boardRole: "Treasurer",
        professionalTitle: "Civil Engineer",
        summary: "A concise institutional profile.",
        category: {
          id: 4,
          title: "Board of Directors",
          slug: "yonetim-kurulu",
          sortOrder: 10,
        },
        image: {
          id: 13,
          url: "/yonetim-kurulu/test-member.webp",
          altText: "Test Member portrait",
        },
        sortOrder: 20,
      }],
    });
    assert.match(executedSql, /bm\.title_en AS professional_title/);
    assert.match(executedSql, /bm\.role_en AS board_role/);
    assert.match(executedSql, /bm\.summary_en AS summary/);
    assert.match(executedSql, /WHERE bm\.is_active = 1/);
    assert.match(executedSql, /bm\.sort_order ASC/);
    assert.match(executedSql, /category\.sort_order ASC/);
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
        roleTr: "Geçici Sayman",
        roleEn: "Interim Treasurer",
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
    assert.deepEqual(insertCall.params, [
      "Test Member",
      "Sayman",
      "Treasurer",
      "Yönetici",
      "Executive",
      "Doğrulanmış kısa kurumsal profil metni.",
      "A concise and verified institutional profile.",
      21,
      null,
      0,
      40,
      5,
      5,
    ]);
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
        role_tr: null,
        role_en: null,
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
    assert.equal(updateCall.params[8], null);
    assert.equal(updateCall.params[9], 0);
    assert.equal(updateCall.params[10], 80);
    assert.equal(updateCall.params[11], 5);
  } finally {
    pool.execute = originalExecute;
  }
});

test("admin cannot publish a board member while required profile fields are missing", async () => {
  const originalExecute = pool.execute;
  let updateAttempted = false;

  pool.execute = async (sql) => {
    if (sql.includes("FROM board_members")) {
      return [[{
        id: 12,
        full_name: "Pending Member",
        role_tr: null,
        role_en: null,
        title_tr: null,
        title_en: null,
        summary_tr: null,
        summary_en: null,
        media_id: null,
        category_id: null,
        is_active: 0,
        sort_order: 90,
      }]];
    }

    if (sql.includes("UPDATE board_members")) updateAttempted = true;
    return [[]];
  };

  try {
    await assert.rejects(
      callHandler(boardMemberController.updateBoardMember, {
        body: { isActive: true },
        params: { id: "12" },
        user: { id: 5 },
      }),
      (error) => error.status === 422 && error.message === "Yayındaki üyeler için iki dilli mesleki unvan zorunludur.",
    );
    assert.equal(updateAttempted, false);
  } finally {
    pool.execute = originalExecute;
  }
});

test("admin can create an inactive profile while portrait and biography are pending", async () => {
  const originalExecute = pool.execute;
  const calls = [];

  pool.execute = async (sql, params) => {
    calls.push({ params, sql });
    if (sql.includes("INSERT INTO board_members")) return [{ insertId: 61 }];
    return [[]];
  };

  try {
    const result = await callHandler(boardMemberController.createBoardMember, {
      body: {
        fullName: "Pending Member",
        roleTr: "Sekreter",
        roleEn: "Secretary",
        titleTr: null,
        titleEn: null,
        summaryTr: null,
        summaryEn: null,
        mediaId: null,
        categoryId: null,
        isActive: false,
        sortOrder: 30,
      },
      user: { id: 5 },
    });
    const insertCall = calls.find((call) => call.sql.includes("INSERT INTO board_members"));

    assert.deepEqual(result, { payload: { id: 61 }, statusCode: 201 });
    assert.equal(insertCall.params[7], null);
    assert.equal(insertCall.params[9], 0);
  } finally {
    pool.execute = originalExecute;
  }
});

test("admin category create generates a stable slug and stores bilingual labels", async () => {
  const originalExecute = pool.execute;
  const calls = [];

  pool.execute = async (sql, params) => {
    calls.push({ params, sql });
    if (sql.includes("SELECT id") && sql.includes("WHERE slug")) return [[]];
    if (sql.includes("INSERT INTO board_member_categories")) return [{ insertId: 17 }];
    return [[]];
  };

  try {
    const result = await callHandler(
      boardMemberController.createBoardMemberCategory,
      {
        body: {
          titleTr: "Geçici Yönetim Kurulu",
          titleEn: "Interim Board of Directors",
          isActive: true,
          sortOrder: 10,
        },
      },
    );
    const insertCall = calls.find((call) =>
      call.sql.includes("INSERT INTO board_member_categories"),
    );

    assert.deepEqual(result, { payload: { id: 17 }, statusCode: 201 });
    assert.deepEqual(insertCall.params, [
      "Yönetim Kurulu",
      "Board of Directors",
      "yonetim-kurulu",
      10,
      1,
    ]);
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
