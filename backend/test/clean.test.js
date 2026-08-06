const assert = require("node:assert/strict");
const test = require("node:test");
const { parseJson, slugify } = require("../src/utils/clean");

test("slugify Turkish text into URL-safe value", () => {
  assert.equal(slugify("Mesafeli Satışlarda Cayma Hakkı"), "mesafeli-satislarda-cayma-hakki");
});

test("parseJson returns fallback for invalid payload", () => {
  assert.deepEqual(parseJson("{bad", { ok: false }), { ok: false });
});

